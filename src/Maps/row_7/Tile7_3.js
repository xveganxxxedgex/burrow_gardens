import * as Food from 'components/Food';
import * as Scenery from 'components/Scenery';
import { buildTileBorders } from 'actions';

const exits = {
  left: { start: 200, end: 400 },
  top: { start: 640, end: 760 },
};

const { left, right, bottom, top } = buildTileBorders(exits, Scenery.Bush);

const foodItems = [
  { type: 'Parsley', position: { x: 540, y: 390 } },
];

const Tile = {
  background: [
    ['B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1'],
    ['B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1'],
    ['B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1'],
    ['B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1'],
    ['B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1'],
    ['B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1'],
    ['B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1'],
    ['B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1'],
    ['B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1'],
    ['B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1'],
    ['B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1'],
    ['B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1'],
    ['B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1'],
    ['B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1'],
    ['B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1'],
  ],
  scenery: [
    ...left,
    ...right,
    ...top,
    ...bottom,
  ],
  food: foodItems.map((item, index) => (
    new Food[item.type]({
      ...item,
      position: item.position,
      id: item.id || index + 1,
    })
  )),
  x: 7,
  y: 3,
  exits,
};

export default Tile;
