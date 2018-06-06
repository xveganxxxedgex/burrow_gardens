import image from 'images/food/pumpkin.png';

export default class Pumpkin {
  constructor({ position, id }) {
    this.position = position;
    this.height = 37;
    this.width = 40;
    this.type = 'Pumpkin';
    this.collected = false;
    this.image = image;
    this.id = id;
  }
}
