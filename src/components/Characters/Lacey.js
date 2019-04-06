import bunnyLeftImg from 'images/bunnies/Lacey/left_1.png';
import bunnyRightImg from 'images/bunnies/Lacey/right.png';
import bunnyUpImg from 'images/bunnies/Lacey/up_1.png';
import bunnyDownImg from 'images/bunnies/Lacey/down_1.png';
import bunnyLeftGif from 'images/bunnies/Lacey/left_gif.gif';
import bunnyRightGif from 'images/bunnies/Lacey/right_gif.gif';
import bunnyUpGif from 'images/bunnies/Lacey/up_gif.gif';
import bunnyDownGif from 'images/bunnies/Lacey/down_gif.gif';
import bunnyLoafLeftImg from 'images/bunnies/Lacey/loaf_left.png';
import bunnyLoafRightImg from 'images/bunnies/Lacey/loaf_right.png';
import bunnyLoafUpImg from 'images/bunnies/Lacey/loaf_up.png';
import bunnyLoafDownImg from 'images/bunnies/Lacey/loaf_down.png';
import bunnyFlopLeftImg from 'images/bunnies/Lacey/flop_left.png';
import bunnyFlopRightImg from 'images/bunnies/Lacey/flop_right.png';
import bunnyFlopUpImg from 'images/bunnies/Lacey/flop_up.png';
import bunnyFlopDownImg from 'images/bunnies/Lacey/flop_down.png';
import * as constants from './constants';

export default class Lacey {
  constructor() {
    this.name = 'Lacey';
    this.hasCollected = false;
    this.goingToTile = false;
    this.position = { x: 1000, y: 350 };
    this.onTile = { x: 1, y: 1 };
    this.height = constants.BUNNY_HEIGHT;
    this.width = constants.BUNNY_WIDTH;
    this.id = 11;
    this.groupTile = { x: 4, y: 5 };
    this.groupPosition = { x: 200, y: 150 };
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
