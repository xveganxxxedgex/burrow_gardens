import image from 'images/food/romaine_lettuce.png';

export default class RomaineLettuce {
  constructor({ position, id }) {
    this.position = position;
    this.height = 29;
    this.width = 24;
    this.type = 'RomaineLettuce';
    this.collected = false;
    this.image = image;
    this.id = id;
    this.needsAbility = 'dig';
    this.playSound = 'rustle';
  }
}
