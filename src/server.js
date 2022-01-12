import App from './App';
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import express from 'express';
import { renderToString } from 'react-dom/server';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const cssLinksFromAssets = (assets, entrypoint) => {
  return assets[entrypoint]
    ? assets[entrypoint].css
      ? assets[entrypoint].css.map((asset) => `<link rel="stylesheet" href="${asset}">`).join('')
      : ''
    : '';
};

const jsScriptTagsFromAssets = (assets, entrypoint, ...extra) => {
  return assets[entrypoint]
    ? assets[entrypoint].js
      ? assets[entrypoint].js.map((asset) => `<script src="${asset}" ${extra.join(' ')}></script>`).join('')
      : ''
    : '';
};

export const renderApp = (req, res) => {
  const context = {};
  const markup = renderToString(
    <StaticRouter context={context} location={req.url}>
      <App />
    </StaticRouter>,
  );
  const html = `<!doctype html>
  <html lang="">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="theme-color" content="#000000" />
        <title>Crypto Composer</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap');
        </style>
    </head>
    <body>
        <div id="root">${markup}</div>
        ${jsScriptTagsFromAssets(assets, 'client', 'defer', 'crossorigin')}
    </body>
  </html>`;
  return { context, html };
};

const server = express();
server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/meta', (req, res) => {
    const context = {};
    const json = '{"json":"adsfadsf"}';
    if (context.url) {
      res.redirect(context.url);
    } else {
      res.status(200).send(json);
    }
  })
  .get('/*', (req, res) => {
    const { context, html } = renderApp(req, res);
    if (context.url) {
      res.redirect(context.url);
    } else {
      res.status(200).send(html);
    }
  });

export default server;
