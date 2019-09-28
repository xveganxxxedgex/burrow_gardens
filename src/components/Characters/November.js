import bunnyLeftImg from 'images/bunnies/November/left_1.png';
import bunnyRightImg from 'images/bunnies/November/right.png';
import bunnyUpImg from 'images/bunnies/November/up_1.png';
import bunnyDownImg from 'images/bunnies/November/down_1.png';
import bunnyLeftGif from 'images/bunnies/November/left_gif.gif';
import bunnyRightGif from 'images/bunnies/November/right_gif.gif';
import bunnyUpGif from 'images/bunnies/November/up_gif.gif';
import bunnyDownGif from 'images/bunnies/November/down_gif.gif';
import bunnyLoafLeftImg from 'images/bunnies/November/loaf_left.png';
import bunnyLoafRightImg from 'images/bunnies/November/loaf_right.png';
import bunnyLoafUpImg from 'images/bunnies/November/loaf_up.png';
import bunnyLoafDownImg from 'images/bunnies/November/loaf_down.png';
import bunnyFlopLeftImg from 'images/bunnies/November/flop_left.png';
import bunnyFlopRightImg from 'images/bunnies/November/flop_right.png';
import bunnyFlopUpImg from 'images/bunnies/November/flop_up.png';
import bunnyFlopDownImg from 'images/bunnies/November/flop_down.png';
import * as constants from './constants';

// TODO: use actual images
export default class November {
  constructor() {
    this.name = 'November';
    this.giveSkill = 'nudge';
    this.hasCollected = false;
    this.goingToTile = false;
    this.position = { x: 900, y: 100 };
    this.onTile = { x: 9, y: 8 };
    this.height = constants.BUNNY_HEIGHT;
    this.width = constants.BUNNY_WIDTH;
    this.id = 2;
    this.groupTile = { x: 4, y: 6 };
    this.groupPosition = { x: 500, y: 300 };
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
