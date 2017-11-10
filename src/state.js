import Baobab from 'baobab';

const state = new Baobab({
  heroPosition: {
    x: 60,
    y: 60
  },
  tooltip: null,
  tile: {},
  boardDimensions: {},
  backgrounds: {
    B0: 'Dirt',
    B1: 'Grass',
    B2: 'Mud',
  }
});

export default state;
