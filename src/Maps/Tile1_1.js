let left1 = [];
for (let i = 0; i < 760; i = i + 40) {
  left1.push({ type: 'Bush', sceneryClass: 'bush', position: { x: 0, y: i } });
}

let right1 = [];
for (let i = 0; i < 200; i = i + 40) {
  right1.push({ type: 'Bush', sceneryClass: 'bush', position: { x: 1160, y: i } });
}

let right2 = [];
for (let i = 400; i < 560; i = i + 40) {
  right2.push({ type: 'Bush', sceneryClass: 'bush', position: { x: 1160, y: i } });
}

let top1 = [];
for (let i = 0; i < 1160; i = i + 40) {
  top1.push({ type: 'Bush', sceneryClass: 'bush', position: { x: i, y: 0 } });
}

let bottom1 = [];
for (let i = 40; i < 220; i = i + 40) {
  bottom1.push({ type: 'Bush', sceneryClass: 'bush', position: { x: i, y: 560 } });
}

let bottom2 = [];
for (let i = 640; i < 1200; i = i + 40) {
  bottom2.push({ type: 'Bush', sceneryClass: 'bush', position: { x: i, y: 560 } });
}

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
  food: [
    {
      type: 'BuriedCarrot',
      display: 'Carrot',
      position: { x: 80, y: 130 },
      id: 1,
      collected: false,
      needsAbility: 'dig'
    },
    {
      type: 'Carrot',
      position: { x: 460, y: 285 },
      id: 2,
      collected: false
    },
    {
      type: 'AlfalfaHay',
      position: { x: 550, y: 455 },
      id: 3,
      collected: false
    },
    {
      type: 'Broccoli',
      position: { x: 800, y: 300 },
      id: 4,
      collected: false
    },
    {
      type: 'Apple',
      position: { x: 800, y: 350 },
      id: 5,
      collected: false
    },
    {
      type: 'Arugula',
      position: { x: 800, y: 400 },
      id: 6,
      collected: false
    },
    {
      type: 'Banana',
      position: { x: 800, y: 450 },
      id: 7,
      collected: false
    },
    {
      type: 'Basil',
      position: { x: 850, y: 300 },
      id: 8,
      collected: false
    },
    {
      type: 'Blueberry',
      position: { x: 900, y: 300 },
      id: 9,
      collected: false
    },
    {
      type: 'BokChoy',
      position: { x: 950, y: 300 },
      id: 10,
      collected: false
    },
    {
      type: 'ButterLettuce',
      position: { x: 850, y: 350 },
      id: 11,
      collected: false
    },
    {
      type: 'Cabbage',
      position: { x: 850, y: 400 },
      id: 12,
      collected: false
    },
    {
      type: 'Cilantro',
      position: { x: 850, y: 450 },
      id: 13,
      collected: false
    },
    {
      type: 'DandelionGreens',
      position: { x: 900, y: 400 },
      id: 14,
      collected: false
    },
    {
      type: 'Endive',
      position: { x: 900, y: 450 },
      id: 15,
      collected: false
    },
    {
      type: 'Melon',
      position: { x: 900, y: 500 },
      id: 16,
      collected: false
    },
    {
      type: 'Mint',
      position: { x: 900, y: 350 },
      id: 17,
      collected: false
    }
  ],
  x: 1,
  y: 1
};

export default Tile;
