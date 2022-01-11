import React, { useEffect } from 'react';
import Text from './Text';
import Card from './Card';
import { useWeb3React } from '@web3-react/core';
import useEth from '../hooks/useEth';
import { useAppContext } from '../AppContext';
import { useContract } from '../hooks/useContract';
import { CryptoComposerABI, CCTokenABI } from '../static/ABI';
const { ethers } = require('ethers');

const BalanceCard = () => {
  const { account, chainId } = useWeb3React();
  const contract = useContract('0x06395CAb4F62b17048dF22c6db8D77e65f4a06c7', CryptoComposerABI);
  const tokenContract = useContract('0x88e77ab1f42a75602F568a39857a5F4A6a36b5AC', CCTokenABI);

  const { exchangeRate, setExchangeRate } = useAppContext();
  const { setCTokenBalance, cTokenBalance } = useAppContext();

  const fetchCCTokenBalance = async () => {
    const ccTokenBalance = await tokenContract.balanceOf(account);
    setCTokenBalance(ccTokenBalance.toNumber());
  };

  useEffect(() => {
    console.log('contract:', contract);
    if (account) {
      fetchCCTokenBalance();
    }
  }, [account, chainId]);

  useEffect(async () => {
    const price = (await contract.tokenPrice()).toNumber();
    setExchangeRate(price);
  }, [contract]);

  const buyCCT = async () => {
    console.log(contract);
    contract
      .buyToken({ value: exchangeRate })
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
          alert(error.message);
        }
        console.log('error: ', error);
      });
  };

  return (
    <Card style={{ maxWidth: 300, color: 'gray' }}>
      <Text t3 block>
        CryptoComposerToken
      </Text>
      <Text>price: {exchangeRate / Math.pow(10, 18)} ETH</Text>
      <Text>CCT balance: {cTokenBalance}</Text>
      <button onClick={buyCCT}>Buy (CCT)</button>
    </Card>
  );
};

export default BalanceCard;
