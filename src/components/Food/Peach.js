import image from 'images/food/peach.png';

export default class Peach {
  constructor(position, id) {
    this.position = position;
    this.height = 24;
    this.width = 21;
    this.type = 'Peach';
    this.collected = false;
    this.image = image;
    this.id = id;
  }
}
