import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import Text from '../components/Text';
import { useCCTVendorContract, useCryptoComposerContract } from '../hooks/useContract';

const Home = () => {
  const contract = useCryptoComposerContract();

  const [songs, setSongs] = useState(null);

  useEffect(() => {
    async function fetchSongs() {
      const totalSupply = await contract.totalSupply();
      const idBNs = await Promise.all(
        Array.from(Array(totalSupply.toNumber())).map((_, i) => contract.tokenByIndex(i)),
      );
      const ids = idBNs.map((n) => n.toNumber());
      const songs = await Promise.all(ids.map((id) => contract.songs(id)));
      setSongs(songs);
    }
    fetchSongs();
  }, [contract]);

  return (
    <Container className="mt-5">
      {/* <label>{songs && songs.toString()}</label> */}
      <ul>
        {songs &&
          songs.map((song) => (
            <li key={song.hash}>
              <Text t3 block>
                {song.title}
              </Text>
              <Text t4 block>
                composed by: {song.composer}
              </Text>
              <Text t6 block>
                {song.notes}
              </Text>
            </li>
          ))}
      </ul>
    </Container>
  );
};

export default Home;
