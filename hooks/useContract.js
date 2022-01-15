import { useEffect, useMemo, useState } from 'react';
import { Contract } from '@ethersproject/contracts';
import { AddressZero } from '@ethersproject/constants';
import { useWeb3React } from '@web3-react/core';
import { CryptoComposerABI, CCTokenABI } from './ABI';

export function useCryptoComposerContract() {
  return useContract(
    new Map([
      [3, '0xfcDD8e6455624CCb94C6641E97ED5bf7A96F9384'],
      [4, '0x91922dc7384b62F5ae2f3e12D26597C36aD3b80E'],
      [137, '0xAdf78367Db78437a371DD07DC6fEF826b332Aa23'],
      [1337, '0x3A768f3F21DF4F707BEBA9D0dcac6Ee88a598020'],
    ]),
    CryptoComposerABI,
  );
}

export function useCCTVendorContract() {
  return useContract(
    new Map([
      [3, '0x6383A3C05F6F924680D51801EEF9B8d6CF309Dca'],
      [4, '0x3791Ab57d095440721435fFC847841150C98DDB5'],
      [137, '0x241D66F9dd7000caaD6Fd26DA51F0a031D382947'],
      [1337, '0x175D03Da33E34465E8b51eed520b3aa08a508a1a'],
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
