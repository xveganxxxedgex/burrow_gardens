import tree from 'state';
import _capitalize from 'lodash/capitalize';

import * as Tiles from 'Maps';
import * as FoodItems from 'components/Food';
import * as Backgrounds from 'components/Backgrounds';

let tooltipTimeout;

export function updateHeroPosition(newPos) {
  const cursor = tree.select('heroPosition');
  cursor.set(newPos);
}

export function setTooltip(text, duration = 3000) {
  const cursor = tree.select('tooltip');
  cursor.set(text);
  tree.commit();

  if (text) {
    tooltipTimeout = setTimeout(() => {
      setTooltip(null);
    }, duration);
  } else {
    clearTimeout(tooltipTimeout);
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

export function collectBuriedCarrot() {
  console.log('collectBuriedCarrot');
}
