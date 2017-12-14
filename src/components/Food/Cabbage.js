import image from 'images/cabbage.png';

export default class Cabbage {
  constructor(position, id) {
    this.position = position;
    this.height = 22;
    this.width = 25;
    this.type = 'Cabbage';
    this.collected = false;
    this.image = image;
    this.id = id;
  }
}