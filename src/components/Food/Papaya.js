import image from 'images/food/papaya.png';

export default class Papaya {
  constructor(position, id) {
    this.position = position;
    this.height = 15;
    this.width = 20;
    this.type = 'Papaya';
    this.collected = false;
    this.image = image;
    this.id = id;
  }
}
