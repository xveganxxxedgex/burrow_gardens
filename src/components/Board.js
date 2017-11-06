import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { branch } from 'baobab-react/higher-order';

import Hero from 'components/Characters/Hero';
import Scenery from 'components/Scenery';

import { setBoardDimensions, getTile } from 'actions';

import 'less/Board.less';

@branch({
  tile: ['tile']
})
class Board extends Component {
  constructor(props, context) {
    super(props, context);

    this.getBoardBounds = this.getBoardBounds.bind(this);

    this.backgrounds = {
      B0: 'dirt',
      B1: 'grass',
      B2: 'bush',
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.getBoardBounds);

    this.getBoardBounds();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.getBoardBounds);
  }

  createBackground(tile, tileIndex) {
    const backgroundClass = this.backgrounds[tile];
    return <div className={`background-tile ${backgroundClass}`} key={`tile-${tileIndex}`} />;
  }

  getBoardBounds() {
    setTimeout(() => {
      setBoardDimensions(this.board);
    }, 1);
  }

  render() {
    const { tooltip, tile: { x, y } } = this.props;
    const Tile = getTile(x, y);
    return (
      <div className="board" ref={(board) => { this.board = board }}>
        {Tile.background.map((row, rowIndex) => {
          return (
            <div className="background-row" key={`row-${rowIndex}`}>
              {row.map((tile, tileIndex) => this.createBackground(tile, tileIndex))}
            </div>
          );
        })}
        {Tile.scenery.map((item, itemIndex) => {
          return (
            <Scenery item={item} key={`scenery-${itemIndex}`} />
          );
        })}
        <Hero />
      </div>
    );
  }
}

export default Board;
