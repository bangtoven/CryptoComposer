import React from 'react';
import { Container } from 'react-bootstrap';
import useWalletConnectionModal from '../../hooks/useWalletConnectionModal';
import StepsEditor from '../../components/StepsEditor';

const Home = () => {
  return (
    <Container className="mt-5">
      <StepsEditor />
    </Container>
  );
};

export default Home;
