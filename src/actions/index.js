import React from 'react';
import tree from 'state';
import _capitalize from 'lodash/capitalize';
import _filter from 'lodash/filter';
import _find from 'lodash/find';
import _findIndex from 'lodash/findIndex';
import _forEach from 'lodash/forEach';
import _isEqual from 'lodash/isEqual';
import _max from 'lodash/max';
import _min from 'lodash/min';
import _minBy from 'lodash/minBy';
import _union from 'lodash/union';
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
 * @return {bool|string} - The direction of the exit, or false if already on the target tile
 */
export function findTileExit(targetTile) {
  const tile = tree.get('tile');

  if (tile.x === targetTile.x && tile.y === targetTile.y) {
    return false;
  }

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
      const axisValue = isBackwardDimension ? -characterRect[offsetDimension] : (isXAxis(axis) ? boardWidth : boardHeight);

      if (characterRect[oppositeAxis] >= sideExit.start && characterRect[oppositeAxis] <= sideExit.end) {
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
 * Returns all collision entities on a tile
 *
 * @param  {boolean} filterCollected - If only uncollected entities should be returned
 *
 * @return {array} - The collision entities
 */
export function getCollisionEntities(filterCollected) {
  const tile = tree.get('tile');
  const sceneryEntities = _filter(tile.scenery, entity => {
    // Remove burrow entities
    const isBurrow = entity.type == SceneryConstants.BURROW_TYPE;
    return !isBurrow;
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
export function getTargetDirection(currentPosition, targetPosition, lastDirection) {
  const { x, y } = currentPosition;

  // Go the direction the most far away
  const xDifference = targetPosition.x - x;
  const yDifference = targetPosition.y - y;
  const moveOnAxis = Math.abs(xDifference) > Math.abs(yDifference) ? 'x' : 'y';
  const axisDirections = {
    x: getDirectionForAxis('x', currentPosition, targetPosition),
    y: getDirectionForAxis('y', currentPosition, targetPosition)
  };
  let direction = axisDirections[moveOnAxis];

  if (direction == lastDirection) {
    direction = axisDirections[getOppositeAxis(moveOnAxis)];
  }

  return direction;
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
  const atTargetCoordinate = isMovingBack ? currentPosition[axis] <= targetPosition[axis] : currentPosition[axis] >= targetPosition[axis];
  return atTargetCoordinate;
}

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
    bottom: { x: position.x, y: forwardY, height, width } // bottom
  };

  return neighbours;
}

export function isAtExitPosition(pos, exitPosition, characterRect) {
  const boardDimensions = tree.get('boardDimensions');

  if (exitPosition.x === -characterRect.width) { // left
    return pos.x <= exitPosition.x;
  } else if (exitPosition.x === boardDimensions.width) { // right
    return pos.x >= exitPosition.x;
  } else if (exitPosition.y === -characterRect.height) { // top
    return pos.y <= exitPosition.y;
  } else if (exitPosition.y === boardDimensions.height) { // bottom
    return pos.y >= exitPosition.y;
  }

  return pos.x === exitPosition.x && pos.y === exitPosition.y;
}

export function getCharacterCollisions(character) {
  const characterRect = getElementRect(character);
  const collisions = getCollisionEntities(true);
  return checkCollisions(characterRect, collisions);
}

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
    sortKey: 0
  };
  const positionCosts = {
    [`${characterRect.x}_${characterRect.y}`]: 0
  };
  const queue = [location];
  let visitOrder = queue.length;

  while (queue.length) {
    queue.sort((a, b) => a.sortKey == b.sortKey ? a.visitOrder - b.visitOrder: a.sortKey - b.sortKey);
    const currentLocation = queue.shift();

    if (isAtExitPosition(currentLocation.position, exitPosition, characterRect)) {
      return currentLocation.path;
    }

    const currentPos = `${currentLocation.position.x}_${currentLocation.position.y}`;
    const neighbours = getNeighboursOfPosition(currentLocation.position, heightOffset, widthOffset);

    Object.keys(neighbours).forEach(neighbourSide => {
      const neighbourPos = neighbours[neighbourSide];
      const nextPos = `${neighbourPos.x}_${neighbourPos.y}`;
      const newCost = getStepCost(positionCosts[currentPos], currentLocation.position, exitPosition, neighbourPos);

      if (!positionCosts[nextPos] || newCost < positionCosts[nextPos]) {
        positionCosts[nextPos] = newCost;

        // Neighbour is within map bounds and is not a collision entity
        if (checkIfValidGap(neighbourPos, exitPosition, characterRect)) {
          const isOverlappingEntity = checkCollisions(neighbourPos, collisions, true, true);
          let useNeighbourPos;

          if (!isOverlappingEntity) {
            useNeighbourPos = { x: neighbourPos.x, y: neighbourPos.y };
          } else {
            const collisionRect = getElementRect(isOverlappingEntity);
            const collidingOnYAxis = ['top', 'bottom'].includes(neighbourSide);
            const collisionCharacterXOffset = collisionRect.x - neighbourPos.width;
            const collisionCharacterYOffset = collisionRect.y - neighbourPos.height;
            const collisionXOffset = collisionRect.x < neighbourPos.x ? collisionRect.right : collisionCharacterXOffset;
            const collisionYOffset = collisionRect.y < neighbourPos.y ? collisionRect.bottom : collisionCharacterYOffset;
            const useX = collidingOnYAxis ? collisionXOffset : (neighbourSide == 'right' ? collisionCharacterXOffset : collisionRect.right);
            const useY = !collidingOnYAxis ? collisionYOffset : (neighbourSide == 'bottom' ? collisionCharacterYOffset : collisionRect.bottom);
            const neighbourBorderPosition = { x: useX, y: useY };

            const neighbourBorderPos = `${neighbourBorderPosition.x}_${neighbourBorderPosition.y}`;
            const neighbourBorderCost = getStepCost(positionCosts[currentPos], currentLocation.position, exitPosition, neighbourBorderPosition);

            if (!positionCosts[neighbourBorderPos] || neighbourBorderCost < positionCosts[neighbourBorderPos]) {
              positionCosts[neighbourBorderPos] = neighbourBorderCost;

              // Neighbour is within map bounds
              if (checkIfValidGap(neighbourBorderPosition, exitPosition, characterRect)) {
                const neighbourBorderHasOtherCollision = checkCollisions({
                  ...neighbourBorderPosition,
                  height: neighbourPos.height,
                  width: neighbourPos.width
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
              visitOrder: visitOrder++,
              sortKey: positionCosts[costKey]
            });
          }
        }
      }
    });
  }

  return false;
}

export function getStepCost(currentCost, startPos, endPos, stepPos) {
  return currentCost + heuristic(startPos, stepPos) + heuristic(endPos, stepPos);
}

export function heuristic(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
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
 * @param  {number}  heightOffset - The height offset to use for detecting collision area
 * @param  {number}  widthOffset - The width offset to use for detecting collision area
 * @param  {bool}  excludeEquals - Whether equals comparison check should be excluded
 *                                 Value should be false if equals comparison should be performed
 *
 * @return {Boolean} - If the two elements are colliding
 */
export function checkElementCollision(element1, element2, heightOffset = 0, widthOffset = 0, excludeEquals = false) {
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
 * @param  {string} type - The type of entities to check for collisions, ex: 'food'
 *
 * @return {int} - The max possible value based on the direction the character
 *                 is moving.
 *                 If character is colliding with an item, this max value will
 *                 be whatever that collision point is.
 */
export function checkCollisions(character, items, returnOnCollision, excludeEquals) {
  const collisions = [];

  for (let t = 0; t < items.length; t++) {
    const isColliding = checkElementCollision(character, items[t], null, null, excludeEquals);

    if (isColliding) {
      if (returnOnCollision) {
        return items[t];
      }

      collisions.push(items[t]);
    }
  }

  return returnOnCollision ? false : collisions;
}

export function getEntityCollisions(character, useX, useY, direction, goToTargetPosition, bypassBunnyCollisionUpdate) {
  const useCharacter = getCharacterWithNextPosition(character, useX, useY);
  const sceneryCollisions = checkSceneryCollision(useCharacter, direction);
  const foodCollisions = checkFoodCollision(useCharacter, direction);
  // Don't collide with bunnies when character is going to target position
  const bunnyCollisions = goToTargetPosition ? [] : checkBunnyCollision(useCharacter, direction, bypassBunnyCollisionUpdate);
  const collisions = _union(sceneryCollisions, foodCollisions, bunnyCollisions);
  return collisions;
}

export function isMovingOnYAxis(direction) {
  return ['top', 'bottom', 'up', 'down'].indexOf(direction) > -1;
}

export function getAxisFromDirection(direction) {
  return isMovingOnYAxis(direction) ? 'y' : 'x';
}

export function isBackwardsDirection(direction) {
  return ['top', 'up', 'left'].indexOf(direction) > -1;
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
    if (isBackwardsDirection(direction)) {
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
  updateBunnyGoingToTile(id);
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
 * @param  {bool} moveDiagonally - If the character is moving diagonally
 * @param  {bool} goToTargetPosition - If the character is moving towards a target position
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
  const isHero = character.isHero;
  const heroCollisions = tree.select('heroCollisions');
  // When checking collisions for hero, compare against other AI bunnies on the tile
  // Otherwise, when checking AI collisions, ensure they're not colliding with hero
  // or any other AIs
  const bunniesOnTile = _filter(tree.get('bunniesOnTile'), bunny => {
    return bunny.id != character.props.id &&
      // Only collide with bunnies that have not been collected, or that are already at their group tile
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
      width: heroCursor.width
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

  if (!bypassBunnyCollisionUpdate && !_isEqual(heroCollisions.get(), collisionIds)) {
    heroCollisions.set(collisionIds);
  }

  return collisions;
}

export function removeBunnyCollisionWithHero(bunnyId) {
  const heroCollisions = tree.select('heroCollisions');
  const bunnyIndex = heroCollisions.get().indexOf(bunnyId);

  if (bunnyIndex > -1) {
    heroCollisions.splice([bunnyIndex, 1]);
  }
}

export function updateBunnyGoingToTile(bunnyId) {
  const bunniesCursor = tree.select('bunnies');
  const bunnies = bunniesCursor.get();
  const bunnyIndex = _findIndex(bunnies, bunny => bunny.id == bunnyId);

  bunniesCursor.set([bunnyIndex, 'goingToTile'], !bunniesCursor.get([bunnyIndex, 'goingToTile']));
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
  const collisions = checkCollisions(character, items);

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
