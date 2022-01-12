import React from 'react';
import { hydrate, render } from 'react-dom';
import { HashRouter } from 'react-router-dom';
import App from './App';

const renderMethod = module.hot ? render : hydrate;

export const Client = () => {
  return (
    <HashRouter>
      <App />
    </HashRouter>
  );
};

renderMethod(<Client />, document.getElementById('root'));

if (module.hot) {
  module.hot.accept();
}
