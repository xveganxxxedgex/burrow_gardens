import bunnyLeftImg from 'images/bunnies/Alice/left_1.png';
import bunnyRightImg from 'images/bunnies/Alice/right.png';
import bunnyUpImg from 'images/bunnies/Alice/up_1.png';
import bunnyDownImg from 'images/bunnies/Alice/down_1.png';
import bunnyLeftGif from 'images/bunnies/Alice/left_gif.gif';
import bunnyRightGif from 'images/bunnies/Alice/right_gif.gif';
import bunnyUpGif from 'images/bunnies/Alice/up_gif.gif';
import bunnyDownGif from 'images/bunnies/Alice/down_gif.gif';
import bunnyLoafLeftImg from 'images/bunnies/Alice/loaf_left.png';
import bunnyLoafRightImg from 'images/bunnies/Alice/loaf_right.png';
import bunnyLoafUpImg from 'images/bunnies/Alice/loaf_up.png';
import bunnyLoafDownImg from 'images/bunnies/Alice/loaf_down.png';
import bunnyFlopLeftImg from 'images/bunnies/Alice/flop_left.png';
import bunnyFlopRightImg from 'images/bunnies/Alice/flop_right.png';
import bunnyFlopUpImg from 'images/bunnies/Alice/flop_up.png';
import bunnyFlopDownImg from 'images/bunnies/Alice/flop_down.png';
import bunnyCloseUpImg from 'images/bunnies/Alice/close_up.png';
import * as constants from './constants';

export default class Alice {
  constructor() {
    this.name = 'Alice';
    this.giveSkill = 'zoom';
    this.hasCollected = false;
    this.goingToTile = false;
    this.position = { x: 200, y: 380 };
    this.onTile = { x: 4, y: 8 };
    this.height = constants.BUNNY_HEIGHT;
    this.width = constants.BUNNY_WIDTH;
    this.id = 6;
    this.groupTile = { x: 4, y: 5 };
    this.groupPosition = { x: 300, y: 400 };
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
      closeup: bunnyCloseUpImg,
    };
  }
}
