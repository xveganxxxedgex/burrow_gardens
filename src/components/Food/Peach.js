import image from 'images/food/peach.png';

export default class Peach {
  constructor({ position, id, parentId, flipX }) {
    this.position = position;
    this.height = 24;
    this.width = 21;
    this.type = 'Peach';
    this.collected = false;
    this.image = image;
    this.id = id;
    this.onParent = !!parentId;
    this.parent = parentId;
    this.needsAbility = 'stomp';
    this.flipX = flipX;
  }
}
