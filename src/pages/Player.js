import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import StepsEditor from '../components/StepsEditor';
import Text from '../components/Text';
import { useCCTVendorContract, useCryptoComposerContract } from '../hooks/useContract';
import { decompress } from '../models/Compression';
import { colors } from '../theme';

const fromHexString = (hexString) =>
  new Uint8Array(
    hexString
      .replace(/^0x/, '')
      .match(/.{1,2}/g)
      .map((byte) => parseInt(byte, 16)),
  );

export const Player = () => {
  const { id } = useParams();

  const contract = useCryptoComposerContract();

  const [song, setSong] = useState(null);
  const [stepsData, setStepsData] = useState(null);

  useEffect(() => {
    async function fetchSong() {
      const song = await contract.songs(id);
      setSong(song);

      const compressedStepsData = fromHexString(song.notes);
      const stepsData = decompress(compressedStepsData);
      setStepsData(stepsData);
    }
    if (!song) {
      fetchSong();
    }
  }, [contract]);

  return (
    song && (
      <Container className="mt-5">
        <Text t2 color={colors.white}>
          {song.title}
        </Text>
        <br />
        <Text t4 color={colors.white}>
          composedBy: {song.composer}
        </Text>

        <br />
        <br />
        {stepsData && <StepsEditor stepsData={stepsData}></StepsEditor>}
      </Container>
    )
  );
};
