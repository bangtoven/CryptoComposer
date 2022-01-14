import { InjectedConnector } from '@web3-react/injected-connector';

export const injected = new InjectedConnector({ supportedChainIds: [3, 4, 137, 1337] });

export const getChainName = (id) => {
  switch (id) {
    case 3:
      return 'Ropsten';
    case 4:
      return 'Rinkeby';
    case 137:
      return 'Polygon';
    case 1337:
      return 'Local chain';
    default:
      return null;
  }
};
