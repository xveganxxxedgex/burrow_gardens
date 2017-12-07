import image from 'images/mint.png';

export default class Mint {
  constructor(position, id) {
    this.position = position;
    this.height = 16;
    this.width = 20;
    this.type = 'Mint';
    this.collected = false;
    this.image = image;
    this.id = id;
  }
}
