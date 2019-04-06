import React from 'react';
import tree from 'state';
import { Howl } from 'howler';
import _capitalize from 'lodash/capitalize';
import _filter from 'lodash/filter';
import _find from 'lodash/find';
import _findIndex from 'lodash/findIndex';
import _flatten from 'lodash/flatten';
import _forEach from 'lodash/forEach';
import _isEqual from 'lodash/isEqual';
import _max from 'lodash/max';
import _min from 'lodash/min';
import _minBy from 'lodash/minBy';
import _random from 'lodash/random';
import _union from 'lodash/union';
import { findDOMNode } from 'react-dom';

import * as FoodItems from 'components/Food';
import * as Characters from 'components/Characters';
import * as Backgrounds from 'components/Backgrounds';
import * as SceneryItems from 'components/Scenery';

import { FALL_DURATION, MENU_TABS } from 'components/constants';
import * as sceneryConstants from 'components/Scenery/constants';
import * as characterConstants from 'components/Characters/constants';
import * as mapConstants from 'Maps/constants';

let popoverTimeout;

/**
 * Updates the hero's position to the state
 *
 * @param  {object} newPos - Position containing the new X and Y coordinates of
 *                           the hero
 */
export function updateHeroPosition(newPos) {
  tree.set(['hero', 'position'], newPos);
  tree.commit();
}

export function changeMenuTab(activeTab) {
  const currentTab = tree.get('activeMenuTab');
  const newTab = activeTab || (currentTab < MENU_TABS ? currentTab + 1 : 1);
  tree.set('activeMenuTab', newTab);
}

export function toggleAudioMuted() {
  const backgroundMuted = tree.get(['audioSettings', 'background', 'muted']);
  const effectsMuted = tree.get(['audioSettings', 'effects', 'muted']);
  const muted = backgroundMuted && effectsMuted;

  tree.select('audioSettings').merge({
    background: {
      ...tree.get(['audioSettings', 'background']),
      muted: !muted,
    },
    effects: {
      ...tree.get(['audioSettings', 'effects']),
      muted: !muted,
    },
  });
}

export function toggleAudioTypeMute(audioType) {
  tree.set(['audioSettings', audioType, 'muted'], !tree.get(['audioSettings', audioType, 'muted']));
}

export function setAudioVolume(audioType, volume) {
  tree.set(['audioSettings', audioType, 'volume'], volume);
}

export function getBunnyCursorIndex(bunnyId) {
  const bunnies = tree.get('bunnies');
  return _findIndex(bunnies, bunny => bunny.id === bunnyId);
}

export function updateBunnyProp(bunnyId, key, value) {
  const bunnyIndex = getBunnyCursorIndex(bunnyId);
  const cursor = tree.select(['bunnies', bunnyIndex, key]);
  cursor.set(value);
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
  const useProperties = properties || [
    'top',
    'bottom',
    'left',
    'right',
    'height',
    'width',
  ];
  const newDimensions = {};

  useProperties.forEach((property) => {
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

export function getItemOfType(type, itemId) {
  const items = type === 'food' ? tree.get('foodOnTile') : tree.get(['tile', type]);
  const itemIndex = _findIndex(items, item => item.id === itemId);
  return items[itemIndex];
}

/**
 * Returns the scenery object by its ID
 *
 * @param  {int|string} id - The ID to find the item by
 *
 * @return {object|null} - The found scenery item
 */
export function getItemById(id, type) {
  const items = tree.get(['tile', type]);

  if (!items || !items.length) {
    return false;
  }

  return _find(items, item => item.id === id);
}

export function getItemCursor(type, itemId, tile) {
  const activeTile = tile || tree.get('tile');
  const item = getItemOfType(type, itemId, activeTile);
  const items = type === 'food' ? tree.get('foodOnTile') : tree.get(['tile', type]);
  let itemIndex = _findIndex(items, itemObj => itemObj.id === itemId);
  let itemCursor = tree.select(['tiles', `${activeTile.x}_${activeTile.y}`, type, itemIndex]);

  // If item belonged to a parent, need to update the item in that parent's produce list
  if (item.parent) {
    const parentItem = getItemById(item.parent, 'scenery');
    const parentIndex = _findIndex(tree.get(['tile', 'scenery']), sceneryItem => sceneryItem.id === item.parent);
    itemIndex = _findIndex(parentItem.produce, produceItem => produceItem.id === itemId);
    itemCursor = tree.select(['tiles', `${activeTile.x}_${activeTile.y}`, 'scenery', parentIndex, 'produce', itemIndex]);
  }

  return itemCursor;
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
    x: (
      element.x ||
      (element.position && element.position.x) ||
      (element.props && element.props.position && element.props.position.x) ||
      0
    ),
    y: (
      element.y ||
      (element.position && element.position.y) ||
      (element.props && element.props.position && element.props.position.y) ||
      0
    ),
    height: element.height || (element.props && element.props.height) || 0,
    width: element.width || (element.props && element.props.width) || 0,
  };

  rect.right = rect.x + rect.width;
  rect.bottom = rect.y + rect.height;

  return rect;
}

/**
 * Returns hitboxes for an items that have custom collision entities
 *
 * @param  {array} items - All items to check for custom hitboxes
 *
 * @return {array} - All collision entities, including custom hitboxes
 */
export function getCollisionsWithCustomHitboxes(items) {
  const customHitboxes = _flatten(_filter(
    items,
    item => item.collisionPoints,
  ).map(item => item.collisionPoints));

  if (customHitboxes) {
    return _union(items, customHitboxes);
  }

  return items;
}

export function getCollisionItems(items) {
  return items.filter(item => !item.nonColliding);
}

/**
 * Returns all collision entities on a tile
 *
 * @param  {boolean} filterCollected - If only uncollected entities should be returned
 *
 * @return {array} - The collision entities
 */
export function getCollisionEntities(filterCollected, includeBunnies) {
  const tile = tree.get('tile');
  const foodOnTile = tree.get('foodOnTile');
  const sceneryEntities = _filter(tile.scenery, (entity) => {
    // Remove burrow entities
    const isBurrow = entity.type === sceneryConstants.BURROW_TYPE;
    return !isBurrow;
  });

  const sceneryEntitiesWithHitboxes = getCollisionsWithCustomHitboxes(sceneryEntities);

  const foodEntities = !filterCollected ? foodOnTile : _filter(foodOnTile, food => !food.collected);
  const collisionEntities = [foodEntities, sceneryEntitiesWithHitboxes];

  if (includeBunnies) {
    collisionEntities.push([...tree.get('bunniesOnTile'), tree.get('hero')]);
  }

  return getCollisionItems(_union(...collisionEntities));
}

/**
 * Checks collision between two elements
 *
 * The provided element params must contain the following properties:
 * { x, y, height, width }
 *
 * @param  {object}  element1 - First element to use in check
 * @param  {object}  element2 - Second element to use in check
 * @param  {number}  heightOffset - The height offset to use for detecting collision area
 * @param  {number}  widthOffset - The width offset to use for detecting collision area
 * @param  {bool}  excludeEquals - Whether equals comparison check should be excluded
 *                                 Value should be false if equals comparison should be performed
 *
 * @return {Boolean} - If the two elements are colliding
 */
export function checkElementCollision(
  element1,
  element2,
  heightOffset = 0,
  widthOffset = 0,
  excludeEquals = false,
) {
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
 * @param  {object} entity - The entity to check collisions for
 * @param  {array} items - The collision items to check
 * @param  {bool} returnOnCollision - Whether to return on the first found collision
 * @param  {bool} excludeEquals - Whether equals comparison check should be excluded
 *                                Value should be false if equals comparison should be performed
 *
 * @return {int} - The max possible value based on the direction the character
 *                 is moving.
 *                 If character is colliding with an item, this max value will
 *                 be whatever that collision point is.
 */
export function checkCollisions(entity, items, returnOnCollision, excludeEquals) {
  const collisions = [];

  for (let t = 0; t < items.length; t += 1) {
    const isColliding = checkElementCollision(entity, items[t], null, null, excludeEquals);

    if (isColliding) {
      if (returnOnCollision) {
        return items[t];
      }

      collisions.push(items[t]);
    }
  }

  return returnOnCollision ? false : collisions;
}

/**
 * Returns collision entities that are colliding with a given entity
 *
 * @param  {object} entity - The entity to check for collisions
 * @param  {bool} includeBunnies - Whether to include bunnies as collision entities
 *
 * @return {array} - All collision entities that are currently colliding with the entity
 */
export function getCollisions(entity, includeBunnies) {
  const entityRect = getElementRect(entity);
  const collisions = getCollisionEntities(true, includeBunnies);
  return checkCollisions(entityRect, collisions);
}

/**
 * Returns direct neighbours of a given position
 *
 * @param  {object} position - The position to get neighbours for
 * @param  {int} height - The height of the starting position to derive the
 *                        top and bottom neighbours
 * @param  {int} width - The width of the starting position to derive the left
 *                       and right neighbours
 *
 * @return {object} - The neighbours to the top, bottom, left, and right of the starting position
 */
export function getNeighboursOfPosition(position, height, width) {
  const posRect = getElementRect({ ...position, height, width });
  const forwardX = posRect.right;
  const backwardX = position.x - width;
  const forwardY = posRect.bottom;
  const backwardY = position.y - height;

  const neighbours = {
    left: { x: backwardX, y: position.y, height, width }, // left
    right: { x: forwardX, y: position.y, height, width }, // right
    top: { x: position.x, y: backwardY, height, width }, // top
    bottom: { x: position.x, y: forwardY, height, width }, // bottom
  };

  return neighbours;
}

/**
 * Returns the closest position that does not have any collisions
 *
 * @param  {object} item - The item that will go to this empty position
 * @param  {bool} includeBunnies - Whether to include bunnies as collision entities
 *
 * @return {object} - The nearest position without any collisions
 */
export function getClosestEmptyPosition(item, includeBunnies) {
  const itemRect = getElementRect(item);
  const currentPos = { x: itemRect.x, y: itemRect.y };
  const queue = [currentPos];
  const positionsTried = [];

  while (queue.length) {
    const position = queue.shift();
    const itemCollisions = getCollisions(
      {
        ...position,
        height: item.height,
        width: item.width,
      },
      includeBunnies,
    );

    if (!itemCollisions.length) {
      return position;
    }

    const neighbours = getNeighboursOfPosition(position, item.height, item.width);
    const posKey = `${position.x}_${position.y}`;
    positionsTried.push(posKey);

    _forEach(neighbours, (neighbour) => {
      const neighbourPosKey = `${neighbour.x}_${neighbour.y}`;
      if (!positionsTried.includes(neighbourPosKey)) {
        queue.push(neighbour);
      }
    });
  }

  return currentPos;
}

/**
 * Sets the active game tile to the X and Y coordinates specified
 * @param {Number} x - The new tile X coordinate
 * @param {Number} y - The new tile Y coordinate
 */
export function setActiveTile(x = 4, y = 3) {
  const cursor = tree.select('activeTile');
  const bunnies = tree.get('bunnies');
  const previousTile = cursor.get();
  const itemQueue = tree.select('itemQueue');

  // Set new tile immediately so player doesn't have to wait for the logic below to finish
  cursor.set({ x, y });
  tree.commit();

  if (itemQueue.get().length) {
    // If we have an item queue for the now previous tile, set their
    // hasCollected status to false so they repopulate when the tile is next rendered
    _forEach(itemQueue.get(), (itemId) => {
      const itemCursor = getItemCursor('food', itemId, previousTile);
      itemCursor.set('collected', false);
    });

    // Clear the queue
    itemQueue.set([]);
  }

  const bunniesOnTile = _filter(bunnies, (bunny) => {
    return bunny.onTile.x === x && bunny.onTile.y === y;
  });

  if (bunniesOnTile.length) {
    bunniesOnTile.forEach((item) => {
      const closestEmptyPosition = getClosestEmptyPosition(item);

      // Move bunny position if they're colliding with any items
      if (closestEmptyPosition && !_isEqual(closestEmptyPosition, item.position)) {
        updateCharacterPosition(item.id, closestEmptyPosition);
      }
    });
  }
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
 * @param  {object} tar - The tile the character will go to
 *
 * @return {bool|string} - The direction of the exit, or false if already on the target tile
 */
export function findTileExit(targetTile) {
  const tile = tree.get('tile');

  if (tile.x === targetTile.x && tile.y === targetTile.y) {
    return false;
  }

  let preferredExit;

  // Determine the best direction to head to based on where the group tile is
  // in comparison to the current tile
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

export function isMovingOnYAxis(direction) {
  return ['top', 'bottom', 'up', 'down'].indexOf(direction) > -1;
}

export function getAxisFromDirection(direction) {
  return isMovingOnYAxis(direction) ? 'y' : 'x';
}

export function isXAxis(axis) {
  return axis === 'x';
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

export function isBackwardsDirection(direction) {
  return ['top', 'up', 'left'].indexOf(direction) > -1;
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

export function heuristic(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

/**
 * Get the X, Y coordinates of the exit
 *
 * @param  {object} character - The character moving to the exit position
 * @param  {object} targetTile - The tile the character will go to
 *
 * @return {object} - The { x, y } coordinates of the exit position
 */
export function getExitPosition(character, targetTile) {
  const tile = tree.get('tile');
  const { height: boardHeight, width: boardWidth } = tree.get('boardDimensions');
  const characterRect = getElementRect(character);
  const goToPosition = {};

  if (targetTile) {
    // Get the tile in the direction of the target tile
    const useExit = findTileExit(targetTile);

    switch (useExit) {
      case 'top':
        goToPosition.x = tile.exits[useExit].start;
        goToPosition.y = -characterRect.height; // Top of the board
        break;
      case 'bottom':
        goToPosition.x = tile.exits[useExit].start;
        goToPosition.y = boardHeight; // Bottom of the board
        break;
      case 'left':
        goToPosition.x = -characterRect.width; // Left of the board
        goToPosition.y = tile.exits[useExit].start;
        break;
      case 'right':
      default:
        goToPosition.x = boardWidth; // Right of the board
        goToPosition.y = tile.exits[useExit].start;
        break;
    }
  } else {
    const exits = [];

    _forEach(tile.exits, (sideExit, side) => {
      const axis = getAxisFromDirection(side);
      const oppositeAxis = getOppositeAxis(axis);
      const isBackwardDimension = isBackwardsDirection(side);
      const offsetDimension = getDimensionFromAxis(oppositeAxis);
      const maxDimension = isXAxis(axis) ? boardWidth : boardHeight;
      const axisValue = isBackwardDimension ? -characterRect[offsetDimension] : maxDimension;
      const inExitPath = (
        characterRect[oppositeAxis] >= sideExit.start &&
        characterRect[oppositeAxis] <= sideExit.end
      );

      if (inExitPath) {
        // If character is in the direct path of an exit, use that instead of the offset increments
        exits.push({ [axis]: axisValue, [oppositeAxis]: characterRect[oppositeAxis] });
      } else {
        // Find all possible positions in exit gap in case there's collisions in the way of some
        for (let i = sideExit.start; i < sideExit.end; i += characterRect[offsetDimension]) {
          exits.push({ [axis]: axisValue, [oppositeAxis]: i });
        }
      }
    });

    // Get the closest available exit
    const closestExit = _minBy(exits, exit => heuristic(characterRect, exit));
    goToPosition.x = closestExit.x;
    goToPosition.y = closestExit.y;
  }

  return goToPosition;
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
export function getTargetDirection(currentPosition, targetPosition, lastDirection) {
  const { x, y } = currentPosition;

  // Go the direction the most far away
  const xDifference = targetPosition.x - x;
  const yDifference = targetPosition.y - y;
  const moveOnAxis = Math.abs(xDifference) > Math.abs(yDifference) ? 'x' : 'y';
  const axisDirections = {
    x: getDirectionForAxis('x', currentPosition, targetPosition),
    y: getDirectionForAxis('y', currentPosition, targetPosition),
  };
  let direction = axisDirections[moveOnAxis];

  if (direction === lastDirection) {
    direction = axisDirections[getOppositeAxis(moveOnAxis)];
  }

  return direction;
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
  const isMovingBack = isBackwardsDirection(direction);
  const atTargetCoordinate = isMovingBack
    ? currentPosition[axis] <= targetPosition[axis]
    : currentPosition[axis] >= targetPosition[axis];
  return atTargetCoordinate;
}

/**
 * Returns if a given position is at/equal to a target exit position
 *
 * @param  {object}  pos - The position to check if it's at the exit position
 * @param  {object}  exitPosition - The target exit position
 * @param  {object}  characterRect - The rect object of the character going to the exit position
 *
 * @return {bool} - Whether the position is at the exit position
 */
export function isAtExitPosition(pos, exitPosition, characterRect) {
  const boardDimensions = tree.get('boardDimensions');

  if (exitPosition.x === -characterRect.width) { // left
    return pos.x <= exitPosition.x;
  } if (exitPosition.x === boardDimensions.width) { // right
    return pos.x >= exitPosition.x;
  } if (exitPosition.y === -characterRect.height) { // top
    return pos.y <= exitPosition.y;
  } if (exitPosition.y === boardDimensions.height) { // bottom
    return pos.y >= exitPosition.y;
  }

  return pos.x === exitPosition.x && pos.y === exitPosition.y;
}

/**
 * Returns the position offset for a given axis when an entity is colliding with a collision entity
 *
 * @param {object} collisionRect - The dimensions rect for the collision entity
 *                                 The offset will be calculated based off this
 *                                 rect to move the entity to the
 *                                 nearest/most logical border of this collision entity
 * @param {object} entity - The entity that is colliding with the collision
 * @param {string} axis - The axis to get the offset for
 *
 * @return {int} - The offset to use for the axis
 */
function getCollisionPositionOffset(collisionRect, entity, axis) {
  const entityRect = getElementRect(entity);
  const axisDimension = getDimensionFromAxis(axis);
  const forwardDimension = getForwardDimension(axis);
  const collisionCharacterOffset = collisionRect[axis] - entityRect[axisDimension];
  const isBeforeCollision = (
    entityRect[axis] <= collisionRect[axis] &&
    entityRect[forwardDimension] >= collisionRect[axis]
  );
  let collisionOffset = isBeforeCollision
    ? collisionCharacterOffset
    : collisionRect[forwardDimension];

  const entityWithinCollision = (
    entityRect[axis] >= collisionRect[axis] &&
    entityRect[forwardDimension] <= collisionRect[forwardDimension]
  );

  // Position is inside a collision entity larger than the position dimensions,
  // so use it's current position
  if (entityWithinCollision) {
    collisionOffset = entityRect[axis];
  }

  return collisionOffset;
}

/**
 * Returns the "cost" of how far a given position is away from a given start and end point
 *
 * @param  {int} currentCost - The current cost for the current position
 * @param  {object} startPos - The initial starting position
 * @param  {object} endPos - The target destination position
 * @param  {object} stepPos - The step to get the next cost for
 *
 * @return {int} - The cost of how far this step is from the start and end position
 */
export function getStepCost(currentCost, startPos, endPos, stepPos) {
  return currentCost + heuristic(startPos, stepPos) + heuristic(endPos, stepPos);
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
export function isInBoardBoundsOnAxis(rect, axis, useAxisDimension) {
  const boardDimensions = tree.get('boardDimensions');
  const forwardDimensionOnAxis = getForwardDimension(axis);
  const boundsDimension = getDimensionFromAxis(axis);
  const isAfterBoardStart = rect[axis] >= 0;
  const useDimension = useAxisDimension ? axis : forwardDimensionOnAxis;
  const isBeforeBoardEnd = rect[useDimension] < boardDimensions[boundsDimension];
  return isAfterBoardStart && isBeforeBoardEnd;
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
export function checkIfValidGap(gap, exitPosition, characterRect) {
  const gapRect = getElementRect(gap);
  const isValidOnY = isInBoardBoundsOnAxis(gapRect, 'y', true);
  const isValidOnX = isInBoardBoundsOnAxis(gapRect, 'x', true);
  const atExitPosition = isAtExitPosition(gap, exitPosition, characterRect);
  return atExitPosition || (isValidOnX && isValidOnY);
}

/**
 * Returns a path to the target exit position
 *
 * @param  {object} character - The character that will go to the exit position
 * @param  {object} exitPos - The exit position the character will go to
 *
 * @return {array} - The path to the exit
 */
export function findPathToExit(character, exitPos) {
  const characterRect = getElementRect(character);
  const collisions = getCollisionEntities(true);
  const exitPosition = { x: exitPos.x, y: exitPos.y };
  const heightOffset = characterRect.height;
  const widthOffset = characterRect.width;
  const location = {
    position: { x: characterRect.x, y: characterRect.y },
    path: [],
    visitOrder: 0,
    sortKey: 0,
  };
  const positionCosts = {
    [`${characterRect.x}_${characterRect.y}`]: 0,
  };
  const queue = [location];
  let visitOrder = queue.length;

  while (queue.length) {
    queue.sort((a, b) => (
      a.sortKey === b.sortKey ? a.visitOrder - b.visitOrder : a.sortKey - b.sortKey
    ));
    const currentLocation = queue.shift();

    if (isAtExitPosition(currentLocation.position, exitPosition, characterRect)) {
      return currentLocation.path;
    }

    const currentPos = `${currentLocation.position.x}_${currentLocation.position.y}`;
    const neighbours = getNeighboursOfPosition(currentLocation.position, heightOffset, widthOffset);

    Object.keys(neighbours).forEach((neighbourSide) => { // eslint-disable-line no-loop-func
      const neighbourPos = neighbours[neighbourSide];
      const nextPos = `${neighbourPos.x}_${neighbourPos.y}`;
      const newCost = getStepCost(
        positionCosts[currentPos],
        currentLocation.position,
        exitPosition,
        neighbourPos,
      );

      if (!positionCosts[nextPos] || newCost < positionCosts[nextPos]) {
        positionCosts[nextPos] = newCost;

        // Neighbour is within map bounds
        if (checkIfValidGap(neighbourPos, exitPosition, characterRect)) {
          const isOverlappingEntity = checkCollisions(neighbourPos, collisions, true, true);
          let useNeighbourPos;

          if (!isOverlappingEntity) {
            useNeighbourPos = { x: neighbourPos.x, y: neighbourPos.y };
          } else {
            // This position is overlapping a collision entity, so set the
            // position to the border of the collision
            const collisionRect = getElementRect(isOverlappingEntity);
            const collidingOnYAxis = ['top', 'bottom'].includes(neighbourSide);
            const collisionXOffset = getCollisionPositionOffset(collisionRect, neighbourPos, 'x');
            const collisionYOffset = getCollisionPositionOffset(collisionRect, neighbourPos, 'y');

            const collisionYValue = neighbourSide === 'right'
              ? (collisionRect.x - neighbourPos.width)
              : collisionRect.right;
            const collisionXValue = neighbourSide === 'bottom'
              ? (collisionRect.y - neighbourPos.height)
              : collisionRect.bottom;
            const useX = collidingOnYAxis ? collisionXOffset : collisionYValue;
            const useY = !collidingOnYAxis ? collisionYOffset : collisionXValue;
            const neighbourBorderPosition = { x: useX, y: useY };

            const neighbourBorderPos = `${neighbourBorderPosition.x}_${neighbourBorderPosition.y}`;
            const neighbourBorderCost = getStepCost(
              positionCosts[currentPos],
              currentLocation.position,
              exitPosition,
              neighbourBorderPosition,
            );

            const isLessCost = neighbourBorderCost < positionCosts[neighbourBorderPos];

            if (!positionCosts[neighbourBorderPos] || isLessCost) {
              positionCosts[neighbourBorderPos] = neighbourBorderCost;

              // Neighbour is within map bounds
              if (checkIfValidGap(neighbourBorderPosition, exitPosition, characterRect)) {
                const neighbourBorderHasOtherCollision = checkCollisions({
                  ...neighbourBorderPosition,
                  height: neighbourPos.height,
                  width: neighbourPos.width,
                }, collisions, true, true);

                // Try this path if the position on the collision border does not have another
                // colliding entity
                if (!neighbourBorderHasOtherCollision) {
                  useNeighbourPos = neighbourBorderPosition;
                }
              }
            }
          }

          if (useNeighbourPos) {
            const costKey = `${useNeighbourPos.x}_${useNeighbourPos.y}`;
            queue.push({
              position: useNeighbourPos,
              path: [...currentLocation.path, useNeighbourPos],
              visitOrder: visitOrder += 1,
              sortKey: positionCosts[costKey],
            });
          }
        }
      }
    });
  }

  return false;
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

export function showNeedsSkillPopover(message) {
  setPopover({
    title: 'Skill Needed',
    text: `You must learn a new skill ${message}.`,
    popoverClass: 'info',
  });
}

export function playSoundEffect(soundName, volume = 1, rate = 1) {
  if (tree.get(['audioSettings', 'muteAll']) || tree.get(['audioSettings', 'effects', 'muted'])) {
    return;
  }

  const soundFile = tree.get(['soundEffects', soundName]);
  const effectsVolume = tree.get(['audioSettings', 'effects', 'volume']);
  const sound = new Howl({ src: [soundFile], volume: volume * parseFloat(effectsVolume), rate });
  sound.play();
}

/**
 * Adds an item to the hero's inventory
 *
 * @param  {string} type - The type of item being collected, ex: 'food'
 * @param  {int} itemId - The ID of the item to collect
 */
export function collectItem(type, itemId) {
  const heroAbilities = tree.get(['hero', 'abilities']);
  const item = getItemOfType(type, itemId);

  // Hero doesn't have the required skill to add this item yet
  if (item.needsAbility && heroAbilities.indexOf(item.needsAbility) === -1) {
    showNeedsSkillPopover('to collect this item');
    return;
  }

  if (item.playSound) {
    playSoundEffect(item.playSound, 0.5);
  }

  const activeTile = tree.get('tile');
  const produceListCursor = tree.select('produceList');
  const foodIndex = _findIndex(
    produceListCursor.get(),
    foodItem => foodItem.name === (item.display || item.type),
  );
  const itemCursor = getItemCursor(type, itemId);

  itemCursor.set('collected', true);

  // Item has a parent where it's original location was. Put the item back
  // where it started on it's parent
  if (item.originalPosition) {
    itemCursor.merge({ position: item.originalPosition, originalPosition: null, onParent: true });
  }

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
    popoverClass: 'info',
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
      itemCursor.set('collected', false);
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
  const bunnyIndex = _findIndex(bunnies, bunny => bunny.id === bunnyId);
  const collectedObj = bunniesCursor.get(bunnyIndex);

  // Do nothing if hero has already collected this bunny
  if (collectedObj.hasCollected) {
    return;
  }

  const heroHasSkill = heroAbilities.includes(bunnies[bunnyIndex].needsAbility);

  // Hero doesn't have the required skill to add this bunny yet
  if (bunnies[bunnyIndex].needsAbility && !heroHasSkill) {
    showNeedsSkillPopover('for this bunny to become your friend');
    return;
  }

  playSoundEffect('squeak');
  const bunny = bunnies[bunnyIndex];
  const skills = tree.get('skills');
  const newSkill = bunny.giveSkill && _find(skills, skill => skill.name === bunny.giveSkill);

  bunniesCursor.set([bunnyIndex, 'hasCollected'], true);

  setPopover({
    title: 'New Friend',
    text: (
      <div>
        <p><strong>{bunny.name}</strong> is now your friend!</p>
        {newSkill && (
          <div>
            <p>They taught you a new skill: <strong>{_capitalize(newSkill.name)}</strong>!</p>
            <p>{newSkill.description}</p>
            <p>{bunny.name} will now reside in the Bunny Group area.</p>
          </div>
        )}
      </div>
    ),
    popoverClass: 'info',
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
  const gameStartedCursor = tree.select('gameStarted');
  cursor.set(!cursor.get());

  if (!gameStartedCursor.get()) {
    gameStartedCursor.set(true);
    tree.select(['audioSettings', 'muteAll']).set(false);
  }
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
    right: 'left',
  };

  return oppositeDirections[direction];
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
    position: { x, y },
  };
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
  return usingBurrow ? sceneryConstants.BURROW_WIDTH : 0 - (characterConstants.BUNNY_WIDTH / 2);
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
  return usingBurrow ? sceneryConstants.BURROW_HEIGHT : 0 - (characterConstants.BUNNY_HEIGHT / 2);
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
  const offset = usingBurrow
    ? (sceneryConstants.BURROW_WIDTH + characterConstants.BUNNY_WIDTH)
    : (characterConstants.BUNNY_WIDTH / 2);
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
  const offset = usingBurrow
    ? (sceneryConstants.BURROW_HEIGHT + characterConstants.BUNNY_HEIGHT)
    : (characterConstants.BUNNY_HEIGHT / 2);
  return boardHeight - offset;
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
  if (item.needsAbility && heroAbilities.indexOf(item.needsAbility) === -1) {
    showNeedsSkillPopover('to perform this action');
    return;
  }

  playSoundEffect('dig', 0.1, 1.9);

  // If bunny is going into a burrow, take them to the appropriate tile
  setActiveTile(item.takeToTile.x, item.takeToTile.y);

  // Determine which axis we're using to move to the next tile
  const changingTileX = item.takeToTile.y !== tileY;

  // Depending on the tile axis, get the min and max limits of the board
  // and the boundary of where the burrow is
  const minLimit = changingTileX ? getMinBoardXLimit(true) : getMinBoardYLimit(true);
  const maxLimit = changingTileX ? getMaxBoardXLimit(true) : getMaxBoardYLimit(true);

  // Determine if we're going to the next or previous tile
  const goingToNextTile = changingTileX ? item.takeToTile.y > tileY : item.takeToTile.x > tileX;

  // If we're going to the next tile, put the hero at the starting edge of the next tile
  // If we're going to the previous tile, put the hero at the ending edge of the previous tile
  const newLimit = goingToNextTile ? minLimit : maxLimit;
  const newX = changingTileX ? newLimit : heroPosition.x;
  const newY = changingTileX ? heroPosition.y : newLimit;

  // Set new hero position on the new tile
  updateHeroPosition({ x: newX, y: newY });
}

/**
 * Returns the side of the collision entity that is colliding with the character
 *
 * @param  {object} character - The character entity
 * @param  {object} collision - The collision entity
 *
 * @return {string} - The side the collision is colliding on
 */
export function getCollidingSide(character, collision) {
  const characterRect = getElementRect(character);
  const collisionRect = getElementRect(collision);
  if (characterRect.bottom === collisionRect.y && characterRect.y < collisionRect.y) {
    return 'top';
  }

  if (characterRect.y === collisionRect.bottom && characterRect.y > collisionRect.y) {
    return 'bottom';
  }

  if (characterRect.right === collisionRect.x && characterRect.x < collisionRect.x) {
    return 'left';
  }

  if (characterRect.x === collisionRect.right && characterRect.x > collisionRect.x) {
    return 'right';
  }

  return false;
}

export function shakeProduce(item, parent) {
  const tile = tree.get('tile');
  const hero = tree.select('hero');
  const itemIndex = _findIndex(parent.produce, foodItem => foodItem.id === item.id);
  const parentIndex = _findIndex(tile.scenery, sceneryItem => sceneryItem.id === parent.id);
  const parentRect = getElementRect(parent);
  const itemRect = getElementRect(item);

  const fallLeft = _random(0, 1);
  const fallXOffset = _random(15, 40);
  const fallToX = fallLeft ? itemRect.x - fallXOffset : itemRect.x + fallXOffset;
  const fallToY = parentRect.bottom + _random(10, 40);
  const tileParent = tree.select(['tiles', `${tile.x}_${tile.y}`, 'scenery', parentIndex]);
  let fallToPos = { x: fallToX, y: fallToY };
  const fallToObj = { ...fallToPos, height: item.height, width: item.width };
  const willHaveCollision = getCollisions(fallToObj, true);

  // Produce will fall to a position that has a collision, so fall to the closest open spot
  if (willHaveCollision) {
    fallToPos = getClosestEmptyPosition(fallToObj, true);
  }

  playSoundEffect('treeShake', 0.6);
  playSoundEffect('stomp', 0.1);
  tileParent.select(['produce', itemIndex]).merge({ fallTo: fallToPos, onParent: false });
  tileParent.set('shake', true);
  // Don't let hero move while produce is falling
  hero.set('disableMove', true);

  setTimeout(() => {
    tileParent.select(['produce', itemIndex]).merge({ fallTo: null, position: fallToPos, originalPosition: item.position });
    tileParent.set('shake', false);
    // Let hero move again when animation completes
    hero.set('disableMove', false);
  }, FALL_DURATION);
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
  const sceneryEntities = getCollisionsWithCustomHitboxes(tile.scenery);
  const items = getCollisionItems(sceneryEntities);
  const collisions = checkCollisions(character, items);

  if (collisions.length) {
    _forEach(collisions, (item) => {
      if (character.isHero) {
        // If we're not moving, a space action is happening
        if (!direction) {
          if (item.takeToTile) {
            handleBurrowAction(item);
          } else if ((item.produce || item.produceAction) && getCollidingSide(character, item) === 'bottom') {
            const heroAbilities = tree.get(['hero', 'abilities']);

            // Hero doesn't have the required skill to trigger this event
            if (item.needsAbility && !heroAbilities.includes(item.needsAbility)) {
              showNeedsSkillPopover('to perform this action');
              return;
            }

            const itemWithProduce = item.produce
              ? item
              : sceneryEntities.find(sceneryItem => sceneryItem.id === (item.hitboxFor || item.id));
            const produceItems = itemWithProduce.produce;
            const untouchedProduceItems = produceItems.filter((
              produceItem => !produceItem.collected && produceItem.onParent
            ));
            if (untouchedProduceItems.length) {
              shakeProduce(untouchedProduceItems[0], itemWithProduce);
            }
          }
        }
      }
    });
  }

  return collisions;
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
  const foodOnTile = tree.get('foodOnTile');
  const items = foodOnTile.filter(item => !item.collected);
  const collisions = checkCollisions(character, items);

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
 * @param  {string} direction - The direction the character is moving, ex: 'up'
 * @param  {bool} bypassBunnyCollisionUpdate - If updating the heroCollisions should be bypassed
 *
 * @return {int} - The max possible value based on the direction the character
 *                 is moving.
 *                 If character is colliding with another bunny, this max value
 *                 will be whatever that collision point is.
 */
export function checkBunnyCollision(character, direction, bypassBunnyCollisionUpdate) {
  const { isHero } = character;
  const heroCollisions = tree.select('heroCollisions');
  // When checking collisions for hero, compare against other AI bunnies on the tile
  // Otherwise, when checking AI collisions, ensure they're not colliding with hero
  // or any other AIs
  const bunniesOnTile = _filter(tree.get('bunniesOnTile'), (bunny) => {
    return bunny.id !== character.props.id &&
      // Only collide with bunnies that have not been collected, or that are
      // already at their group tile
      // This prevents hero from colliding with bunnies going to their group tile
      (!bunny.hasCollected || !bunny.goingToTile);
  });

  // If moving AI, check for hero collisions when not going to a target location
  if (!isHero) {
    const heroCursor = tree.get('hero');
    bunniesOnTile.push({
      id: 'Hero',
      position: heroCursor.position,
      height: heroCursor.height,
      width: heroCursor.width,
    });
  }

  const collisions = checkCollisions(character, bunniesOnTile);

  if (collisions.length) {
    // If we're not moving, a space action is happening
    if (!direction && character.isHero) {
      _forEach(collisions, item => collectBunny(item.id));
    }
  }

  const collisionIds = collisions.map(item => item.id);

  if (isHero && !bypassBunnyCollisionUpdate && !_isEqual(heroCollisions.get(), collisionIds)) {
    heroCollisions.set(collisionIds);
  }

  return collisions;
}

export function getEntityCollisions(
  character,
  useX,
  useY,
  direction,
  goToTargetPosition,
  bypassBunnyCollisionUpdate,
) {
  const useCharacter = getCharacterWithNextPosition(character, useX, useY);
  const sceneryCollisions = checkSceneryCollision(useCharacter, direction);
  const foodCollisions = checkFoodCollision(useCharacter, direction);
  // Don't collide with bunnies when character is going to target position
  const bunnyCollisions = goToTargetPosition
    ? []
    : checkBunnyCollision(useCharacter, direction, bypassBunnyCollisionUpdate);
  const collisions = _union(sceneryCollisions, foodCollisions, bunnyCollisions);
  return getCollisionItems(collisions);
}

export function getCollisionMaxValue(currentPosition, direction, character, collisions) {
  if (!direction || !collisions.length) {
    return false;
  }

  const axis = getAxisFromDirection(direction);
  let maxValue = currentPosition[axis];

  const useCharacter = getCharacterWithNextPosition(
    character,
    currentPosition.x,
    currentPosition.y,
  );
  const bunnyRect = getElementRect(useCharacter);
  let maxDirectionValue;

  _forEach(collisions, (entity) => {
    const entityRect = getElementRect(entity);

    // Check if collision is in the path of the direction we're actively going
    if (isMovingOnYAxis(direction)) {
      if (entityRect.x < bunnyRect.right && entityRect.right > bunnyRect.x) {
        if (direction === 'up') {
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
    } else if (entityRect.y < bunnyRect.bottom && entityRect.bottom > bunnyRect.y) {
      if (direction === 'left') {
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
  });

  if (maxDirectionValue) {
    if (isBackwardsDirection(direction)) {
      maxValue = Math.max(maxValue, maxDirectionValue);
    } else {
      maxValue = Math.min(maxValue, maxDirectionValue);
    }
  }

  return maxValue;
}

export function updateBunnyGoingToTile(bunnyId, onGroupTile) {
  const bunniesCursor = tree.select('bunnies');
  const bunnies = bunniesCursor.get();
  const bunnyIndex = _findIndex(bunnies, bunny => bunny.id === bunnyId);

  // If they're already on the tile, set value to false
  const goingToTile = onGroupTile ? !onGroupTile : !bunniesCursor.get([bunnyIndex, 'goingToTile']);

  bunniesCursor.set([bunnyIndex, 'goingToTile'], goingToTile);
}

export function takeBunnyToGroupTile(character, onGroupTile) {
  const { id, groupTile, groupPosition } = character.props;
  updateBunnyTile(id, groupTile);
  updateCharacterPosition(id, groupPosition);
  updateBunnyGoingToTile(id, onGroupTile);
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
 * Handle forward movements, ie moving down or right
 *
 * @param  {object} character - The character entity to move
 * @param  {string} axis - The axis the character is moving on, ex: 'x' or 'y'
 * @param  {int} currentX - Character's current X position
 * @param  {int} currentY - Character's current Y position
 * @param  {string} direction - The direction the character is moving, ex: 'down'
 * @param  {bool} moveDiagonally - If the character is moving diagonally
 * @param  {bool} goToTargetPosition - If the character is moving towards a target position
 *
 * @return {object} - Returns the value to move, and also potentially if the
 *                    tile needs to be changed
 */
export function moveEntityForward(
  character,
  axis,
  currentX,
  currentY,
  direction,
  moveDiagonally,
  goToTargetPosition,
) {
  const tile = tree.get('tile');
  const movePixels = tree.get('movePixels');

  const { isHero } = character;
  const isOnXAxis = isXAxis(axis);
  const minLimit = isOnXAxis ? getMinBoardXLimit() : getMinBoardYLimit();
  const maxLimit = isOnXAxis ? getMaxBoardXLimit() : getMaxBoardYLimit();
  const checkTile = tile[isOnXAxis ? 'y' : 'x'];
  const currentValue = isOnXAxis ? currentX : currentY;
  const diagonalPercentage = getSquareDiagonalPercentage(movePixels);
  const value = Math.ceil(currentValue + (movePixels * (moveDiagonally ? diagonalPercentage : 1)));
  const maxTile = isOnXAxis ? 'MAX_Y_TILES' : 'MAX_X_TILES';
  const useX = isOnXAxis ? value : currentX;
  const useY = isOnXAxis ? currentY : value;

  // Character is going beyond the board bounds
  if (value > maxLimit) {
    if (isHero && checkTile < mapConstants[maxTile]) {
      goToNextTile(axis);
      // Set player coordinates to start of next tile
      return {
        value: minLimit,
        changeTile: true,
        collisions: [],
      };
    } if (!isHero) {
      const goingToGroupTile = character.state.goToGroupTile;
      const collisions = goingToGroupTile ? [] : getEntityCollisions(
        character,
        useX,
        useY,
        direction,
        goToTargetPosition,
      );
      if (character.state.goToGroupTile) {
        // Take AI to next tile and set their position on the new tile
        takeBunnyToGroupTile(character);
      }

      // Return the current value so the bunny doesn't continue moving
      // This will also prevent it overriding the new group location being set
      // in the takeBunnyToGroupTile method
      return {
        value: currentValue,
        collisions,
      };
    }
  }

  const collisions = getEntityCollisions(character, useX, useY, direction, goToTargetPosition);
  const maxCollisionValue = getCollisionMaxValue(
    { x: useX, y: useY },
    direction,
    character,
    collisions,
  );
  let minValue = _min([maxLimit, value]);

  if (maxCollisionValue) {
    minValue = _min([minValue, maxCollisionValue]);
  }

  if (goToTargetPosition) {
    minValue = _min([minValue, goToTargetPosition[axis]]);
  }

  return {
    value: minValue,
    collisions,
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
export function moveEntityBack(
  character,
  axis,
  currentX,
  currentY,
  direction,
  moveDiagonally,
  goToTargetPosition,
) {
  const { height: boardHeight, width: boardWidth } = tree.get('boardDimensions');
  const tile = tree.get('tile');
  const movePixels = tree.get('movePixels');

  const { isHero } = character;
  const isOnXAxis = isXAxis(axis);
  const bunnyRect = findDOMNode(character).getBoundingClientRect();
  const minLimit = 0 - ((isOnXAxis ? bunnyRect.width : bunnyRect.height) / 2);
  const maxLimit = isOnXAxis
    ? boardWidth - (bunnyRect.width / 2)
    : boardHeight - (bunnyRect.height / 2);
  const checkTile = tile[isOnXAxis ? 'y' : 'x'];
  const currentValue = isOnXAxis ? currentX : currentY;
  const diagonalPercentage = getSquareDiagonalPercentage(movePixels);
  const value = Math.ceil(currentValue - (movePixels * (moveDiagonally ? diagonalPercentage : 1)));
  const minTile = isOnXAxis ? 'MIN_Y_TILES' : 'MIN_X_TILES';

  // Character is going beyond the board bounds
  if (value < minLimit) {
    if (isHero && checkTile > mapConstants[minTile]) {
      goToPreviousTile(axis);
      // Set player coordinates to end of previous tile
      return {
        value: maxLimit,
        changeTile: true,
        collisions: [],
      };
    } if (!isHero) {
      // Take AI to next tile and set their position on the new tile
      takeBunnyToGroupTile(character);

      // Return the current value so the bunny doesn't continue moving
      // This will also prevent it overriding the new group location being set
      // in the takeBunnyToGroupTile method
      return {
        value: currentValue,
        collisions: [],
      };
    }
  }

  const useX = isOnXAxis ? value : currentX;
  const useY = isOnXAxis ? currentY : value;
  const collisions = getEntityCollisions(character, useX, useY, direction, goToTargetPosition);
  const minCollisionValue = getCollisionMaxValue(
    { x: useX, y: useY },
    direction,
    character,
    collisions,
  );
  let maxValue = _max([minLimit, value]);

  if (minCollisionValue) {
    maxValue = _max([maxValue, minCollisionValue]);
  }

  if (goToTargetPosition) {
    maxValue = _max([maxValue, goToTargetPosition[axis]]);
  }

  return {
    value: maxValue,
    collisions,
  };
}

export function removeBunnyCollisionWithHero(bunnyId) {
  const heroCollisions = tree.select('heroCollisions');
  const bunnyIndex = heroCollisions.get().indexOf(bunnyId);

  if (bunnyIndex > -1) {
    heroCollisions.splice([bunnyIndex, 1]);
  }
}

/**
 * Toggles whether the game is currently visible.
 * This is determined based on whether the browser tab is active.
 */
export function toggleGameVisibility() {
  const cursor = tree.select('gameVisible');
  cursor.set(document.hidden);
}

export function buildTileBorders(exits, SceneryItem) {
  const left = [];
  const right = [];
  const top = [];
  const bottom = [];

  for (let i = 0; i < 600; i += 40) {
    if (!exits.left || i < exits.left.start || i >= exits.left.end) {
      left.push(new SceneryItem({ position: { x: 0, y: i } }));
    }
  }

  for (let i = 0; i < 560; i += 40) {
    if (!exits.right || i < exits.right.start || i >= exits.right.end) {
      right.push(new SceneryItem({ position: { x: 1160, y: i } }));
    }
  }

  for (let i = 0; i < 1160; i += 40) {
    if (!exits.top || i < exits.top.start || i >= exits.top.end) {
      top.push(new SceneryItem({ position: { x: i, y: 0 } }));
    }
  }

  for (let i = 40; i < 1200; i += 40) {
    if (!exits.bottom || i < exits.bottom.start || i >= exits.bottom.end) {
      bottom.push(new SceneryItem({ position: { x: i, y: 560 } }));
    }
  }

  return { left, right, top, bottom };
}
