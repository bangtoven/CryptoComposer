import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import StepsEditor from '../../components/StepsEditor';
import Text from '../../components/Text';
import { useCryptoComposerContract } from '../../hooks/useContract';
import { decompress } from '../../components/utils/Compression';
import { colors } from '../../styles/theme';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

const fromHexString = (hexString) =>
  new Uint8Array(
    hexString
      .replace(/^0x/, '')
      .match(/.{1,2}/g)
      .map((byte) => parseInt(byte, 16)),
  );

export default function Player() {
  const router = useRouter();
  const { id } = router.query;

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
    <Layout>
      {song && (
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
      )}
    </Layout>
  );
}
