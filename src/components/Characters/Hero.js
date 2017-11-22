import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { branch } from 'baobab-react/higher-order';

import Bunny from 'components/Characters/Bunny';

import {
  updateHeroPosition,
  setActiveTile,
  collectItem,
  toggleShowInventory,
  checkSceneryCollision,
  checkFoodCollision
} from 'actions';

import bunnyLeftImg from 'images/bunny1.png';
import bunnyUpImg from 'images/bunnyup1.png';
import bunnyDownImg from 'images/bunnydown1.png';
import bunnyLeftGif from 'images/bunnygif.gif';
import bunnyUpGif from 'images/bunnyupgif.gif';
import bunnyDownGif from 'images/bunnydowngif.gif';
import bunnyLoafImg from 'images/bunnyloaf.png';
import bunnyLoafUpImg from 'images/bunnyuploaf.png';
import bunnyLoafDownImg from 'images/bunnydownloaf.png';
import bunnyFlopImg from 'images/bunnyflop.png';
import bunnyFlopUpImg from 'images/bunnyupflop.png';
import bunnyFlopDownImg from 'images/bunnydownflop.png';

import lopBunnyLeftImg from 'images/lopbunny1.png';
import lopBunnyUpImg from 'images/lopbunnyup1.png';
import lopBunnyDownImg from 'images/lopbunnydown1.png';
import lopBunnyLeftGif from 'images/lopbunnygif.gif';
import lopBunnyUpGif from 'images/lopbunnyupgif.gif';
import lopBunnyDownGif from 'images/lopbunnydowngif.gif';

@branch({
  hero: ['hero'],
  boardDimensions: ['boardDimensions'],
  tile: ['tile'],
  showInventory: ['showInventory'],
  movePixels: ['movePixels']
})
class Hero extends Component {
  constructor(props, context) {
    super(props, context);

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
      32: 'space',
      // i key
      73: 'inventory'
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
    this.setHeroIdleStatus = this.setHeroIdleStatus.bind(this);

    this.bunnyImages = {
      left: bunnyLeftImg,
      up: bunnyUpImg,
      down: bunnyDownImg,
      leftGif: bunnyLeftGif,
      upGif: bunnyUpGif,
      downGif: bunnyDownGif,
      loaf: bunnyLoafImg,
      loafUp: bunnyLoafUpImg,
      loafDown: bunnyLoafDownImg,
      flop: bunnyFlopImg,
      flopUp: bunnyFlopUpImg,
      flopDown: bunnyFlopDownImg
    }

    this.state = {
      moving: [],
      lastDirection: 'right'
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.setKeyDown);
    document.addEventListener('keyup', this.setKeyUp);

    // Set idle status when player doesn't move within 5 seconds
    this.idleTimeout = setTimeout(this.setHeroIdleStatus.bind(this, 'isLoaf'), 5000);
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

  getDirection(e) {
    const keycode = e.keyCode;
    return this.keyboardEvents[keycode];
  }

  setKeyDown(e) {
    e.preventDefault();
    const {
      moving,
      lastDirection
    } = this.state;
    const direction = this.getDirection(e);
    const {
      hero: {
        position: { x, y }
      },
      showInventory
    } = this.props;

    if (!direction) {
      return;
    }

    clearTimeout(this.idleTimeout);
    this.idleTimeout = null;

    if (direction == 'inventory') {
      toggleShowInventory();
      return;
    }

    if (showInventory) {
      return;
    }

    if (direction == 'space') {
      if (!moving.length) {
        checkFoodCollision(this, x, y);
      }

      return;
    }

    const oppositeDirection = this.oppositeDirections[direction];
    const directionIndex = moving.indexOf(direction);
    const oppositeDirectionIndex = moving.indexOf(oppositeDirection);
    const newState = {};
    let updateIdleState = false;

    if (this.state.isLoaf) {
      newState.isLoaf = false;
      updateIdleState = true;
    }

    if (this.state.isFlopped) {
      newState.isFlopped = false;
      updateIdleState = true;
    }

    if (updateIdleState) {
      this.setState(newState);
    }

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

    // If player is no longer moving, clear moving timeout and set idle timeout
    if (!newMoving.length) {
      clearTimeout(this.movingTimeout);
      this.movingTimeout = null;
      this.idleTimeout = setTimeout(this.setHeroIdleStatus.bind(this, 'isLoaf'), 5000);
    }
  }

  setHeroIdleStatus(type, value) {
    const newState = {
      [type]: value || !this.state[type]
    };

    // Flop bunny after loaf status
    if (type == 'isLoaf') {
      this.idleTimeout = setTimeout(this.setHeroIdleStatus.bind(this, 'isFlopped'), 5000);
    } else if (type == 'isFlopped') {
      newState.isLoaf = false;
    }

    this.setState(newState);
  }

  // Handle forward movements, ie moving down or right
  movePlayerForward(axis, newX, newY, direction) {
    const {
      boardDimensions: {
        height: boardHeight, width: boardWidth
      },
      tile,
      movePixels
    } = this.props;
    const { moving } = this.state;
    const isXAxis = axis == 'x';
    const bunnyRect = findDOMNode(this).getBoundingClientRect();
    const minLimit = 0 - ((isXAxis ? bunnyRect.width : bunnyRect.height) / 2);
    const maxLimit = isXAxis ? boardWidth - (bunnyRect.width / 2) : boardHeight - (bunnyRect.height / 2);
    const checkTile = this.props.tile[isXAxis ? 'y' : 'x'];
    let value = (isXAxis ? newX : newY) + movePixels;

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
    const sceneryLimit = checkSceneryCollision(this, useX, useY, direction);
    const foodLimit = checkFoodCollision(this, useX, useY, direction);

    return {
      value: Math.min(maxLimit, Math.min(value, Math.min(sceneryLimit, foodLimit)))
    };
  }

  // Handle forward movements, ie moving up or left
  movePlayerBack(axis, newX, newY, direction) {
    const {
      boardDimensions: {
        height: boardHeight, width: boardWidth
      },
      tile,
      movePixels
    } = this.props;
    const { moving } = this.state;
    const isXAxis = axis == 'x';
    const bunnyRect = findDOMNode(this).getBoundingClientRect();
    const minLimit = 0 - ((isXAxis ? bunnyRect.width : bunnyRect.height) / 2);
    const maxLimit = isXAxis ? boardWidth - (bunnyRect.width / 2) : boardHeight - (bunnyRect.height / 2);
    const checkTile = this.props.tile[isXAxis ? 'y' : 'x'];
    let value = (isXAxis ? newX : newY) - movePixels;

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
    const sceneryLimit = checkSceneryCollision(this, useX, useY, direction);
    const foodLimit = checkFoodCollision(this, useX, useY, direction);

    return {
      value: Math.max(minLimit, Math.max(value, Math.max(sceneryLimit, foodLimit)))
    };
  }

  movePlayer() {
    const { moving } = this.state;
    const {
      hero: {
        position: { x, y }
      },
      boardDimensions: {
        height, width
      },
      tile: { x: tileX, y: tileY }
    } = this.props;

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

  render() {
    const {
      hero: {
        position: { x, y }
      }
    } = this.props;

    return (
      <Bunny
        name="hero"
        style={{ top: y + 'px', left: x + 'px' }}
        ref={(hero) => { this.hero = hero }}
        direction={this.state.lastDirection}
        isFlopped={this.state.isFlopped}
        isLoaf={this.state.isLoaf}
        isMoving={this.state.moving.length}
        bunnyImages={this.bunnyImages} />
    );
  }
}

export default Hero;
