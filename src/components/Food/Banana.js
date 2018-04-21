import image from 'images/food/banana.png';

export default class Banana {
  constructor(position, id) {
    this.position = position;
    this.height = 25;
    this.width = 19;
    this.type = 'Banana';
    this.collected = false;
    this.image = image;
    this.id = id;
  }
}
