import image from 'images/food/strawberry.png';

export default class Strawberry {
  constructor({ position, id, parentId }) {
    this.position = position;
    this.height = 16;
    this.width = 20;
    this.type = 'Strawberry';
    this.collected = false;
    this.image = image;
    this.id = id;
    this.onParent = !!parentId;
    this.parent = parentId;
    this.needsAbility = 'stomp';
  }
}
