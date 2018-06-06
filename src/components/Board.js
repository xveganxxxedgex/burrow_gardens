import React, { Component } from 'react';
import { branch } from 'baobab-react/higher-order';
import { Popover } from 'react-bootstrap';

import Hero from 'components/Characters/Hero';
import MenuModal from 'components/MenuModal';
import AudioWrapper from 'components/Wrappers/AudioWrapper';
import BackgroundWrapper from 'components/Wrappers/BackgroundWrapper';
import BunniesWrapper from 'components/Wrappers/BunniesWrapper';
import FoodWrapper from 'components/Wrappers/FoodWrapper';
import SceneryWrapper from 'components/Wrappers/SceneryWrapper';

import {
  setBoardDimensions,
  setActiveTile,
  toggleShowMenu,
} from 'actions';

import 'less/Board.less';

@branch({
  tile: ['tile'],
  popover: ['popover'],
  showMenu: ['showMenu'],
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
    const { popover, tile, showMenu } = this.props;

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
        <BackgroundWrapper />
        <SceneryWrapper />
        <FoodWrapper />
        <BunniesWrapper />
        <Hero />
        <AudioWrapper />
      </div>
    );
  }
}

export default Board;
