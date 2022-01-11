import React from 'react';
import styled from 'styled-components';
import Button from 'react-bootstrap/Button';
import { useWeb3React } from '@web3-react/core';
import MMLogo from '../static/metamask-logo.svg';
import Text from './Text';
import Card from './Card';
import { injected } from '../connectors';
import { shortenAddress } from '../utils/shortenAddress';

const MetamaskLogo = styled.img.attrs({
  src: MMLogo,
})`
  height: 40px;
`;

const ConnectBtn = styled(Button).attrs({ variant: 'outline-dark' })``;

const MetamaskConnectButton = () => {
  const { activate, active, account, deactivate, chainId } = useWeb3React();

  if (active) {
    return (
      <Card className="d-flex flex-column justify-content-between" style={{ width: 350, color: 'gray' }}>
        {/* <MetamaskLogo /> */}
        <Text t3 lineHeight="40px" className="mx-3">
          {shortenAddress(account) + ' on Chain #' + chainId}
        </Text>
        {/* <ConnectBtn
          onClick={() => {
            deactivate();
            console.log('logged out');
          }}
        >
          Log Out
        </ConnectBtn> */}
      </Card>
    );
  }

  return (
    <Card className="d-flex flex-row justify-content-between" style={{ width: 350 }}>
      {/* <MetamaskLogo /> */}
      <Text uppercase t3 lineHeight="40px" className="mx-2">
        Connect Wallet
      </Text>
      <ConnectBtn onClick={() => activate(injected)}>Connect</ConnectBtn>
    </Card>
  );
};

export default MetamaskConnectButton;
