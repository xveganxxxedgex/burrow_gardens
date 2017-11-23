import React from 'react';
import tree from 'state';
import _capitalize from 'lodash/capitalize';
import _find from 'lodash/find';
import _findIndex from 'lodash/findIndex';
import _max from 'lodash/max';
import _min from 'lodash/min';
import { findDOMNode } from 'react-dom';

import * as Tiles from 'Maps';
import * as FoodItems from 'components/Food';
import * as Characters from 'components/Characters';
import * as Backgrounds from 'components/Backgrounds';
import * as SceneryItems from 'components/Scenery';

let popoverTimeout;

export function updateHeroPosition(newPos) {
  const cursor = tree.select(['hero', 'position']);
  cursor.set(newPos);
}

export function updateCharacterPosition(bunnyId, newPos) {
  const bunnies = tree.get('bunnies');
  const bunnyIndex = _findIndex(bunnies, bunny => bunny.id == bunnyId);
  const cursor = tree.select(['bunnies', bunnyIndex, 'position']);
  cursor.set(newPos);
}

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

export function setBoardDimensions(board) {
  const boardRect = board.getBoundingClientRect();
  const newDimensions = assignDimensionProperties(boardRect);

  const cursor = tree.select('boardDimensions');
  cursor.set(newDimensions);
}

export function setActiveTile(x = 1, y = 1) {
  const cursor = tree.select('activeTile');
  cursor.set({ x, y });
  tree.commit();
}

export function getFoodItem(type) {
  return FoodItems[type];
}

export function getCharacter(name) {
  return Characters[name];
}

export function getBackgroundCell(cell) {
  const backgrounds = tree.get('backgrounds');
  const type = backgrounds[cell];
  return Backgrounds[type];
}

export function collectItem(type, itemId) {
  const items = tree.get(['tile', type]);
  const heroAbilities = tree.get(['hero', 'abilities']);
  const itemIndex = _findIndex(items, item => item.id == itemId);

  if (items[itemIndex].needsAbility && heroAbilities.indexOf(items[itemIndex].needsAbility) == -1) {
    setPopover({
      title: 'Skill Needed',
      text: `You must learn a new skill to collect this item.`,
      popoverClass: 'info'
    });
    return;
  }

  const item = items[itemIndex];
  const itemDisplay = item.display || item.type;
  const activeTile = tree.get('tile');
  const collectedFoodCursor = tree.select('collectedFood');
  const foodIndex = _findIndex(collectedFoodCursor.get(), foodItem => foodItem.name == itemDisplay);
  tree.select(['tiles', `${activeTile.x}_${activeTile.y}`, type, itemIndex, 'collected']).set(true);

  const collectedObj = collectedFoodCursor.get(foodIndex);
  if (!collectedObj.hasCollected) {
    collectedFoodCursor.set([foodIndex, 'hasCollected'], true);
  }

  collectedFoodCursor.set([foodIndex, 'count'], collectedObj.count + 1);

  setPopover({
    title: 'Item Added',
    text: `You picked up: ${itemDisplay}`,
    popoverClass: 'info'
  });

  const repopulateTimeout = 3 * 60 * 1000;

  // Repopulate item after a timeout
  setTimeout(() => {
    tree.select(['tiles', `${activeTile.x}_${activeTile.y}`, type, itemIndex, 'collected']).set(false);
  }, repopulateTimeout);
}

export function collectBunny(bunnyId) {
  const bunniesCursor = tree.select('bunnies');
  const bunnies = bunniesCursor.get();
  const heroAbilities = tree.get(['hero', 'abilities']);
  const bunnyIndex = _findIndex(bunnies, bunny => bunny.id == bunnyId);

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

  // Make bunny go to the group area
}

export function getSceneryItem(type) {
  return SceneryItems[type];
}

export function toggleShowInventory() {
  const cursor = tree.select('showInventory');
  cursor.set(!cursor.get());
}

export function checkCollision(character, x, y, direction, type) {
  const isHero = character.isHero;
  const tile = tree.get('tile');
  // When checking collisions for hero, compare against other AI bunnies on the tile
  // Otherwise, when checking AI collisions, ensure they're not colliding with hero
  const bunniesOnTile = isHero ? tree.get('bunniesOnTile') : [{ id: 'Hero' }];
  const boardDimensions = tree.get('boardDimensions');
  const { left: boardX, top: boardY } = boardDimensions;

  const bunnyRect = findDOMNode(character).getBoundingClientRect();
  const bunnyLeft = x + boardX;
  const bunnyRight = bunnyLeft + bunnyRect.width;
  const bunnyTop = y + boardY;
  const bunnyBottom = bunnyTop + bunnyRect.height;
  let loopItems = type == 'bunny' ? bunniesOnTile : tile[type].filter(item => !item.collected);

  let maxValue = direction && (['up', 'down'].indexOf(direction) > -1 ? y : x);

  for (let t = 0; t < loopItems.length; t++) {
    const elementId = loopItems[t].id;
    const checkElement = document.querySelector(`.${type}_index_${elementId || t}`).getBoundingClientRect();
    const elementBottom = checkElement.top + checkElement.height;
    const elementRight = checkElement.left + checkElement.width;
    const hitBunnyRight = direction ? bunnyRight > checkElement.left : bunnyRight >= checkElement.left;
    const hitBunnyBottom = direction ? bunnyBottom > checkElement.top : bunnyBottom >= checkElement.top;
    const hitBunnyLeft = direction ? bunnyLeft < elementRight : bunnyLeft <= elementRight;
    const hitBunnyTop = direction ? bunnyTop < elementBottom : bunnyTop <= elementBottom;
    const isBetweenY = hitBunnyTop && hitBunnyBottom;
    const isBetweenX = hitBunnyLeft && hitBunnyRight;
    const isColliding = isBetweenY && isBetweenX;

    if (isColliding) {
      if (isHero) {
        if (type == 'food' && !direction) {
          collectItem('food', elementId);
        } else if (type == 'bunny' && !direction) {
          collectBunny(elementId);
        }
      }

      if (direction) {
        switch(direction) {
          case 'up':
            maxValue = Math.max(maxValue, (elementBottom - boardY));
            break;
          case 'down':
            maxValue = Math.min(maxValue, (checkElement.top - boardY - bunnyRect.height));
            break;
          case 'left':
            maxValue = Math.max(maxValue, (elementRight - boardX));
            break;
          case 'right':
            maxValue = Math.min(maxValue, (checkElement.left - boardX - bunnyRect.width));
            break;
        }
      }
    }
  }

  return maxValue;
}

// Handle forward movements, ie moving down or right
export function moveEntityForward(character, moving, axis, newX, newY, direction) {
  const { height: boardHeight, width: boardWidth } = tree.get('boardDimensions');
  const tile = tree.get('tile');
  const movePixels = tree.get('movePixels');

  const isHero = character.isHero;
  const isXAxis = axis == 'x';
  const bunnyRect = findDOMNode(character).getBoundingClientRect();
  const minLimit = 0 - ((isXAxis ? bunnyRect.width : bunnyRect.height) / 2);
  const maxLimit = isXAxis ? boardWidth - (bunnyRect.width / 2) : boardHeight - (bunnyRect.height / 2);
  const checkTile = tile[isXAxis ? 'y' : 'x'];
  let value = (isXAxis ? newX : newY) + movePixels;

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

  const useX = isXAxis ? value : newX;
  const useY = isXAxis ? newY : value;

  // Ensure new position isn't colliding with any entities
  const sceneryLimit = checkSceneryCollision(character, useX, useY, direction);
  const foodLimit = checkFoodCollision(character, useX, useY, direction);
  const bunnyLimit = checkBunnyCollision(character, useX, useY, direction);

  return {
    value: _min([maxLimit, value, sceneryLimit, foodLimit, bunnyLimit])
  };
}

// Handle forward movements, ie moving up or left
export function moveEntityBack(character, moving, axis, newX, newY, direction) {
  const { height: boardHeight, width: boardWidth } = tree.get('boardDimensions');
  const tile = tree.get('tile');
  const movePixels = tree.get('movePixels');

  const isHero = character.isHero;
  const isXAxis = axis == 'x';
  const bunnyRect = findDOMNode(character).getBoundingClientRect();
  const minLimit = 0 - ((isXAxis ? bunnyRect.width : bunnyRect.height) / 2);
  const maxLimit = isXAxis ? boardWidth - (bunnyRect.width / 2) : boardHeight - (bunnyRect.height / 2);
  const checkTile = tile[isXAxis ? 'y' : 'x'];
  let value = (isXAxis ? newX : newY) - movePixels;

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

  const useX = isXAxis ? value : newX;
  const useY = isXAxis ? newY : value;

  // Ensure new position isn't colliding with any entities
  const sceneryLimit = checkSceneryCollision(character, useX, useY, direction);
  const foodLimit = checkFoodCollision(character, useX, useY, direction);
  const bunnyLimit = checkBunnyCollision(character, useX, useY, direction);

  return {
    value: _max([minLimit, value, sceneryLimit, foodLimit, bunnyLimit])
  };
}

export function checkFoodCollision(character, x, y, direction) {
  return checkCollision(character, x, y, direction, 'food');
}

export function checkSceneryCollision(character, x, y, direction) {
  return checkCollision(character, x, y, direction, 'scenery');
}

export function checkBunnyCollision(character, x, y, direction) {
  return checkCollision(character, x, y, direction, 'bunny');
}

export function toggleGameVisibility() {
  const cursor = tree.select('gameVisible');
  cursor.set(document.hidden);
}
