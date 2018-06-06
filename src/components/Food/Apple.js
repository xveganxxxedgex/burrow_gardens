import image from 'images/food/apple1.png';

export default class Apple {
  constructor({ position, id, parentId }) {
    this.position = position;
    this.height = 21;
    this.width = 17;
    this.type = 'Apple';
    this.collected = false;
    this.image = image;
    this.id = id;
    this.onParent = !!parentId;
    this.parent = parentId;
    this.needsAbility = 'stomp';
  }
}
