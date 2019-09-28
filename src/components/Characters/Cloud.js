import bunnyLeftImg from 'images/bunnies/Cloud/left_1.png';
import bunnyRightImg from 'images/bunnies/Cloud/right.png';
import bunnyUpImg from 'images/bunnies/Cloud/up_1.png';
import bunnyDownImg from 'images/bunnies/Cloud/down_1.png';
import bunnyLeftGif from 'images/bunnies/Cloud/left_gif.gif';
import bunnyRightGif from 'images/bunnies/Cloud/right_gif.gif';
import bunnyUpGif from 'images/bunnies/Cloud/up_gif.gif';
import bunnyDownGif from 'images/bunnies/Cloud/down_gif.gif';
import bunnyLoafLeftImg from 'images/bunnies/Cloud/loaf_left.png';
import bunnyLoafRightImg from 'images/bunnies/Cloud/loaf_right.png';
import bunnyLoafUpImg from 'images/bunnies/Cloud/loaf_up.png';
import bunnyLoafDownImg from 'images/bunnies/Cloud/loaf_down.png';
import bunnyFlopLeftImg from 'images/bunnies/Cloud/flop_left.png';
import bunnyFlopRightImg from 'images/bunnies/Cloud/flop_right.png';
import bunnyFlopUpImg from 'images/bunnies/Cloud/flop_up.png';
import bunnyFlopDownImg from 'images/bunnies/Cloud/flop_down.png';
import bunnyCloseUpImg from 'images/bunnies/Cloud/close_up.png';
import * as constants from './constants';

export default class Cloud {
  constructor() {
    this.name = 'Cloud';
    this.giveSkill = 'binky';
    this.needsAbility = 'groom';
    this.hasCollected = false;
    this.goingToTile = false;
    this.position = { x: 300, y: 350 };
    this.onTile = { x: 7, y: 2 };
    this.height = constants.BUNNY_HEIGHT;
    this.width = constants.BUNNY_WIDTH;
    this.id = 3;
    this.groupTile = { x: 4, y: 6 };
    this.groupPosition = { x: 900, y: 50 };
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
