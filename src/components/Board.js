import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { branch } from 'baobab-react/higher-order';
import { Popover } from 'react-bootstrap';
import _isEqual from 'lodash/isEqual';

import Hero from 'components/Characters/Hero';
import Scenery from 'components/Scenery';
import InventoryModal from 'components/InventoryModal';
import SceneryItem from 'components/Scenery/SceneryItem';
import FoodItem from 'components/Food/FoodItem';
import Bunny from 'components/Characters/Bunny';
import grassImage from 'images/grass.png';

import {
  setBoardDimensions,
  setActiveTile,
  getCharacter,
  getFoodItem,
  getBackgroundCell,
  getSceneryItem,
  showInventory
} from 'actions';

import 'less/Board.less';

@branch({
  tile: ['tile'],
  popover: ['popover'],
  showInventory: ['showInventory'],
  bunniesOnTile: ['bunniesOnTile']
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
    const { popover, tile, showInventory, bunniesOnTile } = this.props;

    if (!Object.keys(tile).length) {
      return <div>Loading...</div>;
    }

    return (
      <div className="board modal-container" ref={(board) => { this.board = board }}>
        {popover &&
          <Popover
            id="board-popover"
            title={popover.title}
            placement="left"
            positionTop={20}
            className={`right-alert ${popover.popoverClass}`}
          >
            {popover.text}
          </Popover>
        }
        {showInventory &&
          <InventoryModal container={this} show={showInventory} />
        }
        <BackgroundWrapper tile={tile} />
        <SceneryWrapper tile={tile} />
        <FoodWrapper tile={tile} />
        {bunniesOnTile.map((item, itemIndex) => {
          // TODO: Ensure bunny isn't overlapping/colliding with any other
          // element before populating on the board
          return (
            <Bunny {...item} key={`bunny-${itemIndex}`} index={itemIndex} />
          );
        })}
        <Hero />
      </div>
    );
  }
}

export default Board;

class BackgroundWrapper extends Component {
  shouldComponentUpdate(nextProps) {
    return !_isEqual([nextProps.tile.x, nextProps.tile.y], [this.props.tile.x, this.props.tile.y]);
  }

  render() {
    const { tile } = this.props;

    return (
      <div className="background-wrapper">
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
      </div>
    )
  }
}

class SceneryWrapper extends Component {
  shouldComponentUpdate(nextProps) {
    return !_isEqual([nextProps.tile.x, nextProps.tile.y], [this.props.tile.x, this.props.tile.y]);
  }

  render() {
    const { tile } = this.props;

    return (
      <div className="scenery-wrapper">
        {tile.scenery.map((item, itemIndex) => {
          return (
            <SceneryItem {...item} key={`scenery-${itemIndex}`} index={itemIndex} />
          );
        })}
      </div>
    )
  }
}

class FoodWrapper extends Component {
  shouldComponentUpdate(nextProps) {
    const tileChanged = !_isEqual([nextProps.tile.x, nextProps.tile.y], [this.props.tile.x, this.props.tile.y]);
    const foodChanged = !_isEqual(nextProps.tile.food, this.props.tile.food);
    return tileChanged || foodChanged;
  }

  render() {
    const { tile } = this.props;

    return (
      <div className="food-wrapper">
        {tile.food.map((item, itemIndex) => {
          return (
            <FoodItem {...item} key={`food-${itemIndex}`} index={itemIndex} />
          );
        })}
      </div>
    )
  }
}
