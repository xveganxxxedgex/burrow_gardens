import bunnyLeftImg from 'images/bunnies/Sebastian/left_1.png';
import bunnyRightImg from 'images/bunnies/Sebastian/right.png';
import bunnyUpImg from 'images/bunnies/Sebastian/up_1.png';
import bunnyDownImg from 'images/bunnies/Sebastian/down_1.png';
import bunnyLeftGif from 'images/bunnies/Sebastian/left_gif.gif';
import bunnyRightGif from 'images/bunnies/Sebastian/right_gif.gif';
import bunnyUpGif from 'images/bunnies/Sebastian/up_gif.gif';
import bunnyDownGif from 'images/bunnies/Sebastian/down_gif.gif';
import bunnyLoafLeftImg from 'images/bunnies/Sebastian/loaf_left.png';
import bunnyLoafRightImg from 'images/bunnies/Sebastian/loaf_right.png';
import bunnyLoafUpImg from 'images/bunnies/Sebastian/loaf_up.png';
import bunnyLoafDownImg from 'images/bunnies/Sebastian/loaf_down.png';
import bunnyFlopLeftImg from 'images/bunnies/Sebastian/flop_left.png';
import bunnyFlopRightImg from 'images/bunnies/Sebastian/flop_right.png';
import bunnyFlopUpImg from 'images/bunnies/Sebastian/flop_up.png';
import bunnyFlopDownImg from 'images/bunnies/Sebastian/flop_down.png';
import * as constants from './constants';

// TODO: use actual images
export default class Sebastian {
  constructor() {
    this.name = 'Sebastian';
    this.giveSkill = 'jump';
    this.needsAbility = 'binky';
    this.hasCollected = false;
    this.goingToTile = false;
    this.position = { x: 400, y: 350 };
    this.onTile = { x: 9, y: 4 };
    this.height = constants.BUNNY_HEIGHT;
    this.width = constants.BUNNY_WIDTH;
    this.id = 7;
    this.groupTile = { x: 4, y: 6 };
    this.groupPosition = { x: 100, y: 180 };
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
