import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import React, { useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import StepsEditor from '../components/StepsEditor';
import Text from '../components/Text';
import { TextInput } from '../components/TextInput';
import { useCryptoComposerContract } from '../hooks/useContract';
import { colors } from '../styles/theme';
import { alertError } from '../utils/alertError';

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

  const onClickMint = () => {
    if (!title.length) {
      alert('Please name your song.');
      return;
    }

    contract
      .mintNewSong(title, stepsData)
      .then((response) => {
        return contract.queryFilter(
          {
            address: contract.address,
            topics: [
              ethers.utils.id('CCNFTMinted(address,string,uint256,bytes32)'),
              ethers.utils.hexZeroPad(account, 32),
            ],
          },
          'latest',
        );
      })
      .then((events) => {
        if (!events.length) return;

        contract.once(events[0], (...args) => {
          const allArgs = Array.from(args);
          const result = allArgs[allArgs.length - 1];

          alert(`${result.event} event emitted
          "${result.args.title}" has been registered 
          on block ${result.blockHash}
          with tx hash ${result.transactionHash}.`);
        });
      })
      .catch((error) => {
        alertError(error);
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
