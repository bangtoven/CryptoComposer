import '../styles/base.scss';
import '../styles/global.scss';
import '../styles/app.module.scss';
import { ethers } from 'ethers';

import { AppContextProvider } from '../components/utils/AppContext';
import { Web3ReactProvider } from '@web3-react/core';

function getLibrary(provider) {
  return new ethers.providers.Web3Provider(provider);
}

const MyApp = ({ Component, pageProps }) => {
  return (
    <AppContextProvider>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Component {...pageProps} />
      </Web3ReactProvider>
    </AppContextProvider>
  );
};

export default MyApp;
