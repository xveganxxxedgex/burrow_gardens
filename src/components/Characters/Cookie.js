import bunnyLeftImg from 'images/bunnies/Cookie/left_1.png';
import bunnyRightImg from 'images/bunnies/Cookie/right.png';
import bunnyUpImg from 'images/bunnies/Cookie/up_1.png';
import bunnyDownImg from 'images/bunnies/Cookie/down_1.png';
import bunnyLeftGif from 'images/bunnies/Cookie/left_gif.gif';
import bunnyRightGif from 'images/bunnies/Cookie/right_gif.gif';
import bunnyUpGif from 'images/bunnies/Cookie/up_gif.gif';
import bunnyDownGif from 'images/bunnies/Cookie/down_gif.gif';
import bunnyLoafLeftImg from 'images/bunnies/Cookie/loaf_left.png';
import bunnyLoafRightImg from 'images/bunnies/Cookie/loaf_right.png';
import bunnyLoafUpImg from 'images/bunnies/Cookie/loaf_up.png';
import bunnyLoafDownImg from 'images/bunnies/Cookie/loaf_down.png';
import bunnyFlopLeftImg from 'images/bunnies/Cookie/flop_left.png';
import bunnyFlopRightImg from 'images/bunnies/Cookie/flop_right.png';
import bunnyFlopUpImg from 'images/bunnies/Cookie/flop_up.png';
import bunnyFlopDownImg from 'images/bunnies/Cookie/flop_down.png';
import bunnyCloseUpImg from 'images/bunnies/Cookie/close_up.png';
import * as constants from './constants';

export default class Cookie {
  constructor() {
    this.name = 'Cookie';
    this.hasCollected = false;
    this.goingToTile = false;
    this.position = { x: 350, y: 400 };
    this.onTile = { x: 4, y: 1 };
    this.height = constants.BUNNY_HEIGHT;
    this.width = constants.BUNNY_WIDTH;
    this.id = 13;
    this.groupTile = { x: 4, y: 7 };
    this.groupPosition = { x: 1000, y: 500 };
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
