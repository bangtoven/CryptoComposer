// components/Layout.js
import Head from 'next/head';

import Header from './Header';

import { AppContextProvider } from '../utils/AppContext';
import { Web3ReactProvider } from '@web3-react/core';

import { ethers } from 'ethers';
import './Layout.module.css';

function getLibrary(provider) {
  return new ethers.providers.Web3Provider(provider);
}

// import './Layout.scss';
// import './index.scss';

const Layout = (props) => {
  return (
    <div className="Layout">
      <Head>
        <title>Crypto Composer</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#000000" />
        <style>@import url('https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap');</style>
      </Head>
      <AppContextProvider>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Header />
          <div className="app" id="root">
            {props.children}
          </div>
        </Web3ReactProvider>
      </AppContextProvider>
    </div>
  );
};

export default Layout;
