import * as Food from 'components/Food';
import * as Scenery from 'components/Scenery';

let left1 = [];
for (let i = 0; i < 760; i = i + 40) {
  left1.push(new Scenery.Bush({ x: 0, y: i }));
}

let right1 = [];
for (let i = 0; i < 200; i = i + 40) {
  right1.push(new Scenery.Bush({ x: 1160, y: i }));
}

let right2 = [];
for (let i = 400; i < 560; i = i + 40) {
  right2.push(new Scenery.Bush({ x: 1160, y: i }));
}

let top1 = [];
for (let i = 0; i < 1160; i = i + 40) {
  top1.push(new Scenery.Bush({ x: i, y: 0 }));
}

let bottom1 = [];
for (let i = 40; i < 220; i = i + 40) {
  bottom1.push(new Scenery.Bush({ x: i, y: 560 }));
}

let bottom2 = [];
for (let i = 640; i < 1200; i = i + 40) {
  bottom2.push(new Scenery.Bush({ x: i, y: 560 }));
}

const foodItems = [
  { type: 'BuriedCarrot', position: { x: 80, y: 130 } },
  { type: 'Carrot', position: { x: 460, y: 285 } },
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
    ...left1,
    ...right1,
    ...right2,
    ...top1,
    ...bottom1,
    ...bottom2
  ],
  food: foodItems.map((item, index) => {
    return new Food[item.type](item.position, index + 1);
  }),
  x: 1,
  y: 1
};

export default Tile;
