import Baobab, { monkey } from 'baobab';

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
  'Apple',
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
  'Pears',
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
        hasCollected: false
      },
      {
        name: 'November',
        giveSkill: 'ball',
        hasCollected: false
      },
      {
        name: 'Cloud',
        giveSkill: 'binky',
        hasCollected: false
      },
      {
        name: 'Spence',
        giveSkill: 'groom',
        hasCollected: false
      },
      {
        name: 'Giant',
        giveSkill: 'climb',
        hasCollected: false
      },
      {
        name: 'Unknown 1',
        giveSkill: 'zoom',
        hasCollected: false
      },
      {
        name: 'Unknown 2',
        giveSkill: 'jump',
        hasCollected: false
      },
      {
        name: 'Unknown 3',
        giveSkill: 'stomp',
        hasCollected: false
      },
      {
        name: 'No Skill',
        hasCollected: false
      },
      {
        name: 'No Skill',
        hasCollected: false
      },
      {
        name: 'No Skill',
        hasCollected: false
      },
      {
        name: 'No Skill',
        hasCollected: false
      },
      {
        name: 'No Skill',
        hasCollected: false
      },
    ]
  },
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
