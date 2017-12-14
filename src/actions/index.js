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
  const bunnies = tree.get('bunnies');
  const bunnyIndex = _findIndex(bunnies, bunny => bunny.id == bunnyId);
  const cursor = tree.select(['bunnies', bunnyIndex, 'position']);
  cursor.set(newPos);
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

  const collectedObj = bunniesCursor.get(bunnyIndex);

  // Do nothing if hero has already collected this bunny
  if (collectedObj.hasCollected) {
    return;
  }

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
          </div>
        }
      </div>
    ),
    popoverClass: 'info'
  }, 10000);

  // TODO: Make bunny go to the group area
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
function getElementRect(element) {
  return {
    x: element.x || (element.position && element.position.x),
    y: element.y || (element.position && element.position.y),
    height: element.height || element.props.height,
    width: element.width || element.props.width
  };
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
  const element1Rect = getElementRect(element1, isMoving);
  const element2Rect = getElementRect(element2);
  const element2Right = element2Rect.x + element2Rect.width;
  const element1Right = element1Rect.x + element1Rect.width;
  const element2Bottom = element2Rect.y + element2Rect.height;
  const element1Bottom = element1Rect.height + element1Rect.y;

  const elementHittingLeft = isMoving ? element1Rect.x < element2Right : element1Rect.x <= element2Right;
  const elementHittingRight = isMoving ? element1Right > element2Rect.x : element1Right >= element2Rect.x;
  const elementHittingTop = isMoving ? element1Rect.y < element2Bottom : element1Rect.y <= element2Bottom;
  const elementHittingBottom = isMoving ? element1Bottom > element2Rect.y : element1Bottom >= element2Rect.y;

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
export function checkCollisions(character, x, y, direction, type) {
  const isHero = character.isHero;
  const tile = tree.get('tile');
  const movePixels = tree.get('movePixels');
  const heroCursor = tree.get('hero');
  // When checking collisions for hero, compare against other AI bunnies on the tile
  // Otherwise, when checking AI collisions, ensure they're not colliding with hero
  // or any other AIs
  const bunniesOnTile = _filter(tree.get('bunniesOnTile'), bunny => {
    return bunny.id != character.props.id;
  });

  if (!isHero) {
    bunniesOnTile.push({
      id: 'Hero',
      position: heroCursor.position,
      height: heroCursor.height,
      width: heroCursor.width
    });
  }

  let loopItems = type == 'bunny' ? bunniesOnTile : tile[type].filter(item => !item.collected);
  let maxValue = direction && (['up', 'down'].indexOf(direction) > -1 ? y : x);

  for (let t = 0; t < loopItems.length; t++) {
    const isColliding = checkElementCollision(character, loopItems[t], direction);

    if (isHero) {
      handleHeroItemCollision(direction, type, loopItems[t], isColliding);
    }

    if (isColliding) {
      if (direction) {
        const bunnyRect = getElementRect(character);
        const collidingElementRect = getElementRect(loopItems[t]);

        switch(direction) {
          case 'up':
            maxValue = Math.max(maxValue, (collidingElementRect.y + collidingElementRect.height));
            break;
          case 'down':
            maxValue = Math.min(maxValue, (collidingElementRect.y - bunnyRect.height));
            break;
          case 'left':
            maxValue = Math.max(maxValue, (collidingElementRect.x + collidingElementRect.width));
            break;
          case 'right':
            maxValue = Math.min(maxValue, (collidingElementRect.x - bunnyRect.width));
            break;
        }
      }
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

/**
 * Handles action when collision changes between hero and another entity
 *
 * @param  {Boolean} isMoving - If the hero is currently moving
 * @param  {string}  type - The type of the potentially colliding element
 * @param  {object}  item - The item object that the hero is potentially colliding with
 * @param  {Boolean} isColliding - If the hero is colliding with the item
 */
export function handleHeroItemCollision(isMoving, type, item, isColliding) {
  const heroCollisions = tree.select('heroCollisions');

  if (isColliding) {
    // If we're not moving, a space action is happening
    if (!isMoving) {
      if (type == 'food') {
        collectItem('food', item.id);
      } else if (type == 'bunny') {
        collectBunny(item.id);
      } else if (type == 'scenery' && item.takeToTile) {
        handleBurrowAction(item);
      }
    } else {
      // Save to state who we're colliding with
      if (type == 'bunny') {
        if (heroCollisions.get().indexOf(item.id) == -1) {
          heroCollisions.push(item.id);
        }
      }
    }
  } else {
    if (type == 'bunny') {
      // If no longer colliding with a bunny, remove them from the collisions list
      if (heroCollisions.get().indexOf(item.id) > -1) {
        heroCollisions.splice([heroCollisions.get().indexOf(item.id), 1]);
      }
    }
  }
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
export function moveEntityForward(character, axis, currentX, currentY, direction) {
  const { height: boardHeight, width: boardWidth } = tree.get('boardDimensions');
  const tile = tree.get('tile');
  const movePixels = tree.get('movePixels');

  const isHero = character.isHero;
  const isXAxis = axis == 'x';
  const minLimit = isXAxis ? getMinBoardXLimit() : getMinBoardYLimit();
  const maxLimit = isXAxis ? getMaxBoardXLimit() : getMaxBoardYLimit();
  const checkTile = tile[isXAxis ? 'y' : 'x'];
  let value = (isXAxis ? currentX : currentY) + movePixels;

  if (isHero && value > maxLimit && checkTile < 2) {
    goToNextTile(axis);
    //Set player coordinate to start of next tile
    return {
      value: minLimit,
      changeTile: true
    };
  }

  const useX = isXAxis ? value : currentX;
  const useY = isXAxis ? currentY : value;

  // Ensure new position isn't colliding with any entities
  const sceneryLimit = checkSceneryCollision(character, useX, useY, direction);
  const foodLimit = checkFoodCollision(character, useX, useY, direction);
  const bunnyLimit = checkBunnyCollision(character, useX, useY, direction);

  return {
    value: _min([maxLimit, value, sceneryLimit, foodLimit, bunnyLimit])
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
export function moveEntityBack(character, axis, currentX, currentY, direction) {
  const { height: boardHeight, width: boardWidth } = tree.get('boardDimensions');
  const tile = tree.get('tile');
  const movePixels = tree.get('movePixels');

  const isHero = character.isHero;
  const isXAxis = axis == 'x';
  const bunnyRect = findDOMNode(character).getBoundingClientRect();
  const minLimit = 0 - ((isXAxis ? bunnyRect.width : bunnyRect.height) / 2);
  const maxLimit = isXAxis ? boardWidth - (bunnyRect.width / 2) : boardHeight - (bunnyRect.height / 2);
  const checkTile = tile[isXAxis ? 'y' : 'x'];
  let value = (isXAxis ? currentX : currentY) - movePixels;

  if (isHero && value < minLimit && checkTile > 1) {
    goToPreviousTile(axis);
    //Set player coordinate to end of previous tile
    return {
      value: maxLimit,
      changeTile: true
    };
  }

  const useX = isXAxis ? value : currentX;
  const useY = isXAxis ? currentY : value;

  // Ensure new position isn't colliding with any entities
  const sceneryLimit = checkSceneryCollision(character, useX, useY, direction);
  const foodLimit = checkFoodCollision(character, useX, useY, direction);
  const bunnyLimit = checkBunnyCollision(character, useX, useY, direction);

  return {
    value: _max([minLimit, value, sceneryLimit, foodLimit, bunnyLimit])
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
export function checkFoodCollision(character, x, y, direction) {
  const useCharacter = getCharacterWithNextPosition(character, x, y);
  return checkCollisions(useCharacter, x, y, direction, 'food');
}

/**
 * Check if character is collidiing with any scenery items
 *
 * @param  {object} character - The character entity that is moving
 * @param  {int} x - The character's current X position
 * @param  {int} y - The character's current Y position
 * @param  {string} direction - The direction the character is moving, ex: 'up'
 *
 * @return {int} - The max possible value based on the direction the character
 *                 is moving.
 *                 If character is colliding with a scenery item, this max value
 *                 will be whatever that collision point is.
 */
export function checkSceneryCollision(character, x, y, direction) {
  const useCharacter = getCharacterWithNextPosition(character, x, y);
  return checkCollisions(useCharacter, x, y, direction, 'scenery');
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
export function checkBunnyCollision(character, x, y, direction) {
  const useCharacter = getCharacterWithNextPosition(character, x, y);
  return checkCollisions(useCharacter, x, y, direction, 'bunny');
}

/**
 * Toggles whether the game is currently visible.
 * This is determined based on whether the browser tab is active.
 */
export function toggleGameVisibility() {
  const cursor = tree.select('gameVisible');
  cursor.set(document.hidden);
}
