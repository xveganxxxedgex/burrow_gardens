import React, { Component } from 'react';
import { root } from 'baobab-react/higher-order';

import Board from 'components/Board';

import tree from 'state';
import { toggleGameVisibility, saveGame } from 'actions';

import 'less/App.less';

@root(tree)
export default class App extends Component {
  componentDidMount() {
    window.addEventListener('visibilitychange', toggleGameVisibility, false);
    window.addEventListener('beforeunload', saveGame);
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
