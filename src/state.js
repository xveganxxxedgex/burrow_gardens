import Baobab, { monkey } from 'baobab';
import _filter from 'lodash/filter';
import _flatten from 'lodash/flatten';
import _forEach from 'lodash/forEach';
import _union from 'lodash/union';

import * as Tiles from 'Maps';
import * as Bunnies from 'components/Characters';

// Sound effects from:
// https://www.zapsplat.com/
// https://freesound.org/
import ItemDrop from 'audio/item_drop.mp3';
import Stomp from 'audio/stomp.mp3';
import TreeShake from 'audio/tree_shake.mp3';
import Fall from 'audio/fall.mp3';
import Rustle from 'audio/rustle.mp3';
import PickUp from 'audio/pick_up.mp3';
import Dig from 'audio/dig.mp3';
import Squeak from 'audio/squeak.mp3';

const tiles = {};

for (let r = 1; r <= 9; r += 1) {
  for (let c = 1; c <= 8; c += 1) {
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
  'Zucchini',
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
  'Strawberry',
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
        bunnies: ['bunnies'],
      },
      get({ bunnies }) {
        const abilities = [];
        _forEach(bunnies, (bunny) => {
          if (bunny.hasCollected && bunny.giveSkill) {
            abilities.push(bunny.giveSkill);
          }
        });

        return abilities;
      },
    }),
  },
  heroCollisions: [],
  skills: [
    {
      name: 'dig',
      description: 'You can use the Dig skill anywhere you see burrow holes, or buried produce. This will grant you access to new places and allow you to obtain new produce items.',
    },
    {
      name: 'nudge',
      description: 'You can use the Nudge skill to become friends with more submissive bunnies.',
    },
    {
      name: 'binky',
      description: 'You can use the Binky skill to win over sad buns and get them to become your friend.',
    },
    {
      name: 'groom',
      description: 'You can use the Groom skill to become friends with more dominant bunnies.',
    },
    {
      name: 'stomp',
      description: 'You can use the Stomp skill to shake produce off of certain trees or shrubs.',
    },
    {
      name: 'zoom',
      description: 'You can use the Zoom skill to rush past scary or questionable areas, which will allow you to explore new areas.',
    },
    {
      name: 'jump',
      description: 'You can use the Jump skill to get across gaps to unlock new areas to explore.',
    },
  ],
  produceList: foodItems.map((foodItem) => {
    return {
      name: foodItem.replace(/ /g, ''),
      display: foodItem,
      count: 0,
      hasCollected: false,
    };
  }),
  bunnies: [
    new Bunnies.Simba(),
    new Bunnies.November(),
    new Bunnies.Cloud(),
    new Bunnies.Spencer(),
    {
      name: 'Unknown 1',
      giveSkill: 'zoom',
      hasCollected: false,
      position: { x: 60, y: 60 },
      onTile: { x: 4, y: 8 },
      id: 6,
    },
    {
      name: 'Unknown 2',
      giveSkill: 'jump',
      needsAbility: 'binky',
      hasCollected: false,
      position: { x: 60, y: 60 },
      onTile: { x: 9, y: 4 },
      id: 7,
    },
    {
      name: 'Unknown 3',
      giveSkill: 'stomp',
      hasCollected: false,
      position: { x: 60, y: 60 },
      onTile: { x: 5, y: 6 },
      id: 8,
    },
    {
      name: 'No Skill 1',
      hasCollected: false,
      position: { x: 60, y: 60 },
      onTile: { x: 1, y: 4 },
      id: 9,
    },
    {
      name: 'No Skill 2',
      needsAbility: 'nudge',
      hasCollected: false,
      position: { x: 60, y: 60 },
      onTile: { x: 8, y: 3 },
      id: 10,
    },
    {
      name: 'No Skill 3',
      hasCollected: false,
      position: { x: 60, y: 60 },
      onTile: { x: 1, y: 1 },
      id: 11,
    },
    {
      name: 'No Skill 4',
      hasCollected: false,
      position: { x: 60, y: 60 },
      onTile: { x: 1, y: 8 },
      id: 12,
    },
    {
      name: 'No Skill 5',
      hasCollected: false,
      position: { x: 60, y: 60 },
      onTile: { x: 4, y: 1 },
      id: 13,
    },
  ],
  itemQueue: [],
  movePixels: 20,
  popover: null,
  showMenu: false,
  gameStarted: false,
  activeTab: 1,
  tiles,
  tile: monkey({
    cursors: {
      activeTile: ['activeTile'],
      tilesList: ['tiles'],
    },
    get({ activeTile, tilesList }) {
      return tilesList[`${activeTile.x}_${activeTile.y}`];
    },
  }),
  bunniesOnTile: monkey({
    cursors: {
      activeTile: ['activeTile'],
      bunnies: ['bunnies'],
    },
    get({ activeTile, bunnies }) {
      return _filter(bunnies, (bunny) => {
        return bunny.onTile.x === activeTile.x && bunny.onTile.y === activeTile.y;
      });
    },
  }),
  foodOnTile: monkey({
    cursors: {
      tile: ['tile'],
    },
    get({ tile }) {
      const produceOnItems = _flatten(tile.scenery.map(item => item.produce || []));
      return _union(tile.food, produceOnItems);
    },
  }),
  wonGame: monkey({
    cursors: {
      produceList: ['produceList'],
      bunnies: ['bunnies'],
    },
    get({ produceList, bunnies }) {
      const foodCollected = _filter(produceList, (food) => {
        return food.hasCollected;
      });
      const bunniesCollected = _filter(bunnies, (bunny) => {
        return bunny.hasCollected;
      });
      return (
        foodCollected.length === produceList.length &&
        bunniesCollected.length === bunnies.length
      );
    },
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
  audioSettings: {
    effects: {
      volume: 1.0,
      muted: false,
    },
    background: {
      volume: 1.0,
      muted: false,
    },
  },
  soundEffects: {
    treeShake: TreeShake,
    stomp: Stomp,
    itemDrop: ItemDrop,
    fall: Fall,
    rustle: Rustle,
    pickUp: PickUp,
    dig: Dig,
    squeak: Squeak,
  },
});

export default state;
