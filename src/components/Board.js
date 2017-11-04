import React, { Component } from 'react';

import Tile1 from 'Maps/Tile1-1';

import 'less/Board.less';

class Board extends Component {
  constructor(props, context) {
    super(props, context);

    this.backgrounds = {
      B0: 'dirt',
      B1: 'grass',
      B2: 'bush',
    };
  }

  createBackground(tile, tileIndex) {
    const backgroundClass = this.backgrounds[tile];
    return <div className={`background-tile ${backgroundClass}`} key={`tile-${tileIndex}`}></div>;
  }

  render() {
    return (
      <div className="board">
        {Tile1.map((row, rowIndex) => {
          return (
            <div className="background-row" key={`row-${rowIndex}`}>
              {row.map((tile, tileIndex) => this.createBackground(tile, tileIndex))}
            </div>
          );
        })}
      </div>
    )
  }
}

export default Board;
