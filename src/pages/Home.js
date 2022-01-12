import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Text from '../components/Text';
import { useCCTVendorContract, useCryptoComposerContract } from '../hooks/useContract';

class Song {}

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
      const songsWithTokenId = songs.map((song, index) => {
        return {
          ...song,
          id: ids[index],
        };
      });
      setSongs(songsWithTokenId);
    }
    fetchSongs();
  }, [contract]);

  return (
    <Container className="mt-5">
      {/* <label>{songs && songs.toString()}</label> */}
      <ul>
        {songs &&
          songs.map((song) => (
            <li key={song.id}>
              <Link to={`songs/${song.id}`}>
                <Text t3 block>
                  {song.title}
                </Text>
                <Text t4 block>
                  composed by: {song.composer}
                </Text>
                <Text t6 block>
                  {song.notes}
                </Text>
              </Link>
            </li>
          ))}
      </ul>
    </Container>
  );
};

export default Home;
