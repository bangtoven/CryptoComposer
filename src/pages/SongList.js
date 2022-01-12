import { useWeb3React } from '@web3-react/core';
import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Text from '../components/Text';
import { useCryptoComposerContract } from '../hooks/useContract';

const SongList = ({ songIDs, showComposer = true }) => {
  const contract = useCryptoComposerContract();
  const { account } = useWeb3React();

  const [songs, setSongs] = useState(null);

  useEffect(() => {
    if (!songIDs) return;

    async function fetchSongs() {
      const songs = await Promise.all(songIDs.map((id) => contract.songs(id)));
      const songsWithTokenId = songs.map((song, index) => {
        return {
          ...song,
          id: songIDs[index],
        };
      });
      setSongs(songsWithTokenId);
    }

    if (!songs) {
      fetchSongs();
    }
  }, [songIDs]);

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
                {showComposer && (
                  <Text t4 block style={song.composer == account ? { color: 'white' } : {}}>
                    composed by: {song.composer == account ? 'YOU!' : song.composer}
                  </Text>
                )}
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

export default SongList;
