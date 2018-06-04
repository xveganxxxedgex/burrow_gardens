import React, { Component } from 'react';
import { branch } from 'baobab-react/higher-order';
import _capitalize from 'lodash/capitalize';
import _find from 'lodash/find';
import _isEqual from 'lodash/isEqual';
import _isEmpty from 'lodash/isEmpty';
import _min from 'lodash/min';
import _max from 'lodash/max';
import _random from 'lodash/random';
import _sample from 'lodash/sample';
import _uniq from 'lodash/uniq';

import { MOVEMENT_DURATION } from 'components/Characters/constants';
import { BURROW_TYPE } from 'components/Scenery/constants';

import {
  moveEntityBack,
  moveEntityForward,
  updateCharacterPosition,
  getOppositeDirection,
  getExitPosition,
  isBackwardsDirection,
  getAxisFromDirection,
  findPathToExit,
  getTargetDirection,
  checkIfAtTargetPosition,
  getDirectionForAxis,
  takeBunnyToGroupTile,
  getElementRect,
  removeBunnyCollisionWithHero
} from 'actions';

import 'less/Characters.less';

@branch({
  tile: ['tile'],
  boardDimensions: ['boardDimensions'],
  gameVisible: ['gameVisible'],
  heroCollisions: ['heroCollisions'],
  heroLastDirection: ['hero', 'lastDirection']
})
class Bunny extends Component {
  constructor(props, context) {
    super(props, context);

    this.toggleTransition = this.toggleTransition.bind(this);
    this.getBunnyImage = this.getBunnyImage.bind(this);
    this.moveAI = this.moveAI.bind(this);
    this.moveCharacter = this.moveCharacter.bind(this);
    this.stopMovingCharacter = this.stopMovingCharacter.bind(this);
    this.takeBunnyToTargetTile = this.takeBunnyToTargetTile.bind(this);

    this.directions = ['up', 'down', 'left', 'right'];

    const {
      position,
      boardDimensions: { height: boardHeight, width: boardWidth }
    } = props;

    this.state = {
      moveTransition: true,
      startingPosition: props.position,
      moving: [],
      lastDirection: _sample(this.directions),
      goToPosition: null,
      maxBounds: this.getMaxBoundsFromStartPosition(position, boardHeight, boardWidth),
      goToGroupTile: false
    };
  }

  componentDidMount() {
    if (!this.checkIfIsHero()) {
      this.moveAI();
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      tile,
      gameVisible,
      boardDimensions: { height: boardHeight, width: boardWidth },
      heroCollisions,
      heroLastDirection,
      hasCollected,
      groupTile,
      onTile
    } = nextProps;
    // Tile is changing - temporarily disable movement transition
    // This will prevent the hero from appearing to slide across the tile to the new starting position
    if (tile.x != this.props.tile.x || tile.y != this.props.tile.y) {
      clearTimeout(this.transitionTimeout);
      this.transitionTimeout = null;
      this.toggleTransition(false);
    }

    if (gameVisible != this.props.gameVisible && gameVisible) {
      // TODO: Handle when tab is no longer active/visible
    }

    // Update max bounds once the board dimensions have loaded
    if (!_isEmpty(nextProps.boardDimensions) && !_isEqual(this.props.boardDimensions, nextProps.boardDimensions)) {
      this.setState({ maxBounds: this.getMaxBoundsFromStartPosition(nextProps.position, boardHeight, boardWidth) });
    }

    // If the character moves tiles, do cleanup
    if (onTile != this.props.onTile) {
      this.stopMovingCharacter(false, true);
    }

    // Bunny just joined the group, navigate them to the group area
    if (hasCollected && hasCollected != this.props.hasCollected) {
      if (groupTile.x != tile.x || groupTile.y != tile.y) {
        const newState = { goToGroupTile: true };
        // See if the preferred exit in the direction of the target tile has a valid path
        let goToPosition = getExitPosition(this, groupTile);
        let pathToExit = findPathToExit(this, goToPosition);

        if (!pathToExit) {
          // Try finding a path to the closest exit possible
          goToPosition = getExitPosition(this, null);
          pathToExit = findPathToExit(this, goToPosition);
        }

        if (pathToExit) {
          // Unset them as colliding with the hero
          removeBunnyCollisionWithHero(this.props.id);
          const newPosition = pathToExit[0];
          pathToExit.splice(0, 1);

          newState.goToPosition = newPosition;
          newState.path = pathToExit;
          newState.maxBounds = this.getMaxBoundsFromStartPosition(goToPosition, boardHeight, boardWidth, true);
        }

        this.setState(newState, () => {
          this.stopMovingCharacter(true);
        });
      }
    }

    if (!this.state.goToPosition && heroCollisions != this.props.heroCollisions) {
      // Check if colliding with Hero and if so, face their direction
      if (this.checkIfCollidingWithHero(nextProps)) {
        this.stopMovingCharacter(true, true);
        const oppositeHeroDirection = getOppositeDirection(heroLastDirection);

        if (this.state.lastDirection != oppositeHeroDirection) {
          this.setLastDirection(oppositeHeroDirection);
        }
      }
    }
  }

  componentWillUpdate(nextProps, nextState) {
    const { moving, goToPosition } = nextState;

    if (moving != this.state.moving) {
      const lastDirection = moving.length ? moving[moving.length - 1] : this.state.lastDirection;

      if (lastDirection != this.state.lastDirection) {
        this.setLastDirection(lastDirection);
      }

      if (!moving.length && (!goToPosition || !nextState)) {
        clearTimeout(this.movingTimeout);
        this.movingTimeout = null;
      }
    }
  }

  componentDidUpdate() {
    // Add back the transition once the tile has been rendered
    if (!this.state.moveTransition && !this.transitionTimeout) {
      this.transitionTimeout = setTimeout(this.toggleTransition.bind(this, true), 100);
    }
  }

  componentWillUnmount() {
    if (this.state.goToGroupTile) {
      this.takeBunnyToTargetTile();
    }

    this.clearTimeouts();
  }

  getMaxBoundsFromStartPosition(position, maxHeight, maxWidth, setToBounds) {
    const rightPadding = position.x + 200;
    const bottomPadding = position.y + 100;
    const rightBounds = maxWidth ? Math.min(rightPadding, maxWidth) : rightPadding;
    const bottomBounds = maxHeight ? Math.min(bottomPadding, maxHeight) : bottomPadding;

    return {
      up: setToBounds ? -this.props.height : Math.max(position.y - 100, 0),
      down: setToBounds && maxHeight ? maxHeight : bottomBounds,
      left: setToBounds ? -this.props.width : Math.max(position.x - 200, 0),
      right: setToBounds && maxWidth ? maxWidth : rightBounds
    };
  }

  setLastDirection(lastDirection) {
    this.setState({ lastDirection });
  }

  clearTimeouts() {
    clearTimeout(this.stopMovingCharacterTimeout);
    clearTimeout(this.transitionTimeout);
    clearTimeout(this.movingTimeout);
    clearTimeout(this.moveCharacterTimeout);
  }

  checkIfCollidingWithHero(props) {
    props = props || this.props;
    const { heroCollisions, id } = props;

    return !this.isHero && heroCollisions.indexOf(id) > -1;
  }

  toggleTransition(moveTransition) {
    this.setState({ moveTransition });
  }

  getPosNumber(pos) {
    return Number(pos.replace('px', ''));
  }

  getBunnyImage() {
    const { direction, isFlopped, isLoaf, bunnyImages } = this.props;
    const useDirection = this.checkIfIsHero() ? direction : this.state.lastDirection;
    let imageKey = 'left';

    if (isFlopped || isLoaf) {
      imageKey = (isFlopped ? 'flop' : 'loaf') + _capitalize(useDirection);
    } else {
      imageKey = useDirection;

      if (this.props.isMoving || this.state.moving.length) {
        imageKey = imageKey + 'Gif';
      }
    }

    return bunnyImages[imageKey];
  }

  /**
   * Returns the character object with height and width at the top level
   *
   * @return {object} - The new character object
   */
  getCharacterWithDimensions() {
    const { height, width } = this.props;
    return {
      ...this,
      height,
      width
    };
  }

  getDirection() {
    const { goToPosition } = this.state;
    const randomDirection = _sample(this.directions);

    // If character doesn't have a target position, randomize their direction
    if (!goToPosition) {
      return randomDirection;
    }

    const characterRect = getElementRect(this);
    return getTargetDirection(characterRect, goToPosition);
  }

  moveAI() {
    const { goToPosition } = this.state;
    const direction = this.getDirection(this.props.position, goToPosition);
    const duration = goToPosition ? (60 * 1000) : _random(1.5, 3, true) * 1000;
    // Don't wait to move if bunny needs to go to a new position
    const waitTimeout = goToPosition ? 0 : _random(3, 7, true) * 1000;

    this.clearTimeouts();
    this.moveCharacterTimeout = setTimeout(() => {
      // Don't move if currently colliding with Hero
      if (!goToPosition && this.checkIfCollidingWithHero()) {
        // Try moving again after another timeout
        this.moveAI();
        return;
      }

      this.setState({
        moving: [direction]
      }, () => {
        this.moveCharacter();

        this.stopMovingCharacterTimeout = setTimeout(this.stopMovingCharacter, duration);
      });
    }, waitTimeout);
  }

  stopMovingCharacter(moveAgain, clearTimeouts) {
    if (!this.state.goToPosition) {
      this.setState({ moving: [] });
    }

    if (moveAgain) {
      this.moveAI();
    }

    if (clearTimeouts) {
      this.clearTimeouts();
    }
  }

  shouldContinueMoving(newAxisValue, boundsDirection, oldPos) {
    const { goToPosition } = this.state;
    const checkAxis = getAxisFromDirection(boundsDirection);
    const isInBounds = this.isInBounds(newAxisValue, boundsDirection);
    const collidingWithHero = this.checkIfCollidingWithHero();
    const atSamePosition = newAxisValue == oldPos[checkAxis];
    const canMove = !atSamePosition && isInBounds;

    if (goToPosition) {
      // Stop moving if we're at the target axis position so we can change direction if needed
      const atTargetAxisPosition = checkIfAtTargetPosition(boundsDirection, oldPos, goToPosition);

      if (atTargetAxisPosition) {
        const otherAxis = checkAxis == 'x' ? 'y' : 'x';
        const otherAxisDirection = getDirectionForAxis(otherAxis, oldPos, goToPosition);
        const atTargetOtherAxisPosition = checkIfAtTargetPosition(otherAxisDirection, oldPos, goToPosition);

        // Check to see if there's collisions in the next potential direction
        if (atTargetOtherAxisPosition) {
          const path = this.state.path;
          const newPosition = path[0];
          path.splice(0, 1);

          this.setState({
            goToPosition: newPosition,
            path,
          });

          return false;
        }
      }

      return canMove;
    }

    return canMove && !collidingWithHero;
  }

  isInBounds(newPos, boundsDirection) {
    const { goToPosition } = this.state;

    if (isBackwardsDirection(boundsDirection)) {
      return goToPosition ? newPos >= this.state.maxBounds[boundsDirection] : newPos > this.state.maxBounds[boundsDirection];
    }

    return goToPosition ? newPos <= this.state.maxBounds[boundsDirection] : newPos < this.state.maxBounds[boundsDirection];
  }

  moveCharacter() {
    const { moving, goToPosition } = this.state;
    const { position: { x, y } } = this.props;
    const newPosition = { x, y };

    let continueMoving = false;
    let collisions = [];
    const moveMethods = {
      back: {
        move: moveEntityBack,
        // When moving back, use the max possible value so they don't go out of
        // bounds or intersect with a colliding entity
        value: _max
      },
      forward: {
        move: moveEntityForward,
        // When moving forward, use the min possible value so they don't go out of
        // bounds or intersect with a colliding entity
        value: _min
      }
    };

    for (let m = 0; m < moving.length; m++) {
      const direction = moving[m];
      const axis = getAxisFromDirection(direction);
      const isMovingBack = isBackwardsDirection(direction);
      const useMoveLogic = isMovingBack ? 'back' : 'forward';
      const movePlayer = moveMethods[useMoveLogic].move(this, axis, newPosition.x, newPosition.y, direction, moving.length > 1, goToPosition);
      const newValue = moveMethods[useMoveLogic].value([movePlayer.value, this.state.maxBounds[direction]]);

      if (movePlayer.collisions.length) {
        collisions = _uniq(collisions.concat(movePlayer.collisions));
      }

      continueMoving = continueMoving || this.shouldContinueMoving(newValue, direction, newPosition);
      newPosition[axis] = newValue;
    }

    if (!this.checkIfIsHero()) {
      const burrowCollision = _find(collisions, collision => collision.type == BURROW_TYPE);

      if (burrowCollision) {
        this.setState({ goToPosition: null, path: null, goToGroupTile: false });
        this.takeBunnyToTargetTile();
      }
    }

    if (continueMoving) {
      updateCharacterPosition(this.props.id, newPosition);

      if (this.state.moving.length) {
        this.movingTimeout = setTimeout(this.moveCharacter, MOVEMENT_DURATION);
      }
    } else {
      this.stopMovingCharacter(true);
    }
  }

  takeBunnyToTargetTile() {
    setTimeout(() => {
      // Take character to group tile after the position has updated
      // This is to ensure character doesn't disappear too early
      takeBunnyToGroupTile(this);
      this.stopMovingCharacter(false, true);
    }, MOVEMENT_DURATION);
  }

  checkIfIsHero() {
    return this.props.id == 'Hero';
  }

  render() {
    const { name, position, height, width, children, direction, isFlopped, id } = this.props;
    const { moveTransition, lastDirection } = this.state;
    const bunnyImage = this.getBunnyImage();
    const useDirection = this.checkIfIsHero() ? direction : lastDirection;

    return (
      <div
        className={`bunny ${name} ${moveTransition ? '' : 'no-transition'} ${useDirection} ${isFlopped ? 'isFlopped' : ''} bunny_index_${id}`}
        style={{
          top: position.y + 'px',
          left: position.x + 'px',
          height: height + 'px',
          width: width + 'px'
        }}
      >
        <img src={bunnyImage} />
        {children}
      </div>
    );
  }
}

export default Bunny;
