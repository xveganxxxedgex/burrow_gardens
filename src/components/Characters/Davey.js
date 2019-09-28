import bunnyLeftImg from 'images/bunnies/Davey/left_1.png';
import bunnyRightImg from 'images/bunnies/Davey/right.png';
import bunnyUpImg from 'images/bunnies/Davey/up_1.png';
import bunnyDownImg from 'images/bunnies/Davey/down_1.png';
import bunnyLeftGif from 'images/bunnies/Davey/left_gif.gif';
import bunnyRightGif from 'images/bunnies/Davey/right_gif.gif';
import bunnyUpGif from 'images/bunnies/Davey/up_gif.gif';
import bunnyDownGif from 'images/bunnies/Davey/down_gif.gif';
import bunnyLoafLeftImg from 'images/bunnies/Davey/loaf_left.png';
import bunnyLoafRightImg from 'images/bunnies/Davey/loaf_right.png';
import bunnyLoafUpImg from 'images/bunnies/Davey/loaf_up.png';
import bunnyLoafDownImg from 'images/bunnies/Davey/loaf_down.png';
import bunnyFlopLeftImg from 'images/bunnies/Davey/flop_left.png';
import bunnyFlopRightImg from 'images/bunnies/Davey/flop_right.png';
import bunnyFlopUpImg from 'images/bunnies/Davey/flop_up.png';
import bunnyFlopDownImg from 'images/bunnies/Davey/flop_down.png';
import bunnyCloseUpImg from 'images/bunnies/Davey/close_up.png';
import * as constants from './constants';

export default class Davey {
  constructor() {
    this.name = 'Davey';
    this.giveSkill = 'stomp';
    this.hasCollected = false;
    this.goingToTile = false;
    this.position = { x: 650, y: 220 };
    this.onTile = { x: 5, y: 6 };
    this.height = constants.BUNNY_HEIGHT;
    this.width = constants.BUNNY_WIDTH;
    this.id = 8;
    this.groupTile = { x: 4, y: 7 };
    this.groupPosition = { x: 220, y: 400 };
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
