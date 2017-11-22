import Baobab, { monkey } from 'baobab';
import _filter from 'lodash/filter';

import * as Tiles from 'Maps';

const tiles = {};

// for (let r = 1; r <= 9; r++) {
//   for (let c = 1; c <= 8; c++) {
//     const Tile = Tiles[`Tile${r}_${c}`];
//     tiles[`${Tile.x}_${Tile.y}`] = { food: Tile.food, bunnies: Tile.bunnies };
//   }
// }

for (let r = 1; r <= 2; r++) {
  for (let c = 1; c <= 2; c++) {
    const Tile = Tiles[`Tile${r}_${c}`];
    tiles[`${Tile.x}_${Tile.y}`] = Tile;
  }
}

const vegetables = [
  'Alfalfa Hay',
  'Arugula',
  'Basil',
  'Bok Choy',
  'Broccoli',
  'Butter Lettuce',
  'Cabbage',
  'Carrot',
  'Cilantro',
  'Dandelion Greens',
  'Endive',
  'Mint',
  'Parsley',
  'Pumpkin',
  'Radicchio',
  'Red Leaf Lettuce',
  'Romaine Lettuce',
  'Spinach',
  'Swiss Chard',
  'Timothy Hay',
  'Zucchini'
];

const fruits = [
  'Apple',
  'Banana',
  'Blueberry',
  'Melon',
  'Papaya',
  'Peach',
  'Pear',
  'Raspberry',
  'Strawberry'
];

const foodItems = vegetables.concat(fruits);

const state = new Baobab({
  hero: {
    position: {
      x: 60,
      y: 60
    },
    abilities: [],
  },
  collectedFood: foodItems.map(foodItem => {
    return {
      name: foodItem,
      count: 0,
      hasCollected: false
    }
  }),
  collectedBunnies: [
    {
      name: 'Simba',
      giveSkill: 'dig',
      hasCollected: false,
      position: {
        x: 300,
        y: 230
      },
      onTile: {
        x: 1,
        y: 1
      }
    },
    {
      name: 'November',
      giveSkill: 'ball',
      hasCollected: false,
      position: {
        x: 60,
        y: 60
      },
      onTile: {
        x: 1,
        y: 5
      }
    },
    {
      name: 'Cloud',
      giveSkill: 'binky',
      hasCollected: false,
      position: {
        x: 60,
        y: 60
      },
      onTile: {
        x: 1,
        y: 5
      }
    },
    {
      name: 'Spencer',
      giveSkill: 'groom',
      hasCollected: false,
      position: {
        x: 60,
        y: 60
      },
      onTile: {
        x: 1,
        y: 5
      }
    },
    {
      name: 'Giant',
      giveSkill: 'climb',
      hasCollected: false,
      position: {
        x: 60,
        y: 60
      },
      onTile: {
        x: 1,
        y: 5
      }
    },
    {
      name: 'Unknown 1',
      giveSkill: 'zoom',
      hasCollected: false,
      position: {
        x: 60,
        y: 60
      },
      onTile: {
        x: 1,
        y: 5
      }
    },
    {
      name: 'Unknown 2',
      giveSkill: 'jump',
      hasCollected: false,
      position: {
        x: 60,
        y: 60
      },
      onTile: {
        x: 1,
        y: 5
      }
    },
    {
      name: 'Unknown 3',
      giveSkill: 'stomp',
      hasCollected: false,
      position: {
        x: 60,
        y: 60
      },
      onTile: {
        x: 1,
        y: 5
      }
    },
    {
      name: 'No Skill',
      hasCollected: false,
      position: {
        x: 60,
        y: 60
      },
      onTile: {
        x: 1,
        y: 5
      }
    },
    {
      name: 'No Skill',
      hasCollected: false,
      position: {
        x: 60,
        y: 60
      },
      onTile: {
        x: 1,
        y: 5
      }
    },
    {
      name: 'No Skill',
      hasCollected: false,
      position: {
        x: 60,
        y: 60
      },
      onTile: {
        x: 1,
        y: 5
      }
    },
    {
      name: 'No Skill',
      hasCollected: false,
      position: {
        x: 60,
        y: 60
      },
      onTile: {
        x: 1,
        y: 5
      }
    },
    {
      name: 'No Skill',
      hasCollected: false,
      position: {
        x: 60,
        y: 60
      },
      onTile: {
        x: 1,
        y: 5
      }
    },
  ],
  movePixels: 20,
  popover: null,
  showInventory: false,
  tiles,
  tile: monkey({
    cursors: {
      activeTile: ['activeTile'],
      tiles: ['tiles']
    },
    get: function({ activeTile, tiles }) {
      return tiles[`${activeTile.x}_${activeTile.y}`];
    }
  }),
  bunniesOnTile: monkey({
    cursors: {
      activeTile: ['activeTile'],
      bunnies: ['collectedBunnies']
    },
    get: function({ activeTile, bunnies }) {
      return _filter(bunnies, bunny => {
        return bunny.onTile.x == activeTile.x && bunny.onTile.y == activeTile.y;
      });
    }
  }),
  activeTile: {
    x: 1,
    y: 1
  },
  boardDimensions: {},
  backgrounds: {
    B0: 'Dirt',
    B1: 'Grass',
    B2: 'Mud',
  }
});

export default state;
