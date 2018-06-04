// import image from 'images/food/romaine_lettuce.png';

export default class RomaineLettuce {
  constructor(position, id) {
    this.position = position;
    this.height = 15;
    this.width = 20;
    this.type = 'RomaineLettuce';
    this.collected = false;
    // this.image = image;
    this.id = id;
  }
}
