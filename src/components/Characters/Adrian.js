import bunnyLeftImg from 'images/bunnies/Adrian/left_1.png';
import bunnyRightImg from 'images/bunnies/Adrian/right.png';
import bunnyUpImg from 'images/bunnies/Adrian/up_1.png';
import bunnyDownImg from 'images/bunnies/Adrian/down_1.png';
import bunnyLeftGif from 'images/bunnies/Adrian/left_gif.gif';
import bunnyRightGif from 'images/bunnies/Adrian/right_gif.gif';
import bunnyUpGif from 'images/bunnies/Adrian/up_gif.gif';
import bunnyDownGif from 'images/bunnies/Adrian/down_gif.gif';
import bunnyLoafLeftImg from 'images/bunnies/Adrian/loaf_left.png';
import bunnyLoafRightImg from 'images/bunnies/Adrian/loaf_right.png';
import bunnyLoafUpImg from 'images/bunnies/Adrian/loaf_up.png';
import bunnyLoafDownImg from 'images/bunnies/Adrian/loaf_down.png';
import bunnyFlopLeftImg from 'images/bunnies/Adrian/flop_left.png';
import bunnyFlopRightImg from 'images/bunnies/Adrian/flop_right.png';
import bunnyFlopUpImg from 'images/bunnies/Adrian/flop_up.png';
import bunnyFlopDownImg from 'images/bunnies/Adrian/flop_down.png';
import * as constants from './constants';

export default class Adrian {
  constructor() {
    this.name = 'Adrian';
    this.hasCollected = false;
    this.goingToTile = false;
    this.position = { x: 600, y: 250 };
    this.onTile = { x: 1, y: 4 };
    this.height = constants.BUNNY_HEIGHT;
    this.width = constants.BUNNY_WIDTH;
    this.id = 9;
    this.groupTile = { x: 4, y: 5 };
    this.groupPosition = { x: 900, y: 360 };
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
