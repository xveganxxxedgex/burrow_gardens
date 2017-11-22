import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { branch } from 'baobab-react/higher-order';

import Bunny from 'components/Characters/Bunny';

import {
  updateHeroPosition,
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
  tile: ['tile']
})
class Simba extends Component {
  constructor(props, context) {
    super(props, context);

    this.oppositeDirections = {
      'up': 'down',
      'down': 'up',
      'left': 'right',
      'right': 'left',
    };

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

  render() {
    const {
      item: {
        position: { x, y }
      }
    } = this.props;

    return (
      <Bunny
        name="Simba"
        style={{ top: y + 'px', left: x + 'px' }}
        direction={this.state.lastDirection}
        isMoving={this.state.moving.length}
        bunnyImages={this.bunnyImages} />
    );
  }
}

export default Simba;
