import React, { useEffect, useState } from 'react';
import Text from './Text';
import Navbar from 'react-bootstrap/Navbar';
import MetamaskConnectButton from './MetamaskConnectButton';
import BalancesCard from './BalancesCard';
import { useEagerConnect, useInactiveListener } from '../hooks/useEagerConnect';
import { useContract } from '../hooks/useContract';
import { CryptoComposerABI } from '../static/ABI';
import { useAppContext } from '../AppContext';

const Header = () => {
  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect(); // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists

  useInactiveListener(!triedEager);

  return (
    <Navbar className="justify-content-between">
      <BalancesCard />
      <div />
      <MetamaskConnectButton />
    </Navbar>
  );
};

export default Header;
