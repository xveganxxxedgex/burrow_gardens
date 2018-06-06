import Baobab, { monkey } from 'baobab';
import _filter from 'lodash/filter';
import _flatten from 'lodash/flatten';
import _forEach from 'lodash/forEach';
import _union from 'lodash/union';

import * as Tiles from 'Maps';
import * as Bunnies from 'components/Characters';

const tiles = {};

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
    position: { x: 700, y: 380 },
    height: 40,
    width: 40,
    lastDirection: 'right',
    disableMove: false,
    abilities: monkey({
      cursors: {
        bunnies: ['bunnies']
      },
      get: function({ bunnies }) {
        const abilities = [];
        _forEach(bunnies, bunny => {
          if (bunny.hasCollected && bunny.giveSkill) {
            abilities.push(bunny.giveSkill);
          }
        });

        return abilities;
      }
    }),
  },
  heroCollisions: [],
  skills: [
    {
      name: 'dig',
      description: 'You can use the Dig skill anywhere you see burrow holes, or buried produce. This will grant you access to new places and allow you to obtain new produce items.'
    },
    {
      name: 'ball',
      description: 'You can use the Ball skill to cover gaps, which can unlock new areas to explore.'
    },
    {
      name: 'binky',
      description: 'You can use the Binky skill to win over sad buns and get them to become your friend.'
    },
    {
      name: 'groom',
      description: 'You can use the Groom skill to become friends with more dominant bunnies.'
    },
    {
      name: 'stomp',
      description: 'You can use the Stomp skill to become friends with more submissive bunnies, as well as shake produce off of certain trees.'
    },
    {
      name: 'climb',
      description: 'You can use the Climb skill to access higher locations or objects.'
    },
    {
      name: 'zoom',
      description: 'You can use the Zoom skill to rush past scary or questionable areas, which will allow you to explore new areas.'
    },
    {
      name: 'jump',
      description: 'You can use the Jump skill to get onto higher areas to explore.'
    },
  ],
  produceList: foodItems.map(foodItem => {
    return {
      name: foodItem.replace(/ /g, ''),
      display: foodItem,
      count: 0,
      hasCollected: false
    }
  }),
  bunnies: [
    new Bunnies.Simba(),
    new Bunnies.November(),
    new Bunnies.Cloud(),
    new Bunnies.Spencer(),
    {
      name: 'Giant',
      giveSkill: 'climb',
      hasCollected: false,
      position: { x: 60, y: 60 },
      onTile: { x: 1, y: 5 },
      id: 5
    },
    {
      name: 'Unknown 1',
      giveSkill: 'zoom',
      hasCollected: false,
      position: { x: 60, y: 60 },
      onTile: { x: 1, y: 5 },
      id: 6
    },
    {
      name: 'Unknown 2',
      giveSkill: 'jump',
      needsAbility: 'binky',
      hasCollected: false,
      position: { x: 60, y: 60 },
      onTile: { x: 1, y: 5 },
      id: 7
    },
    {
      name: 'Unknown 3',
      giveSkill: 'stomp',
      hasCollected: false,
      position: { x: 60, y: 60 },
      onTile: { x: 1, y: 5 },
      id: 8
    },
    {
      name: 'No Skill',
      hasCollected: false,
      position: { x: 60, y: 60 },
      onTile: { x: 1, y: 5 },
      id: 9
    },
    {
      name: 'No Skill',
      hasCollected: false,
      needsAbility: 'stomp',
      position: { x: 60, y: 60 },
      onTile: { x: 1, y: 5 },
      id: 10
    },
    {
      name: 'No Skill',
      hasCollected: false,
      position: { x: 60, y: 60 },
      onTile: { x: 1, y: 5 },
      id: 11
    },
    {
      name: 'No Skill',
      hasCollected: false,
      position: { x: 60, y: 60 },
      onTile: { x: 1, y: 5 },
      id: 12
    },
    {
      name: 'No Skill',
      hasCollected: false,
      position: { x: 60, y: 60 },
      onTile: { x: 1, y: 5 },
      id: 13
    },
  ],
  itemQueue: [],
  movePixels: 20,
  popover: null,
  showMenu: true,
  activeTab: 1,
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
      bunnies: ['bunnies']
    },
    get: function({ activeTile, bunnies }) {
      return _filter(bunnies, bunny => {
        return bunny.onTile.x == activeTile.x && bunny.onTile.y == activeTile.y;
      });
    }
  }),
  foodOnTile: monkey({
    cursors: {
      tile: ['tile']
    },
    get: function({ tile }) {
      const produceOnItems = _flatten(tile.scenery.map(item => item.produce || []));
      return _union(tile.food, produceOnItems);
    }
  }),
  wonGame: monkey({
    cursors: {
      produceList: ['produceList'],
      bunnies: ['bunnies']
    },
    get: function({ produceList, bunnies }) {
      const foodCollected = _filter(produceList, food => {
        return food.hasCollected;
      });
      const bunniesCollected = _filter(bunnies, bunny => {
        return bunny.hasCollected;
      });
      return foodCollected.length == produceList.length && bunniesCollected.length == bunnies.length;
    }
  }),
  activeTile: { x: 1, y: 1 },
  boardDimensions: {},
  backgrounds: {
    B0: 'Dirt',
    B1: 'Grass',
    B2: 'Grass2',
    B3: 'Mud',
  },
  gameVisible: true,
  audioMuted: false,
});

export default state;
