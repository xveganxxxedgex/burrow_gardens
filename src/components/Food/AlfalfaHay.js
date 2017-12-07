import image from 'images/alfalfa_hay1.png';

export default class AlfalfaHay {
  constructor(position, id) {
    this.position = position;
    this.height = 35;
    this.width = 59;
    this.type = 'AlfalfaHay';
    this.collected = false;
    this.image = image;
    this.id = id;
  }
}