import { useWeb3React } from '@web3-react/core';
import React, { useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import StepsEditor from '../components/StepsEditor';
import Text from '../components/Text';
import { TextInput } from '../components/TextInput';
import { colors } from '../theme';

export const Mint = () => {
  const [stepsData, setStepsData] = useState(new Uint8Array());
  const { account } = useWeb3React();

  return (
    <Container className="mt-5">
      <div className="d-flex flex-column justify-content-between">
        <TextInput label="Title of the song" />
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
      >
        <Text>⚪ Mint</Text>
      </Button>

      <StepsEditor
        onStepEditorChange={(data) => {
          console.log(data);
        }}
      />
    </Container>
  );
};
