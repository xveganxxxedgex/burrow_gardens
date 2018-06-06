import image from 'images/scenery/dirt_clump.png';

export default class DirtClump {
  constructor({ position }) {
    this.position = position;
    this.height = 24;
    this.width = 80;
    this.sceneryClass = 'dirtClump';
    this.image = image;
    this.type = 'DirtClump';
  }
}
