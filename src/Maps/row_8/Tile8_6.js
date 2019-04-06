import * as Food from 'components/Food';
import * as Scenery from 'components/Scenery';
import { buildTileBorders } from 'actions';

const exits = {
  top: { start: 240, end: 1120 },
  bottom: { start: 350, end: 640 },
};

const { left, right, bottom, top } = buildTileBorders(exits, Scenery.Bush);

const foodItems = [
  { type: 'Spinach', position: { x: 850, y: 260 } },
  { type: 'Spinach', position: { x: 900, y: 300 } },
  { type: 'Spinach', position: { x: 875, y: 340 } },
  { type: 'Spinach', position: { x: 925, y: 380 } },
  { type: 'Spinach', position: { x: 900, y: 360 } },
  { type: 'Spinach', position: { x: 800, y: 335 } },
  { type: 'Spinach', position: { x: 855, y: 300 } },
  { type: 'Spinach', position: { x: 150, y: 130 } },
  { type: 'Spinach', position: { x: 120, y: 150 } },
  { type: 'Spinach', position: { x: 140, y: 160 } },
  { type: 'Spinach', position: { x: 180, y: 180 } },
  { type: 'Spinach', position: { x: 160, y: 200 } },
  { type: 'Spinach', position: { x: 130, y: 170 } },
  { type: 'Spinach', position: { x: 160, y: 175 } },
  { type: 'Spinach', position: { x: 170, y: 140 } },
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
  x: 8,
  y: 6,
  exits,
};

export default Tile;
