import image from 'images/food/spinach.png';

export default class Spinach {
  constructor({ position, id }) {
    this.position = position;
    this.height = 16;
    this.width = 30;
    this.type = 'Spinach';
    this.collected = false;
    this.image = image;
    this.id = id;
  }
}
