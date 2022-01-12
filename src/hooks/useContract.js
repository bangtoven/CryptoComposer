import { useEffect, useMemo, useState } from 'react';
import { Contract } from '@ethersproject/contracts';
import { AddressZero } from '@ethersproject/constants';
import { useWeb3React } from '@web3-react/core';
import { CryptoComposerABI, CCTokenABI } from '../static/ABI';

export function useCryptoComposerContract() {
  return useContract(new Map([[1337, '0x1209d16273E28766f5D6B55e54f177CA62E960A1']]), CryptoComposerABI);
}

export function useCCTVendorContract() {
  return useContract(new Map([[1337, '0xE409c88D96042c30A13e0ce1b9153EAf9999e93e']]), CCTokenABI);
}

function useContract(contractAddresses, ABI) {
  const { library, account, chainId } = useWeb3React();
  const [contractAddress, setContractAddress] = useState(contractAddresses.get(1337));

  useEffect(() => {
    console.log('chainId: ', chainId);
    const address = contractAddresses.get(chainId);
    console.log('address: ', address);
    if (address) {
      setContractAddress(address);
    }
  }, [chainId]);

  if (contractAddress === AddressZero) {
    throw Error(`Invalid 'contractAddress' parameter '${contractAddress}' at chain ${chainId}.`);
  }

  const signerOrProvider = account ? library.getSigner(account).connectUnchecked() : library;

  return useMemo(() => {
    return new Contract(contractAddress, ABI, signerOrProvider);
  }, [contractAddress, ABI, signerOrProvider]);
}
