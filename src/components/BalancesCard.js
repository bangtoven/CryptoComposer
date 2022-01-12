import React, { useEffect } from 'react';
import Text from './Text';
import Card from './Card';
import Button from 'react-bootstrap/Button';
import { useWeb3React } from '@web3-react/core';
import styled from 'styled-components';
import { useAppContext } from '../AppContext';
import { useCryptoComposerContract, useCCTVendorContract } from '../hooks/useContract';
import { injected } from '../connectors';

const ConnectBtn = styled(Button).attrs({ variant: 'outline-dark' })``;

const BalanceCard = () => {
  const { activate, active, account, chainId } = useWeb3React();

  const contract = useCryptoComposerContract();
  const tokenContract = useCCTVendorContract();

  const { exchangeRate, setExchangeRate } = useAppContext();
  const { cTokenBalance, setCTokenBalance } = useAppContext();

  useEffect(async () => {
    const price = (await tokenContract.tokenPrice()).toNumber();
    setExchangeRate(price);
  }, [contract]);

  const fetchCCTokenBalance = async () => {
    const ccTokenBalance = await tokenContract.balanceOf(account);
    setCTokenBalance(ccTokenBalance.toNumber());
  };

  useEffect(() => {
    if (account) {
      fetchCCTokenBalance();
    }
  }, [account, chainId]);

  const buyCCT = async () => {
    console.log(contract);
    tokenContract
      .buyTokenToMintNFT({ value: exchangeRate })
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
        if (error.data && error.data.message) {
          alert(error.data.message);
        } else {
          alert(error);
        }
        console.log('error: ', error);
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

  return (
    <Card className="d-flex flex-column justify-content-between" style={{ width: 350, color: 'gray' }}>
      <Text t3 block>
        CryptoComposerToken
      </Text>
      <Text>CCT balance: {cTokenBalance}</Text>
      <button onClick={buyCCT}>Buy CCT (price: {exchangeRate / Math.pow(10, 18)} ETH)</button>
    </Card>
  );
};

export default BalanceCard;
