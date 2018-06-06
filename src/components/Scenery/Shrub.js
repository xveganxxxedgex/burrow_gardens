import image from 'images/scenery/bush2.png';

export default class Shrub {
  constructor({ position, id, produce = [] }) {
    this.position = position;
    this.id = id;
    this.height = 85;
    this.width = 85;
    this.sceneryClass = 'shrub';
    this.image = image;
    this.type = 'Shrub';
    this.produce = produce;
    this.needsAbility = 'stomp';
  }
}
