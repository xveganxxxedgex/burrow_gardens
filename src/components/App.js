import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { root } from 'baobab-react/higher-order';

import Board from 'components/Board';

import '../less/App.less';

import tree from '../state';

import { toggleGameVisibility } from 'actions';

@root(tree)
export default class App extends Component {
  componentDidMount() {
    window.addEventListener("visibilitychange", toggleGameVisibility, false);
  }

  componentWillUnmount() {
    window.removeEventListener('visibilitychange', toggleGameVisibility);
  }

  render() {
    return (
      <div className="app">
        <Board />
      </div>
    );
  }
}
