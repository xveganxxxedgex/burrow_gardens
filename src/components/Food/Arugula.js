import image from 'images/arugula.png';

export default class Arugula {
  constructor(position, id) {
    this.position = position;
    this.height = 21;
    this.width = 17;
    this.type = 'Arugula';
    this.collected = false;
    this.image = image;
    this.id = id;
  }
}
