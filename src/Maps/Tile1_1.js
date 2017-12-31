import * as Food from 'components/Food';
import * as Scenery from 'components/Scenery';

const exits = {
  right: { start: 200, end: 240 },
  bottom: { start: 220, end: 640 }
};

let left = [];
for (let i = 0; i < 760; i = i + 40) {
  left.push(new Scenery.Bush({ x: 0, y: i }));
}

let right = [];
for (let i = 0; i < 560; i = i + 40) {
  if (i < exits.right.start || i >= exits.right.end) {
    right.push(new Scenery.Bush({ x: 1160, y: i }));
  }
}

let top = [];
for (let i = 0; i < 1160; i = i + 40) {
  top.push(new Scenery.Bush({ x: i, y: 0 }));
}

let bottom = [];
for (let i = 40; i < 1200; i = i + 40) {
  if (i < exits.bottom.start || i >= exits.bottom.end) {
    bottom.push(new Scenery.Bush({ x: i, y: 560 }));
  }
}

const foodItems = [
  { type: 'BuriedCarrot', position: { x: 80, y: 130 } },
  { type: 'Carrot', position: { x: 460, y: 110 } },
  { type: 'Carrot', position: { x: 460, y: 70 } },
  { type: 'Carrot', position: { x: 460, y: 150 } },
  { type: 'Carrot', position: { x: 460, y: 190 } },
  { type: 'Carrot', position: { x: 460, y: 230 } },
  { type: 'Carrot', position: { x: 460, y: 270 } },
  { type: 'Carrot', position: { x: 460, y: 310 } },
  { type: 'Carrot', position: { x: 420, y: 270 } },
  { type: 'Carrot', position: { x: 420, y: 190 } },
  { type: 'Carrot', position: { x: 380, y: 190 } },
  { type: 'AlfalfaHay', position: { x: 550, y: 455 } },
  { type: 'Broccoli', position: { x: 800, y: 300 } },
  { type: 'Apple', position: { x: 800, y: 350 } },
  { type: 'Arugula', position: { x: 800, y: 400 } },
  { type: 'Banana', position: { x: 800, y: 450 } },
  { type: 'Basil', position: { x: 850, y: 300 } },
  { type: 'Blueberry', position: { x: 900, y: 300 } },
  { type: 'BokChoy', position: { x: 950, y: 300 } },
  { type: 'ButterLettuce', position: { x: 850, y: 350 } },
  { type: 'Cabbage', position: { x: 850, y: 400 } },
  { type: 'Cilantro', position: { x: 850, y: 450 } },
  { type: 'DandelionGreens', position: { x: 900, y: 400 } },
  { type: 'Endive', position: { x: 900, y: 450 } },
  { type: 'Melon', position: { x: 900, y: 500 } },
  { type: 'Mint', position: { x: 900, y: 350 } }
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
    new Scenery.Burrow({ x: 1138, y: 200 }, { x: 1, y: 2 }, 'left')
  ],
  food: foodItems.map((item, index) => {
    return new Food[item.type](item.position, index + 1);
  }),
  x: 1,
  y: 1,
  exits
};

export default Tile;
