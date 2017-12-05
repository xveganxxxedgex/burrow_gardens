import React from 'react';
import tree from 'state';
import _capitalize from 'lodash/capitalize';
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
  const collectedFoodCursor = tree.select('collectedFood');
  const foodIndex = _findIndex(collectedFoodCursor.get(), foodItem => foodItem.name == (item.display || item.type));
  tree.select(['tiles', `${activeTile.x}_${activeTile.y}`, type, itemIndex, 'collected']).set(true);

  const collectedObj = collectedFoodCursor.get(foodIndex);
  const itemDisplay = collectedObj.display;

  // If we're collecting this type of item for the first time, set the hasCollected flag to true
  if (!collectedObj.hasCollected) {
    collectedFoodCursor.set([foodIndex, 'hasCollected'], true);
  }

  collectedFoodCursor.set([foodIndex, 'count'], collectedObj.count + 1);

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
export function toggleShowInventory() {
  const cursor = tree.select('showInventory');
  cursor.set(!cursor.get());
}

/**
 * Sets the last direction the hero was moving to the state
 */
export function setHeroLastDirection(direction) {
  const cursor = tree.select('hero', 'lastDirection');
  cursor.set(direction);
}

export function getOppositeDirection(direction) {
  let oppositeDirection;

  switch(direction) {
    case 'up':
      oppositeDirection = 'down';
      break;
    case 'down':
      oppositeDirection = 'up';
      break;
    case 'left':
      oppositeDirection = 'right';
      break;
    default:
      oppositeDirection = 'left';
  }

  return oppositeDirection;
}

/**
 * Checks collision between two element bounding rect dimensions relative to
 * the board
 *
 * @param  {object}  element1Rect - First element to use in check
 * @param  {object}  element2Rect - Second element to use in check
 * @param  {Boolean} isMoving - If element1 is currently moving
 *
 * @return {Boolean} - If the two elements are colliding
 */
export function checkElementCollision(element1Rect, element2Rect, isMoving) {
  const element2Bottom = element2Rect.top + element2Rect.height;
  const element2Right = element2Rect.left + element2Rect.width;
  const hitElement1Right = isMoving ? element1Rect.right > element2Rect.left : element1Rect.right >= element2Rect.left;
  const hitElement1Bottom = isMoving ? element1Rect.bottom > element2Rect.top : element1Rect.bottom >= element2Rect.top;
  const hitElement1Left = isMoving ? element1Rect.left < element2Right : element1Rect.left <= element2Right;
  const hitElement1Top = isMoving ? element1Rect.top < element2Bottom : element1Rect.top <= element2Bottom;
  const isBetweenY = hitElement1Top && hitElement1Bottom;
  const isBetweenX = hitElement1Left && hitElement1Right;
  const isColliding = isBetweenY && isBetweenX;
  return isColliding;
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
  const heroCollisions = tree.select('heroCollisions');
  // When checking collisions for hero, compare against other AI bunnies on the tile
  // Otherwise, when checking AI collisions, ensure they're not colliding with hero
  const bunniesOnTile = isHero ? tree.get('bunniesOnTile') : [{ id: 'Hero' }];
  const boardDimensions = tree.get('boardDimensions');
  const { left: boardX, top: boardY } = boardDimensions;

  const bunnyRect = findDOMNode(character).getBoundingClientRect();
  const useBunnyRect = {
    top: y + boardY,
    bottom: y + boardY + bunnyRect.height,
    left: x + boardX,
    right: x + boardX + bunnyRect.width
  };
  let loopItems = type == 'bunny' ? bunniesOnTile : tile[type].filter(item => !item.collected);
  let maxValue = direction && (['up', 'down'].indexOf(direction) > -1 ? y : x);

  for (let t = 0; t < loopItems.length; t++) {
    const elementId = loopItems[t].id;
    const checkElement = document.querySelector(`.${type}_index_${elementId || t}`).getBoundingClientRect();
    const isColliding = checkElementCollision(useBunnyRect, checkElement, direction);

    if (isColliding) {
      if (isHero) {
        if (!direction) {
          if (type == 'food') {
            collectItem('food', elementId);
          } else if (type == 'bunny') {
            collectBunny(elementId);
          }
        } else {
          // Save to state who we're colliding with
          if (type == 'bunny') {
            if (heroCollisions.get().indexOf(elementId) == -1) {
              heroCollisions.push(elementId);
            }
          }
        }
      }

      if (direction) {
        switch(direction) {
          case 'up':
            maxValue = Math.max(maxValue, ((checkElement.top + checkElement.height) - boardY));
            break;
          case 'down':
            maxValue = Math.min(maxValue, (checkElement.top - boardY - bunnyRect.height));
            break;
          case 'left':
            maxValue = Math.max(maxValue, ((checkElement.left + checkElement.width) - boardX));
            break;
          case 'right':
            maxValue = Math.min(maxValue, (checkElement.left - boardX - bunnyRect.width));
            break;
        }
      }
    } else if (type == 'bunny') {
      if (heroCollisions.get().indexOf(elementId) > -1) {
        heroCollisions.splice([heroCollisions.get().indexOf(elementId), 1]);
      }
    }
  }

  return maxValue;
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
  const bunnyRect = findDOMNode(character).getBoundingClientRect();
  const minLimit = 0 - ((isXAxis ? bunnyRect.width : bunnyRect.height) / 2);
  const maxLimit = isXAxis ? boardWidth - (bunnyRect.width / 2) : boardHeight - (bunnyRect.height / 2);
  const checkTile = tile[isXAxis ? 'y' : 'x'];
  let value = (isXAxis ? currentX : currentY) + movePixels;

  if (isHero && value > maxLimit && checkTile < 2) {
    const tileX = tile.x + (isXAxis ? 0 : 1);
    const tileY = tile.y + (isXAxis ? 1 : 0);
    // Move to next tile
    setActiveTile(tileX, tileY);
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
    const tileX = tile.x - (isXAxis ? 0 : 1);
    const tileY = tile.y - (isXAxis ? 1 : 0);
    // Move to previous tile
    setActiveTile(tileX, tileY);
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
  return checkCollisions(character, x, y, direction, 'food');
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
  return checkCollisions(character, x, y, direction, 'scenery');
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
  return checkCollisions(character, x, y, direction, 'bunny');
}

/**
 * Toggles whether the game is currently visible.
 * This is determined based on whether the browser tab is active.
 */
export function toggleGameVisibility() {
  const cursor = tree.select('gameVisible');
  cursor.set(document.hidden);
}
