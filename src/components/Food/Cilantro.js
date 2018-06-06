import image from 'images/food/cilantro.png';

export default class Cilantro {
  constructor({ position, id }) {
    this.position = position;
    this.height = 23;
    this.width = 20;
    this.type = 'Cilantro';
    this.collected = false;
    this.image = image;
    this.id = id;
  }
}
