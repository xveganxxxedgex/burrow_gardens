import image from 'images/food/raspberry.png';

export default class Raspberry {
  constructor(position, id) {
    this.position = position;
    this.height = 13;
    this.width = 17;
    this.type = 'Raspberry';
    this.collected = false;
    this.image = image;
    this.id = id;
  }
}
