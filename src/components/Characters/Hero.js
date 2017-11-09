import React, { Component } from 'react';
import { Overlay, Tooltip } from 'react-bootstrap';
import { findDOMNode } from 'react-dom';
import { branch } from 'baobab-react/higher-order';

import Bunny from 'components/Characters/Bunny';

import { updateHeroPosition, setTooltip, setActiveTile } from 'actions';

import bunnyLeftImg from 'images/bunny1.png';
import bunnyUpImg from 'images/bunnyup1.png';
import bunnyDownImg from 'images/bunnydown1.png';
import bunnyLeftGif from 'images/bunnygif.gif';
import bunnyUpGif from 'images/bunnyupgif.gif';
import bunnyDownGif from 'images/bunnydowngif.gif';

import lopBunnyLeftImg from 'images/lopbunny1.png';
import lopBunnyUpImg from 'images/lopbunnyup1.png';
import lopBunnyDownImg from 'images/lopbunnydown1.png';
import lopBunnyLeftGif from 'images/lopbunnygif.gif';
import lopBunnyUpGif from 'images/lopbunnyupgif.gif';
import lopBunnyDownGif from 'images/lopbunnydowngif.gif';

@branch({
  heroPosition: ['heroPosition'],
  tooltip: ['tooltip'],
  boardDimensions: ['boardDimensions'],
  tile: ['tile']
})
class Hero extends Component {
  constructor(props, context) {
    super(props, context);

    this.movePixels = 20;

    this.keyboardEvents = {
      // Direction keys
      38: 'up',
      40: 'down',
      37: 'left',
      39: 'right',
      // WASD keys
      87: 'up',
      83: 'down',
      65: 'left',
      68: 'right',
      // Space Bar
      32: 'space'
    };

    this.oppositeDirections = {
      'up': 'down',
      'down': 'up',
      'left': 'right',
      'right': 'left',
    };

    this.movePlayer = this.movePlayer.bind(this);
    this.getDirection = this.getDirection.bind(this);
    this.setKeyDown = this.setKeyDown.bind(this);
    this.setKeyUp = this.setKeyUp.bind(this);
    this.callAction = this.callAction.bind(this);
    this.unsetTooltip = this.unsetTooltip.bind(this);
    this.checkCollision = this.checkCollision.bind(this);

    this.state = {
      moving: [],
      lastDirection: 'right'
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.setKeyDown);
    document.addEventListener('keyup', this.setKeyUp);
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.moving != this.state.moving) {
      const lastDirection = nextState.moving.length ? nextState.moving[nextState.moving.length - 1] : this.state.lastDirection;

      if (lastDirection != this.state.lastDirection) {
        this.setState({ lastDirection });
      }

      if (nextState || !nextState.moving.length) {
        clearTimeout(this.movingTimeout);
        this.movingTimeout = null;
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.setKeyDown);
    document.removeEventListener('keyup', this.setKeyUp);
  }

  getPosNumber(pos) {
    return Number(pos.replace('px', ''));
  }

  getDirection(e) {
    const keycode = e.keyCode;
    return this.keyboardEvents[keycode];
  }

  setKeyDown(e) {
    e.preventDefault();
    const { moving } = this.state;
    const direction = this.getDirection(e);
    const { tooltip } = this.props;

    if (!direction) {
      return;
    }

    if (direction == 'space') {
      if (!tooltip && !moving.length) {
        // call space action method
        this.callAction();
      }

      return;
    }

    const oppositeDirection = this.oppositeDirections[direction];
    const directionIndex = moving.indexOf(direction);
    const oppositeDirectionIndex = moving.indexOf(oppositeDirection);

    if (directionIndex == -1 && oppositeDirectionIndex == -1) {
      this.setState({
        moving: [...moving, direction]
      });

      if (!this.movingTimeout) {
        this.movePlayer();
      }
    }
  }

  setKeyUp(e) {
    const direction = this.getDirection(e);

    if (!direction) {
      return;
    }

    const directionIndex = this.state.moving.indexOf(direction);
    const newMoving = this.state.moving.filter((value, index) => { return index != directionIndex });

    if (directionIndex > -1) {
      this.setState({
        moving: newMoving
      }, () => {
        if (newMoving.length) {
          this.movePlayer();
        }
      });
    }

    if (!newMoving.length) {
      clearTimeout(this.movingTimeout);
      this.movingTimeout = null;
    }
  }

  unsetTooltip() {
    const { tooltip } = this.props;

    if (tooltip) {
      setTooltip(null);
    }
  }

  checkCollision(x, y, direction) {
    const {
      tile: { scenery },
      boardDimensions: {
        left: boardX, top: boardY
      }
    } = this.props;
    const heroRect = findDOMNode(this).getBoundingClientRect();
    const heroLeft = x + boardX;
    const heroRight = heroLeft + heroRect.width;
    const heroTop = y + boardY;
    const heroBottom = heroTop + heroRect.height;
    let maxValue = ['up', 'down'].indexOf(direction) > -1 ? y : x;

    for (let s = 0; s < scenery.length; s++) {
      const sceneryElement = document.querySelector(`.scenery_index_${s}`).getBoundingClientRect();
      const sceneryBottom = sceneryElement.top + sceneryElement.height;
      const sceneryRight = sceneryElement.left + sceneryElement.width;
      const hitPlayerRight = heroRight > sceneryElement.left;
      const hitPlayerBottom = heroBottom > sceneryElement.top;
      const hitPlayerLeft = heroLeft < sceneryRight;
      const hitPlayerTop = heroTop < sceneryBottom;
      const isBetweenY = hitPlayerTop && hitPlayerBottom;
      const isBetweenX = hitPlayerLeft && hitPlayerRight;
      const isColliding = isBetweenY && isBetweenX;

      if (isColliding) {
        switch(direction) {
          case 'up':
            maxValue = Math.max(maxValue, (sceneryBottom - boardY));
            break;
          case 'down':
            maxValue = Math.min(maxValue, (sceneryElement.top - boardY - heroRect.height));
            break;
          case 'left':
            maxValue = Math.max(maxValue, (sceneryRight - boardX));
            break;
          case 'right':
            maxValue = Math.min(maxValue, (sceneryElement.left - boardX - heroRect.width));
            break;
        }
      }
    }

    return maxValue;
  }

  // Handle forward movements, ie moving down or right
  movePlayerForward(axis, newX, newY, direction) {
    const {
      boardDimensions: {
        height: boardHeight, width: boardWidth
      },
      tile
    } = this.props;
    const { moving } = this.state;
    const isXAxis = axis == 'x';
    const heroRect = findDOMNode(this).getBoundingClientRect();
    const minLimit = 0 - ((isXAxis ? heroRect.width : heroRect.height) / 2);
    const maxLimit = isXAxis ? boardWidth - (heroRect.width / 2) : boardHeight - (heroRect.height / 2);
    const checkTile = this.props.tile[isXAxis ? 'y' : 'x'];
    let value = (isXAxis ? newX : newY) + this.movePixels;

    if (value > maxLimit && checkTile < 2) {
      const tileX = tile.x + (isXAxis ? 0 : 1);
      const tileY = tile.y + (isXAxis ? 1 : 0);
      // Move to next tile
      setActiveTile(tileX, tileY);
      //Set player coordinate to start of next tile
      return {
        value: minLimit,
        changeTile: true
      };
    }

    const useX = isXAxis ? value : newX;
    const useY = isXAxis ? newY : value;

    // Ensure new position isn't colliding with any entities
    const sceneryLimit = this.checkCollision(useX, useY, direction);

    return {
      value: Math.min(maxLimit, Math.min(value, sceneryLimit))
    };
  }

  // Handle forward movements, ie moving up or left
  movePlayerBack(axis, newX, newY, direction) {
    const {
      boardDimensions: {
        height: boardHeight, width: boardWidth
      },
      tile
    } = this.props;
    const { moving } = this.state;
    const isXAxis = axis == 'x';
    const heroRect = findDOMNode(this).getBoundingClientRect();
    const minLimit = 0 - ((isXAxis ? heroRect.width : heroRect.height) / 2);
    const maxLimit = isXAxis ? boardWidth - (heroRect.width / 2) : boardHeight - (heroRect.height / 2);
    const checkTile = this.props.tile[isXAxis ? 'y' : 'x'];
    let value = (isXAxis ? newX : newY) - this.movePixels;

    if (value < minLimit && checkTile > 1) {
      const tileX = tile.x - (isXAxis ? 0 : 1);
      const tileY = tile.y - (isXAxis ? 1 : 0);
      // Move to previous tile
      setActiveTile(tileX, tileY);
      //Set player coordinate to end of previous tile
      return {
        value: maxLimit,
        changeTile: true
      };
    }

    const useX = isXAxis ? value : newX;
    const useY = isXAxis ? newY : value;

    // Ensure new position isn't colliding with any entities
    const sceneryLimit = this.checkCollision(useX, useY, direction);

    return {
      value: Math.max(minLimit, Math.max(value, sceneryLimit))
    };
  }

  movePlayer() {
    const { moving } = this.state;
    const {
      heroPosition: { x, y },
      boardDimensions: {
        height, width
      },
      tooltip,
      tile: { x: tileX, y: tileY }
    } = this.props;

    this.unsetTooltip();
    let newX = x;
    let newY = y;

    for (let m = 0; m < moving.length; m++) {
      switch(moving[m]) {
        case 'up':
          const movePlayerUp = this.movePlayerBack('y', newX, newY, moving[m]);
          newY = movePlayerUp.value;
          break;
        case 'down':
          const movePlayerDown = this.movePlayerForward('y', newX, newY, moving[m]);
          newY = movePlayerDown.value;
          break;
        case 'left':
          const movePlayerLeft = this.movePlayerBack('x', newX, newY, moving[m]);
          newX = movePlayerLeft.value;
          break;
        case 'right':
          const movePlayerRight = this.movePlayerForward('x', newX, newY, moving[m]);
          newX = movePlayerRight.value;
          break;
      }
    }

    updateHeroPosition({ x: newX, y: newY });

    this.movingTimeout = setTimeout(this.movePlayer, 120);
  }

  callAction() {
    // What to do when user hits space?
    setTooltip("Space bar pressed");
  }

  render() {
    const { heroPosition: { x, y }, tooltip } = this.props;
    let bunnyImage = this.state.moving.length ? bunnyLeftGif : bunnyLeftImg;

    if (this.state.lastDirection == 'up') {
      bunnyImage = this.state.moving.length ? bunnyUpGif : bunnyUpImg;
    } else if (this.state.lastDirection == 'down') {
      bunnyImage = this.state.moving.length ? bunnyDownGif : bunnyDownImg;
    }

    if (true || isLop) {
      bunnyImage = this.state.moving.length ? lopBunnyLeftGif : lopBunnyLeftImg;

      if (this.state.lastDirection == 'up') {
        bunnyImage = this.state.moving.length ? lopBunnyUpGif : lopBunnyUpImg;
      } else if (this.state.lastDirection == 'down') {
        bunnyImage = this.state.moving.length ? lopBunnyDownGif : lopBunnyDownImg;
      }
    }

    return (
      <Bunny
        name="hero"
        style={{ top: y + 'px', left: x + 'px' }}
        ref={(hero) => { this.hero = hero }}
        direction={this.state.lastDirection}
      >
        <img src={bunnyImage} />
        <Overlay
          placement='top'
          show={!!tooltip}
          animation={false}
          container={this}
          target={() => findDOMNode(this.hero)}
        >
          <Tooltip id="heroToolTip">{ tooltip }</Tooltip>
        </Overlay>
      </Bunny>
    );
  }
}

export default Hero;
