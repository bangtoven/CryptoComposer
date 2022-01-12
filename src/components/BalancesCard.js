import React, { useEffect, useState } from 'react';
import Text from './Text';
import Card from './Card';
import Button from 'react-bootstrap/Button';
import { useWeb3React } from '@web3-react/core';
import styled from 'styled-components';
import { useAppContext } from '../AppContext';
import { useCryptoComposerContract, useCCTVendorContract } from '../hooks/useContract';
import { injected } from '../connectors';
import { alertError } from '../utils/alertError';
import { BigNumber } from 'ethers';

const ConnectBtn = styled(Button).attrs({ variant: 'outline-dark' })``;

const BalanceCard = () => {
  const { activate, active, account, chainId } = useWeb3React();

  const contract = useCryptoComposerContract();
  const tokenContract = useCCTVendorContract();

  const { exchangeRate, setExchangeRate } = useAppContext();
  const { cTokenBalance, setCTokenBalance } = useAppContext();
  const [nftCount, setNftCount] = useState(0);

  useEffect(async () => {
    const price = (await tokenContract.tokenPrice()).toNumber();
    setExchangeRate(price);
  }, [contract]);

  const fetchCCTokenBalance = async () => {
    const ccTokenBalance = await tokenContract.balanceOf(account);
    setCTokenBalance(ccTokenBalance.toNumber());
  };

  const fetchNFTCounts = async () => {
    const count = await contract.balanceOf(account);
    setNftCount(count.toNumber());
  };

  useEffect(() => {
    if (account) {
      fetchCCTokenBalance();
      fetchNFTCounts();
    }
  }, [account, chainId]);

  const buyCCT = async () => {
    const count = parseInt(prompt('How many CCT do you want to buy?'));
    if (!count) {
      alert('Please make sure to enter valid number');
      return;
    }

    tokenContract
      .buyTokenToMintNFT({ value: BigNumber.from(exchangeRate).mul(count) })
      .then(() => {
        // contract.once(
        //   {
        //     address: contract.address,
        //     topics: [ethers.utils.id('BuyToken(address,uint256)'), ethers.utils.hexZeroPad(account, 32)],
        //   },
        //   (error, event) => {
        //     alert('confirmed');
        //   },
        // );
        alert('Bought 1 CryptoComposerToken! Waiting for the transaction to be mined');
      })
      .catch((error) => {
        alertError(error);
      });
  };

  if (!active) {
    return (
      <Card className="d-flex justify-content-between" style={{ width: 350, color: 'gray' }}>
        <Text uppercase t3 lineHeight="40px" className="mx-2">
          Sign in with Wallet
        </Text>
        <ConnectBtn onClick={() => activate(injected)}>Sign in</ConnectBtn>
      </Card>
    );
  }

  const chainName = (id) => {
    switch (id) {
      case 3:
        return 'Ropsten';
      case 4:
        return 'Rinkeby';
      case 137:
        return 'Polygon';
      case 1337:
        return 'Local chain';
      default:
        return 'unsupported chain';
    }
  };

  return (
    <Card className="d-flex flex-column justify-content-between" style={{ width: 350, color: 'gray' }}>
      <Text t3 block>
        CryptoComposerToken
      </Text>
      <Text t6>On {chainName(chainId)}</Text>
      <Text>My CCT balance: {cTokenBalance}</Text>
      <Text>My Song count: {nftCount}</Text>
      <button onClick={buyCCT}>
        Buy CCT (price: {exchangeRate / Math.pow(10, 18)} {chainId != 137 ? 'ETH' : 'MATIC'})
      </button>
    </Card>
  );
};

export default BalanceCard;
