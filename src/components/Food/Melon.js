import image from 'images/food/melon.png';

export default class Melon {
  constructor({ position, id, flipX }) {
    this.position = position;
    this.height = 25;
    this.width = 30;
    this.type = 'Melon';
    this.collected = false;
    this.image = image;
    this.id = id;
    this.flipX = flipX;
  }
}
