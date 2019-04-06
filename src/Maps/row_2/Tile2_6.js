import * as Food from 'components/Food';
import * as Scenery from 'components/Scenery';
import { buildTileBorders } from 'actions';

const exits = {
  top: { start: 0, end: 1200 },
  bottom: { start: 0, end: 1200 },
  right: { start: 0, end: 600 },
  left: { start: 0, end: 600 },
};

const { left, right, bottom, top } = buildTileBorders(exits, Scenery.Bush);
const foodItems = [];
const dirtRows = [];

for (let y = 80; y <= 300; y += 100) {
  for (let x = 50; x < 450; x += 70) {
    dirtRows.push(new Scenery.DirtPile({ position: { x, y } }));

    if (x % 20 === 0) {
      foodItems.push({ type: 'Broccoli', position: { x, y: y - 10 } });
    }
  }
}

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
    ...dirtRows,
  ],
  food: foodItems.map((item, index) => (
    new Food[item.type]({
      ...item,
      position: item.position,
      id: item.id || index + 1,
    })
  )),
  x: 2,
  y: 6,
  exits,
};

export default Tile;
