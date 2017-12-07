import image from 'images/Brick3.png';

export default class Bush {
  constructor(position) {
    this.position = position;
    this.height = 40;
    this.width = 40;
    this.sceneryClass = 'bush';
    this.image = image;
    this.type = 'Bush';
  }
}
