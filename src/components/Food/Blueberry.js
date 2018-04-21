import image from 'images/food/blueberries.png';

export default class Blueberry {
  constructor(position, id) {
    this.position = position;
    this.height = 23;
    this.width = 23;
    this.type = 'Blueberry';
    this.collected = false;
    this.image = image;
    this.id = id;
  }
}
