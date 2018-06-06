import image from 'images/food/carrot.png';

export default class Carrot {
  constructor({ position, id }) {
    this.position = position;
    this.height = 26;
    this.width = 20;
    this.type = 'Carrot';
    this.collected = false;
    this.image = image;
    this.id = id;
  }
}