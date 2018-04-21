import bunnyLeftImg from 'images/bunnies/bunny.png';
import bunnyUpImg from 'images/bunnies/bunny_up.png';
import bunnyDownImg from 'images/bunnies/bunny_down.png';
import bunnyLeftGif from 'images/bunnies/bunny_gif.gif';
import bunnyUpGif from 'images/bunnies/bunny_up_gif.gif';
import bunnyDownGif from 'images/bunnies/bunny_down_gif.gif';
import bunnyLoafImg from 'images/bunnies/bunny_loaf.png';
import bunnyLoafUpImg from 'images/bunnies/bunny_up_loaf.png';
import bunnyLoafDownImg from 'images/bunnies/bunny_down_loaf.png';
import bunnyFlopImg from 'images/bunnies/bunny_flop.png';
import bunnyFlopUpImg from 'images/bunnies/bunny_up_flop.png';
import bunnyFlopDownImg from 'images/bunnies/bunny_down_flop.png';
import * as constants from './constants';

// TODO: use actual images
export default class Spencer {
  constructor() {
    this.name = 'Spencer';
    this.giveSkill = 'groom';
    this.hasCollected = false;
    this.goingToTile = false;
    this.position = { x: 60, y: 60 };
    this.onTile = { x: 1, y: 5 };
    this.height = constants.BUNNY_HEIGHT;
    this.width = constants.BUNNY_WIDTH;
    this.id = 4;
    this.bunnyImages = {
      left: bunnyLeftImg,
      up: bunnyUpImg,
      down: bunnyDownImg,
      leftGif: bunnyLeftGif,
      upGif: bunnyUpGif,
      downGif: bunnyDownGif,
      loaf: bunnyLoafImg,
      loafUp: bunnyLoafUpImg,
      loafDown: bunnyLoafDownImg,
      flop: bunnyFlopImg,
      flopUp: bunnyFlopUpImg,
      flopDown: bunnyFlopDownImg
    }
  }
}