import image from 'images/food/zucchini.png';

export default class Zucchini {
  constructor({ position, id }) {
    this.position = position;
    this.height = 12;
    this.width = 30;
    this.type = 'Zucchini';
    this.collected = false;
    this.image = image;
    this.id = id;
  }
}
