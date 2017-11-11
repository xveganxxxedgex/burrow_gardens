import Baobab from 'baobab';

const state = new Baobab({
  hero: {
    position: {
      x: 60,
      y: 60
    },
    abilities: []
  },
  popover: null,
  tile: {},
  boardDimensions: {},
  backgrounds: {
    B0: 'Dirt',
    B1: 'Grass',
    B2: 'Mud',
  }
});

export default state;
