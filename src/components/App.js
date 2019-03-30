import React, { Component } from 'react';
import { root } from 'baobab-react/higher-order';

import Board from 'components/Board';

import tree from 'state';
import { toggleGameVisibility } from 'actions';

import 'less/App.less';

@root(tree)
export default class App extends Component {
  componentDidMount() {
    window.addEventListener('visibilitychange', toggleGameVisibility, false);
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
