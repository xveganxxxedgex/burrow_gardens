import image from 'images/scenery/tree.png';

export default class Tree {
  constructor(position, id, produce = []) {
    this.position = position;
    this.id = id;
    this.height = 340;
    this.width = 240;
    this.sceneryClass = 'tree';
    this.image = image;
    this.type = 'Tree';
    this.produce = produce;
    this.nonColliding = true;
    this.collisionPoints = [
      { position: { x: position.x + 30, y: position.y + 5 }, height: 20, width: 180, type: 'hitbox', hitboxFor: id, },
      { position: { x: position.x, y: position.y + 25 }, height: 60, width: 240, type: 'hitbox', hitboxFor: id, },
      { position: { x: position.x, y: position.y + 85 }, height: 50, width: 240, type: 'hitbox', hitboxFor: id, },
      { position: { x: position.x + 20, y: position.y + 135 }, height: 35, width: 200, type: 'hitbox', hitboxFor: id, },
      { position: { x: position.x + 85, y: position.y + 170 }, height: 90, width: 60, type: 'hitbox', hitboxFor: id, },
      { position: { x: position.x + 60, y: position.y + 260 }, height: 30, width: 120, type: 'hitbox', hitboxFor: id, },
      { position: { x: position.x + 20, y: position.y + 290 }, height: 45, width: 170, type: 'hitbox', hitboxFor: id, produceAction: true },
    ];
  }
}
