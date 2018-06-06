import image from 'images/food/broccoli.png';

export default class Broccoli {
  constructor({ position, id }) {
    this.position = position;
    this.height = 23;
    this.width = 17;
    this.type = 'Broccoli';
    this.collected = false;
    this.image = image;
    this.id = id;
  }
}
