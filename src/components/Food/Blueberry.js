import image from 'images/food/blueberries.png';

export default class Blueberry {
  constructor({ position, id, parentId }) {
    this.position = position;
    this.height = 23;
    this.width = 23;
    this.type = 'Blueberry';
    this.collected = false;
    this.image = image;
    this.id = id;
    this.onParent = !!parentId;
    this.parent = parentId;
    this.needsAbility = 'stomp';
  }
}
