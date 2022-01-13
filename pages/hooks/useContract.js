import { useEffect, useMemo, useState } from 'react';
import { Contract } from '@ethersproject/contracts';
import { AddressZero } from '@ethersproject/constants';
import { useWeb3React } from '@web3-react/core';
import { CryptoComposerABI, CCTokenABI } from '../static/ABI';

export function useCryptoComposerContract() {
  return useContract(
    new Map([
      [3, '0x1209d16273E28766f5D6B55e54f177CA62E960A1'],
      [4, ''],
      [137, ''],
      [1337, '0x66505759Af3989D45906A79fB7A2d8160F16B5A8'],
    ]),
    CryptoComposerABI,
  );
}

export function useCCTVendorContract() {
  return useContract(
    new Map([
      [3, '0x1209d16273E28766f5D6B55e54f177CA62E960A1'],
      [4, ''],
      [137, ''],
      [1337, '0x9d184B3aeef268B227bd60D74beE97FF49f3D922'],
    ]),
    CCTokenABI,
  );
}

function useContract(contractAddresses, ABI) {
  const { library, account, chainId } = useWeb3React();
  const [contractAddress, setContractAddress] = useState(contractAddresses.get(1337));

  useEffect(() => {
    const address = contractAddresses.get(chainId);
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
