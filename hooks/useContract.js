import { useEffect, useMemo, useState } from 'react';
import { Contract } from '@ethersproject/contracts';
import { AddressZero } from '@ethersproject/constants';
import { useWeb3React } from '@web3-react/core';
import { CryptoComposerABI, CCTokenABI } from './ABI';

export function useCryptoComposerContract() {
  return useContract(
    new Map([
      [3, '0xA27FACD3FB95E8a159f69522151caA6DA4224EC2'],
      [4, '0xDE58a83BC2634753143C555dD08d47D22463E71f'],
      [137, ''],
      [1337, '0x66505759Af3989D45906A79fB7A2d8160F16B5A8'],
    ]),
    CryptoComposerABI,
  );
}

export function useCCTVendorContract() {
  return useContract(
    new Map([
      [3, '0xE92DB29c68EA1A4AFa30b6D777CCcB78d16033f1'],
      [4, '0x9F4067FC1c0E6BcA242D548380525257Ab6c9cAB'],
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
