import image from 'images/burrow.png';

import * as constants from './constants';

export default class Burrow {
  constructor(position, takeToTile, faceDirection) {
    this.position = position;
    this.height = constants.BURROW_HEIGHT;
    this.width = constants.BURROW_WIDTH;
    this.sceneryClass = `burrow ${faceDirection}`;
    this.image = image;
    this.type = constants.BURROW_TYPE;
    this.takeToTile = takeToTile;
    this.needsAbility = 'dig';
  }
}
