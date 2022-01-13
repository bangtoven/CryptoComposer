import React, { useEffect, useState } from 'react';
import Text from './Text';
import Card from './Card';
import Button from 'react-bootstrap/Button';
import { useWeb3React } from '@web3-react/core';
import styled from 'styled-components';
import { useAppContext } from '../utils/AppContext';
import { useCryptoComposerContract, useCCTVendorContract } from '../hooks/useContract';
import { injected } from '../utils/connectors';
import { alertError } from '../utils/alertError';
import { BigNumber } from 'ethers';
import { ethers } from 'ethers';
import theme from '../styles/theme';

const ConnectBtn = styled(Button).attrs({ variant: 'outline-dark' })``;

const BalanceCard = () => {
  const { activate, active, account, chainId, connector } = useWeb3React();

  const { exchangeRate, setExchangeRate } = useAppContext();
  const { cTokenBalance, setCTokenBalance } = useAppContext();
  const [nftCount, setNftCount] = useState(0);

  const contract = useCryptoComposerContract();
  const tokenContract = useCCTVendorContract();

  useEffect(async () => {
    const price = (await tokenContract.tokenPrice()).toNumber();
    setExchangeRate(price);
  }, [tokenContract]);

  const fetchCCTokenBalance = async () => {
    const ccTokenBalance = await tokenContract.balanceOf(account);
    setCTokenBalance(ccTokenBalance.toNumber());
  };

  const fetchNFTCounts = async () => {
    const count = await contract.balanceOf(account);
    setNftCount(count.toNumber());
  };

  useEffect(() => {
    if (account && cTokenBalance == '--') {
      fetchCCTokenBalance();
      fetchNFTCounts();
    }
  }, [account, chainId, tokenContract]);

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

  // TODO
  // const importCCT = async () => {
  //   try {
  //     // wasAdded is a boolean. Like any RPC method, an error may be thrown.
  //     const wasAdded = await ethereum.request({
  //       method: 'wallet_watchAsset',
  //       params: {
  //         type: 'ERC20', // Initially only supports ERC20, but eventually more!
  //         options: {
  //           address: tokenAddress, // The address that the token is at.
  //           symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
  //           decimals: tokenDecimals, // The number of decimals in the token
  //           image: tokenImage, // A string url of the token logo
  //         },
  //       },
  //     });

  //     if (wasAdded) {
  //       console.log('Thanks for your interest!');
  //     } else {
  //       console.log('Your loss!');
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

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
    return (
      <Card className="d-flex justify-content-between" style={{ width: 350, color: 'gray' }}>
        <Text uppercase t3 lineHeight="40px" className="mx-2">
          Sign in with Wallet
        </Text>
        <Text t4>Select Ropsten, Rinkeby, or Polygon</Text>
        <ConnectBtn onClick={() => activate(injected)}>Sign in</ConnectBtn>
      </Card>
    );
  }

  return (
    <Card className="d-flex flex-column justify-content-between" style={{ width: 350, color: theme.lightBlue }}>
      <Text t3 block color={theme.darkBlue}>
        CryptoComposerToken
      </Text>
      <Text t6>On {chainName(chainId)}</Text>
      <Text>
        🪙 CCT balance: {cTokenBalance} 🎶 Song count: {nftCount}
      </Text>
      <button onClick={buyCCT} style={{ backgroundColor: theme.darkBlue, color: 'white' }}>
        Buy CCT (price: {exchangeRate / Math.pow(10, 18)} {chainId != 137 ? 'ETH' : 'MATIC'})
      </button>
    </Card>
  );
};

export default BalanceCard;
