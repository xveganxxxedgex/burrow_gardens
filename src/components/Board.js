import React, { Component } from 'react';

import Tile1 from 'Maps/Tile1';

import 'less/Board.less';

class Board extends Component {
  constructor(props, context) {
    super(props, context);

    this.backgrounds = {
      B0: 'dirt',
      B1: 'grass'
    };
  }

  createBackground(tile) {
    const backgroundClass = this.backgrounds[tile];
    return <div className={`background-tile ${backgroundClass}`}></div>;
  }

  render() {
    return (
      <div className="board">
        {Tile1.map(row => {
          return (
            <div className="background-row">
              {row.map(tile => this.createBackground(tile))}
            </div>
          );
        })}
      </div>
    )
  }
}

export default Board;
