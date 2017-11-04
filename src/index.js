require('babel-polyfill');

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
const history = createBrowserHistory();

import App from './components/App';

class Root extends React.Component {
  render() {
    return (
      <Router history={history}>
        <Route component={App} />
      </Router>
    );
  }
}

ReactDOM.render(
  <Root />,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}
