import { useWeb3React } from '@web3-react/core';
import React, { useEffect, useState } from 'react';
import Text from '../components/Text';
import { useCryptoComposerContract } from '../hooks/useContract';
import SongList from './SongList';

const MySongs = () => {
  const contract = useCryptoComposerContract();
  const { account } = useWeb3React();

  const [songIDs, setSongIDs] = useState(null);

  useEffect(() => {
    async function fetchSongIDs() {
      const totalSupply = await contract.balanceOf(account);
      const idBNs = await Promise.all(
        Array.from(Array(totalSupply.toNumber())).map((_, i) => contract.tokenOfOwnerByIndex(account, i)),
      );
      const ids = idBNs.map((n) => n.toNumber());
      setSongIDs(ids);
    }

    if (!songIDs) {
      fetchSongIDs();
    }
  }, [contract]);

  if (songIDs) {
    if (!songIDs.length) {
      return <Text t1>Try minting your own song!</Text>;
    } else {
      return <SongList songIDs={songIDs} showComposer={false} />;
    }
  } else {
    return <></>;
  }
};

export default MySongs;
