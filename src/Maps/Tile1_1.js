import * as Food from 'components/Food';
import * as Scenery from 'components/Scenery';

const exits = {
  right: { start: 200, end: 240 },
  bottom: { start: 240, end: 640 }
};

const left = [];
for (let i = 0; i < 760; i = i + 40) {
  left.push(new Scenery.Bush({ x: 0, y: i }));
}

const right = [];
for (let i = 0; i < 560; i = i + 40) {
  if (i < exits.right.start || i >= exits.right.end) {
    right.push(new Scenery.Bush({ x: 1160, y: i }));
  }
}

const top = [];
for (let i = 0; i < 1160; i = i + 40) {
  top.push(new Scenery.Bush({ x: i, y: 0 }));
}

const bottom = [];
for (let i = 40; i < 1200; i = i + 40) {
  if (i < exits.bottom.start || i >= exits.bottom.end) {
    bottom.push(new Scenery.Bush({ x: i, y: 560 }));
  }
}

const foodItems = [
  { type: 'AlfalfaHay', position: { x: 550, y: 455 } },
  { type: 'Apple', position: { x: 430, y: 160 }, id: 'tree_apple_1', onItem: 'tree_1' },
  { type: 'Apple', position: { x: 530, y: 210 }, id: 'tree_apple_2', onItem: 'tree_1' },
  { type: 'Apple', position: { x: 580, y: 140 }, id: 'tree_apple_3', onItem: 'tree_1' },
  { type: 'Arugula', position: { x: 800, y: 400 } },
  { type: 'Banana', position: { x: 800, y: 450 } },
  { type: 'Basil', position: { x: 850, y: 300 } },
  { type: 'Blueberry', position: { x: 900, y: 300 } },
  { type: 'BokChoy', position: { x: 950, y: 300 } },
  { type: 'Broccoli', position: { x: 800, y: 300 } },
  { type: 'BuriedCarrot', position: { x: 80, y: 130 } },
  { type: 'ButterLettuce', position: { x: 850, y: 350 } },
  { type: 'Cabbage', position: { x: 850, y: 400 } },
  { type: 'Carrot', position: { x: 950, y: 350 } },
  { type: 'Cilantro', position: { x: 850, y: 450 } },
  { type: 'DandelionGreens', position: { x: 900, y: 400 } },
  { type: 'Endive', position: { x: 900, y: 450 } },
  { type: 'Melon', position: { x: 900, y: 500 } },
  { type: 'Mint', position: { x: 900, y: 350 } },
  { type: 'Papaya', position: { x: 800, y: 350 } },
  { type: 'Parsley', position: { x: 950, y: 400 } },
  { type: 'Peach', position: { x: 950, y: 450 } },
  { type: 'Pear', position: { x: 800, y: 500 } },
  { type: 'Pumpkin', position: { x: 840, y: 490 } },
  { type: 'Radicchio', position: { x: 950, y: 500 } },
  { type: 'Raspberry', position: { x: 1000, y: 510 } },
  // { type: 'RedLeafLettuce', position: { x: 1000, y: 450 } },
  // { type: 'RomaineLettuce', position: { x: 1000, y: 400 } },
  // { type: 'Spinach', position: { x: 1000, y: 350 } },
  // { type: 'Strawberry', position: { x: 1000, y: 300 } },
  // { type: 'SwissChard', position: { x: 1050, y: 350 } },
  // { type: 'TimothyHay', position: { x: 1050, y: 400 } },
  // { type: 'Zucchini', position: { x: 1050, y: 450 } }
];

const Tile = {
  background: [
    ['B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1'],
    ['B1', 'B0', 'B0', 'B0', 'B0', 'B0', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1'],
    ['B1', 'B0', 'B0', 'B0', 'B0', 'B0', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1'],
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
    ['B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1']
  ],
  scenery: [
    ...left,
    ...right,
    ...top,
    ...bottom,
    new Scenery.Burrow({ x: 1138, y: 200 }, { x: 1, y: 2 }, 'left'),
    new Scenery.Tree({ x: 400, y: 100 }, 'tree_1', ['tree_apple_1', 'tree_apple_2', 'tree_apple_3'])
  ],
  food: foodItems.map((item, index) => {
    return new Food[item.type](item.position, item.id || index + 1, item.onItem);
  }),
  x: 1,
  y: 1,
  exits
};

export default Tile;
