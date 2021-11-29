import React from 'react';
import { Container } from 'react-bootstrap';
import CompInteractionCard from './CompInteractionCard';
import ConnectWalletModal from '../../components/ConnectWalletModal';
import useWalletConnectionModal from '../../hooks/useWalletConnectionModal';
import { Song, Track, Instrument } from 'reactronica';
import StepsEditorExample from '../../components/StepsEditorExample';

const Home = () => {
  const { isWalletConnectModalOpen } = useWalletConnectionModal();
  return (
    <Container className="mt-5">
      {isWalletConnectModalOpen && <ConnectWalletModal />}
      <StepsEditorExample />
      {/* <CompInteractionCard /> */}
    </Container>
  );
};

export default Home;
