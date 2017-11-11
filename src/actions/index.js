import tree from 'state';
import _capitalize from 'lodash/capitalize';
import _findIndex from 'lodash/findIndex';

import * as Tiles from 'Maps';
import * as FoodItems from 'components/Food';
import * as Backgrounds from 'components/Backgrounds';

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
  const tile = Tiles[`Tile${x}_${y}`];
  const cursor = tree.select('tile');
  cursor.set(tile);
  tree.commit();
}

export function getFoodItem(type) {
  return FoodItems[type];
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

  const itemDisplay = items[itemIndex].display || items[itemIndex].type;
  tree.select(['tile', type, itemIndex, 'collected']).set(true);
  setPopover({
    title: 'Item Added',
    text: `You picked up: ${itemDisplay}`,
    popoverClass: 'info'
  });
}
