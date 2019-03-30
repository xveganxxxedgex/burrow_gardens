import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';

import App from './components/App';

require('babel-polyfill');

const history = createBrowserHistory();

const Root = () => {
  return (
    <Router history={history}>
      <Route component={App} />
    </Router>
  );
};

ReactDOM.render(
  <Root />,
  document.getElementById('root'),
);

if (module.hot) {
  module.hot.accept();
}
