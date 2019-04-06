import bunnyLeftImg from 'images/bunnies/Spencer/left_1.png';
import bunnyRightImg from 'images/bunnies/Spencer/right.png';
import bunnyUpImg from 'images/bunnies/Spencer/up_1.png';
import bunnyDownImg from 'images/bunnies/Spencer/down_1.png';
import bunnyLeftGif from 'images/bunnies/Spencer/left_gif.gif';
import bunnyRightGif from 'images/bunnies/Spencer/right_gif.gif';
import bunnyUpGif from 'images/bunnies/Spencer/up_gif.gif';
import bunnyDownGif from 'images/bunnies/Spencer/down_gif.gif';
import bunnyLoafLeftImg from 'images/bunnies/Spencer/loaf_left.png';
import bunnyLoafRightImg from 'images/bunnies/Spencer/loaf_right.png';
import bunnyLoafUpImg from 'images/bunnies/Spencer/loaf_up.png';
import bunnyLoafDownImg from 'images/bunnies/Spencer/loaf_down.png';
import bunnyFlopLeftImg from 'images/bunnies/Spencer/flop_left.png';
import bunnyFlopRightImg from 'images/bunnies/Spencer/flop_right.png';
import bunnyFlopUpImg from 'images/bunnies/Spencer/flop_up.png';
import bunnyFlopDownImg from 'images/bunnies/Spencer/flop_down.png';
import * as constants from './constants';

// TODO: use actual images
export default class Spencer {
  constructor() {
    this.name = 'Spencer';
    this.giveSkill = 'groom';
    this.hasCollected = false;
    this.goingToTile = false;
    this.position = { x: 200, y: 200 };
    this.onTile = { x: 5, y: 5 };
    this.height = constants.BUNNY_HEIGHT;
    this.width = constants.BUNNY_WIDTH;
    this.id = 4;
    this.groupTile = { x: 4, y: 6 };
    this.groupPosition = { x: 1050, y: 450 };
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
