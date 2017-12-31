import React, { Component } from 'react';
import { branch } from 'baobab-react/higher-order';
import _capitalize from 'lodash/capitalize';
import _difference from 'lodash/difference';
import _find from 'lodash/find';
import _filter from 'lodash/filter';
import _isEqual from 'lodash/isEqual';
import _isEmpty from 'lodash/isEmpty';
import _min from 'lodash/min';
import _max from 'lodash/max';
import _random from 'lodash/random';
import _sample from 'lodash/sample';
import _uniq from 'lodash/uniq';
import _without from 'lodash/without';
import _cloneDeep from 'lodash/cloneDeep';

import { BURROW_TYPE } from 'components/Scenery/constants';

import {
  moveEntityBack,
  moveEntityForward,
  updateCharacterPosition,
  getOppositeDirection,
  getExitPosition,
  updateBunnyTile,
  entityIsMovingBack,
  isMovingOnYAxis,
  getAxisFromDirection
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
    this.updateCollidingStatus = this.updateCollidingStatus.bind(this);
    this.removeNextDirection = this.removeNextDirection.bind(this);

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
      collisionStatus: {
        directionsTried: [],
        collisions: [],
        failedAttempts: []
      }
    };
  }

  componentDidMount() {
    if (!this.checkIfIsHero()) {
      this.moveAI();
    }
  }

  componentWillUpdate(nextProps, nextState) {
    const { collisionStatus, moving } = nextState;

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

  componentWillReceiveProps(nextProps) {
    const {
      tile,
      gameVisible,
      position: { x, y },
      boardDimensions: { height: boardHeight, width: boardWidth },
      heroCollisions,
      heroLastDirection,
      hasCollected,
      groupTile,
      onTile,
      collisionStatus
    } = nextProps;
    // Tile is changing - temporarily disable movement transition
    // This will prevent the hero from appearing to slide across the tile to the new starting position
    if (tile != this.props.tile) {
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
        this.setState({ goToPosition, maxBounds: this.getMaxBoundsFromStartPosition(goToPosition, boardHeight, boardWidth, true) }, () => {
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

  componentDidUpdate(prevProps, prevState) {
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
    const { isMoving, direction, isFlopped, isLoaf, bunnyImages } = this.props;
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

  getPreferredDirection(currentPosition, targetPosition) {
    const { x, y } = currentPosition;
    // Try to go in the direction of the target position based on characters current position
    if (targetPosition.x > x) {
      return 'right';
    } else if (targetPosition.x < x) {
      return 'left';
    } else if (targetPosition.y > y) {
      return 'down';
    }

    return 'up';
  }

  getDirection(currentPosition, targetPosition, moving, collisionStatus) {
    moving = moving || this.state.moving;
    collisionStatus = collisionStatus || this.state.collisionStatus;
    const { directionsTried, nextDirection } = collisionStatus;
    const { x, y } = currentPosition;
    const randomDirection = _sample(this.directions);

    // If character doesn't have a target position, randomize their direction
    if (!targetPosition) {
      return randomDirection;
    }

    if (nextDirection) {
      this.removeNextDirection();
      return nextDirection;
    }

    // Try to go in the direction of the target position based on characters current position
    const preferredDirection = this.getPreferredDirection(currentPosition, targetPosition);
    // If we can't go our preferred direction, try to go the next best route
    const alternativeDirection = this.getNextBestDirection(currentPosition, targetPosition, preferredDirection);
    let direction = moving.indexOf(preferredDirection) == -1 ? preferredDirection : alternativeDirection;

    // If that direction has a collision, pick an alternative direction
    if (directionsTried.indexOf(direction) > -1) {
      const nextBestDirection = this.getNextBestDirection(currentPosition, targetPosition, direction);
      // const oppositeDirection = getOppositeDirection(preferredDirection);
      // const oppositeDirection = getOppositeDirection(nextBestDirection);
      const oppositeDirection = getOppositeDirection(direction);

      if (directionsTried.indexOf(nextBestDirection) == -1) {
        direction = nextBestDirection;
      } else if (directionsTried.indexOf(oppositeDirection) == -1) {
        // Try to go in the opposite direction that we're currently going
        direction = oppositeDirection;
      } else {
        // As a last resort, pick any other direction that we haven't tried
        direction = _difference(this.directions, directionsTried)[0];
      }
    }

    return direction;
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
    const { goToPosition, moving, collisionStatus } = this.state;
    const { position: { x, y } } = this.props;
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

  removeNextDirection() {
    const newCollisionStatus = this.state.collisionStatus;
    newCollisionStatus.nextDirection = null;
    this.setState({ newCollisionStatus });
  }

  updateCollidingStatus(addDirection, collisions, removeDirection, returnOnly, failedCoordinate, nextDirection) {
    const newCollisionStatus = _cloneDeep(this.state.collisionStatus);

    // Add newly attempted direction that had a collision
    if (addDirection && newCollisionStatus.directionsTried.indexOf(addDirection) == -1) {
      newCollisionStatus.directionsTried = [...newCollisionStatus.directionsTried, addDirection];
    }

    // Remove a direction that no longer has a collision
    if (removeDirection && newCollisionStatus.directionsTried.indexOf(removeDirection) > -1) {
      newCollisionStatus.directionsTried = _without(newCollisionStatus.directionsTried, removeDirection);
    }

    newCollisionStatus.collisions = collisions || [];

    if (failedCoordinate) {
      if (!_find(newCollisionStatus.failedAttempts, coordinate => _isEqual(coordinate, failedCoordinate ))) {
        newCollisionStatus.failedAttempts = [...newCollisionStatus.failedAttempts, failedCoordinate];
      }
    }

    // if (nextDirection) {
      // newCollisionStatus.nextDirection = nextDirection;
    // }

    if (returnOnly) {
      return newCollisionStatus;
    }

    if (!_isEqual(newCollisionStatus, this.state.collisionStatus)) {
      this.setState({ collisionStatus: newCollisionStatus });
    }
  }

  shouldContinueMoving(newAxisValue, boundsDirection, oldPos, collisions) {
    const { goToPosition, collisionStatus: { directionsTried, collisions: currentCollisions, failedAttempts }, moving } = this.state;
    const checkAxis = getAxisFromDirection(boundsDirection);
    const isInBounds = this.isInBounds(newAxisValue, boundsDirection);
    const collidingWithHero = this.checkIfCollidingWithHero();
    const canMove = newAxisValue != oldPos[checkAxis];

    // Can't move, colliding with something directly
    if (!canMove) {
      // If AI is going towards a target location, update the attempted
      // direction and current collisions
      if (goToPosition) {
        this.updateCollidingStatus(boundsDirection, collisions);
      }

      return false;
    }

    const collisionsChanged = !_isEqual(collisions, currentCollisions);
    const collisionItemsChanged = !_isEqual(this.removeFailedCollisions(collisions), this.removeFailedCollisions(currentCollisions));
    const failedAttemptCollisions = this.filterFailedCollisions(collisions);
    const failedAttemptCollisionsChanged = !_isEqual(failedAttemptCollisions, this.filterFailedCollisions(currentCollisions));

    if (!goToPosition) {
      return (!collisionsChanged || !collisions.length) && !collidingWithHero && isInBounds;
    }

    const otherAxis = checkAxis == 'x' ? 'y' : 'x';
    const isAtOtherAxis = goToPosition[otherAxis] == oldPos[otherAxis];
    const newPosition = { [checkAxis]: newAxisValue, [otherAxis]: oldPos[otherAxis], height: this.props.width, width: this.props.width };
    const preferredDirection = this.getPreferredDirection(newPosition, goToPosition);
    const lastAttemptedDirection = directionsTried[directionsTried.length - 1];
    const emptyCollisionStatus = this.updateCollidingStatus(null, collisions, lastAttemptedDirection, true);
    const nextDirection = this.getDirection(newPosition, goToPosition, [], emptyCollisionStatus);
    const oppositeOfLastDirection = getOppositeDirection(lastAttemptedDirection);
    const willGoOppositeOfLastDirection = nextDirection == oppositeOfLastDirection;
    const goingInNextPossibleDirection = boundsDirection == nextDirection;
    // Check if we're going in our preferred direction
    let goingInPreferredDirection = boundsDirection == preferredDirection;
    let removeAttemptedDirection;

    const isMovingBack = entityIsMovingBack(boundsDirection);
    const dimension = checkAxis == 'x' ? 'width' : 'height';
    const previousAttempt = {
      // Put failed attempt position where the character moving from
      [checkAxis]: isMovingBack ? oldPos[checkAxis] + this.props[dimension] : oldPos[checkAxis] - this.props[dimension],
      [otherAxis]: oldPos[otherAxis],
      height: this.props.width,
      width: this.props.width, type: 'failed'
    };

    if (!collisionsChanged || !collisions.length) {
      if (!collisions.length) {
        let failedAttempt;

        // TODO:
        // The problem is that we need to change direction when collisions
        // have changed. What's happening now is that we clear the failed attempt
        // collision, but then the next position has new collisions, colliding with the bushes.
        // So we need to watch for being able to go new directions regardless of if collisions
        // have changed.
        //
        // That becomes tricky though because collision changes are triggered almost
        // every time the character moves, since it collides with different
        // entities as it goes.
        //
        // So need to determine the logic on when it's 100% safe to go a new direction
        // that also doesn't trigger when character is going opposite of preferred direction
        //
        // If canGoLastAttemptedDirection
        // If notGoingOppositeOfFirstDirection
        //
        // Don't go:
        //
        // Start -> Right -> Up -> Left (it will try to go up again)
        //
        // Do go:
        //
        // Start -> Right -> Up -> Left -> Up -> Right (We want it to go right when it can)
        //
        // So maybe if canGoPreferredDirection && lastDirection == preferredDirection?

        // If we're not colliding with anything and not going the preferred
        // direction, see if we can and move that way instead
        if (!goingInPreferredDirection) {
          // TODO: Faulty logic, this is preventing it from going the right way later on
          const lastAttemptedIsPreferredDirection = lastAttemptedDirection && lastAttemptedDirection == preferredDirection;
          const goingLastAttemptedDirection = boundsDirection == lastAttemptedDirection;
          goingInPreferredDirection = lastAttemptedIsPreferredDirection && nextDirection == preferredDirection;
          // If we're able to go in the last attempted direction, remove it from the attempts
          removeAttemptedDirection = lastAttemptedDirection;

          const firstAttemptedDirection = directionsTried[0];
          const goingOppositeOfFirstDirection = boundsDirection == getOppositeDirection(firstAttemptedDirection);

          // If we're going the opposite direction of our first attempted direction,
          // record that coordinate as a failed attempt so we don't try to go that way again
          if (goingOppositeOfFirstDirection) {
            failedAttempt = previousAttempt;
          }
        }

        this.updateCollidingStatus(null, null, removeAttemptedDirection, false, failedAttempt);
      } else {
        // If collisions haven't changed, but there are still collisions, see
        // if we're going in the best possible direction
        goingInPreferredDirection = goingInNextPossibleDirection;
      }

      return goingInPreferredDirection;
    }

    // If collision items changed, see if we can go a new direction
    if (collisionsChanged) {
      // If we're no longer colliding with a failed coordinate, try to go the
      // last attempted direction
      if (failedAttemptCollisionsChanged && !failedAttemptCollisions.length) {
        const goingOppositeOfPreferredDirection = getOppositeDirection(preferredDirection) == boundsDirection;
        const goingOppositeOfLastDirection = oppositeOfLastDirection == boundsDirection;
        const goingInLastAttemptedDirection = boundsDirection == lastAttemptedDirection;
        const willGoLastAttemptedDirection = !goingInLastAttemptedDirection && nextDirection == lastAttemptedDirection;
        const goLastDirection = willGoLastAttemptedDirection && !goingOppositeOfPreferredDirection && !goingOppositeOfLastDirection;

        if (goLastDirection) {
          removeAttemptedDirection = lastAttemptedDirection;
          this.updateCollidingStatus(null, collisions, removeAttemptedDirection, false, previousAttempt);
          return false;
        }
      }

      // TODO: May need to add logic here to handle when we can go a new direction
      // but there are collision changes... But be careful that this doesn't happen
      // when there are just collision changes, but we shouldn't really go a new direction...
      // const lastAttemptedIsPreferredDirection = lastAttemptedDirection && lastAttemptedDirection == preferredDirection;
      // const willGoPreferredDirection = nextDirection == preferredDirection;
      // if (lastAttemptedIsPreferredDirection && willGoPreferredDirection) {
      //   console.log("STOP MOVIng SO WE CAN GO PREFERRED DIRECTION - but prob need to still update the position")
      // }
    }

    return !collidingWithHero && isInBounds;
  }

  removeFailedCollisions(collisions) {
    return _filter(collisions, collision => collision.type != 'failed');
  }

  filterFailedCollisions(collisions) {
    return _filter(collisions, collision => collision.type == 'failed');
  }

  isInBounds(newPos, boundsDirection) {
    if (entityIsMovingBack(boundsDirection)) {
      return newPos > this.state.maxBounds[boundsDirection];
    }

    return newPos < this.state.maxBounds[boundsDirection];
  }

  moveCharacter() {
    const { moving, goToPosition, collisionStatus: { failedAttempts } } = this.state;
    const {
      position: { x, y }
    } = this.props;

    let continueMoving = false;
    let collisions = [];
    let newPosition = { x, y };
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
      const movePlayer = moveMethods[useMoveLogic].move(this, axis, newPosition.x, newPosition.y, direction, moving.length > 1, goToPosition, failedAttempts);
      const newValue = moveMethods[useMoveLogic].value([movePlayer.value, this.state.maxBounds[direction]]);

      if (movePlayer.collisions.length) {
        collisions = _uniq(collisions.concat(movePlayer.collisions));
      }

      continueMoving = continueMoving || this.shouldContinueMoving(newValue, direction, newPosition, collisions);
      newPosition[axis] = newValue;
    }

    if (continueMoving) {
      updateCharacterPosition(this.props.id, newPosition);

      if (this.state.moving.length) {
        this.movingTimeout = setTimeout(this.moveCharacter, 120);
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
    const { moveTransition, moving, lastDirection, collisionStatus: { failedAttempts } } = this.state;
    const bunnyImage = this.getBunnyImage();
    const useDirection = this.checkIfIsHero() ? direction : lastDirection;

    /* Orange visual boxes of failed attempts:
    (<div>
      {failedAttempts.map(attempt => {
        return (
          <div style={{
            top: attempt.y + 'px',
            left: attempt.x + 'px',
            height: attempt.height + 'px',
            width: attempt.width + 'px',
            backgroundColor: 'orange',
            position: 'absolute'
          }}>
          </div>
        );
      })}
    </div>)
    */

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
