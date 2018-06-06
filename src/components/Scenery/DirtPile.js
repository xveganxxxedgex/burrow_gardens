import image from 'images/scenery/dirt_pile.png';

export default class DirtPile {
  constructor({ position }) {
    this.position = position;
    this.height = 24;
    this.width = 99;
    this.sceneryClass = 'dirtPile';
    this.image = image;
    this.type = 'DirtPile';
  }
}
