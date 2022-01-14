import Text from './Text';
import BalancesCard from './BalancesCard';
import { useEagerConnect, useInactiveListener } from '../hooks/useEagerConnect';
import Link from 'next/link';
import { withRouter } from 'next/router';
import Card from './Card';
import { useWeb3React } from '@web3-react/core';
import { colors } from '../styles/theme';
import Navbar from 'react-bootstrap/Navbar';

const NavButton = (props) => (
  <Link href={props.to}>
    <a className={`${props.router.pathname === props.to ? 'active' : ''}`}>
      <Card
        style={{
          width: 160,
          color: props.router.pathname === props.to ? 'white' : colors.lightBlue,
          background: props.router.pathname === props.to ? colors.darkBlue : 'white',
        }}
      >
        <Text t3 block>
          {props.router.pathname === props.to && '> '}
          {props.label}
        </Text>
      </Card>
    </a>
  </Link>
);

const MenuLink = withRouter(NavButton);

const Header = () => {
  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect(); // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists

  useInactiveListener(!triedEager);

  const { active } = useWeb3React();

  return (
    <Navbar className="justify-content-between" style={{ paddingLeft: 50, paddingRight: 50 }}>
      <img src={'/hero.jpg'} style={{ width: 100, height: 100, borderRadius: '50%' }} />
      <MenuLink activeOnlyWhenExact={true} to="/" label="Home" />
      {active && <MenuLink to="/mysongs" label="My Songs" />}
      {active && <MenuLink to="/mint" label="Mint new" />}
      {!active && <Text>Sign in to mint your own songs!</Text>}

      <div />
      <BalancesCard />
    </Navbar>
  );
};

export default Header;
