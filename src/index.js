// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './store' // Make sure to import your Redux store

ReactDOM.render(
  <Auth0Provider
    domain="dev-x5lmxdamexy436rr.us.auth0.com"
    clientId="hVD9rHaycEDDP9CyviGqPE5zklTAgsyX"
    redirectUri={window.location.origin}
  >
    <Provider store={store}>
      <App />
    </Provider>
  </Auth0Provider>,
  document.getElementById('root')
);
