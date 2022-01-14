import React, { useEffect, useState } from 'react';
import Text from '../components/Text';
import { useCryptoComposerContract } from '../hooks/useContract';
import SongList from '../components/SongList';
import Layout from '../components/Layout';

const Home = () => {
  const contract = useCryptoComposerContract();

  const [songIDs, setSongIDs] = useState(null);

  useEffect(() => {
    async function fetchSongIDs() {
      const totalSupply = (await contract.totalSupply()).toNumber();

      // most recent songs, at most 10 of them
      const count = Math.min(10, totalSupply);
      const indices = [...Array(count).keys()].map((i) => totalSupply - 1 - i);
      const songIDs = await Promise.all(indices.map((i) => contract.tokenByIndex(i).then((id) => id.toNumber())));
      setSongIDs(songIDs);
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

export default function Index() {
  return (
    <Layout>
      <Home />
    </Layout>
  );
}
