import bunnyLeftImg from 'images/bunnies/Simba/left_1.png';
import bunnyRightImg from 'images/bunnies/Simba/right.png';
import bunnyUpImg from 'images/bunnies/Simba/up_1.png';
import bunnyDownImg from 'images/bunnies/Simba/down_1.png';
import bunnyLeftGif from 'images/bunnies/Simba/left_gif.gif';
import bunnyRightGif from 'images/bunnies/Simba/right_gif.gif';
import bunnyUpGif from 'images/bunnies/Simba/up_gif.gif';
import bunnyDownGif from 'images/bunnies/Simba/down_gif.gif';
import bunnyLoafLeftImg from 'images/bunnies/Simba/loaf_left.png';
import bunnyLoafRightImg from 'images/bunnies/Simba/loaf_right.png';
import bunnyLoafUpImg from 'images/bunnies/Simba/loaf_up.png';
import bunnyLoafDownImg from 'images/bunnies/Simba/loaf_down.png';
import bunnyFlopLeftImg from 'images/bunnies/Simba/flop_left.png';
import bunnyFlopRightImg from 'images/bunnies/Simba/flop_right.png';
import bunnyFlopUpImg from 'images/bunnies/Simba/flop_up.png';
import bunnyFlopDownImg from 'images/bunnies/Simba/flop_down.png';
import bunnyCloseUpImg from 'images/bunnies/bunny_close_1.png'; // TODO: Use correct image for Simba
import * as constants from './constants';

export default class Simba {
  constructor() {
    this.name = 'Simba';
    this.giveSkill = 'dig';
    this.hasCollected = false;
    this.goingToTile = false;
    this.position = { x: 1050, y: 500 };
    this.onTile = { x: 6, y: 4 };
    this.height = constants.BUNNY_HEIGHT;
    this.width = constants.BUNNY_WIDTH;
    this.id = 1;
    this.groupTile = { x: 4, y: 7 };
    this.groupPosition = { x: 775, y: 60 };
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
