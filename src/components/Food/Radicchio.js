import image from 'images/food/radicchio.png';

export default class Radicchio {
  constructor({ position, id }) {
    this.position = position;
    this.height = 24;
    this.width = 25;
    this.type = 'Radicchio';
    this.collected = false;
    this.image = image;
    this.id = id;
    this.needsAbility = 'dig';
    this.playSound = 'rustle';
  }
}
