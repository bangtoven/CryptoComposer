import { useWeb3React } from '@web3-react/core';
import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import Link from 'next/link';
import Text from './Text';
import { useCryptoComposerContract } from '../hooks/useContract';
import theme from '../styles/theme';
import OpenSea from './OpenSea';

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

    if (songs == null) {
      fetchSongs();
    }
  }, [songIDs, contract]);

  return (
    <Container className="mt-5">
      {songs && songs.length != 0 ? <OpenSea songId={songs[0].id} /> : <></>}
      <br />
      <ul>
        {songs &&
          songs.map((song) => (
            <li key={song.id}>
              <Link href={`/songs/${song.id}`}>
                <a style={{ color: theme.green }}>
                  <Text t3 block>
                    [#{song.id}] {song.title}
                  </Text>
                  {showComposer && (
                    <Text t4 block style={song.composer == account ? { color: 'white' } : {}}>
                      composed by: {song.composer == account ? 'YOU!' : song.composer}
                    </Text>
                  )}
                  <Text t6 block>
                    {song.notes}
                  </Text>
                </a>
              </Link>
            </li>
          ))}
      </ul>
    </Container>
  );
};

export default SongList;
