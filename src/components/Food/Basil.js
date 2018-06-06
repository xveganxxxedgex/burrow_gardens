import image from 'images/food/basil.png';

export default class Basil {
  constructor({ position, id }) {
    this.position = position;
    this.height = 21;
    this.width = 19;
    this.type = 'Basil';
    this.collected = false;
    this.image = image;
    this.id = id;
  }
}
