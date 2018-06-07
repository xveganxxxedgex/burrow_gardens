import image from 'images/food/butter_lettuce.png';

export default class ButterLettuce {
  constructor({ position, id }) {
    this.position = position;
    this.height = 20;
    this.width = 25;
    this.type = 'ButterLettuce';
    this.collected = false;
    this.image = image;
    this.id = id;
    this.needsAbility = 'dig';
    this.playSound = 'rustle';
  }
}
