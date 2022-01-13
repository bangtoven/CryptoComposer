import React from 'react';
import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './styles/base.scss';
import css from './styles/app.module.scss';

import Home from './pages/Home';
import Header from './components/Header';
import { AppContextProvider } from './utils/AppContext';
import { Mint } from './pages/Mint';
import { Player } from './pages/Player';
import MySongs from './pages/MySongs';

function getLibrary(provider) {
  return new ethers.providers.Web3Provider(provider);
}

const App = () => {
  return (
    <AppContextProvider>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Header />

        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/mysongs" component={MySongs} />
          <Route path="/mint" component={Mint} />
          <Route path="/songs/:id" component={Player} />
        </Switch>
      </Web3ReactProvider>
    </AppContextProvider>
  );
};

export default App;
