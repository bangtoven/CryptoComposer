import { useMemo } from 'react';
import { Contract } from '@ethersproject/contracts';
import { AddressZero } from '@ethersproject/constants';
import { useWeb3React } from '@web3-react/core';
import { CryptoComposerABI, CCTokenABI } from '../static/ABI';

export function useCryptoComposerContract() {
  return useContract('0x06395CAb4F62b17048dF22c6db8D77e65f4a06c7', CryptoComposerABI);
}

export function useTokenContract() {
  return useContract('0x88e77ab1f42a75602F568a39857a5F4A6a36b5AC', CCTokenABI);
}

function useContract(contractAddress, ABI) {
  if (contractAddress === AddressZero) {
    throw Error(`Invalid 'contractAddress' parameter '${contractAddress}'.`);
  }

  const { library, account } = useWeb3React();

  const signerOrProvider = account ? library.getSigner(account).connectUnchecked() : library;

  return useMemo(() => {
    return new Contract(contractAddress, ABI, signerOrProvider);
  }, [contractAddress, ABI, signerOrProvider]);
}
