import image from 'images/food/dandelion_greens.png';

export default class DandelionGreens {
  constructor(position, id) {
    this.position = position;
    this.height = 14;
    this.width = 25;
    this.type = 'DandelionGreens';
    this.collected = false;
    this.image = image;
    this.id = id;
  }
}
