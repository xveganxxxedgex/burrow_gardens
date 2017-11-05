import React, { Component } from 'react';
import { Overlay, Tooltip } from 'react-bootstrap';
import { findDOMNode } from 'react-dom';
import { branch } from 'baobab-react/higher-order';

import Bunny from 'components/Characters/Bunny';

import { updateHeroPosition, setTooltip } from 'actions';

@branch({
  heroPosition: ['heroPosition'],
  tooltip: ['tooltip']
})
class Hero extends Component {
  constructor(props, context) {
    super(props, context);

    this.movePixels = 5;

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

    this.state = {
      moving: []
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.setKeyDown);
    document.addEventListener('keyup', this.setKeyUp);
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.moving != this.state.moving) {
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

    if (direction == 'space') {
      // call space action method
      this.callAction();
    } else {
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
  }

  setKeyUp(e) {
    const direction = this.getDirection(e);
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

  movePlayer() {
    const {
      moving
    } = this.state;
    const { heroPosition: { x, y } } = this.props;
    let newX = x;
    let newY = y;

    for (let m = 0; m < moving.length; m++) {
      switch(moving[m]) {
        case 'up':
          newY -= this.movePixels;
          break;
        case 'down':
          newY += this.movePixels;
          break;
        case 'left':
          newX -= this.movePixels;
          break;
        case 'right':
          newX += this.movePixels;
          break;
      }
    }

    updateHeroPosition({ x: newX, y: newY });

    this.movingTimeout = setTimeout(this.movePlayer, 50);
  }

  callAction() {
    // What to do when user hits space?
    setTooltip("Space bar pressed");
  }

  render() {
    const { heroPosition: { x, y }, tooltip } = this.props;
    console.log(tooltip, this.hero);
    return (
      <div style={{ position: 'absolute' }}>
        <Bunny
          name="hero"
          style={{ top: y + 'px', left: x + 'px' }}
          ref={(hero) => { this.hero = hero }}
        />
        <Overlay placement='top' show={!!tooltip} container={this} target={() => findDOMNode(this.hero)}>
          <Tooltip id="heroToolTip" className="in">{ tooltip }</Tooltip>
        </Overlay>
      </div>
    );
  }
}

export default Hero;
