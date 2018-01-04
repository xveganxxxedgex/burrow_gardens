import React from 'react';
import tree from 'state';
import _capitalize from 'lodash/capitalize';
import _differenceWith from 'lodash/differenceWith';
import _filter from 'lodash/filter';
import _find from 'lodash/find';
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

import * as Tiles from 'Maps';
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
export function findCollisionsInPath(character, exitPosition) {
  const collisionEntities = getCollisionEntities(true);
  const characterRect = getElementRect(character);
  const direction = getTargetDirection(characterRect, exitPosition);
  const axis = getAxisFromDirection(direction);
  const oppositeAxis = axis == 'x' ? 'y' : 'x';
  const isMovingBack = entityIsMovingBack(direction);

  const collisionsInPath = _filter(collisionEntities, entity => {
    const isInAxis = isCollidingInAxis(oppositeAxis, characterRect, entity);
    const exitMethodParams = [axis, entity, characterRect, exitPosition];
    const isBetweenExit = isMovingBack ? isBetweenCharacterAndBackwardExit(...exitMethodParams) : isBetweenCharacterAndForwardExit(...exitMethodParams);
    return isBetweenExit && isInAxis;
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
 */
export function getTargetDirection(characterPosition, targetPosition) {
  const { x, y } = characterPosition;
  // Go the direction the most far away
  const xDifference = targetPosition.x - x;
  const yDifference = targetPosition.y - y;

  if (Math.abs(xDifference) > Math.abs(yDifference)) {
    // Go direction on X axis
    return xDifference > 0 ? 'right' : 'left';
  }

  // Go direction on Y axis
  return yDifference > 0 ? 'down' : 'up';
}

/**
 * Returns if an entity is colliding with the axis
 *
 * @param  {string}  axis - The axis the character is moving on (ex: 'x' or 'y')
 * @param  {object}  characterRect - The character rect object containing x, y,
 *                                   right, bottom, height and width
 * @param  {object}  entity - The collision entity to check
 *
 * @return {Boolean} - If the entity is colliding with the axis path
 */
export function isCollidingInAxis(axis, characterRect, entity) {
  const entityRect = getElementRect(entity);
  const rectEnd = axis == 'x' ? 'right' : 'bottom';

  return entityRect[axis] < characterRect[rectEnd] && entityRect[rectEnd] > characterRect[axis];
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
export function isBetweenCharacterAndForwardExit(axis, entity, characterRect, exitPosition) {
  const entityRect = getElementRect(entity);
  return entityRect[axis] < exitPosition[axis] && entityRect[axis] > characterRect[axis];
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
export function isBetweenCharacterAndBackwardExit(axis, entity, characterRect, exitPosition) {
  // exit is on right
  const entityRect = getElementRect(entity);
  return exitPosition[axis] < entityRect[axis] && characterRect[axis] < entityRect[axis];
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

/**
 * Returns the nearest open gap that avoids collisions in the path to the exit position
 *
 * @param  {object} character - The character to take to the exit position
 * @param  {object} exitPosition - The {x, y} to take the character to
 *
 * @return {object} - The nearest open gap that the character should move towards
 */
export function getClosestOpenGap(character, exitPosition) {
  const collisionsInPath = findCollisionsInPath(character, exitPosition);
  const collisionEntities = getCollisionEntities(true);

  if (!collisionsInPath.length) {
    return exitPosition;
  }

  const boardDimensions = tree.get('boardDimensions');
  const characterRect = getElementRect(character);
  const direction = getTargetDirection(characterRect, exitPosition);
  const axis = getAxisFromDirection(direction);
  const oppositeAxis = axis == 'x' ? 'y' : 'x';
  const isMovingBack = entityIsMovingBack(direction);
  const valueLogic = isMovingBack ? 'max' : 'min';
  const backwardDimension = getBackwardDimension(oppositeAxis);
  const forwardDimension = getForwardDimension(oppositeAxis);
  const dimensionVar = getDimensionFromAxis(oppositeAxis);
  const valueMethods = {
    min: _minBy,
    max: _maxBy
  };

  const closestCollision = valueMethods[valueLogic](collisionsInPath, entity => {
    return entity.position[axis];
  });

  const { closest, collisions: consecutiveCollisions } = findConsecutiveCollisions(closestCollision, collisionEntities, characterRect.height, characterRect.width);

  // Find nearest gaps that have enough room for the character to move through
  const validBackwardGap = closest[backwardDimension].min.position[oppositeAxis] > characterRect[dimensionVar] * 2;
  const forwardCollisionRect = getElementRect(closest[forwardDimension].max);
  const validForwardGap = forwardCollisionRect[forwardDimension] < boardDimensions[dimensionVar] - characterRect[dimensionVar] * 2;
  const forwardGap = { [axis]: forwardCollisionRect[axis], [oppositeAxis]: forwardCollisionRect[forwardDimension] };
  let goToOpenGap = validBackwardGap
    ? {
      [axis]: closest[backwardDimension].min.position[axis],
      [oppositeAxis]: closest[backwardDimension].min.position[oppositeAxis] - characterRect[dimensionVar]
    }
    : forwardGap;

  // If both backward and forward paths are valid, find the one closest to the
  // characters current position
  if (validBackwardGap && validForwardGap) {
    const distanceFromBackwardToCharacter = closest[backwardDimension].min.position[oppositeAxis] - characterRect[oppositeAxis];
    const distanceFromForwardToCharacter = characterRect[oppositeAxis] - closest[forwardDimension].max.position[oppositeAxis];

    if (distanceFromForwardToCharacter < distanceFromBackwardToCharacter) {
      goToOpenGap = forwardGap;
    }
  }

  // Need to see if character is stuck inside a collision cluster and need to move out
  // before proceeding to the target position
  const minMaxLogic = goToOpenGap[oppositeAxis] < characterRect[oppositeAxis] ? 'min' : 'max';
  const backwardDimensionOnAxis = getBackwardDimension(axis);
  const forwardDimensionOnAxis = getForwardDimension(axis);
  const closestForwardOnAxis = closest[forwardDimensionOnAxis][minMaxLogic];
  const closestBackwardOnAxis = closest[backwardDimensionOnAxis][minMaxLogic];
  const goAroundCollision = isMovingBack ? closestForwardOnAxis : closestBackwardOnAxis;
  const axisDirection = isMovingBack ? backwardDimensionOnAxis : forwardDimensionOnAxis;
  const oppositeAxisDirection = isMovingBack ? forwardDimensionOnAxis : backwardDimensionOnAxis;
  const otherAxisDirection = isMovingBack ? backwardDimension : forwardDimension;
  const collisionIsBeforeCharacter = isMovingBack
    ? goAroundCollision.position[axis] > characterRect[axisDirection]
    : goAroundCollision.position[axis] < characterRect[axisDirection];

  if (collisionIsBeforeCharacter) {
    const collisionRectOnAxis = getElementRect(closest[oppositeAxisDirection][minMaxLogic]);
    // Check if outermost collision is closer to the gap than character
    const collisionToGapDistance = closest[oppositeAxisDirection][minMaxLogic].position[oppositeAxis] - goToOpenGap[oppositeAxis];
    const characterToGapDistance = characterRect[oppositeAxis] - goToOpenGap[oppositeAxis];

    if (Math.abs(collisionToGapDistance) < Math.abs(characterToGapDistance)) {
      // Collision is in the way of where character needs to go, so go around it
      goToOpenGap = {
        [axis]: closest[oppositeAxisDirection][minMaxLogic].position[axis] - characterRect[getDimensionFromAxis(axis)],
        [oppositeAxis]: collisionRectOnAxis[otherAxisDirection]
      };
    }
  }

  return goToOpenGap;
}

/**
 * Returns backwards direction string based on axis
 *
 * @param  {string} axis - The axis to get the direction for (ex: 'x' or 'y')
 *
 * @return {string} - The string of the backward direction
 */
export function getBackwardDirection(axis) {
  return axis == 'x' ? 'left' : 'up';
}

/**
 * Returns forwards direction string based on axis
 *
 * @param  {string} axis - The axis to get the direction for (ex: 'x' or 'y')
 *
 * @return {string} - The string of the forward direction
 */
export function getForwardDirection(axis) {
  return axis == 'x' ? 'right' : 'down';
}

/**
 * Returns backwards dimension string based on axis
 *
 * @param  {string} axis - The axis to get the dimension for (ex: 'x' or 'y')
 *
 * @return {string} - The string of the backward dimension
 */
export function getBackwardDimension(axis) {
  return axis == 'x' ? 'left' : 'top';
}

/**
 * Returns forwards dimension string based on axis
 *
 * @param  {string} axis - The axis to get the dimension for (ex: 'x' or 'y')
 *
 * @return {string} - The string of the forward dimension
 */
export function getForwardDimension(axis) {
  return axis == 'x' ? 'right' : 'bottom';
}

/**
 * Returns the appropriate height or width dimension to use depending on axis
 *
 * @param  {string} axis - The axis to get the dimension for (ex: 'x' or 'y')
 *
 * @return {string} - The string of the dimension
 */
export function getDimensionFromAxis(axis) {
  return axis == 'x' ? 'width' : 'height';
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
      min: startingEntity,
      max: startingEntity
    },
    bottom: {
      min: startingEntity,
      max: startingEntity
    },
    left: {
      min: startingEntity,
      max: startingEntity
    },
    right: {
      min: startingEntity,
      max: startingEntity
    }
  };

  _forEach(remainingCollisions, ce => {
    const collisionEntityRect = getElementRect(ce);
    const bottomCollision = collisionEntityRect.y < entityRect.bottom + heightThreshold;
    const topCollision = collisionEntityRect.bottom > entityRect.y - heightThreshold;
    const rightCollision = collisionEntityRect.x < entityRect.right + widthThreshold;
    const leftCollision = collisionEntityRect.right > entityRect.x - widthThreshold;
    const isConsecutiveCollision = bottomCollision && topCollision && rightCollision && leftCollision;

    if (isConsecutiveCollision) {
      foundCollisions.push(ce);
      // Recursively call for each new item to see the consecutive values of
      // that entity, add them to the master collisions array and remove duplicates
      const childConsecutiveCollisions = findConsecutiveCollisions(ce, remainingCollisions, heightThreshold, widthThreshold, foundCollisions, closestCollisions);
      foundCollisions = _uniq(_union(foundCollisions, childConsecutiveCollisions.collisions));
      const closestChild = childConsecutiveCollisions.closest;
      closestCollisions = getClosestCollisions(closestChild, ce, closestCollisions);
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
    const oppositeAxis = axis == 'x' ? 'y' : 'x';
    const movingString = ['top', 'left'].indexOf(dimension) > -1 ? 'back' : 'forward';
    const valueMethods = { back: _minBy, forward: _maxBy };
    const closestCollision = closestCollisions[dimension];
    const newCollision = valueMethods[movingString]([closestChild[dimension].min, closestChild[dimension].max, closestParent], entity => entity.position[axis]);
    const childCollision = closestChild[dimension];

    // If new collision min/max is more updated, use that instead for both values
    if (newCollision.position[axis] < closestCollision.min.position[axis] || newCollision.position[axis] > closestCollision.max.position[axis]) {
      closestCollisions[dimension] = { min: newCollision, max: newCollision };
    }

    // Replace min/max values for opposite axis if child or parent values are more updated
    // This will ensure that we get the min/max on opposite axis, even when the main axis hasn't changed
    if (closestCollision.min.position[axis] == childCollision.min.position[axis] && childCollision.min.position[oppositeAxis] < closestCollision.min.position[oppositeAxis]) {
      closestCollisions[dimension].min = childCollision.min;
    }

    if (closestCollision.max.position[axis] == childCollision.max.position[axis] && childCollision.max.position[oppositeAxis] > closestCollision.max.position[oppositeAxis]) {
      closestCollisions[dimension].max = childCollision.max;
    }

    if (closestCollision.min.position[axis] == closestParent.position[axis] && closestParent.position[oppositeAxis] < closestCollision.min.position[oppositeAxis]) {
      closestCollisions[dimension].min = closestParent;
    }

    if (closestCollision.max.position[axis] == closestParent.position[axis] && closestParent.position[oppositeAxis] > closestCollision.max.position[oppositeAxis]) {
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
      text: `You must learn a new skill to collect this item.`,
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
      text: `You must learn a new skill for this bunny to become your friend.`,
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
    x: element.x || (element.position && element.position.x) || (element.props && element.props.position && element.props.position.x),
    y: element.y || (element.position && element.position.y) || (element.props && element.props.position && element.props.position.y),
    height: element.height || element.props.height,
    width: element.width || element.props.width
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
 * @param  {Boolean} isMoving - If element1 is currently moving
 *
 * @return {Boolean} - If the two elements are colliding
 */
export function checkElementCollision(element1, element2, isMoving) {
  const element1Rect = getElementRect(element1);
  const element2Rect = getElementRect(element2);

  const elementHittingLeft = element1Rect.x <= element2Rect.right;
  const elementHittingRight = element1Rect.right >= element2Rect.x;
  const elementHittingTop = element1Rect.y <= element2Rect.bottom;
  const elementHittingBottom = element1Rect.bottom >= element2Rect.y;

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
    const isColliding = checkElementCollision(character, items[t], direction);

    if (isColliding) {
      collisions.push(items[t]);
    }
  }

  return collisions;
}

export function getEntityCollisions(character, useX, useY, direction, goToTargetPosition) {
  const useCharacter = getCharacterWithNextPosition(character, useX, useY);
  const sceneryCollisions = checkSceneryCollision(useCharacter, direction, character.position);
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
      text: `You must learn a new skill to perform this action.`,
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
  const isXAxis = axis == 'x';
  const tileX = tile.x + (isXAxis ? 0 : 1);
  const tileY = tile.y + (isXAxis ? 1 : 0);
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
  const isXAxis = axis == 'x';
  const tileX = tile.x - (isXAxis ? 0 : 1);
  const tileY = tile.y - (isXAxis ? 1 : 0);
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
  const { height: boardHeight, width: boardWidth } = tree.get('boardDimensions');
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
  const { height: boardHeight, width: boardWidth } = tree.get('boardDimensions');
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
  const { height: boardHeight, width: boardWidth } = tree.get('boardDimensions');
  const tile = tree.get('tile');
  const movePixels = tree.get('movePixels');

  const isHero = character.isHero;
  const isXAxis = axis == 'x';
  const minLimit = isXAxis ? getMinBoardXLimit() : getMinBoardYLimit();
  const maxLimit = isXAxis ? getMaxBoardXLimit() : getMaxBoardYLimit();
  const checkTile = tile[isXAxis ? 'y' : 'x'];
  const currentValue = isXAxis ? currentX : currentY;
  const diagonalPercentage = getSquareDiagonalPercentage(movePixels);
  let value = Math.ceil(currentValue + (movePixels * (moveDiagonally ? diagonalPercentage : 1)));

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

  const useX = isXAxis ? value : currentX;
  const useY = isXAxis ? currentY : value;
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

export function getSquareDiagonalPercentage(side) {
  return (side * Math.sqrt(2)) / (side * 2);
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
  const isXAxis = axis == 'x';
  const bunnyRect = findDOMNode(character).getBoundingClientRect();
  const minLimit = 0 - ((isXAxis ? bunnyRect.width : bunnyRect.height) / 2);
  const maxLimit = isXAxis ? boardWidth - (bunnyRect.width / 2) : boardHeight - (bunnyRect.height / 2);
  const checkTile = tile[isXAxis ? 'y' : 'x'];
  const currentValue = isXAxis ? currentX : currentY;
  const diagonalPercentage = getSquareDiagonalPercentage(movePixels);
  let value = Math.ceil(currentValue - (movePixels * (moveDiagonally ? diagonalPercentage : 1)));

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

  const useX = isXAxis ? value : currentX;
  const useY = isXAxis ? currentY : value;
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
 * Returns the character with their position at the top level
 *
 * @param  {object} character - The character to alter
 * @param  {int} x - The character's X position
 * @param  {int} y - The character's Y position
 *
 * @return {object} - The new character object
 */
function getCharacterWithNextPosition(character, x, y) {
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
  const tile = tree.get('tile');
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
  const items = tile.scenery.filter(item => !item.collected);
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
