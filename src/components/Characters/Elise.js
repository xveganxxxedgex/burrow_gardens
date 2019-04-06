import bunnyLeftImg from 'images/bunnies/Elise/left_1.png';
import bunnyRightImg from 'images/bunnies/Elise/right.png';
import bunnyUpImg from 'images/bunnies/Elise/up_1.png';
import bunnyDownImg from 'images/bunnies/Elise/down_1.png';
import bunnyLeftGif from 'images/bunnies/Elise/left_gif.gif';
import bunnyRightGif from 'images/bunnies/Elise/right_gif.gif';
import bunnyUpGif from 'images/bunnies/Elise/up_gif.gif';
import bunnyDownGif from 'images/bunnies/Elise/down_gif.gif';
import bunnyLoafLeftImg from 'images/bunnies/Elise/loaf_left.png';
import bunnyLoafRightImg from 'images/bunnies/Elise/loaf_right.png';
import bunnyLoafUpImg from 'images/bunnies/Elise/loaf_up.png';
import bunnyLoafDownImg from 'images/bunnies/Elise/loaf_down.png';
import bunnyFlopLeftImg from 'images/bunnies/Elise/flop_left.png';
import bunnyFlopRightImg from 'images/bunnies/Elise/flop_right.png';
import bunnyFlopUpImg from 'images/bunnies/Elise/flop_up.png';
import bunnyFlopDownImg from 'images/bunnies/Elise/flop_down.png';
import * as constants from './constants';

// TODO: use actual images
export default class Elise {
  constructor() {
    this.name = 'Elise';
    this.needsAbility = 'nudge';
    this.hasCollected = false;
    this.goingToTile = false;
    this.position = { x: 550, y: 250 };
    this.onTile = { x: 8, y: 3 };
    this.height = constants.BUNNY_HEIGHT;
    this.width = constants.BUNNY_WIDTH;
    this.id = 10;
    this.groupTile = { x: 4, y: 7 };
    this.groupPosition = { x: 450, y: 200 };
    this.bunnyImages = {
      left: bunnyLeftImg,
      right: bunnyRightImg,
      up: bunnyUpImg,
      down: bunnyDownImg,
      leftGif: bunnyLeftGif,
      rightGif: bunnyRightGif,
      upGif: bunnyUpGif,
      downGif: bunnyDownGif,
      loafLeft: bunnyLoafLeftImg,
      loafRight: bunnyLoafRightImg,
      loafUp: bunnyLoafUpImg,
      loafDown: bunnyLoafDownImg,
      flopLeft: bunnyFlopLeftImg,
      flopRight: bunnyFlopRightImg,
      flopUp: bunnyFlopUpImg,
      flopDown: bunnyFlopDownImg,
    };
  }
}
