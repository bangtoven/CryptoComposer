import React from 'react';
import { Container } from 'react-bootstrap';
import CompInteractionCard from './CompInteractionCard';
import ConnectWalletModal from '../../components/ConnectWalletModal';
import useWalletConnectionModal from '../../hooks/useWalletConnectionModal';
import { Song, Track, Instrument } from 'reactronica';
import StepsEditorExample from '../../components/StepsEditorExample';
import { useContract } from '../../hooks/useContract';
import { CCTokenABI, CryptoComposerABI } from '../../static/ABI';

const Home = () => {
  const { isWalletConnectModalOpen } = useWalletConnectionModal();
  const contract = useContract('0xa577e568E74490A7e502e35b06999dC335AA54c1', CryptoComposerABI);
  const tokenContract = useContract('0x8e9A8311086bf7a1293a20498E77cEd9CD7F5b53', CCTokenABI);
  return (
    <Container className="mt-5">
      {isWalletConnectModalOpen && <ConnectWalletModal />}
      <StepsEditorExample />
      {/* <CompInteractionCard /> */}
    </Container>
  );
};

export default Home;
