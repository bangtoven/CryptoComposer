import React from 'react';
import { hydrate, render } from 'react-dom';
import { Web3ReactProvider } from '@web3-react/core';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './styles/base.scss';
import css from './app.module.scss';
import { ethers } from 'ethers';

import Home from './pages/Home';
import Header from './components/Header';
import { AppContextProvider } from './AppContext';
import { Mint } from './pages/Mint';
import { Player } from './pages/Player';
import MySongs from './pages/MySongs';

function getLibrary(provider) {
  return new ethers.providers.Web3Provider(provider);
}

const renderMethod = module.hot ? render : hydrate;

export const Client = () => {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
};

renderMethod(<Client />, document.getElementById('root'));

if (module.hot) {
  module.hot.accept();
}
