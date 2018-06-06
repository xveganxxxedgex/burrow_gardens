import * as Food from 'components/Food';
import * as Scenery from 'components/Scenery';

const exits = {
  right: { start: 200, end: 240 },
  bottom: { start: 240, end: 640 }
};

const left = [];
for (let i = 0; i < 760; i = i + 40) {
  left.push(new Scenery.Bush({ position: { x: 0, y: i } }));
}

const right = [];
for (let i = 0; i < 560; i = i + 40) {
  if (i < exits.right.start || i >= exits.right.end) {
    right.push(new Scenery.Bush({ position: { x: 1160, y: i } }));
  }
}

const top = [];
for (let i = 0; i < 1160; i = i + 40) {
  top.push(new Scenery.Bush({ position: { x: i, y: 0 } }));
}

const bottom = [];
for (let i = 40; i < 1200; i = i + 40) {
  if (i < exits.bottom.start || i >= exits.bottom.end) {
    bottom.push(new Scenery.Bush({ position: { x: i, y: 560 } }));
  }
}

const dirtRows = [];

for (let y = 65; y <= 265; y = y + 100) {
  for (let x = 650; x <= 1070; x = x + 70) {
    dirtRows.push(new Scenery.DirtPile({ position: { x, y } }));
  }
}

const foodItems = [
  { type: 'Cabbage', position: { x: 690, y: 155 } },
  { type: 'Cabbage', position: { x: 760, y: 155 } },
  { type: 'Cabbage', position: { x: 830, y: 155 } },
  { type: 'Cabbage', position: { x: 900, y: 155 } },
  { type: 'Cabbage', position: { x: 970, y: 155 } },
  { type: 'Cabbage', position: { x: 1040, y: 155 } },
  { type: 'Cabbage', position: { x: 1110, y: 155 } },
  { type: 'ButterLettuce', position: { x: 690, y: 255 } },
  { type: 'ButterLettuce', position: { x: 760, y: 255 } },
  { type: 'ButterLettuce', position: { x: 830, y: 255 } },
  { type: 'ButterLettuce', position: { x: 900, y: 255 } },
  { type: 'ButterLettuce', position: { x: 970, y: 255 } },
  { type: 'ButterLettuce', position: { x: 1040, y: 255 } },
  { type: 'ButterLettuce', position: { x: 1110, y: 255 } },
];

const treePosition = { x: 350, y: 100 };
const shrubPosition = { x: 200, y: 300 };

const Tile = {
  background: [
    ['B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1'],
    ['B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1'],
    ['B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B0', 'B0', 'B0', 'B0', 'B0', 'B0', 'B0', 'B0', 'B0', 'B0', 'B0', 'B0', 'B1'],
    ['B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B0', 'B0', 'B0', 'B0', 'B0', 'B0', 'B0', 'B0', 'B0', 'B0', 'B0', 'B0', 'B1'],
    ['B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B0', 'B0', 'B0', 'B0', 'B0', 'B0', 'B0', 'B0', 'B0', 'B0', 'B0', 'B0', 'B1'],
    ['B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B0', 'B0', 'B0', 'B0', 'B0', 'B0', 'B0', 'B0', 'B0', 'B0', 'B0', 'B0', 'B1'],
    ['B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B0', 'B0', 'B0', 'B0', 'B0', 'B0', 'B0', 'B0', 'B0', 'B0', 'B0', 'B0', 'B1'],
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
    new Scenery.Burrow({ position: { x: 1138, y: 200 }, takeToTile: { x: 1, y: 2 }, faceDirection: 'left'}),
    new Scenery.Tree({
      position: treePosition,
      id: 'tree_1',
      produce: [
        new Food.Apple({ position: { x: treePosition.x + 40, y: treePosition.y + 50 }, id: 'tree_apple_1', parentId: 'tree_1' }),
        new Food.Apple({ position: { x: treePosition.x + 100, y: treePosition.y + 90 }, id: 'tree_apple_2', parentId: 'tree_1' }),
        new Food.Apple({ position: { x: treePosition.x + 170, y: treePosition.y + 35 }, id: 'tree_apple_3', parentId: 'tree_1' }),
      ]
    }),
    new Scenery.Shrub({
      position: shrubPosition,
      id: 'shrub_1',
      produce: [
        new Food.Strawberry({ position: { x: shrubPosition.x + 15, y: shrubPosition.y + 45 }, id: 'shrub_strawberry_1', parentId: 'shrub_1' }),
        new Food.Strawberry({ position: { x: shrubPosition.x + 50, y: shrubPosition.y + 20 }, id: 'shrub_strawberry_2', parentId: 'shrub_1' }),
      ]
    }),
    ...dirtRows
  ],
  food: foodItems.map((item, index) => {
    return new Food[item.type]({ position: item.position, id: item.id || index + 1, parentId: item.parentId });
  }),
  x: 1,
  y: 1,
  exits
};

export default Tile;
