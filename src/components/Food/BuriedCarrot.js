import image from 'images/food/ground_carrot.png';

export default class BuriedCarrot {
  constructor({ position, id }) {
    this.position = position;
    this.height = 18;
    this.width = 24;
    this.type = 'BuriedCarrot';
    this.needsAbility = 'dig';
    this.display = 'Carrot';
    this.collected = false;
    this.image = image;
    this.id = id;
    this.playSound = 'rustle';
  }
}
