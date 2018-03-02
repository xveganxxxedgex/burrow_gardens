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
import _uniqWith from 'lodash/uniqWith';

import { MOVEMENT_DURATION } from 'components/Characters/constants';
import { BURROW_TYPE } from 'components/Scenery/constants';

import {
  moveEntityBack,
  moveEntityForward,
  updateCharacterPosition,
  getOppositeDirection,
  getExitPosition,
  entityIsMovingBack,
  isMovingOnYAxis,
  getAxisFromDirection,
  getClosestOpenGap,
  getTargetDirection,
  checkIfAtTargetPosition,
  getDirectionForAxis,
  takeBunnyToGroupTile,
  getElementRect
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
      attemptedGaps: []
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
        const goToPosition = getExitPosition(groupTile);
        const closestOpenGap = getClosestOpenGap(this, goToPosition, this.state.attemptedGaps);

        const newState = {
          goToPosition: closestOpenGap.gap,
          maxBounds: this.getMaxBoundsFromStartPosition(goToPosition, boardHeight, boardWidth, true),
        };

        if (closestOpenGap.collision) {
          newState.attemptedGaps = _uniqWith([...this.state.attemptedGaps, closestOpenGap.collision], _isEqual)
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
    const { moving } = nextState;

    if (moving != this.state.moving) {
      const lastDirection = moving.length ? moving[moving.length - 1] : this.state.lastDirection;

      if (lastDirection != this.state.lastDirection) {
        this.setLastDirection(lastDirection);
      }

      if (nextState || !moving.length) {
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
    this.clearTimeouts();
  }

  getMaxBoundsFromStartPosition(position, maxHeight, maxWidth, setToBounds) {
    const rightPadding = position.x + 200;
    const bottomPadding = position.y + 100;
    const rightBounds = maxWidth ? Math.min(rightPadding, maxWidth) : rightPadding;
    const bottomBounds = maxHeight ? Math.min(bottomPadding, maxHeight) : bottomPadding;

    return {
      up: setToBounds ? 0 : Math.max(position.y - 100, 0),
      down: setToBounds && maxHeight ? maxHeight : bottomBounds,
      left: setToBounds ? 0 : Math.max(position.x - 200, 0),
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
      imageKey = isFlopped ? 'flop' : 'loaf';

      if (isMovingOnYAxis(useDirection)) {
        imageKey = imageKey + _capitalize(useDirection);
      }
    } else {
      if (isMovingOnYAxis(useDirection)) {
        imageKey = useDirection;
      }

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
    const { moving, goToPosition } = this.state;
    const { position } = this.props;
    const randomDirection = _sample(this.directions);

    // If character doesn't have a target position, randomize their direction
    if (!goToPosition) {
      return randomDirection;
    }

    const characterRect = getElementRect(this);
    // Try to go in the direction of the target position based on characters current position
    const lastDirection = moving.length ? this.state.lastDirection : null;
    const { direction: preferredDirection, newTargetPosition } = getTargetDirection(characterRect, goToPosition, true, lastDirection);

    // If we need to go an alternate route due to collisions in the preferred direction(s),
    // update the target position
    if (!_isEqual(newTargetPosition, goToPosition)) {
      this.setState({ goToPosition: newTargetPosition });
    }

    // If we can't go our preferred direction, try to go the next best route
    const alternativeDirection = this.getNextBestDirection(position, newTargetPosition, preferredDirection);

    return moving.indexOf(preferredDirection) == -1 ? preferredDirection : alternativeDirection;
  }

  getNextBestDirection(currentPosition, targetPosition, direction) {
    const { x, y } = currentPosition;

    // Move on opposite axis to try to get around collision
    if (isMovingOnYAxis(direction)) {
      return targetPosition.x > x ? 'right' : 'left';
    }

    return targetPosition.y > y ? 'down' : 'up';
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
    this.setState({ moving: [] });

    if (moveAgain) {
      this.moveAI();
    }

    if (clearTimeouts) {
      this.clearTimeouts();
    }
  }

  setGoToPosition(goToPosition = null) {
    this.setState({ goToPosition });
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
      const otherAxis = checkAxis == 'x' ? 'y' : 'x';

      if (atTargetAxisPosition) {
        const otherAxisDirection = getDirectionForAxis(otherAxis, oldPos, goToPosition);
        const atTargetOtherAxisPosition = checkIfAtTargetPosition(otherAxisDirection, oldPos, goToPosition);

        // Check to see if there's collisions in the next potential direction
        if (atTargetOtherAxisPosition) {
          const exitPosition = getExitPosition(this.props.groupTile);
          const closestOpenGap = getClosestOpenGap(this, exitPosition, this.state.attemptedGaps);
          const newState = { goToPosition: closestOpenGap.gap };

          if (closestOpenGap.collision) {
            newState.attemptedGaps = _uniqWith([...this.state.attemptedGaps, closestOpenGap.collision], _isEqual)
          }

          this.setState(newState);
        }
      }

      return canMove && !atTargetAxisPosition;
    }

    return canMove && !collidingWithHero;
  }

  isInBounds(newPos, boundsDirection) {
    if (entityIsMovingBack(boundsDirection)) {
      return newPos > this.state.maxBounds[boundsDirection];
    }

    return newPos < this.state.maxBounds[boundsDirection];
  }

  moveCharacter() {
    const { moving, goToPosition } = this.state;
    const {
      position: { x, y }
    } = this.props;

    let continueMoving = false;
    let collisions = [];
    const newPosition = { x, y };
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
      const isMovingBack = entityIsMovingBack(direction);
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
        setTimeout(() => {
          // Take character to group tile after the position has updated
          // This is to ensure character doesn't disappear too early
          takeBunnyToGroupTile(this);
          this.stopMovingCharacter(false, true);
        }, MOVEMENT_DURATION);
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
