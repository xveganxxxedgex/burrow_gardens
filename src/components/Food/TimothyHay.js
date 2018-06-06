import image from 'images/food/timothy_hay.png';

export default class TimothyHay {
  constructor({ position, id }) {
    this.position = position;
    this.height = 38;
    this.width = 59;
    this.type = 'TimothyHay';
    this.collected = false;
    this.image = image;
    this.id = id;
  }
}
