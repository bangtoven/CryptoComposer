import { useWeb3React } from '@web3-react/core';
import Link from 'next/link';
import theme from '../styles/theme';
import Text from './Text';

export default function OpenSea({ songId }) {
  const { chainId } = useWeb3React();

  function openseaUrl(songId) {
    switch (chainId) {
      case 4:
        return `https://testnets.opensea.io/assets/0x91922dc7384b62f5ae2f3e12d26597c36ad3b80e/${songId}`;
      case 137:
        return `https://opensea.io/assets/matic/0xadf78367db78437a371dd07dc6fef826b332aa23/${songId}`;
      default:
        return null;
    }
  }

  const url = openseaUrl(songId);

  if (url) {
    return (
      <Link href={url}>
        <a target="_blank" style={{ color: theme.lightBlue }}>
          <Text t2 block>
            See on OpenSea
          </Text>
        </a>
      </Link>
    );
  } else {
    return <></>;
  }
}
