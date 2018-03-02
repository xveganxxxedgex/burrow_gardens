import React from 'react';
import tree from 'state';
import _capitalize from 'lodash/capitalize';
import _cloneDeep from 'lodash/cloneDeep';
import _differenceWith from 'lodash/differenceWith';
import _filter from 'lodash/filter';
import _find from 'lodash/find';
import _findKey from 'lodash/findKey';
import _findIndex from 'lodash/findIndex';
import _forEach from 'lodash/forEach';
import _isEqual from 'lodash/isEqual';
import _max from 'lodash/max';
import _maxBy from 'lodash/maxBy';
import _min from 'lodash/min';
import _minBy from 'lodash/minBy';
import _orderBy from 'lodash/orderBy';
import _union from 'lodash/union';
import _uniq from 'lodash/uniq';
import { findDOMNode } from 'react-dom';

import * as FoodItems from 'components/Food';
import * as Characters from 'components/Characters';
import * as Backgrounds from 'components/Backgrounds';
import * as SceneryItems from 'components/Scenery';

import * as SceneryConstants from 'components/Scenery/constants';
import * as CharacterConstants from 'components/Characters/constants';

let popoverTimeout;

/**
 * Updates the hero's position to the state
 *
 * @param  {object} newPos - Position containing the new X and Y coordinates of
 *                           the hero
 */
export function updateHeroPosition(newPos) {
  const cursor = tree.select(['hero', 'position']);
  cursor.set(newPos);
}

/**
 * Updates the character's position to the state
 *
 * @param  {int} bunnyId - The ID of the character to update
 * @param  {object} newPos - Position containing the new X and Y coordinates
 *                           of the character
 */
export function updateCharacterPosition(bunnyId, newPos) {
  updateBunnyProp(bunnyId, 'position', newPos);
}

export function updateBunnyTile(bunnyId, newTile) {
  updateBunnyProp(bunnyId, 'onTile', newTile);
}

export function updateBunnyProp(bunnyId, key, value) {
  const bunnyIndex = getBunnyCursorIndex(bunnyId);
  const cursor = tree.select(['bunnies', bunnyIndex, key]);
  cursor.set(value);
}

export function getBunnyCursorIndex(bunnyId) {
  const bunnies = tree.get('bunnies');
  return _findIndex(bunnies, bunny => bunny.id == bunnyId);
}

/**
 * Saves the hero's height and width to the state
 *
 * @param  {int} height - The hero's new height
 * @param  {int} width - The hero's new width
 */
export function updateHeroSize(height, width) {
  const cursor = tree.select('hero');
  cursor.set('height', height);
  cursor.set('width', width);
}

/**
 * Sets popover object that will unset after a given timeout duration
 *
 * @param {object} popoverObj - The object to use when rendering the popover content
 * @param {Number} duration - The duration to show the popover for
 */
export function setPopover(popoverObj, duration = 3000) {
  const cursor = tree.select('popover');
  cursor.set(popoverObj);
  tree.commit();

  if (popoverObj) {
    clearTimeout(popoverTimeout);
    popoverTimeout = setTimeout(() => {
      setPopover(null);
    }, duration);
  } else {
    clearTimeout(popoverTimeout);
  }
}

/**
 * Maps desired properties to a new objects
 * Mostly used to convert a boundingClientRect object to a standard JS objects
 *
 * @param  {object} dimensions - Object of possible dimensions
 * @param  {array} properties - The desired properties
 *
 * @return {object} - Object containing desired properties
 */
function assignDimensionProperties(dimensions, properties) {
  properties = properties || [
    'top',
    'bottom',
    'left',
    'right',
    'height',
    'width'
  ];
  const newDimensions = {};

  properties.map(property => {
    newDimensions[property] = dimensions[property];
  });

  return newDimensions;
}

/**
 * Sets the board dimensions to the state
 *
 * @param {element} board - The board HTML element
 */
export function setBoardDimensions(board) {
  const boardRect = board.getBoundingClientRect();
  const newDimensions = assignDimensionProperties(boardRect);

  const cursor = tree.select('boardDimensions');
  cursor.set(newDimensions);
}

/**
 * Sets the active game tile to the X and Y coordinates specified
 * @param {Number} x - The new tile X coordinate
 * @param {Number} y - The new tile Y coordinate
 */
export function setActiveTile(x = 1, y = 1) {
  const cursor = tree.select('activeTile');
  const previousTile = cursor.get();
  const previousTileCursor = tree.select(['tiles', `${previousTile.x}_${previousTile.y}`]);
  const itemQueue = tree.select('itemQueue');

  if (itemQueue.get().length) {
    // If we have an item queue for the now previous tile, set their
    // hasCollected status to false so they repopulate when the tile is next rendered
    _forEach(itemQueue.get(), item => {
      const itemIndex = _findIndex(previousTileCursor.get('food'), foodItem => foodItem.id == item);
      previousTileCursor.set(['food', itemIndex, 'collected'], false);
    });

    // Clear the queue
    itemQueue.set([]);
  }

  cursor.set({ x, y });
  tree.commit();
}

/**
 * Returns food item object based on the food type
 *
 * @param  {string} type - The type of food to retrieve
 *
 * @return {class} - The food class
 */
export function getFoodItem(type) {
  return FoodItems[type];
}

/**
 * Returns character object based on character name
 *
 * @param  {string} name - The name of the character to retrieve
 *
 * @return {class} - The character class
 */
export function getCharacter(name) {
  return Characters[name];
}

/**
 * Returns background object based on a string representation of the cell type
 *
 * @param  {string} cell - Short string representation of the background type
 *
 * @return {class} - The background class
 */
export function getBackgroundCell(cell) {
  const backgrounds = tree.get('backgrounds');
  const type = backgrounds[cell];
  return Backgrounds[type];
}

/**
 * Finds the closest exit in the direction of the target tile
 *
 * @param  {object} targetTile - The tile the character will go to
 *
 * @return {string} - The direction of the exit
 */
export function findTileExit(targetTile) {
  const tile = tree.get('tile');
  let preferredExit;

  // Determine the best direction to head to based on where the group tile is in comparison to the current tile
  if (tile.x < targetTile.x) {
    preferredExit = 'bottom';
  } else if (tile.x > targetTile.x) {
    preferredExit = 'top';
  } else if (tile.y < targetTile.y) {
    preferredExit = 'right';
  } else if (tile.y > targetTile.y) {
    preferredExit = 'left';
  }

  // Use the preferred exit if possible, otherwise use the first exit available
  return preferredExit && tile.exits[preferredExit] ? preferredExit : Object.keys(tile.exits)[0];
}

/**
 * Get the X, Y coordinates of the exit
 *
 * @param  {object} targetTile - The tile the character will go to
 *
 * @return {object} - The { x, y } coordinates of the exit position
 */
export function getExitPosition(targetTile) {
  const tile = tree.get('tile');
  const { height: boardHeight, width: boardWidth } = tree.get('boardDimensions');
  const useExit = findTileExit(targetTile);
  const goToPosition = {};

  switch (useExit) {
    case 'top':
      goToPosition.x = tile.exits[useExit].start;
      goToPosition.y = 0; // Top of the board
      break;
    case 'bottom':
      goToPosition.x = tile.exits[useExit].start;
      goToPosition.y = boardHeight; // Bottom of the board
      break;
    case 'left':
      goToPosition.x = 0; // Left of the board
      goToPosition.y = tile.exits[useExit].start;
      break;
    case 'right':
      goToPosition.x = boardWidth; // Right of the board
      goToPosition.y = tile.exits[useExit].start;
      break;
  }

  return goToPosition;
}

/**
 * Returns collisions within the path axis that the character will move on
 *
 * @param  {object} character - The character that will go towards the exit position
 * @param  {object} exitPosition - The position the character will go towards
 *
 * @return {array} - All collisions in the path between the character and the
 *                   exit position
 */
export function findCollisionsInPath(character, exitPosition, direction) {
  const collisionEntities = getCollisionEntities(true);
  const characterRect = getElementRect(character);
  direction = direction || getTargetDirection(characterRect, exitPosition).direction;
  const axis = getAxisFromDirection(direction);
  const oppositeAxis = getOppositeAxis(axis);
  const isMovingBack = entityIsMovingBack(direction);

  const collisionsInPath = _filter(collisionEntities, entity => {
    const isInAxis = isCollidingInAxis(oppositeAxis, characterRect, entity);
    const isInPath = isMovingBack ? entity.position[axis] < characterRect[axis] : entity.position[axis] > characterRect[axis];
    const isBetweenExit = isMovingBack ? entity.position[axis] > exitPosition[axis] : entity.position[axis] < exitPosition[axis];
    return isInPath && isInAxis && isBetweenExit;
  });

  return collisionsInPath;
}

/**
 * Returns all collision entities on a tile
 *
 * @param  {boolean} filterCollected - If only uncollected entities should be returned
 *
 * @return {array} - The collision entities
 */
export function getCollisionEntities(filterCollected) {
  const tile = tree.get('tile');
  const { height: boardHeight, width: boardWidth } = tree.get('boardDimensions');
  const sceneryEntities = _filter(tile.scenery, entity => {
    // Remove burrow and tile border entities
    const isBurrow = entity.type != SceneryConstants.BURROW_TYPE;
    const isBorder = entity.position.x == 0 || entity.position.y == 0 || entity.position.x == boardWidth - entity.width || entity.position.y == boardHeight - entity.height;
    return !isBurrow && !isBorder;
  });

  const foodEntities = !filterCollected ? tile.food : _filter(tile.food, food => !food.collected);

  return _union(foodEntities, sceneryEntities);
}

/**
 * Returns the direction the character should move based on the axis and
 * current and target positions
 *
 * @param  {string}  axis - The axis to get the direction for (ex: 'x' or 'y')
 * @param  {object} characterPosition - The character's current position
 * @param  {object} targetPosition - The position the character is heading to
 *
 * @return {string} - The direction the character should go
 */
export function getDirectionForAxis(axis, characterPosition, targetPosition) {
  const backwardDirection = getBackwardDirection(axis);
  const forwardDirection = getForwardDirection(axis);
  return characterPosition[axis] < targetPosition[axis] ? forwardDirection : backwardDirection;
}

/**
 * Returns the direction the character should move based on where their
 * current and target positions are
 *
 * @param  {object} characterPosition - The character's current position
 * @param  {object} targetPosition - The position the character is heading to
 *
 * @return {string} - Which direction the character should go
 *
 * TODO: Refactor
 */
export function getTargetDirection(characterPosition, targetPosition, avoidCollisions, lastDirection) {
  const { x, y } = characterPosition;
  const { collisions } = targetPosition;
  // Go the direction the most far away
  const xDifference = targetPosition.x - x;
  const yDifference = targetPosition.y - y;
  const moveOnAxis = Math.abs(xDifference) > Math.abs(yDifference) ? 'x' : 'y';
  const axisDirections = {
    x: xDifference > 0 ? 'right' : 'left',
    y: yDifference > 0 ? 'down' : 'up'
  };
  let direction = axisDirections[moveOnAxis];
  let newTargetPosition = _cloneDeep(targetPosition);

  if (!avoidCollisions) {
    return {
      direction,
      newTargetPosition
    };
  }

  const collisionsInFirstDirection = findCollisionsInPath(characterPosition, targetPosition, direction);
  // Don't let AI go in the opposite direction of the last directon they used
  let goingOppositeOfLastDirection = direction == getOppositeDirection(lastDirection);

  // Use the first direction if it doesn't have any collisions except from the
  // target position, and if it's not the opposite of the characters last direction
  if (!collisionsInFirstDirection.length && !goingOppositeOfLastDirection) {
    return {
      direction,
      newTargetPosition
    };
  }

  // Get the collision furthest away, for the entire cluster for the first direction
  const furthestClusterCollisionFirstDirection = getFurthestCollisionInDirection(collisions, direction, characterPosition, newTargetPosition, true);
  // Get the collision furthest away, only within the path of the first direction
  const collisionInFirstDirection = getFurthestCollisionInDirection(collisions, direction, characterPosition, newTargetPosition);

  // Try going on the opposite axis to get around the collisions
  const oppositeAxis = getOppositeAxis(moveOnAxis);
  const otherAxisDirection = axisDirections[oppositeAxis];
  const secondDirectionIsOppositeOfLastDirection = otherAxisDirection == getOppositeDirection(lastDirection);

  // Return if the first direction is not the opposite of the last direction,
  // and if either the closest collision is the known furthest one for the cluster,
  // or if the second direction is trying to take us back on the last direction
  if (!goingOppositeOfLastDirection && (_isEqual(furthestClusterCollisionFirstDirection, collisionInFirstDirection) || secondDirectionIsOppositeOfLastDirection)) {
    return {
      direction,
      newTargetPosition
    };
  }

  // Update the return value to use the new direction and target position
  direction = otherAxisDirection;
  goingOppositeOfLastDirection = direction == getOppositeDirection(lastDirection);

  // See if there are any collisions in the second direction
  const collisionsInSecondDirection = findCollisionsInPath(characterPosition, targetPosition, direction);

  // Use the second direction if there are no collisions
  if (!goingOppositeOfLastDirection && !collisionsInSecondDirection.length) {
    return {
      direction,
      newTargetPosition
    };
  }

  const offsetDimension = getDimensionFromAxis(oppositeAxis); // height/width
  const isMovingBack = entityIsMovingBack(direction);
  const forwardDimension = getForwardDimension(oppositeAxis); // right/bottom
  const sortLogic = isMovingBack ? 'asc' : 'desc';

  // If second direction has consecutive collisions blocking the way, find the nearest
  // gap of those using the third direction
  const consecutiveCollisionsInSecondDirection = _orderBy(_filter(collisions, entity => {
    return entity.position[oppositeAxis] == newTargetPosition[oppositeAxis] + characterPosition[offsetDimension];
  }), entity => entity.position[oppositeAxis], [sortLogic]);

  if (consecutiveCollisionsInSecondDirection.length) {
    const closestGapOnSecondDirection = consecutiveCollisionsInSecondDirection[0];

    _forEach(consecutiveCollisionsInSecondDirection, entity => {
      // There's not a big enough gap for the character to get through,
      // so set this as the new maximum so they can go around it
      if (isMovingBack) {
        if (entity[forwardDimension] > closestGapOnSecondDirection[oppositeAxis] - characterPosition[offsetDimension]) {
          newTargetPosition = entity.position;
        }
      } else {
        if (entity[oppositeAxis] < closestGapOnSecondDirection[forwardDimension] + characterPosition[offsetDimension]) {
          newTargetPosition = entity.position;
        }
      }
    });
  }

  const oppositeOfFirstDirection = getOppositeDirection(axisDirections[moveOnAxis]);
  const furthestCollisionInClusterForThirdDirection = getFurthestCollisionInDirection(collisions, oppositeOfFirstDirection, characterPosition, newTargetPosition, true);
  const collisionInThirdDirection = getFurthestCollisionInDirection(collisions, oppositeOfFirstDirection, characterPosition, newTargetPosition);

  // Go third direction if the closest collision using the third
  // direction is not the furthest in that direction for the entire cluster
  if (!_isEqual(collisionInThirdDirection, furthestCollisionInClusterForThirdDirection)) {
    direction = oppositeOfFirstDirection;
    newTargetPosition = collisionInThirdDirection;
  }

  return {
    direction,
    newTargetPosition
  };
}

// TODO: See if this is still even needed
export function getFurthestCollisionInDirection(collisions, direction, characterPosition, newTargetPosition, checkEntireCluster) {
  const moveOnAxis = getAxisFromDirection(direction);
  const oppositeAxis = getOppositeAxis(moveOnAxis);
  const isMovingBack = entityIsMovingBack(direction);
  const offsetDimension = getDimensionFromAxis(moveOnAxis);
  let newPosition = _cloneDeep(newTargetPosition);

  // Find collisions that are in the way of the diretion we want to go,
  // then set the new target position to go past that entity.
  // This will ensure we take an alternative route if our two preferred
  // directions have collisions
  _forEach(collisions, entity => {
    const entityRect = getElementRect(entity);
    const collisionClearedPosition = entityRect[moveOnAxis] - characterPosition[offsetDimension];
    // Need to see if this is not already the furthest entity in the cluster
    if (newPosition[moveOnAxis] != entityRect[moveOnAxis]) {
      if (isMovingBack) {
        /*
        This is to check if the collision is in the direction they will go next,
        and that the collision is in the way, but is not the furthest in the cluster

        This makes it so the entity will move left in the below situation, where X is
        the character position and N is where we need to go to avoid the collisions:
            ------
             X   -
           N------
         */
        if (checkEntireCluster || entityRect[oppositeAxis] > characterPosition[oppositeAxis]) {
          // Find the collision furthest in the direction we need to go
          if (collisionClearedPosition < newPosition[moveOnAxis]) {
            newPosition = {
              [moveOnAxis]: checkEntireCluster ? entityRect[moveOnAxis] : collisionClearedPosition,
              [oppositeAxis]: entityRect[oppositeAxis]
            };
          }
        }
      } else {
        if (checkEntireCluster || entityRect[oppositeAxis] < characterPosition[oppositeAxis]) {
          const forwardDimension = getForwardDimension(moveOnAxis);
          // Find the collision furthest in the direction we need to go
          if (entityRect[forwardDimension] > newPosition[moveOnAxis]) {
            newPosition = {
              [moveOnAxis]: checkEntireCluster ? entityRect[moveOnAxis] : entityRect[forwardDimension],
              [oppositeAxis]: entityRect[oppositeAxis]
            };
          }
        }
      }
    }
  });

  return newPosition;
}

/**
 * Returns the axis opposite of the one provided
 *
 * @param  {string}  axis - The axis to get the opposite axis for
 *
 * @return {string} - The opposite axis
 */
export function getOppositeAxis(axis) {
  return isXAxis(axis) ? 'y' : 'x';
}

/**
 * Returns if an entity is colliding with the axis
 *
 * @param  {string}  axis - The axis the character is moving on (ex: 'x' or 'y')
 * @param  {object}  entityRect - The entity rect object containing x, y,
 *                                   right, bottom, height and width
 * @param  {object}  collision - The collision entity to check
 *
 * @return {Boolean} - If the entity is colliding with the axis path
 */
export function isCollidingInAxis(axis, entityRect, collision, offset = 0) {
  const collisionRect = getElementRect(collision);
  const rectEnd = isXAxis(axis) ? 'right' : 'bottom';

  return collisionRect[axis] < entityRect[rectEnd] + offset && collisionRect[rectEnd] > entityRect[axis] - offset;
}

/**
 * Returns if the entity is between the character's current position and the
 * exit position going forward on the axis
 *
 * @param  {string}  axis - The axis the character is moving on (ex: 'x' or 'y')
 * @param  {object}  entity - The collision entity to check
 * @param  {object}  characterRect - The character rect object containing x, y,
 *                                   right, bottom, height and width
 * @param  {[type]}  exitPosition - The exit position the character is heading towards
 *
 * @return {Boolean} - If the entity is between the character and the exit
 */
export function isBetweenCharacterAndForwardExit(axis, entity, characterRect, exitPosition, offset) {
  const entityRect = getElementRect(entity);
  return entityRect[axis] > characterRect[axis] && entityRect[axis] < exitPosition[axis] + offset;
}

/**
 * Returns if the entity is between the character's current position and the
 * exit position going back on the axis
 *
 * @param  {string}  axis - The axis the character is moving on (ex: 'x' or 'y')
 * @param  {object}  entity - The collision entity to check
 * @param  {object}  characterRect - The character rect object containing x, y,
 *                                   right, bottom, height and width
 * @param  {[type]}  exitPosition - The exit position the character is heading towards
 *
 * @return {Boolean} - If the entity is between the character and the exit
 */
export function isBetweenCharacterAndBackwardExit(axis, entity, characterRect, exitPosition, offset) {
  const entityRect = getElementRect(entity);
  return entityRect[axis] > exitPosition[axis] - offset && entityRect[axis] < characterRect[axis];
}

/**
 * Returns if the character is at the target position for a given axis
 *
 * @param  {string} direction - The direction the character is moving
 * @param  {object} currentPosition - The character's current position
 * @param  {object} targetPosition - The position the character is moving towards
 *
 * @return {boolean} - If the character is at the target axis position
 */
export function checkIfAtTargetPosition(direction, currentPosition, targetPosition) {
  const axis = getAxisFromDirection(direction);
  const isMovingBack = entityIsMovingBack(direction);
  const atTargetCoordinate = isMovingBack ? currentPosition[axis] <= targetPosition[axis] : currentPosition[axis] >= targetPosition[axis];
  return atTargetCoordinate;
}

export function getClosestOpenGap(character, exitPosition, attemptedGaps) {
  const collisionsInPath = findCollisionsInPath(character, exitPosition);

  // No collisions are in the path of the direction the character will go,
  // so go straight to the exit position
  if (!collisionsInPath.length) {
    return { gap: exitPosition };
  }

  const characterRect = getElementRect(character);
  const { direction } = getTargetDirection(characterRect, exitPosition);
  const openGap = findGapInDirection(direction, collisionsInPath, character, exitPosition, attemptedGaps);
  return openGap;
}

function getDistanceSumFromGap(character, entity = {}, exitPosition = {}) {
  const characterRect = getElementRect(character);
  const entityRect = getElementRect(entity);
  const distanceToCharacter = Math.abs(characterRect.x - entityRect.x) + Math.abs(characterRect.y - entityRect.y) || 0;
  const distanceToExit = Math.abs(exitPosition.x - entityRect.x) + Math.abs(exitPosition.y - entityRect.y) || 0;
  return distanceToCharacter + distanceToExit;
}

export function getClosestValidGap(character, exitPosition, collisionCluster, collisionsNearGaps) {
  const sortedCollisions = _orderBy(collisionsNearGaps, entity => getDistanceSumFromGap(character, entity, exitPosition));
  const withoutCollisionsInPath = _find(sortedCollisions, entity => {
    const gapNearCollision = getGapPosition(character, entity, collisionCluster);
    const collisionsInPath = findCollisionsInPath(character, gapNearCollision);
    return !collisionsInPath.length || (collisionsInPath.length == 1 && _isEqual(collisionsInPath[0], entity));
  });

  return withoutCollisionsInPath || sortedCollisions[0];
}

export function findGapInDirection(direction, collisions, character, exitPosition, attemptedGaps) {
  const collisionEntities = getCollisionEntities(true);
  const characterRect = getElementRect(character);
  const axis = getAxisFromDirection(direction);
  const isMovingBack = entityIsMovingBack(direction);
  const valueLogic = isMovingBack ? 'max' : 'min';
  const valueMethods = {
    min: _minBy,
    max: _maxBy
  };

  // Check if there's any gaps along the axis that has the collision
  const closestCollision = valueMethods[valueLogic](collisions, entity => {
    return entity.position[axis];
  });
  const { collisions: consecutiveCollisions } = findConsecutiveCollisions(closestCollision, collisionEntities, characterRect.height, characterRect.width);
  const collisionsNearGaps = getCollisionsNearGaps(character, consecutiveCollisions, attemptedGaps);

  if (collisionsNearGaps.length) {
    const closestCollisionNearGap = collisionsNearGaps.length == 1 ? collisionsNearGaps[0] : getClosestValidGap(character, exitPosition, consecutiveCollisions, collisionsNearGaps);
    const gapPosition = getGapPosition(character, closestCollisionNearGap, consecutiveCollisions);

    return {
      gap: gapPosition,
      collision: closestCollisionNearGap
    };
  }

  return { gap: exitPosition };
}

/**
 * Returns corner and diagonal that character cannot go past
 *
 * For example:
 *        __
 *         | <- character would never be able to go past this corner from their
 *              current position if going up and to the right
 *
 * X
 *
 * @param  {object} character - The character object, containing their current position
 * @param  {object} collision - The collision entity to get the corner/diagonal for
 *
 * @return {array} - Sorted array containing the sides constructing the invalid corner and diagonal
 */
export function getCollisionCorner(character, collision) {
  const characterRect = getElementRect(character);
  const collisionRect = getElementRect(collision);
  const sides = [];
  let diagonalX = 'left';
  let diagonalY = 'top';

  if (characterRect.right <= collisionRect.x) {
    sides.push({ side: 'left', isDiagonal: false });
    diagonalX = 'right';
  } else {
    sides.push({ side: 'right', isDiagonal: false });
  }

  if (characterRect.bottom <= collisionRect.y) {
    sides.push({ side: 'up', isDiagonal: false });
    diagonalY = 'bottom';
  } else {
    sides.push({ side: 'down', isDiagonal: false });
  }

  sides.push({ side: `${diagonalY}-${diagonalX}`, isDiagonal: true });

  return _orderBy(sides, 'side');
}

/**
 * Returns the opposite corner of a given corner
 *
 * For example:
 * This:
 * |__
 *
 * Would return:
 *  __
 *   |
 * @param  {array} corner - The corner to get the opposite for
 *
 * @return {array} - Sorted array containing the sides for the opposite corner
 */
export function getOppositeCorner(corner) {
  const oppositeCorner = [
    { side: getOppositeDirection(corner[0].side), isDiagonal: false },
    { side: getOppositeDirection(corner[1].side), isDiagonal: false }
  ];

  return _orderBy(oppositeCorner, 'side');
}

/**
 * Checks if the sides with collisions contains a corner
 *
 * @param  {array} sidesWithCollisions - The sides of an entity that have collision neighbours
 *
 * @return {string|null} - The key/name of the corner if there is one, or null
 */
function checkIfIsCorner(sidesWithCollisions) {
  const corners = {
    'bottom-right': ['left', 'up'],
    'top-right': ['down', 'left'],
    'bottom-left': ['right', 'up'],
    'top-left': ['down', 'right']
  };
  return _findKey(corners, corner => arrayContainsAll(sidesWithCollisions, corner, 'side'));
}

/**
 * Returns if a corner is an outer corner, ie not an invalid corner that the character cannot go past
 *
 * @param  {object} entity - The collision entity to check the corner
 * @param  {array} sidesWithCollisions - The sides of the entity that have collision neighbours
 * @param  {array} collisions - The current collision cluster that the entity belongs to
 * @param  {object} character - The character object, containing their current position
 *
 * @return {bool} - Whether the collision is an outer corner and has no other collisions
 *                  outside of it
 */
export function checkIfIsOuterCorner(entity, sidesWithCollisions, collisions, character) {
  const entityRect = getElementRect(entity);
  const characterRect = getElementRect(character);
  const isCorner = checkIfIsCorner(sidesWithCollisions);

  if (!isCorner) {
    return false;
  }

  const characterInsideX = isCorner.includes('left') ? entityRect.right <= characterRect.x : entityRect.x >= characterRect.right;
  const characterInsideY = isCorner.includes('top') ? entityRect.bottom <= characterRect.y : entityRect.y >= characterRect.bottom;

  if (characterInsideX && characterInsideY) {
    return false;
  }

  const collisionOutsideOfCorner = _find(collisions, collision => {
    const collisionRect = getElementRect(collision);
    const isPastX = isCorner.includes('left') ? collisionRect.x <= entityRect.x : collisionRect.x >= entityRect.x;
    const isPastY = isCorner.includes('top') ? collisionRect.y <= entityRect.y : collisionRect.y >= entityRect.y;
    const isBetweenCharacterX = isCorner.includes('left') ? collisionRect.x >= characterRect.x : collisionRect.x <= characterRect.x;
    const isBetweenCharacterY = isCorner.includes('top') ? collisionRect.y >= characterRect.y : collisionRect.y <= characterRect.y;
    return !_isEqual(entity, collision) && isPastX && isPastY && (isBetweenCharacterX || isBetweenCharacterY);
  });

  return !collisionOutsideOfCorner;
}

/**
 * Returns whether an array contains all values of a second array
 *
 * @param  {array} arr1 - The array that must contain all values of the second array
 * @param  {array} arr2 - The array whos values all must exist in the primary array
 * @param  {string} property1 -
 *
 * @return {bool} - If the first array contains all of the second array
 */
export function arrayContainsAll(arr1, arr2, property1) {
  return arr2.every(val1 => _find(arr1, val2 => {
    if (property1) {
      return val2[property1] == val1;
    }

    return val2 == val1;
  }));
}

/**
 * Returns whether an entity has neighbours on opposite diagonals
 * If true, this entity cannot be next to an open gap
 *
 * @param  {array} sidesWithCollisions - The sides of the entity that have collision neighbours
 * @param  {object} character - The character object, containing their current position
 * @param  {object} entity - The collision entity to check the diagonal collisions
 * @param  {array} collisions - The current collision cluster that the entity belongs to
 *
 * @return {Boolean} - Whether the entity has collision neighbours on opposite diagonals
 */
export function hasOppositeDiagonals(sidesWithCollisions, character, entity, collisions) {
  const characterRect = getElementRect(character);
  const entityRect = getElementRect(entity);
  /*
  This checks neighbours like:
    x
      x
        x
  */
  const forwardDiagonal = arrayContainsAll(sidesWithCollisions, ['top-left', 'bottom-right'], 'side');
  /*
  This checks neighbours like:
        x
      x
    x
  */
  const backwardDiagonal = arrayContainsAll(sidesWithCollisions, ['top-right', 'bottom-left'], 'side');
  const xDiagonalSide = characterRect.x < entityRect.x ? 'left' : 'right';
  const yDiagonalSide = characterRect.y < entityRect.y ? 'top' : 'bottom';
  const hasDiagonalsOnX = arrayContainsAll(sidesWithCollisions, [`top-${xDiagonalSide}`, `bottom-${xDiagonalSide}`], 'side');
  const hasDiagonalsOnY = arrayContainsAll(sidesWithCollisions, [`${yDiagonalSide}-left`, `${yDiagonalSide}-right`], 'side');
  let hasXDiagonal = hasDiagonalsOnX;
  let hasYDiagonal = hasDiagonalsOnY;

  // TODO: Refactor?
  if (hasDiagonalsOnX) {
    /*
    This checks neighbours like:

       x           x
     x      OR       x
       x           x
    */
    const isCollidingOnX = (collisionRect) => {
      return xDiagonalSide == 'right'
        ? collisionRect.x < entityRect.right + characterRect.width
        : collisionRect.right < entityRect.x - characterRect.width;
    };

    const findXDiagonalCollision = (collision, position) => {
      const collisionRect = getElementRect(collision);
      const collidingOnY = position == 'top'
        ? collisionRect.y < entityRect.y && collisionRect.bottom > entityRect.y - characterRect.height
        : collisionRect.y > entityRect.y && collisionRect.y < entityRect.bottom + characterRect.height;
      const collidingOnX = isCollidingOnX(collisionRect);
      return !_isEqual(collision, entity) && collidingOnY && collidingOnX;
    };

    // Find the collisions to the top and bottom of the entity
    const topCollision = _find(collisions, collision => {
      return findXDiagonalCollision(collision, 'top');
    });
    const bottomCollision = _find(collisions, collision => {
      return findXDiagonalCollision(collision, 'bottom');
    });

    const characterAboveTop = topCollision && characterRect.bottom < topCollision.position.y;
    const characterBelowBottom = bottomCollision && characterRect.y > getElementRect(bottomCollision).bottom;
    hasXDiagonal = !characterAboveTop && !characterBelowBottom;
  }

  if (hasDiagonalsOnY) {
    /*
    This checks neighbours like:

       x          x   x
     x   x   OR     x
    */
    const isCollidingOnY = (collisionRect) => {
      return yDiagonalSide == 'bottom'
        ? collisionRect.y < entityRect.bottom + characterRect.height
        : collisionRect.bottom < entityRect.y - characterRect.height;
    };

    const findYDiagonalCollision = (collision, position) => {
      const collisionRect = getElementRect(collision);
      const collidingOnX = position == 'left'
        ? collisionRect.x < entityRect.x && collisionRect.right > entityRect.x - characterRect.width
        : collisionRect.x > entityRect.x && collisionRect.x < entityRect.right + characterRect.width;
      const collidingOnY = isCollidingOnY(collisionRect);
      return !_isEqual(collision, entity) && collidingOnY && collidingOnX;
    };

    // Find the collisions to the top and bottom of the entity
    const leftCollision = _find(collisions, collision => {
      return findYDiagonalCollision(collision, 'left');
    });
    const rightCollision = _find(collisions, collision => {
      return findYDiagonalCollision(collision, 'bottom');
    });

    const characterBeforeLeft = leftCollision && characterRect.right < leftCollision.position.x;
    const characterAfterRight = rightCollision && characterRect.x > getElementRect(rightCollision).right;
    hasYDiagonal = !characterBeforeLeft && !characterAfterRight;
  }

  return forwardDiagonal || backwardDiagonal || hasXDiagonal || hasYDiagonal;
}

/**
 * Returns whether an entity has neighbours on opposite sides
 * If true, this entity cannot be next to an open gap
 *
 * @param  {array} sidesWithCollisions - The sides of the entity that have collision neighbours
 *
 * @return {Boolean} - Whether the entity has collision neighbours on opposite sides
 */
export function hasNeighboursOnOppositeSides(sidesWithCollisions) {
  const hasBothOnXAxis = arrayContainsAll(sidesWithCollisions, ['left', 'right'], 'side');
  const hasBothOnYAxis = arrayContainsAll(sidesWithCollisions, ['up', 'down'], 'side');
  return hasBothOnXAxis || hasBothOnYAxis;
}

/**
 * Returns whether an entity has collision neighbours on an invalid diagonal based
 * on the characters current position
 *
 * @param  {array} sidesWithCollisions - The sides of the entity that have collision neighbours
 * @param  {object} character - The character object, containing their current position
 * @param  {object} entity - The collision entity to check the corner
 * @param  {array} collisions - The current collision cluster that the entity belongs to
 *
 * @return {Boolean} - Whether entity has invalid diagonal collision
 */
export function hasInvalidDiagonal(sidesWithCollisions, character, entity, collisions) {
  const characterRect = getElementRect(character);
  const entityRect = getElementRect(entity);
  const diagonalCollisions = _filter(sidesWithCollisions, collisionSide => collisionSide.isDiagonal);

  if (!diagonalCollisions.length) {
    return false;
  }

  let hasInvalidDiagonal = false;

  // TODO: cleanup/refactor?
  _forEach(diagonalCollisions, collision => {
    const invalidCollisionSide = collision.side.includes('left') ? 'right' : 'left';

    if (_find(sidesWithCollisions, sideObj => sideObj.side == invalidCollisionSide)) {
      // Check if there are collisions outside of this diagonal
      // If there are, character is stuck inside a collision cluster and this entity
      // cannot be near an open gap
      if (collision.side.includes('top')) {
        const collisionBelowEntity = _find(collisions, collision => !_isEqual(collision, entity) && collision.position.y > entityRect.bottom);

        if (collisionBelowEntity) {
          hasInvalidDiagonal = true;
        }
      } else if (collision.side.includes('bottom')) {
        const collisionAboveEntity = _find(collisions, collision => {
          const collisionRect = getElementRect(collision);
          return !_isEqual(collision, entity) && collisionRect.bottom > entityRect.y;
        });

        if (collisionAboveEntity) {
          hasInvalidDiagonal = true;
        }
      }

      if (collision.side.includes('left')) {
        const collisionAfterEntity = _find(collisions, collision => !_isEqual(collision, entity) && collision.position.x > entityRect.right);

        if (collisionAfterEntity) {
          hasInvalidDiagonal = true;
        }
      } else if (collision.side.includes('right')) {
        const collisionBeforeEntity = _find(collisions, collision => {
          const collisionRect = getElementRect(collision);
          return !_isEqual(collision, entity) && collisionRect.right > entityRect.x;
        });

        if (collisionBeforeEntity) {
          hasInvalidDiagonal = true;
        }
      }

      // Check if invalid diagonal based on the diagonal type and the characters
      // current position relative to the entity with the collision neighbours
      if (characterRect.y < entityRect.y) {
        if (collision.side == 'top-left' && characterRect.x > entityRect.x - characterRect.width) {
          hasInvalidDiagonal = true;
        } else if (collision.side == 'top-right' && characterRect.x < entityRect.right + characterRect.width) {
          hasInvalidDiagonal = true;
        }
      } else {
        if (collision.side == 'bottom-left' && characterRect.x > entityRect.x - characterRect.width) {
          hasInvalidDiagonal = true;
        } else if (collision.side == 'bottom-right' && characterRect.x < entityRect.right + characterRect.width) {
          hasInvalidDiagonal = true;
        }
      }

      if (hasInvalidDiagonal) {
        return;
      }
    }
  })

  return hasInvalidDiagonal;
}

/**
 * Returns all collision entities that are neighbouring an open gap where the character can go through
 *
 * @param  {object} character - The character object, containing their current position
 * @param  {array} entities - The current collision cluster that the entity belongs to
 * @param  {array} attempted - Array of open gaps the character has already attempted
 *
 * @return {array} - Array of collisions in the cluster that are near open gaps
 */
export function getCollisionsNearGaps(character, entities, attempted) {
  const characterRect = getElementRect(character);
  const collisionsWithGaps = _filter(entities, entity => {
    const sidesWithCollisions = getSidesWithCollisions(entity, entities, characterRect);
    const cornerCollisions = getCollisionCorner(character, entity);
    const cornerSides = cornerCollisions.filter(side => !side.isDiagonal);
    let isNearGap = false;

    // Collision doesn't have any neighbours
    if (!sidesWithCollisions.length) {
      isNearGap = true;
    }

    // Collision has a side with a collision, but those sides aren't corner collisions
    if (sidesWithCollisions.length == 1 && !_find(cornerCollisions, collisionSide => collisionSide.side == sidesWithCollisions[0])) {
      isNearGap = true;
    }

    if (sidesWithCollisions.length >= 2) {
      const hasCollisionsOnOppositeSides = hasNeighboursOnOppositeSides(sidesWithCollisions);
      const hasCollisionsOnOppositeDiagonals = hasOppositeDiagonals(sidesWithCollisions, character, entity, entities);

      // Collisions that have neighbours to each side on an axis , or collisions on opposite diagonals can't have a gap nearby
      if (!hasCollisionsOnOppositeSides && !hasCollisionsOnOppositeDiagonals) {
        const collisionSides = sidesWithCollisions.filter(side => !side.isDiagonal);
        const hasInvalidDiagonalCollision = hasInvalidDiagonal(sidesWithCollisions, character, entity, entities);
        const oppositeCorner = getOppositeCorner(cornerSides);
        const hasValidCornerCollisions = _isEqual(collisionSides, oppositeCorner);
        const isCorner = checkIfIsCorner(sidesWithCollisions);
        const isOuterCorner = checkIfIsOuterCorner(entity, sidesWithCollisions, entities, character);
        isNearGap = !_isEqual(collisionSides, cornerSides) && (!hasInvalidDiagonalCollision || hasValidCornerCollisions) && (!isCorner || isOuterCorner);
      }
    }

    // Ensure the gap is valid, hasn't already been attempted and the character is not currently at that position
    if (isNearGap) {
      const gapPosition = getGapPosition(character, entity, entities);
      const isValidGap = checkIfValidGap(gapPosition, characterRect.height, characterRect.width);
      const characterIsAtGap = _isEqual({ x: characterRect.x, y: characterRect.y }, gapPosition);
      const hasAttempted = _find(attempted, collision => {
        return collision.position.x == entity.position.x && collision.position.y == entity.position.y;
      });
      return isValidGap && !characterIsAtGap && !hasAttempted;
    }

    return isNearGap;
  });

  return collisionsWithGaps;
}

/**
 * Returns the sides of an entity that have collision neighbours
 *
 * @param  {object} entity - The collision entity to get the sides that have collision neighbours
 * @param  {array} entities - The current collision cluster that the entity belongs to
 * @param  {object} characterRect - The character rect object, containing their current position, height and width
 *
 * @return {array} - Sorted array of the sides that have collision neighbours
 */
export function getSidesWithCollisions(entity, entities, characterRect) {
  const sides = ['up', 'down', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right'];
  const entityRect = getElementRect(entity);
  const sidesWithCollisions = [];

  // Check each side explicitly for collisions
  _forEach(sides, side => {
    const axis = getAxisFromDirection(side);
    const oppositeAxis = getOppositeAxis(axis);
    const dimensionVar = getDimensionFromAxis(axis);
    const isDiagonal = side.includes('-');
    const offset = characterRect[dimensionVar];
    const neighbourMethods = {
      forward: hasNeighbourForward,
      backward: hasNeighbourBackward
    };
    const neighbourLogic = ['right', 'down', 'top-left', 'top-right', 'bottom-right'].includes(side) ? 'forward' : 'backward';
    const hasNeighbourOnSide = _find(entities, neighbour => {
      const neighbourRect = getElementRect(neighbour);

      if (isDiagonal) {
        let isInXAxis = false;
        let isInYAxis = false;

        if (side.includes('left')) {
          isInXAxis = hasNeighbourBackward(entityRect, neighbourRect, 'x', characterRect.width);
        } else if (side.includes('right')) {
          isInXAxis = hasNeighbourForward(entityRect, neighbourRect, 'x', characterRect.width);
        }

        if (side.includes('top')) {
          isInYAxis = hasNeighbourBackward(entityRect, neighbourRect, 'y', characterRect.width);
        } else if (side.includes('bottom')) {
          isInYAxis = hasNeighbourForward(entityRect, neighbourRect, 'y', characterRect.height);
        }

        return isInXAxis && isInYAxis;
      }

      const isInAxis = isCollidingInAxis(oppositeAxis, entityRect, neighbourRect, isDiagonal ? offset : 0);
      const hasNeighbourOnAxis = neighbourMethods[neighbourLogic](entityRect, neighbourRect, axis, offset);
      return isInAxis && hasNeighbourOnAxis;
    });

    if (hasNeighbourOnSide) {
      sidesWithCollisions.push({ side, isDiagonal });
    }
  });

  return _orderBy(sidesWithCollisions, 'side');
}

/**
 * Returns the open gap position next to the entity that is near an open gap
 *
 * @param  {object} character - The character object, containing their current position, height and width
 * @param  {object} closestCollisionNearGap - The entity that is closest to an open gap
 * @param  {array} collisions - The current collision cluster that the closestCollisionNearGap belongs to
 *
 * @return {object} - The position of the open gap relative to the entity
 */
export function getGapPosition(character, closestCollisionNearGap, collisions) {
  const characterRect = getElementRect(character);
  const closestCollisionRect = getElementRect(closestCollisionNearGap);
  const sidesWithCollisions = getSidesWithCollisions(closestCollisionNearGap, collisions, characterRect);
  const gapPos = {
    x: closestCollisionRect.right,
    y: closestCollisionRect.bottom,
    height: characterRect.height,
    width: characterRect.width
  };

  if (_find(sidesWithCollisions, sideObj => sideObj.side.includes('right'))) {
    gapPos.x = closestCollisionRect.x - characterRect.width;
  }

  if (_find(sidesWithCollisions, sideObj => sideObj.side == 'down' || sideObj.side.includes('bottom'))) {
    gapPos.y = closestCollisionRect.y - characterRect.height;
  }

  return gapPos;
}

/**
 * Returns whether a gap position is valid
 *
 * @param  {object} gap - The gap position
 * @param  {int} heightOffset - The height offset to use in the board bounds logic
 * @param  {int} widthOffset - The width offset to use in the board bounds logic
 *
 * @return {bool} - Whether the gap is valid
 */
export function checkIfValidGap(gap, heightOffset, widthOffset) {
  const gapRect = getElementRect(gap);
  const isValidOnY = isInBoardBoundsOnAxis(gapRect, 'y', heightOffset);
  const isValidOnX = isInBoardBoundsOnAxis(gapRect, 'x', widthOffset);
  return isValidOnX && isValidOnY;
}

/**
 * Returns whether a position is within the board bounds
 *
 * @param  {object} rect - The position rect to check
 * @param  {string} axis - The axis to check
 * @param  {int} offset - The offset to use in the board bounds logic
 *
 * @return {Boolean} - Whether the rect is within the board bounds
 */
export function isInBoardBoundsOnAxis(rect, axis, offset) {
  const boardDimensions = tree.get('boardDimensions');
  const forwardDimensionOnAxis = getForwardDimension(axis);
  const isAfterBoardStart = rect[axis] > offset;
  const isBeforeBoardEnd = rect[forwardDimensionOnAxis] < boardDimensions[forwardDimensionOnAxis] - offset;
  return isAfterBoardStart && isBeforeBoardEnd;
}

/**
 * Returns whether a given value is before another based on whether the character is moving back
 *
 * @param  {int}  value1 - The first value to compare
 * @param  {int}  value2 - The second value to compare
 * @param  {bool} isMovingBack - If the character is moving backward
 *
 * @return {bool} - If value1 is before value2 based on whether the character is moving back
 */
export function valueIsBefore(value1, value2, isMovingBack) {
  return isMovingBack ? value1 < value2 : value1 > value2;
}

/**
 * Returns if an entity has a neighbour in the forward direction based on the axis
 *
 * @param  {object} entityRect - The entity rect to check for forward neighbours
 * @param  {object} neighbourRect - The potential neighbour rect
 * @param  {string} axis - The axis to check
 * @param  {int} offsetThreshold - The offset to use in the collision logic
 * @param  {bool} useEquals - Whether equal comparison logic should be used
 *
 * @return {Boolean} - Whether the neighbourRect is a collision neighbour forward
 */
export function hasNeighbourForward(entityRect, neighbourRect, axis, offsetThreshold, useEquals) {
  const forwardDimension = getForwardDimension(axis);

  if (useEquals) {
    return neighbourRect[axis] <= entityRect[forwardDimension] + offsetThreshold && neighbourRect[axis] >= entityRect[axis];
  }

  return neighbourRect[axis] < entityRect[forwardDimension] + offsetThreshold && neighbourRect[axis] > entityRect[axis];
}

/**
 * Returns if an entity has a neighbour in the backward direction based on the axis
 *
 * @param  {object} entityRect - The entity rect to check for backward neighbours
 * @param  {object} neighbourRect - The potential neighbour rect
 * @param  {string} axis - The axis to check
 * @param  {int} offsetThreshold - The offset to use in the collision logic
 * @param  {bool} useEquals - Whether equal comparison logic should be used
 *
 * @return {Boolean} - Whether the neighbourRect is a collision neighbour backward
 */
export function hasNeighbourBackward(entityRect, neighbourRect, axis, offsetThreshold, useEquals) {
  const forwardDimension = getForwardDimension(axis);

  if (useEquals) {
    return neighbourRect[forwardDimension] >= entityRect[axis] - offsetThreshold && neighbourRect[axis] <= entityRect[axis];
  }

  return neighbourRect[forwardDimension] > entityRect[axis] - offsetThreshold && neighbourRect[axis] < entityRect[axis];
}

/**
 * Returns backwards direction string based on axis
 *
 * @param  {string} axis - The axis to get the direction for (ex: 'x' or 'y')
 *
 * @return {string} - The string of the backward direction
 */
export function getBackwardDirection(axis) {
  return isXAxis(axis) ? 'left' : 'up';
}

/**
 * Returns forwards direction string based on axis
 *
 * @param  {string} axis - The axis to get the direction for (ex: 'x' or 'y')
 *
 * @return {string} - The string of the forward direction
 */
export function getForwardDirection(axis) {
  return isXAxis(axis) ? 'right' : 'down';
}

/**
 * Returns backwards dimension string based on axis
 *
 * @param  {string} axis - The axis to get the dimension for (ex: 'x' or 'y')
 *
 * @return {string} - The string of the backward dimension
 */
export function getBackwardDimension(axis) {
  return isXAxis(axis) ? 'left' : 'top';
}

/**
 * Returns forwards dimension string based on axis
 *
 * @param  {string} axis - The axis to get the dimension for (ex: 'x' or 'y')
 *
 * @return {string} - The string of the forward dimension
 */
export function getForwardDimension(axis) {
  return isXAxis(axis) ? 'right' : 'bottom';
}

/**
 * Returns the appropriate height or width dimension to use depending on axis
 *
 * @param  {string} axis - The axis to get the dimension for (ex: 'x' or 'y')
 *
 * @return {string} - The string of the dimension
 */
export function getDimensionFromAxis(axis) {
  return isXAxis(axis) ? 'width' : 'height';
}

export function isXAxis(axis) {
  return axis == 'x';
}

/**
 * Finds clusters of consecutive collisions
 *
 * This will find all collision entities that are close to each other based on
 * the height and width threshholds.
 *
 * Will loop through recursively to find all neighbouring collisions each time
 * a new unique one is added
 *
 * @param  {object} startingEntity - The first collision to start/branch from
 * @param  {array} collisionEntities - All possible collision entities on the tile
 * @param  {number} heightThreshold - The height distance between entities to determine if collisions are consecutive
 * @param  {number} widthThreshold - The width distance between entities to determine if collisions are consecutive
 * @param  {array} foundCollisions - The found consecutive collisions
 * @param  {object} closestCollisions - The collisions on the outermost edges of the cluster
 *
 * @return {object} - Object containing the entities in the cluster, and the
 * outermost entities
 */
export function findConsecutiveCollisions(startingEntity, collisionEntities, heightThreshold, widthThreshold, foundCollisions, closestCollisions) {
  const entityRect = getElementRect(startingEntity);
  foundCollisions = foundCollisions || [startingEntity];
  const remainingCollisions = _differenceWith(collisionEntities, foundCollisions, _isEqual);
  closestCollisions = closestCollisions || {
    top: {
      min: _cloneDeep(entityRect),
      max: _cloneDeep(entityRect)
    },
    bottom: {
      min: _cloneDeep(entityRect),
      max: _cloneDeep(entityRect)
    },
    left: {
      min: _cloneDeep(entityRect),
      max: _cloneDeep(entityRect)
    },
    right: {
      min: _cloneDeep(entityRect),
      max: _cloneDeep(entityRect)
    }
  };

  _forEach(remainingCollisions, ce => {
    // need to ensure starting entity doesn't change when recursively calling
    const isConsecutiveCollision = checkElementCollision(entityRect, ce, heightThreshold, widthThreshold, true);

    if (isConsecutiveCollision) {
      foundCollisions.push(ce);
      // Recursively call for each new item to see the consecutive values of
      // that entity, add them to the master collisions array and remove duplicates
      const childConsecutiveCollisions = findConsecutiveCollisions(ce, remainingCollisions, heightThreshold, widthThreshold, foundCollisions, closestCollisions);
      foundCollisions = _uniq(_union(foundCollisions, childConsecutiveCollisions.collisions));
      const closestChild = childConsecutiveCollisions.closest;
      closestCollisions = getClosestCollisions(closestChild, getElementRect(ce), closestCollisions);
    }
  });

  return {
    collisions: foundCollisions,
    closest: closestCollisions
  };
}

/**
 * Returns the outermost entities in a collision cluster
 *
 * @param  {object} closestChild - The outermost values for the children
 * @param  {object} closestParent - The parent collision that the children were branched from
 * @param  {object} closestCollisions - The current outermost entities
 *
 * @return {object} - The new outer entities
 */
export function getClosestCollisions(closestChild, closestParent, closestCollisions) {
  const dimensions = [
    { dimension: 'top', axis: 'y' },
    { dimension: 'bottom', axis: 'y' },
    { dimension: 'left', axis: 'x' },
    { dimension: 'right', axis: 'x' }
  ];

  _forEach(dimensions, d => {
    const { dimension, axis } = d;
    const oppositeAxis = getOppositeAxis(axis);
    const movingString = ['top', 'left'].indexOf(dimension) > -1 ? 'back' : 'forward';
    const valueMethods = { back: _minBy, forward: _maxBy };
    const closestCollision = closestCollisions[dimension];
    const newCollision = valueMethods[movingString]([closestChild[dimension].min, closestChild[dimension].max, closestParent], entity => entity[axis]);

    if (movingString == 'back') {
      if (newCollision[axis] < closestCollision.min[axis] || newCollision[axis] < closestCollision.max[axis]) {
        closestCollisions[dimension].min = getElementRect(newCollision);
        closestCollisions[dimension].max = getElementRect(newCollision);
      }
    } else {
      if (newCollision[axis] > closestCollision.min[axis] || newCollision[axis] > closestCollision.max[axis]) {
        closestCollisions[dimension].min = getElementRect(newCollision);
        closestCollisions[dimension].max = getElementRect(newCollision);
      }
    }

    if (closestCollision.min[axis] == closestParent[axis] && closestParent[oppositeAxis] < closestCollision.min[oppositeAxis]) {
      closestCollisions[dimension].min = closestParent;
    }

    if (closestCollision.max[axis] == closestParent[axis] && closestParent[oppositeAxis] > closestCollision.max[oppositeAxis]) {
      closestCollisions[dimension].max = closestParent;
    }
  });

  return closestCollisions;
}

/**
 * Adds an item to the hero's inventory
 *
 * @param  {string} type - The type of item being collected, ex: 'food'
 * @param  {int} itemId - The ID of the item to collect
 */
export function collectItem(type, itemId) {
  const items = tree.get(['tile', type]);
  const heroAbilities = tree.get(['hero', 'abilities']);
  const itemIndex = _findIndex(items, item => item.id == itemId);

  // Hero doesn't have the required skill to add this item yet
  if (items[itemIndex].needsAbility && heroAbilities.indexOf(items[itemIndex].needsAbility) == -1) {
    setPopover({
      title: 'Skill Needed',
      text: 'You must learn a new skill to collect this item.',
      popoverClass: 'info'
    });
    return;
  }

  const item = items[itemIndex];
  const activeTile = tree.get('tile');
  const produceListCursor = tree.select('produceList');
  const foodIndex = _findIndex(produceListCursor.get(), foodItem => foodItem.name == (item.display || item.type));
  tree.select(['tiles', `${activeTile.x}_${activeTile.y}`, type, itemIndex, 'collected']).set(true);

  const collectedObj = produceListCursor.get(foodIndex);
  const itemDisplay = collectedObj.display;

  // If we're collecting this type of item for the first time, set the hasCollected flag to true
  if (!collectedObj.hasCollected) {
    produceListCursor.set([foodIndex, 'hasCollected'], true);
  }

  produceListCursor.set([foodIndex, 'count'], collectedObj.count + 1);

  setPopover({
    title: 'Item Added',
    text: `You picked up: ${itemDisplay}`,
    popoverClass: 'info'
  });

  // Repopulate items every three minutes
  const repopulateTimeout = 3 * 60 * 1000;

  // Repopulate item after the repopulate timeout
  setTimeout(() => {
    const currentTile = tree.get('tile');
    const stillOnSameTile = _isEqual([currentTile.x, currentTile.y], [activeTile.x, activeTile.y]);

    if (stillOnSameTile) {
      // If tile is still active, add to queue to repopulate when the tile changes
      const queueCursor = tree.select('itemQueue');
      queueCursor.push(itemId);
    } else {
      // If tile is not still active, repopulate the item
      tree.select(['tiles', `${activeTile.x}_${activeTile.y}`, type, itemIndex, 'collected']).set(false);
    }
  }, repopulateTimeout);
}

/**
 * Adds specified bunny to hero's collected bunnies
 * If bunny teaches a skill, will make that skill available for the hero to use
 *
 * @param  {int} bunnyId - The ID of the bunny to collect
 */
export function collectBunny(bunnyId) {
  const bunniesCursor = tree.select('bunnies');
  const bunnies = bunniesCursor.get();
  const heroAbilities = tree.get(['hero', 'abilities']);
  const bunnyIndex = _findIndex(bunnies, bunny => bunny.id == bunnyId);
  const collectedObj = bunniesCursor.get(bunnyIndex);

  // Do nothing if hero has already collected this bunny
  if (collectedObj.hasCollected) {
    return;
  }

  // Hero doesn't have the required skill to add this bunny yet
  if (bunnies[bunnyIndex].needsAbility && heroAbilities.indexOf(bunnies[bunnyIndex].needsAbility) == -1) {
    setPopover({
      title: 'Skill Needed',
      text: 'You must learn a new skill for this bunny to become your friend.',
      popoverClass: 'info'
    });
    return;
  }

  const bunny = bunnies[bunnyIndex];
  const skills = tree.get('skills');
  const newSkill = bunny.giveSkill && _find(skills, skill => skill.name == bunny.giveSkill);

  bunniesCursor.set([bunnyIndex, 'hasCollected'], true);

  setPopover({
    title: 'New Friend',
    text: (
      <div>
        <p><strong>{bunny.name}</strong> is now your friend!</p>
        {newSkill &&
          <div>
            <p>They taught you a new skill: <strong>{_capitalize(newSkill.name)}</strong>!</p>
            <p>{newSkill.description}</p>
            <p>{bunny.name} will now reside in the Bunny Group area.</p>
          </div>
        }
      </div>
    ),
    popoverClass: 'info'
  }, 10000);
}

/**
 * Returns scenery item class based on type
 *
 * @param  {string} type - The type of scenery to get
 *
 * @return {class} - The scenery item class
 */
export function getSceneryItem(type) {
  return SceneryItems[type];
}

/**
 * Toggles whether the inventory modal should be shown
 */
export function toggleShowMenu() {
  const cursor = tree.select('showMenu');
  cursor.set(!cursor.get());
}

/**
 * Sets the last direction the hero was moving to the state
 */
export function setHeroLastDirection(direction) {
  const cursor = tree.select('hero', 'lastDirection');
  cursor.set(direction);
}

/**
 * Returns the opposite direction from the provided direction
 *
 * @param  {string} direction - Direction to get the opposite for
 *
 * @return {string} - The opposite direction
 */
export function getOppositeDirection(direction) {
  const oppositeDirections = {
    up: 'down',
    down: 'up',
    left: 'right',
    right: 'left'
  };

  return oppositeDirections[direction];
}

/**
 * Returns a clean object containing the current position and dimensions for an
 * element
 *
 * @param  {object} element - The element to get dimensions for
 *
 * @return {object} - The position/dimensions for the element
 */
export function getElementRect(element) {
  const rect = {
    x: element.x || (element.position && element.position.x) || (element.props && element.props.position && element.props.position.x) || 0,
    y: element.y || (element.position && element.position.y) || (element.props && element.props.position && element.props.position.y) || 0,
    height: element.height || (element.props && element.props.height) || 0,
    width: element.width || (element.props && element.props.width) || 0
  };

  rect.right = rect.x + rect.width;
  rect.bottom = rect.y + rect.height;

  return rect;
}

/**
 * Checks collision between two elements
 *
 * The provided element params must contain the following properties:
 * { x, y, height, width }
 *
 * @param  {object}  element1 - First element to use in check
 * @param  {object}  element2 - Second element to use in check
 *
 * @return {Boolean} - If the two elements are colliding
 */
export function checkElementCollision(element1, element2, heightOffset = 0, widthOffset = 0, excludeEquals) {
  const element1Rect = getElementRect(element1);
  const element2Rect = getElementRect(element2);

  let elementHittingLeft = element1Rect.x - widthOffset <= element2Rect.right;
  let elementHittingRight = element1Rect.right + widthOffset >= element2Rect.x;
  let elementHittingTop = element1Rect.y - heightOffset <= element2Rect.bottom;
  let elementHittingBottom = element1Rect.bottom + heightOffset >= element2Rect.y;

  if (excludeEquals) {
    elementHittingLeft = element1Rect.x - widthOffset < element2Rect.right;
    elementHittingRight = element1Rect.right + widthOffset > element2Rect.x;
    elementHittingTop = element1Rect.y - heightOffset < element2Rect.bottom;
    elementHittingBottom = element1Rect.bottom + heightOffset > element2Rect.y;
  }

  return elementHittingLeft && elementHittingRight && elementHittingTop && elementHittingBottom;
}

/**
 * Loops through entities of a certain type and checks if character is colliding
 * with any of them
 *
 * @param  {object} character - The character entity that is moving
 * @param  {int} x - The character's current X position
 * @param  {int} y - The character's current Y position
 * @param  {string} direction - The direction that the character is moving
 * @param  {string} type - The type of entities to check for collisions, ex: 'food'
 *
 * @return {int} - The max possible value based on the direction the character
 *                 is moving.
 *                 If character is colliding with an item, this max value will
 *                 be whatever that collision point is.
 */
export function checkCollisions(character, direction, items) {
  const collisions = [];

  for (let t = 0; t < items.length; t++) {
    const isColliding = checkElementCollision(character, items[t]);

    if (isColliding) {
      collisions.push(items[t]);
    }
  }

  return collisions;
}

export function getEntityCollisions(character, useX, useY, direction, goToTargetPosition) {
  const useCharacter = getCharacterWithNextPosition(character, useX, useY);
  const sceneryCollisions = checkSceneryCollision(useCharacter, direction);
  const foodCollisions = checkFoodCollision(useCharacter, direction);
  // Don't collide with bunnies when character is going to target position
  const bunnyCollisions = goToTargetPosition ? [] : checkBunnyCollision(useCharacter, direction);
  const collisions = _union(sceneryCollisions, foodCollisions, bunnyCollisions);
  return collisions;
}

export function isMovingOnYAxis(direction) {
  return ['up', 'down'].indexOf(direction) > -1;
}

export function getAxisFromDirection(direction) {
  return isMovingOnYAxis(direction) ? 'y' : 'x';
}

export function entityIsMovingBack(direction) {
  return ['up', 'left'].indexOf(direction) > -1;
}

export function getCollisionMaxValue(currentPosition, direction, character, collisions) {
  if (!direction || !collisions.length) {
    return false;
  }

  const axis = getAxisFromDirection(direction);
  let maxValue = currentPosition[axis];

  const useCharacter = getCharacterWithNextPosition(character, currentPosition.x, currentPosition.y);
  const bunnyRect = getElementRect(useCharacter);
  let maxDirectionValue;

  _forEach(collisions, entity => {
    const entityRect = getElementRect(entity);

    // Check if collision is in the path of the direction we're actively going
    if (isMovingOnYAxis(direction)) {
      if (entityRect.x < bunnyRect.right && entityRect.right > bunnyRect.x) {
        if (direction == 'up') {
          // Moving up
          if (!maxDirectionValue || entityRect.bottom > maxDirectionValue) {
            maxDirectionValue = entityRect.bottom;
          }
        } else {
          // Moving down
          const bunnyOffset = entityRect.y - bunnyRect.height;
          if (!maxDirectionValue || bunnyOffset < maxDirectionValue) {
            maxDirectionValue = bunnyOffset;
          }
        }
      }
    } else {
      if (entityRect.y < bunnyRect.bottom && entityRect.bottom > bunnyRect.y) {
        if (direction == 'left') {
          // Moving left
          if (!maxDirectionValue || entityRect.right > maxDirectionValue) {
            maxDirectionValue = entityRect.right;
          }
        } else {
          // Moving right
          const bunnyOffset = entityRect.x - bunnyRect.width;
          if (!maxDirectionValue || bunnyOffset < maxDirectionValue) {
            maxDirectionValue = bunnyOffset;
          }
        }
      }
    }
  });

  if (maxDirectionValue) {
    if (entityIsMovingBack(direction)) {
      maxValue = Math.max(maxValue, maxDirectionValue);
    } else {
      maxValue = Math.min(maxValue, maxDirectionValue);
    }
  }

  return maxValue;
}

/**
 * Handles when player interacts with a burrow entity
 *
 * @param  {object} item - The burrow entity object
 */
export function handleBurrowAction(item) {
  const heroAbilities = tree.get(['hero', 'abilities']);
  const heroPosition = tree.get('hero', 'position');
  const { x: tileX, y: tileY } = tree.get('tile');

  // Hero doesn't have the required skill to add this item yet
  if (item.needsAbility && heroAbilities.indexOf(item.needsAbility) == -1) {
    setPopover({
      title: 'Skill Needed',
      text: 'You must learn a new skill to perform this action.',
      popoverClass: 'info'
    });
    return;
  }

  // If bunny is going into a burrow, take them to the appropriate tile
  setActiveTile(item.takeToTile.x, item.takeToTile.y);

  // Determine which axis we're using to move to the next tile
  const changingTileX = item.takeToTile.y != tileY;

  // Depending on the tile axis, get the min and max limits of the board
  // and the boundary of where the burrow is
  const minLimit = changingTileX ? getMinBoardXLimit(true) : getMinBoardYLimit(true);
  const maxLimit = changingTileX ? getMaxBoardXLimit(true) : getMaxBoardYLimit(true);

  // Determine if we're going to the next or previous tile
  const goToNextTile = changingTileX ? item.takeToTile.y > tileY : item.takeToTile.x > tileX;

  // If we're going to the next tile, put the hero at the starting edge of the next tile
  // If we're going to the previous tile, put the hero at the ending edge of the previous tile
  const newLimit = goToNextTile ? minLimit : maxLimit;
  const newX = changingTileX ? newLimit : heroPosition.x;
  const newY = changingTileX ? heroPosition.y : newLimit;

  // Set new hero position on the new tile
  updateHeroPosition({ x: newX, y: newY });
}

export function takeBunnyToGroupTile(character) {
  const { id, groupTile, groupPosition } = character.props;
  updateBunnyTile(id, groupTile);
  updateCharacterPosition(id, groupPosition);
}

/**
 * Sets the active tile to the next tile depending on the axis
 *
 * @param  {string} axis - The axis being used to go to the next tile
 */
export function goToNextTile(axis) {
  const tile = tree.get('tile');
  const isOnXAxis = isXAxis(axis);
  const tileX = tile.x + (isOnXAxis ? 0 : 1);
  const tileY = tile.y + (isOnXAxis ? 1 : 0);
  // Move to next tile
  setActiveTile(tileX, tileY);
}

/**
 * Sets the active tile to the previous tile depending on the axis
 *
 * @param  {string} axis - The axis being used to go to the previous tile
 */
export function goToPreviousTile(axis) {
  const tile = tree.get('tile');
  const isOnXAxis = isXAxis(axis);
  const tileX = tile.x - (isOnXAxis ? 0 : 1);
  const tileY = tile.y - (isOnXAxis ? 1 : 0);
  // Move to next tile
  setActiveTile(tileX, tileY);
}

/**
 * Returns the minimum possible spawn point for the X axis on a tile
 *
 * If the entity went through a burrow, set the min to be where the burrow
 * ends on the next tile
 *
 * Otherwise, set to the edge of the board, minus half the character's width
 * This gives the illusion of the entity actually walking to the next tile,
 * as opposed to just teleporting there
 *
 * @param  {bool} usingBurrow - Entity used burrow to switch tiles
 *
 * @return {int} - The minimum spawn point
 */
export function getMinBoardXLimit(usingBurrow) {
  // If they went through a burrow, set the min to be where the burrow ends on the next tile
  // Otherwise, set to the edge of the board, minus half the character's height
  return usingBurrow ? SceneryConstants.BURROW_WIDTH : 0 - (CharacterConstants.BUNNY_WIDTH / 2);
}

/**
 * Returns the minimum possible spawn point for the Y axis on a tile
 *
 * If the entity went through a burrow, set the min to be where the burrow
 * ends on the next tile
 *
 * Otherwise, set to the edge of the board, minus half the character's height
 * This gives the illusion of the entity actually walking to the next tile,
 * as opposed to just teleporting there
 *
 * @param  {bool} usingBurrow - Entity used burrow to switch tiles
 *
 * @return {int} - The minimum spawn point
 */
export function getMinBoardYLimit(usingBurrow) {
  // If they went through a burrow, set the min to be where the burrow ends on the next tile
  // Otherwise, set to the edge of the board, minus half the character's height
  return usingBurrow ? SceneryConstants.BURROW_HEIGHT : 0 - (CharacterConstants.BUNNY_HEIGHT / 2);
}

/**
 * Returns the maximum possible spawn point for the X axis on a tile
 *
 * If the entity went through a burrow, set the max to be where the burrow
 * starts on the next tile
 *
 * Otherwise, set to the edge of the board, minus half the character's width
 * This gives the illusion of the entity actually walking to the next tile,
 * as opposed to just teleporting there
 *
 * @param  {bool} usingBurrow - Entity used burrow to switch tiles
 *
 * @return {int} - The minimum spawn point
 */
export function getMaxBoardXLimit(usingBurrow) {
  const { width: boardWidth } = tree.get('boardDimensions');
  // If they went through a burrow, set the max to be where the burrow starts
  // Otherwise, set to the edge of the board, minus half the character's width
  const offset = usingBurrow ? (SceneryConstants.BURROW_WIDTH + CharacterConstants.BUNNY_WIDTH) : (CharacterConstants.BUNNY_WIDTH / 2);
  return boardWidth - offset;
}


/**
 * Returns the maximum possible spawn point for the Y axis on a tile
 *
 * If the entity went through a burrow, set the max to be where the burrow
 * starts on the next tile
 *
 * Otherwise, set to the edge of the board, minus half the character's height
 * This gives the illusion of the entity actually walking to the next tile,
 * as opposed to just teleporting there
 *
 * @param  {bool} usingBurrow - Entity used burrow to switch tiles
 *
 * @return {int} - The minimum spawn point
 */
export function getMaxBoardYLimit(usingBurrow) {
  const { height: boardHeight } = tree.get('boardDimensions');
  // If they went through a burrow, set the max to be where the burrow starts
  // Otherwise, set to the edge of the board, minus half the character's height
  const offset = usingBurrow ? (SceneryConstants.BURROW_HEIGHT + CharacterConstants.BUNNY_HEIGHT) : (CharacterConstants.BUNNY_HEIGHT / 2);
  return boardHeight - offset;
}

/**
 * Handle forward movements, ie moving down or right
 *
 * @param  {object} character - The character entity to move
 * @param  {string} axis - The axis the character is moving on, ex: 'x' or 'y'
 * @param  {int} currentX - Character's current X position
 * @param  {int} currentY - Character's current Y position
 * @param  {string} direction - The direction the character is moving, ex: 'down'
 *
 * @return {object} - Returns the value to move, and also potentially if the
 *                    tile needs to be changed
 */
export function moveEntityForward(character, axis, currentX, currentY, direction, moveDiagonally, goToTargetPosition) {
  const tile = tree.get('tile');
  const movePixels = tree.get('movePixels');

  const isHero = character.isHero;
  const isOnXAxis = isXAxis(axis);
  const minLimit = isOnXAxis ? getMinBoardXLimit() : getMinBoardYLimit();
  const maxLimit = isOnXAxis ? getMaxBoardXLimit() : getMaxBoardYLimit();
  const checkTile = tile[isOnXAxis ? 'y' : 'x'];
  const currentValue = isOnXAxis ? currentX : currentY;
  const diagonalPercentage = getSquareDiagonalPercentage(movePixels);
  const value = Math.ceil(currentValue + (movePixels * (moveDiagonally ? diagonalPercentage : 1)));

  // Character is going beyond the board bounds
  if (value > maxLimit) {
    if (isHero && checkTile < 2) { // TODO: Use a constant for the max tiles
      goToNextTile(axis);
      // Set player coordinates to start of next tile
      return {
        value: minLimit,
        changeTile: true,
        collisions: []
      };
    } else if (!isHero) {
      // Take AI to next tile and set their position on the new tile
      takeBunnyToGroupTile(character);

      // Return the current value so the bunny doesn't continue moving
      // This will also prevent it overriding the new group location being set
      // in the takeBunnyToGroupTile method
      return {
        value: currentValue,
        collisions: []
      };
    }
  }

  const useX = isOnXAxis ? value : currentX;
  const useY = isOnXAxis ? currentY : value;
  const collisions = getEntityCollisions(character, useX, useY, direction, goToTargetPosition);
  const maxCollisionValue = getCollisionMaxValue({ x: useX, y: useY }, direction, character, collisions);
  let minValue = _min([maxLimit, value]);

  if (maxCollisionValue) {
    minValue = _min([minValue, maxCollisionValue]);
  }

  if (goToTargetPosition) {
    minValue = _min([minValue, goToTargetPosition[axis]]);
  }

  return {
    value: minValue,
    collisions
  };
}

/**
 * Handle backward movements, ie moving up or left
 *
 * @param  {object} character - The character entity to move
 * @param  {string} axis - The axis the character is moving on, ex: 'x' or 'y'
 * @param  {int} currentX - Character's current X position
 * @param  {int} currentY - Character's current Y position
 * @param  {string} direction - The direction the character is moving, ex: 'up'
 *
 * @return {object} - Returns the value to move, and also potentially if the
 *                    tile needs to be changed
 */
export function moveEntityBack(character, axis, currentX, currentY, direction, moveDiagonally, goToTargetPosition) {
  const { height: boardHeight, width: boardWidth } = tree.get('boardDimensions');
  const tile = tree.get('tile');
  const movePixels = tree.get('movePixels');

  const isHero = character.isHero;
  const isOnXAxis = isXAxis(axis);
  const bunnyRect = findDOMNode(character).getBoundingClientRect();
  const minLimit = 0 - ((isOnXAxis ? bunnyRect.width : bunnyRect.height) / 2);
  const maxLimit = isOnXAxis ? boardWidth - (bunnyRect.width / 2) : boardHeight - (bunnyRect.height / 2);
  const checkTile = tile[isOnXAxis ? 'y' : 'x'];
  const currentValue = isOnXAxis ? currentX : currentY;
  const diagonalPercentage = getSquareDiagonalPercentage(movePixels);
  const value = Math.ceil(currentValue - (movePixels * (moveDiagonally ? diagonalPercentage : 1)));

  // Character is going beyond the board bounds
  if (value < minLimit) {
    if (isHero && checkTile > 1) { // TODO: Use a constant for the min tiles
      goToPreviousTile(axis);
      // Set player coordinates to end of previous tile
      return {
        value: maxLimit,
        changeTile: true,
        collisions: []
      };
    } else if (!isHero) {
      // Take AI to next tile and set their position on the new tile
      takeBunnyToGroupTile(character);

      // Return the current value so the bunny doesn't continue moving
      // This will also prevent it overriding the new group location being set
      // in the takeBunnyToGroupTile method
      return {
        value: currentValue,
        collisions: []
      };
    }
  }

  const useX = isOnXAxis ? value : currentX;
  const useY = isOnXAxis ? currentY : value;
  const collisions = getEntityCollisions(character, useX, useY, direction, goToTargetPosition);
  const minCollisionValue = getCollisionMaxValue({ x: useX, y: useY }, direction, character, collisions);
  let maxValue = _max([minLimit, value]);

  if (minCollisionValue) {
    maxValue = _max([maxValue, minCollisionValue]);
  }

  if (goToTargetPosition) {
    maxValue = _max([maxValue, goToTargetPosition[axis]]);
  }

  return {
    value: maxValue,
    collisions
  };
}

/**
 * Returns the diagonal percentage of a square
 *
 * @param  {number} side - The length of the side in the square
 *
 * @return {number} - The diagonal percentage
 */
export function getSquareDiagonalPercentage(side) {
  return (side * Math.sqrt(2)) / (side * 2);
}

/**
 * Returns the character with their position at the top level
 *
 * @param  {object} character - The character to alter
 * @param  {int} x - The character's X position
 * @param  {int} y - The character's Y position
 *
 * @return {object} - The new character object
 */
export function getCharacterWithNextPosition(character, x, y) {
  return {
    ...character,
    position: { x, y }
  };
}

/**
 * Check if character is collidiing with any food items
 *
 * @param  {object} character - The character entity that is moving
 * @param  {int} x - The character's current X position
 * @param  {int} y - The character's current Y position
 * @param  {string} direction - The direction the character is moving, ex: 'up'
 *
 * @return {int} - The max possible value based on the direction the character
 *                 is moving.
 *                 If character is colliding with a food item, this max value
 *                 will be whatever that collision point is.
 */
export function checkFoodCollision(character, direction) {
  const tile = tree.get('tile');
  const items = tile.food.filter(item => !item.collected);
  const collisions = checkCollisions(character, direction, items);

  // If we're not moving, a space action is happening
  if (character.isHero && collisions.length && !direction) {
    _forEach(collisions, item => collectItem('food', item.id));
  }

  return collisions;
}

/**
 * Check if character is collidiing with any bunnies
 *
 * @param  {object} character - The character entity that is moving
 * @param  {int} x - The character's current X position
 * @param  {int} y - The character's current Y position
 * @param  {string} direction - The direction the character is moving, ex: 'up'
 *
 * @return {int} - The max possible value based on the direction the character
 *                 is moving.
 *                 If character is colliding with another bunny, this max value
 *                 will be whatever that collision point is.
 */
export function checkBunnyCollision(character, direction) {
  const isHero = character.isHero;
  const heroCollisions = tree.select('heroCollisions');
  // When checking collisions for hero, compare against other AI bunnies on the tile
  // Otherwise, when checking AI collisions, ensure they're not colliding with hero
  // or any other AIs
  const bunniesOnTile = _filter(tree.get('bunniesOnTile'), bunny => {
    return bunny.id != character.props.id;
  });

  // If moving AI, check for hero collisions when not going to a target location
  if (!isHero) {
    const heroCursor = tree.get('hero');
    bunniesOnTile.push({
      id: 'Hero',
      position: heroCursor.position,
      height: heroCursor.height,
      width: heroCursor.width
    });
  }

  const collisions = checkCollisions(character, direction, bunniesOnTile);

  if (collisions.length) {
    // If we're not moving, a space action is happening
    if (!direction && character.isHero) {
      _forEach(collisions, item => collectBunny(item.id));
    }
  }

  const collisionIds = collisions.map(item => item.id);

  if (!_isEqual(heroCollisions.get(), collisionIds)) {
    heroCollisions.set(collisionIds);
  }

  return collisions;
}

/**
 * Check if character is collidiing with any scenery items
 *
 * @param  {object} character - The character entity that is moving
 * @param  {string} direction - The direction the character is moving, ex: 'up'
 *
 * @return {int} - The max possible value based on the direction the character
 *                 is moving.
 *                 If character is colliding with a scenery item, this max value
 *                 will be whatever that collision point is.
 */
export function checkSceneryCollision(character, direction) {
  const tile = tree.get('tile');
  const items = tile.scenery;
  const collisions = checkCollisions(character, direction, items);

  // If we're not moving, a space action is happening
  if (collisions.length) {
    _forEach(collisions, item => {
      if (character.isHero) {
        if (item.takeToTile && !direction) {
          handleBurrowAction(item);
        }
      }
    });
  }

  return collisions;
}

/**
 * Toggles whether the game is currently visible.
 * This is determined based on whether the browser tab is active.
 */
export function toggleGameVisibility() {
  const cursor = tree.select('gameVisible');
  cursor.set(document.hidden);
}
