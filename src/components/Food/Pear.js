import image from 'images/food/pear.png';

export default class Pear {
  constructor(position, id) {
    this.position = position;
    this.height = 23;
    this.width = 16;
    this.type = 'Pear';
    this.collected = false;
    this.image = image;
    this.id = id;
  }
}
