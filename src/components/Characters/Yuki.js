import bunnyLeftImg from 'images/bunnies/Yuki/left_1.png';
import bunnyRightImg from 'images/bunnies/Yuki/right.png';
import bunnyUpImg from 'images/bunnies/Yuki/up_1.png';
import bunnyDownImg from 'images/bunnies/Yuki/down_1.png';
import bunnyLeftGif from 'images/bunnies/Yuki/left_gif.gif';
import bunnyRightGif from 'images/bunnies/Yuki/right_gif.gif';
import bunnyUpGif from 'images/bunnies/Yuki/up_gif.gif';
import bunnyDownGif from 'images/bunnies/Yuki/down_gif.gif';
import bunnyLoafLeftImg from 'images/bunnies/Yuki/loaf_left.png';
import bunnyLoafRightImg from 'images/bunnies/Yuki/loaf_right.png';
import bunnyLoafUpImg from 'images/bunnies/Yuki/loaf_up.png';
import bunnyLoafDownImg from 'images/bunnies/Yuki/loaf_down.png';
import bunnyFlopLeftImg from 'images/bunnies/Yuki/flop_left.png';
import bunnyFlopRightImg from 'images/bunnies/Yuki/flop_right.png';
import bunnyFlopUpImg from 'images/bunnies/Yuki/flop_up.png';
import bunnyFlopDownImg from 'images/bunnies/Yuki/flop_down.png';
import * as constants from './constants';

// TODO: use actual images
export default class Yuki {
  constructor() {
    this.name = 'Yuki';
    this.hasCollected = false;
    this.goingToTile = false;
    this.position = { x: 1050, y: 100 };
    this.onTile = { x: 1, y: 8 };
    this.height = constants.BUNNY_HEIGHT;
    this.width = constants.BUNNY_WIDTH;
    this.id = 12;
    this.groupTile = { x: 4, y: 7 };
    this.groupPosition = { x: 80, y: 100 };
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
