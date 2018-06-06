import image from 'images/food/parsley.png';

export default class Parsley {
  constructor({ position, id }) {
    this.position = position;
    this.height = 23;
    this.width = 20;
    this.type = 'Parsley';
    this.collected = false;
    this.image = image;
    this.id = id;
  }
}
