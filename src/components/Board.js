import React, { Component } from 'react';
import { branch } from 'baobab-react/higher-order';
import { Popover } from 'react-bootstrap';
import _isEqual from 'lodash/isEqual';

import Hero from 'components/Characters/Hero';
import MenuModal from 'components/MenuModal';
import SceneryItem from 'components/Scenery/SceneryItem';
import FoodItem from 'components/Food/FoodItem';
import Bunny from 'components/Characters/Bunny';

import {
  setBoardDimensions,
  setActiveTile,
  getBackgroundCell,
  toggleShowMenu
} from 'actions';

import 'less/Board.less';

@branch({
  tile: ['tile'],
  popover: ['popover'],
  showMenu: ['showMenu'],
  bunniesOnTile: ['bunniesOnTile'],
  wonGame: ['wonGame']
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

  componentWillReceiveProps(nextProps) {
    // If player just won the game, open the modal to notify them
    if (nextProps.wonGame && this.props.wonGame != nextProps.wonGame && !nextProps.showMenu) {
      toggleShowMenu();
    }
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
    const { popover, tile, showMenu, bunniesOnTile } = this.props;

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
        {showMenu &&
          <MenuModal container={this} show={showMenu} />
        }
        <BackgroundWrapper tile={tile} />
        <SceneryWrapper tile={tile} />
        <FoodWrapper tile={tile} />
        <BunniesWrapper tile={tile} bunniesOnTile={bunniesOnTile} />
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

class BunniesWrapper extends Component {
  shouldComponentUpdate(nextProps) {
    const tileChanged = !_isEqual([nextProps.tile.x, nextProps.tile.y], [this.props.tile.x, this.props.tile.y]);
    const bunniesChanged = !_isEqual(nextProps.bunniesOnTile, this.props.bunniesOnTile);
    return tileChanged || bunniesChanged;
  }

  render() {
    const { bunniesOnTile } = this.props;

    return (
      <div className="bunny-wrapper">
        {bunniesOnTile.map((item, itemIndex) => {
          return (
            <Bunny {...item} key={`bunny-${itemIndex}`} index={itemIndex} />
          );
        })}
      </div>
    )
  }
}
