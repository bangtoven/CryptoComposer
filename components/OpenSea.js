import { useWeb3React } from '@web3-react/core';
import Link from 'next/link';
import theme from '../styles/theme';
import Text from './Text';

export default function OpenSea({ songId }) {
  const { chainId } = useWeb3React();

  if (chainId == 4) {
    return (
      <Link href={`https://testnets.opensea.io/assets/0x91922dc7384b62f5ae2f3e12d26597c36ad3b80e/${songId}`}>
        <a target="_blank" style={{ color: theme.lightBlue }}>
          <Text t2 block>
            See them on OpenSea
          </Text>
        </a>
      </Link>
    );
  } else {
    return <></>;
  }
}
