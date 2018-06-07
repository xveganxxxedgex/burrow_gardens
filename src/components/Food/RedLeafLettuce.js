import image from 'images/food/red_leaf_lettuce.png';

export default class RedLeafLettuce {
  constructor({ position, id }) {
    this.position = position;
    this.height = 24;
    this.width = 24;
    this.type = 'RedLeafLettuce';
    this.collected = false;
    this.image = image;
    this.id = id;
    this.needsAbility = 'dig';
    this.playSound = 'rustle';
  }
}
