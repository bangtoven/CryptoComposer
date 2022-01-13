import React, { useEffect, useState } from 'react';
import Text from '../components/Text';
import { useCryptoComposerContract } from '../hooks/useContract';
import SongList from './SongList';

const Home = () => {
  const contract = useCryptoComposerContract();

  const [songIDs, setSongIDs] = useState(null);

  useEffect(() => {
    async function fetchSongIDs() {
      const totalSupply = await contract.totalSupply();
      const idBNs = await Promise.all(
        Array.from(Array(totalSupply.toNumber())).map((_, i) => contract.tokenByIndex(i)),
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
      return <Text t1>Be the first crypto composer by minting your song!</Text>;
    } else {
      return <SongList songIDs={songIDs} showComposer={true} />;
    }
  } else {
    return <></>;
  }
};

export default Home;
