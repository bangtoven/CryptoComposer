import '../styles/base.scss';
import '../styles/global.scss';
import '../styles/app.module.scss';
import { ethers } from 'ethers';
import Head from 'next/head';

import { AppContextProvider } from '../components/utils/AppContext';
import { Web3ReactProvider } from '@web3-react/core';
import { AlertContextProvider } from '../components/Alert';

function getLibrary(provider) {
  return new ethers.providers.Web3Provider(provider);
}

const MyApp = ({ Component, pageProps }) => {
  return (
    <div>
      <Head>
        <title>Crypto Composer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppContextProvider>
        <Web3ReactProvider getLibrary={getLibrary}>
          <AlertContextProvider>
            <Component {...pageProps} />
          </AlertContextProvider>{' '}
        </Web3ReactProvider>
      </AppContextProvider>
    </div>
  );
};

export default MyApp;
