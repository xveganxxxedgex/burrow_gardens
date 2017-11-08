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

  movePlayerX() {

  }

  movePlayerY() {
    const tempUpY = newY - this.movePixels;
    if (tempUpY < minTop && tileX > 1) {
      //move tile
      setActiveTile(tileX - 1, tileY);
      //Set player coordinate to bottom of new tile
      newY = maxBottom;
      // break;
    }

    // Ensure new position isn't colliding with any entities
    const sceneryMaxBottom = this.checkCollision(newX, tempUpY, moving[m]);

    newY = Math.max(minTop, Math.max(tempUpY, sceneryMaxBottom));
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
    const heroRect = findDOMNode(this).getBoundingClientRect();

    const minTop = 0 - (heroRect.height / 2);
    const maxBottom = height - (heroRect.height / 2);
    const minLeft = 0 - (heroRect.width / 2);
    const maxRight = width - (heroRect.width / 2);

    for (let m = 0; m < moving.length; m++) {
      switch(moving[m]) {
        case 'up':
          const tempUpY = newY - this.movePixels;
          if (tempUpY < minTop && tileX > 1) {
            //move tile
            setActiveTile(tileX - 1, tileY);
            //Set player coordinate to bottom of new tile
            newY = maxBottom;
            break;
          }

          // Ensure new position isn't colliding with any entities
          const sceneryMaxBottom = this.checkCollision(newX, tempUpY, moving[m]);

          newY = Math.max(minTop, Math.max(tempUpY, sceneryMaxBottom));
          break;
        case 'down':
          const tempDownY = newY + this.movePixels;
          if (tempDownY > maxBottom && tileX < 2) {
            //move tile
            setActiveTile(tileX + 1, tileY);
            //Set player coordinate to top of new tile
            newY = minTop;
            break;
          }

          // Ensure new position isn't colliding with any entities
          const sceneryMaxTop = this.checkCollision(newX, tempDownY, moving[m]);

          newY = Math.min(maxBottom, Math.min(tempDownY, sceneryMaxTop));
          break;
        case 'left':
          const tempLeftX = newX - this.movePixels;
          if (tempLeftX < minLeft && tileY > 1) {
            //move tile
            setActiveTile(tileX, tileY - 1);
            //Set player coordinate to right of new tile
            newX = maxRight;
            break;
          }

          // Ensure new position isn't colliding with any entities
          const sceneryMaxRight = this.checkCollision(tempLeftX, newY, moving[m]);

          newX = Math.max(minLeft, Math.max(tempLeftX, sceneryMaxRight));
          break;
        case 'right':
          const tempRightX = newX + this.movePixels;
          if (tempRightX > maxRight && tileY < 2) {
            //move tile
            setActiveTile(tileX, tileY + 1);
            //Set player coordinate to left of new tile
            newX = minLeft;
            break;
          }

          // Ensure new position isn't colliding with any entities
          const sceneryMaxLeft = this.checkCollision(tempRightX, newY, moving[m]);

          newX = Math.min(maxRight, Math.min(tempRightX, sceneryMaxLeft));
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
