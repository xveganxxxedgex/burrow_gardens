
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { branch } from 'baobab-react/higher-order';

import Hero from 'components/Characters/Hero';
import Scenery from 'components/Scenery';
import grassImage from 'images/grass.png';

import { setBoardDimensions, setActiveTile, getFoodItem, getBackgroundCell } from 'actions';

import 'less/Board.less';

@branch({
  tile: ['tile']
})
class Board extends Component {
  constructor(props, context) {
    super(props, context);

    this.getBoardBounds = this.getBoardBounds.bind(this);
  }

  componentWillMount() {
    setActiveTile();
  }

  componentDidMount() {
    window.addEventListener('resize', this.getBoardBounds);

    this.getBoardBounds();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.getBoardBounds);
  }

  getBoardBounds() {
    setTimeout(() => {
      setBoardDimensions(this.board);
    }, 1);
  }

  render() {
    const { tooltip, tile } = this.props;

    if (!Object.keys(tile).length) {
      return <div>Loading...</div>;
    }

    return (
      <div className="board" ref={(board) => { this.board = board }}>
        {tile.background.map((row, rowIndex) => {
          return (
            <div className="background-row" key={`row-${rowIndex}`}>
              {row.map((tile, tileIndex) => {
                const BackgroundItem = getBackgroundCell(tile);
                return (
                  <BackgroundItem tile={tile} key={`background-${tileIndex}`} index={tileIndex} />
                );
              })}
            </div>
          );
        })}
        {tile.scenery.map((item, itemIndex) => {
          return (
            <Scenery item={item} key={`scenery-${itemIndex}`} index={itemIndex} />
          );
        })}
        {tile.food.map((item, itemIndex) => {
          const FoodItem = getFoodItem(item.type);
          return (
            <FoodItem item={item} key={`food-${itemIndex}`} index={itemIndex} />
          );
        })}
        <Hero />
      </div>
    );
  }
}

export default Board;
