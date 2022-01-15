import '../styles/base.scss';
import '../styles/global.scss';
import '../styles/app.module.scss';
import { ethers } from 'ethers';
import Head from 'next/head';

import { AppContextProvider } from '../components/utils/AppContext';
import { Web3ReactProvider } from '@web3-react/core';
import { AlertContextProvider } from '../components/Alert';

import Script from 'next/script';

function getLibrary(provider) {
  return new ethers.providers.Web3Provider(provider);
}

const MyApp = ({ Component, pageProps }) => {
  return (
    <div>
      <Head>
        <title>Crypto Composer</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=0.1" />
      </Head>
      <Script strategy="lazyOnload" src={`https://www.googletagmanager.com/gtag/js?id=G-VCHYVKGEN6`} />
      <Script strategy="lazyOnload" id="my-script">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-VCHYVKGEN6', {
              page_path: window.location.pathname,
            });
          `}
      </Script>

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
