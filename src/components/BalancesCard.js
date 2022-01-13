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
import { ethers } from 'ethers';

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
      .then((response) => {
        return tokenContract.queryFilter(
          {
            address: tokenContract.address,
            topics: [ethers.utils.id('CCTBought(address,uint256)'), ethers.utils.hexZeroPad(account, 32)],
          },
          'latest',
        );
      })
      .then((events) => {
        console.log(events);
        if (!events.length) return;

        tokenContract.once(events[0], (...args) => {
          const allArgs = Array.from(args);
          const result = allArgs[allArgs.length - 1];

          alert(`${result.event} event emitted
          ${result.args.amount} CCT purchased by ${result.args.by}
          on block ${result.blockHash}
          with tx hash ${result.transactionHash}.`);
        });
      })
      .catch((error) => {
        alertError(error);
      });
  };

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
        return null;
    }
  };

  if (!active) {
    if (!chainId) {
      return (
        <Card className="d-flex justify-content-between" style={{ width: 350, color: 'gray' }}>
          <Text t3 lineHeight="40px" className="mx-2">
            Unsupported Chain
          </Text>
          <Text t4>Select Ropsten, Rinkeby, or Polygon</Text>
        </Card>
      );
    }

    return (
      <Card className="d-flex justify-content-between" style={{ width: 350, color: 'gray' }}>
        <Text uppercase t3 lineHeight="40px" className="mx-2">
          Sign in with Wallet
        </Text>
        <Text t6>On {chainName(chainId)}</Text>
        <ConnectBtn onClick={() => activate(injected)}>Sign in</ConnectBtn>
      </Card>
    );
  }

  return (
    <Card className="d-flex flex-column justify-content-between" style={{ width: 350, color: 'gray' }}>
      <Text t3 block>
        CryptoComposerToken
      </Text>
      <Text t6>On {chainName(chainId)}</Text>
      <Text>
        🪙 CCT balance: {cTokenBalance} 🎶 Song count: {nftCount}
      </Text>
      <button onClick={buyCCT}>
        Buy CCT (price: {exchangeRate / Math.pow(10, 18)} {chainId != 137 ? 'ETH' : 'MATIC'})
      </button>
    </Card>
  );
};

export default BalanceCard;
