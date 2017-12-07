import image from 'images/melon.png';

export default class Melon {
  constructor(position, id) {
    this.position = position;
    this.height = 25;
    this.width = 30;
    this.type = 'Melon';
    this.collected = false;
    this.image = image;
    this.id = id;
  }
}
