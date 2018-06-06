import image from 'images/food/swiss_chard.png';

export default class SwissChard {
  constructor({ position, id }) {
    this.position = position;
    this.height = 40;
    this.width = 17;
    this.type = 'SwissChard';
    this.collected = false;
    this.image = image;
    this.id = id;
  }
}
