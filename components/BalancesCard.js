import React, { useEffect, useState } from 'react';
import Text from './Text';
import Card from './Card';
import Button from 'react-bootstrap/Button';
import { useWeb3React } from '@web3-react/core';
import styled from 'styled-components';
import { useAppContext } from './utils/AppContext';
import { useCryptoComposerContract, useCCTVendorContract } from '../hooks/useContract';
import { getChainName, injected } from './utils/connectors';
import { BigNumber } from 'ethers';
import { ethers } from 'ethers';
import theme from '../styles/theme';
import { useAlert } from './Alert';

const ConnectBtn = styled(Button).attrs({ variant: 'outline-dark' })``;

const BalanceCard = () => {
  const { activate, active, account, chainId } = useWeb3React();

  const { exchangeRate, setExchangeRate } = useAppContext();
  const { cTokenBalance, setCTokenBalance } = useAppContext();
  const [nftCount, setNftCount] = useState(0);
  const [manualRefresh, setManualRefresh] = useState(0);

  const contract = useCryptoComposerContract();
  const tokenContract = useCCTVendorContract();

  const alert = useAlert();

  useEffect(async () => {
    if (!exchangeRate) {
      const price = BigNumber.from(await tokenContract.tokenPrice());
      setExchangeRate(price);
    }
  }, [tokenContract, chainId]);

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
  }, [tokenContract, account, chainId]);

  useEffect(() => {
    if (manualRefresh) {
      fetchCCTokenBalance();
      fetchNFTCounts();
    }
  }, [manualRefresh]);

  const buyCCT = () => {
    const count = parseInt(prompt('How many CCT do you want to buy?'));
    if (!count) {
      alert.show({ title: '!', body: 'Please make sure to enter valid number' });
      return;
    }

    tokenContract
      .buyTokenToMintNFT({ value: exchangeRate.mul(count) })
      .then((response) => {
        const txHash = response.hash;

        alert.showTx({
          title: `Pending`,
          body: `Check tx ${txHash} on Etherscan`,
          txHash: txHash,
        });

        tokenContract.once(
          {
            address: tokenContract.address,
            topics: [ethers.utils.id('CCTBought(address,uint256)'), ethers.utils.hexZeroPad(account, 32)],
          },
          (...args) => {
            const allArgs = Array.from(args);
            const result = allArgs[allArgs.length - 1];
            alert.showTx({
              title: `${result.event} event emitted`,
              body: `
                ${result.args.amount} CCT purchased by ${result.args.by}
                on block ${result.blockHash}
                with tx hash ${result.transactionHash}.
              `,
              txHash: txHash,
            });
          },
        );
      })
      .catch((error) => {
        alert.showError(error);
      });
  };

  if (!active) {
    return (
      <Card className="d-flex justify-content-between" style={{ width: 350, color: 'gray' }}>
        <Text uppercase t3 lineHeight="40px" className="mx-2">
          Sign in with Wallet
        </Text>
        <Text t4>Select Polygon (or Ropsten/Rinkeby)</Text>
        <ConnectBtn onClick={() => activate(injected)}>Sign in</ConnectBtn>
      </Card>
    );
  }

  return (
    <Card className="d-flex flex-column justify-content-between" style={{ width: 350, color: theme.lightBlue }}>
      <div style={{ flexDirection: 'row' }}>
        <Text t3 color={theme.darkBlue}>
          CryptoComposerToken
        </Text>
        <button
          onClick={() => {
            setManualRefresh(manualRefresh + 1);
          }}
          style={{
            fontSize: '30px',
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            padding: 0,
            paddingLeft: '10px',
          }}
        >
          🔄
        </button>
      </div>
      <Text t6>On {getChainName(chainId)}</Text>
      <Text>
        🪙 CCT balance: {cTokenBalance} 🎶 Song count: {nftCount}
      </Text>
      <button onClick={buyCCT} style={{ backgroundColor: theme.darkBlue, color: 'white' }}>
        Buy CCT (price: {exchangeRate / BigNumber.from(10).pow(18)} {chainId != 137 ? 'ETH' : 'MATIC'})
      </button>
    </Card>
  );
};

export default BalanceCard;
