import { useWeb3React } from '@web3-react/core';
import React, { useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import StepsEditor from '../components/StepsEditor';
import Text from '../components/Text';
import { TextInput } from '../components/TextInput';
import { useCryptoComposerContract } from '../hooks/useContract';
import { colors } from '../theme';

const defaultStepsData = [
  [{ name: 'C4' }, { name: 'E4' }],
  [{ name: 'E4' }],
  [{ name: 'F4' }],
  [{ name: 'G4' }],
  [{ name: 'D4' }, { name: 'G4' }],
  [{ name: 'F4' }],
  [{ name: 'E4' }],
  [{ name: 'D4' }],
];

export const Mint = () => {
  const { account } = useWeb3React();
  const [title, setTitle] = useState('');
  const [stepsData, setStepsData] = useState(new Uint8Array());

  const contract = useCryptoComposerContract();

  const onClickMint = async () => {
    if (!title.length) {
      alert('Please name your song.');
      return;
    }

    contract
      .mintNewSong(title, stepsData)
      .then(() => {
        alert('Minted a new song! Waiting for the transaction to be mined');
      })
      .catch((error) => {
        if (error.data && error.data.message) {
          alert(error.data.message);
        } else {
          alert(error);
        }
        console.log('error: ', error);
      });
  };

  return (
    <Container className="mt-5">
      <div className="d-flex flex-column justify-content-between">
        <TextInput label="Title of the song" value={title} onChange={(t) => setTitle(t)} />
        <Text t6 color={colors.white}>
          Composer: {account}
        </Text>
        <br />
      </div>

      <Button
        style={{
          margin: 10,
          width: 120,
          justifyContent: 'center',
          backgroundColor: 'red',
          color: 'white',
          borderColor: 'white',
        }}
        onClick={onClickMint}
      >
        <Text>⚪ Mint</Text>
      </Button>

      <StepsEditor
        stepsData={defaultStepsData}
        onStepEditorChange={(data) => {
          setStepsData(data);
        }}
      />
    </Container>
  );
};
