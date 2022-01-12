import React, { useEffect, useState } from 'react';
import Text from './Text';
import Navbar from 'react-bootstrap/Navbar';
import MetamaskConnectButton from './MetamaskConnectButton';
import BalancesCard from './BalancesCard';
import { useEagerConnect, useInactiveListener } from '../hooks/useEagerConnect';
import { useContract } from '../hooks/useContract';
import { CryptoComposerABI } from '../static/ABI';
import { useAppContext } from '../AppContext';
import { Link, useRouteMatch } from 'react-router-dom';
import Card from './Card';

function MenuLink({ label, to, activeOnlyWhenExact }) {
  let match = useRouteMatch({
    path: to,
    exact: activeOnlyWhenExact,
  });

  return (
    <div className={match ? 'active' : ''}>
      <Link to={to}>
        <Card style={{ width: 200, color: match ? 'white' : '#0fa6d1', background: match ? '#0fa6d1' : 'white' }}>
          <Text t3 block>
            {match && '> '}
            {label}
          </Text>
        </Card>
      </Link>
    </div>
  );
}

const Header = () => {
  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect(); // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists

  useInactiveListener(!triedEager);

  return (
    <Navbar className="justify-content-between">
      <MenuLink activeOnlyWhenExact={true} to="/" label="Home" />
      <MenuLink to="/about" label="About" />

      <div />
      <BalancesCard />
    </Navbar>
  );
};

export default Header;
