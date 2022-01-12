import { useMemo } from 'react';
import { Contract } from '@ethersproject/contracts';
import { AddressZero } from '@ethersproject/constants';
import { useWeb3React } from '@web3-react/core';
import { CryptoComposerABI, CCTokenABI } from '../static/ABI';

export function useCryptoComposerContract() {
  return useContract('0x1209d16273E28766f5D6B55e54f177CA62E960A1', CryptoComposerABI);
}

export function useCCTVendorContract() {
  return useContract('0xE409c88D96042c30A13e0ce1b9153EAf9999e93e', CCTokenABI);
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
