import React from 'react';
import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './styles/base.scss';
import css from './app.module.scss';

import Home from './pages/Home';
import Header from './components/Header';
import { AppContextProvider } from './AppContext';
import Text from './components/Text';

function getLibrary(provider) {
  return new ethers.providers.Web3Provider(provider);
}

const App = () => {
  return (
    <AppContextProvider>
      <Web3ReactProvider getLibrary={getLibrary}>
        <BrowserRouter>
          <Header />

          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/about" component={Text} />
          </Switch>
        </BrowserRouter>
      </Web3ReactProvider>
    </AppContextProvider>
  );
};

export default App;
