import image from 'images/scenery/brick.png';

export default class Bush {
  constructor({ position }) {
    this.position = position;
    this.height = 40;
    this.width = 40;
    this.sceneryClass = 'bush';
    this.image = image;
    this.type = 'Bush';
  }
}
