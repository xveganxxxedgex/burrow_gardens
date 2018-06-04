import bunnyLeftImg from 'images/bunnies/bunny_left.png';
import bunnyRightImg from 'images/bunnies/bunny_right.png';
import bunnyUpImg from 'images/bunnies/bunny_up.png';
import bunnyDownImg from 'images/bunnies/bunny_down.png';
import bunnyLeftGif from 'images/bunnies/bunny_left_gif.gif';
import bunnyRightGif from 'images/bunnies/bunny_right_gif.gif';
import bunnyUpGif from 'images/bunnies/bunny_up_gif.gif';
import bunnyDownGif from 'images/bunnies/bunny_down_gif.gif';
import bunnyLoafLeftImg from 'images/bunnies/bunny_left_loaf.png';
import bunnyLoafRightImg from 'images/bunnies/bunny_right_loaf.png';
import bunnyLoafUpImg from 'images/bunnies/bunny_up_loaf.png';
import bunnyLoafDownImg from 'images/bunnies/bunny_down_loaf.png';
import bunnyFlopLeftImg from 'images/bunnies/bunny_left_flop.png';
import bunnyFlopRightImg from 'images/bunnies/bunny_right_flop.png';
import bunnyFlopUpImg from 'images/bunnies/bunny_up_flop.png';
import bunnyFlopDownImg from 'images/bunnies/bunny_down_flop.png';
import bunnyCloseUpImg from 'images/bunnies/bunny_close_1.png'; // TODO: Use correct image for Simba
import * as constants from './constants';

export default class Simba {
  constructor() {
    this.name = 'Simba';
    this.giveSkill = 'dig';
    this.hasCollected = false;
    this.goingToTile = false;
    this.position = { x: 300, y: 230 };
    this.onTile = { x: 1, y: 1 };
    this.height = constants.BUNNY_HEIGHT;
    this.width = constants.BUNNY_WIDTH;
    this.id = 1;
    this.groupTile = { x: 1, y: 2 };
    this.groupPosition = { x: 725, y: 150 };
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
      closeup: bunnyCloseUpImg
    }
  }
}