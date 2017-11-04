import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { root } from 'baobab-react/higher-order';

import Board from 'components/Board';

import '../less/App.less';

import tree from '../state';

@root(tree)
export default class App extends Component {
  render() {
    return (
      <div className="app">
        <Board />
      </div>
    );
  }
}
