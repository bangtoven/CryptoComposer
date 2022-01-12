import { useMemo } from 'react';
import { Contract } from '@ethersproject/contracts';
import { AddressZero } from '@ethersproject/constants';
import { useWeb3React } from '@web3-react/core';
import { CryptoComposerABI, CCTokenABI } from '../static/ABI';

export function useCryptoComposerContract() {
  return useContract('0xbc243782bB0b206dED562066EfF432512668E5a2', CryptoComposerABI);
}

export function useCCTVendorContract() {
  return useContract('0x3a708A6C5226d334788280510a9D20E5245A08bd', CCTokenABI);
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
