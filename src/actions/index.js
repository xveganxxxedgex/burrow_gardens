import tree from 'state';
import _capitalize from 'lodash/capitalize';
import _findIndex from 'lodash/findIndex';
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

export function setPopover(popoverObj, duration = 3000) {
  const cursor = tree.select('popover');
  cursor.set(popoverObj);
  tree.commit();

  if (popoverObj) {
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

  // Repopulate item after a timeout
  setTimeout(() => {
    tree.select(['tiles', `${activeTile.x}_${activeTile.y}`, type, itemIndex, 'collected']).set(false);
  }, 5000);
}

export function getSceneryItem(type) {
  return SceneryItems[type];
}

export function toggleShowInventory() {
  const cursor = tree.select('showInventory');
  cursor.set(!cursor.get());
}

export function checkCollision(character, x, y, direction, type) {
  const tile = tree.get('tile');
  const boardDimensions = tree.get('boardDimensions');
  const { left: boardX, top: boardY } = boardDimensions;

  const bunnyRect = findDOMNode(character).getBoundingClientRect();
  const bunnyLeft = x + boardX;
  const bunnyRight = bunnyLeft + bunnyRect.width;
  const bunnyTop = y + boardY;
  const bunnyBottom = bunnyTop + bunnyRect.height;
  const uncollectedItems = tile[type].filter(item => !item.collected);
  let maxValue = direction && (['up', 'down'].indexOf(direction) > -1 ? y : x);

  for (let t = 0; t < uncollectedItems.length; t++) {
    const elementId = uncollectedItems[t].id;
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
      if (type == 'food' && !direction) {
        collectItem('food', elementId);
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

export function checkFoodCollision(character, x, y, direction) {
  return checkCollision(character, x, y, direction, 'food');
}

export function checkSceneryCollision(character, x, y, direction) {
  return checkCollision(character, x, y, direction, 'scenery');
}
