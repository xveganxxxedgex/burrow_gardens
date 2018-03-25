import * as actions from '../../actions';

describe('Actions;', () => {
  describe('isXAxis;', () => {
    it('returns true when axis is x', () => {
      const axisIsX = actions.isXAxis('x');
      expect(axisIsX).toBeTruthy();
    });

    it('returns false when axis is y', () => {
      const axisIsX = actions.isXAxis('y');
      expect(axisIsX).toBeFalsy();
    });
  });

  describe('getOppositeAxis;', () => {
    it('returns correct opposite of X axis', () => {
      const oppositeOfX = actions.getOppositeAxis('x');
      expect(oppositeOfX).toEqual('y');
    });

    it('returns correct opposite of Y axis', () => {
      const oppositeOfY = actions.getOppositeAxis('y');
      expect(oppositeOfY).toEqual('x');
    });
  });

  describe('getDimensionFromAxis;', () => {
    it('returns correct dimension for X axis', () => {
      const dimension = actions.getDimensionFromAxis('x');
      expect(dimension).toEqual('width');
    });

    it('returns correct dimension for Y axis', () => {
      const dimension = actions.getDimensionFromAxis('y');
      expect(dimension).toEqual('height');
    });
  });

  describe('getForwardDimension;', () => {
    it('returns correct dimension for X axis', () => {
      const dimension = actions.getForwardDimension('x');
      expect(dimension).toEqual('right');
    });

    it('returns correct dimension for Y axis', () => {
      const dimension = actions.getForwardDimension('y');
      expect(dimension).toEqual('bottom');
    });
  });

  describe('getBackwardDimension;', () => {
    it('returns correct dimension for X axis', () => {
      const dimension = actions.getBackwardDimension('x');
      expect(dimension).toEqual('left');
    });

    it('returns correct dimension for Y axis', () => {
      const dimension = actions.getBackwardDimension('y');
      expect(dimension).toEqual('top');
    });
  });

  describe('getForwardDirection;', () => {
    it('returns correct direction for X axis', () => {
      const dimension = actions.getForwardDirection('x');
      expect(dimension).toEqual('right');
    });

    it('returns correct direction for Y axis', () => {
      const dimension = actions.getForwardDirection('y');
      expect(dimension).toEqual('down');
    });
  });

  describe('isMovingOnYAxis;', () => {
    it('returns correct value when direction is up', () => {
      const isOnYAxis = actions.isMovingOnYAxis('up');
      expect(isOnYAxis).toBeTruthy();
    });

    it('returns correct value when direction is down', () => {
      const isOnYAxis = actions.isMovingOnYAxis('down');
      expect(isOnYAxis).toBeTruthy();
    });

    it('returns correct value when direction is left', () => {
      const isOnYAxis = actions.isMovingOnYAxis('left');
      expect(isOnYAxis).toBeFalsy();
    });

    it('returns correct value when direction is right', () => {
      const isOnYAxis = actions.isMovingOnYAxis('right');
      expect(isOnYAxis).toBeFalsy();
    });
  });

  describe('getAxisFromDirection;', () => {
    it('returns correct value when direction is up', () => {
      const axis = actions.getAxisFromDirection('up');
      expect(axis).toEqual('y');
    });

    it('returns correct value when direction is down', () => {
      const axis = actions.getAxisFromDirection('down');
      expect(axis).toEqual('y');
    });

    it('returns correct value when direction is left', () => {
      const axis = actions.getAxisFromDirection('left');
      expect(axis).toEqual('x');
    });

    it('returns correct value when direction is right', () => {
      const axis = actions.getAxisFromDirection('right');
      expect(axis).toEqual('x');
    });
  });

  describe('entityIsMovingBack;', () => {
    it('returns correct value when direction is up', () => {
      const isMovingBack = actions.entityIsMovingBack('up');
      expect(isMovingBack).toBeTruthy();
    });

    it('returns correct value when direction is down', () => {
      const isMovingBack = actions.entityIsMovingBack('down');
      expect(isMovingBack).toBeFalsy();
    });

    it('returns correct value when direction is left', () => {
      const isMovingBack = actions.entityIsMovingBack('left');
      expect(isMovingBack).toBeTruthy();
    });

    it('returns correct value when direction is right', () => {
      const isMovingBack = actions.entityIsMovingBack('right');
      expect(isMovingBack).toBeFalsy();
    });
  });

  describe('getBackwardDirection;', () => {
    it('returns correct direction for X axis', () => {
      const dimension = actions.getBackwardDirection('x');
      expect(dimension).toEqual('left');
    });

    it('returns correct direction for Y axis', () => {
      const dimension = actions.getBackwardDirection('y');
      expect(dimension).toEqual('up');
    });
  });

  describe('getSquareDiagonalPercentage;', () => {
    it('returns correct diagonal percentage', () => {
      const percentage = actions.getSquareDiagonalPercentage(20);
      expect(percentage).toEqual(0.7071067811865476);
    });
  });

  describe('getCharacterWithNextPosition;', () => {
    it('returns correct object when x and y params are the same as the character x and y', () => {
      const character = {
        x: 100,
        y: 200,
        height: 40,
        width: 60
      };
      const expectedResult = {
        x: 100,
        y: 200,
        height: 40,
        width: 60,
        position: {
          x: 100,
          y: 200
        }
      };
      const characterWithNextPosition = actions.getCharacterWithNextPosition(character, 100, 200);
      expect(characterWithNextPosition).toEqual(expectedResult);
    });

    it('returns correct object when x and y params differ from the character x and y', () => {
      const character = {
        x: 100,
        y: 200,
        height: 40,
        width: 60
      };
      const expectedResult = {
        x: 100,
        y: 200,
        height: 40,
        width: 60,
        position: {
          x: 400,
          y: 700
        }
      };
      const characterWithNextPosition = actions.getCharacterWithNextPosition(character, 400, 700);
      expect(characterWithNextPosition).toEqual(expectedResult);
    });

    it('returns correct object when character object does not have x and y', () => {
      const character = {
        height: 40,
        width: 60
      };
      const expectedResult = {
        height: 40,
        width: 60,
        position: {
          x: 100,
          y: 200
        }
      };
      const characterWithNextPosition = actions.getCharacterWithNextPosition(character, 100, 200);
      expect(characterWithNextPosition).toEqual(expectedResult);
    });
  });

  describe('getOppositeDirection;', () => {
    it('returns opposite direction for up', () => {
      const direction = actions.getOppositeDirection('up');
      expect(direction).toEqual('down');
    });

    it('returns opposite direction for down', () => {
      const direction = actions.getOppositeDirection('down');
      expect(direction).toEqual('up');
    });

    it('returns opposite direction for left', () => {
      const direction = actions.getOppositeDirection('left');
      expect(direction).toEqual('right');
    });

    it('returns opposite direction for right', () => {
      const direction = actions.getOppositeDirection('right');
      expect(direction).toEqual('left');
    });
  });

  describe('getElementRect;', () => {
    it('returns correct rect for entity with x, y, height, and width at base level', () => {
      const entity = {
        x: 100,
        y: 200,
        height: 40,
        width: 60
      };
      const expectedRect = {
        x: 100,
        y: 200,
        height: 40,
        width: 60,
        right: 160,
        bottom: 240
      };
      const rect = actions.getElementRect(entity);
      expect(rect).toEqual(expectedRect);
    });

    it('returns correct rect for entity with x and y nested in position object', () => {
      const entity = {
        position: {
          x: 100,
          y: 200,
        },
        height: 40,
        width: 60
      };
      const expectedRect = {
        x: 100,
        y: 200,
        height: 40,
        width: 60,
        right: 160,
        bottom: 240
      };
      const rect = actions.getElementRect(entity);
      expect(rect).toEqual(expectedRect);
    });

    it('returns correct rect for entity with x and y nested in props.position object', () => {
      const entity = {
        props: {
          position: {
            x: 100,
            y: 200,
          }
        },
        height: 40,
        width: 60
      };
      const expectedRect = {
        x: 100,
        y: 200,
        height: 40,
        width: 60,
        right: 160,
        bottom: 240
      };
      const rect = actions.getElementRect(entity);
      expect(rect).toEqual(expectedRect);
    });

    it('returns correct rect for entity without x and y values', () => {
      const entity = {
        height: 40,
        width: 60
      };
      const expectedRect = {
        x: 0,
        y: 0,
        height: 40,
        width: 60,
        right: 60,
        bottom: 40
      };
      const rect = actions.getElementRect(entity);
      expect(rect).toEqual(expectedRect);
    });

    it('returns correct rect for entity with width and height at props level', () => {
      const entity = {
        x: 100,
        y: 200,
        props: {
          height: 40,
          width: 60
        }
      };
      const expectedRect = {
        x: 100,
        y: 200,
        height: 40,
        width: 60,
        right: 160,
        bottom: 240
      };
      const rect = actions.getElementRect(entity);
      expect(rect).toEqual(expectedRect);
    });

    it('returns correct rect for entity without height and width', () => {
      const entity = {
        x: 100,
        y: 200
      };
      const expectedRect = {
        x: 100,
        y: 200,
        height: 0,
        width: 0,
        right: 100,
        bottom: 200
      };
      const rect = actions.getElementRect(entity);
      expect(rect).toEqual(expectedRect);
    });

    it('returns correct rect for entity without x, y, height and width', () => {
      const entity = {};
      const expectedRect = {
        x: 0,
        y: 0,
        height: 0,
        width: 0,
        right: 0,
        bottom: 0
      };
      const rect = actions.getElementRect(entity);
      expect(rect).toEqual(expectedRect);
    });

    it('returns correct rect for entity with x and y at props.position level, and width and height at props level', () => {
      const entity = {
        props: {
          position: {
            x: 100,
            y: 200
          },
          height: 40,
          width: 60
        }
      };
      const expectedRect = {
        x: 100,
        y: 200,
        height: 40,
        width: 60,
        right: 160,
        bottom: 240
      };
      const rect = actions.getElementRect(entity);
      expect(rect).toEqual(expectedRect);
    });
  });

  describe('checkElementCollision;', () => {
    it('returns true when entities are colliding 1', () => {
      const element1 = { x: 100, y: 200, height: 50, width: 40 };
      const element2 = { x: 100, y: 200, height: 50, width: 40 };
      const isColliding = actions.checkElementCollision(element1, element2);
      expect(isColliding).toBeTruthy();
    });

    it('returns true when entities are colliding 2', () => {
      const element1 = { x: 100, y: 200, height: 50, width: 40 };
      const element2 = { x: 140, y: 249, height: 50, width: 40 };
      const isColliding = actions.checkElementCollision(element1, element2);
      expect(isColliding).toBeTruthy();
    });

    it('returns true when entities are colliding 3', () => {
      const element1 = { x: 100, y: 200, height: 50, width: 40 };
      const element2 = { x: 140, y: 210, height: 50, width: 40 };
      const isColliding = actions.checkElementCollision(element1, element2);
      expect(isColliding).toBeTruthy();
    });

    it('returns true when entities are colliding 4', () => {
      const element1 = { x: 100, y: 200, height: 50, width: 40 };
      const element2 = { x: 139, y: 250, height: 50, width: 40 };
      const isColliding = actions.checkElementCollision(element1, element2);
      expect(isColliding).toBeTruthy();
    });

    it('returns true when entities are colliding 5', () => {
      const element1 = { x: 100, y: 200, height: 50, width: 40 };
      const element2 = { x: 110, y: 250, height: 50, width: 40 };
      const isColliding = actions.checkElementCollision(element1, element2);
      expect(isColliding).toBeTruthy();
    });

    it('returns true when entities are colliding 6', () => {
      const element1 = { x: 100, y: 200, height: 50, width: 40 };
      const element2 = { x: 110, y: 210, height: 50, width: 40 };
      const isColliding = actions.checkElementCollision(element1, element2);
      expect(isColliding).toBeTruthy();
    });

    it('returns true when entities are colliding 7', () => {
      const element1 = { x: 100, y: 200, height: 50, width: 40 };
      const element2 = { x: 60, y: 160, height: 50, width: 40 };
      const isColliding = actions.checkElementCollision(element1, element2);
      expect(isColliding).toBeTruthy();
    });

    it('returns true when entities are colliding 8', () => {
      const element1 = { x: 100, y: 200, height: 50, width: 40 };
      const element2 = { x: 60, y: 150, height: 50, width: 40 };
      const isColliding = actions.checkElementCollision(element1, element2);
      expect(isColliding).toBeTruthy();
    });

    it('returns true when entities are colliding 9', () => {
      const element1 = { x: 100, y: 200, height: 50, width: 40 };
      const element2 = { x: 40, y: 150, height: 50, width: 60 };
      const isColliding = actions.checkElementCollision(element1, element2);
      expect(isColliding).toBeTruthy();
    });
    it('returns true when entities are colliding 10', () => {
      const element1 = { x: 100, y: 200, height: 50, width: 40 };
      const element2 = { x: 50, y: 120, height: 80, width: 50 };
      const isColliding = actions.checkElementCollision(element1, element2);
      expect(isColliding).toBeTruthy();
    });

    it('returns false when entities are not colliding 1', () => {
      const element1 = { x: 100, y: 200, height: 50, width: 40 };
      const element2 = { x: 200, y: 300, height: 50, width: 40 };
      const isColliding = actions.checkElementCollision(element1, element2);
      expect(isColliding).toBeFalsy();
    });

    it('returns false when entities are not colliding 2', () => {
      const element1 = { x: 100, y: 200, height: 50, width: 40 };
      const element2 = { x: 141, y: 300, height: 50, width: 40 };
      const isColliding = actions.checkElementCollision(element1, element2);
      expect(isColliding).toBeFalsy();
    });

    it('returns false when entities are not colliding 3', () => {
      const element1 = { x: 100, y: 200, height: 50, width: 40 };
      const element2 = { x: 200, y: 251, height: 50, width: 40 };
      const isColliding = actions.checkElementCollision(element1, element2);
      expect(isColliding).toBeFalsy();
    });

    it('returns false when entities are not colliding 4', () => {
      const element1 = { x: 100, y: 200, height: 50, width: 40 };
      const element2 = { x: 141, y: 251, height: 50, width: 40 };
      const isColliding = actions.checkElementCollision(element1, element2);
      expect(isColliding).toBeFalsy();
    });

    it('returns false when entities are not colliding 5', () => {
      const element1 = { x: 100, y: 200, height: 50, width: 40 };
      const element2 = { x: 59, y: 100, height: 50, width: 40 };
      const isColliding = actions.checkElementCollision(element1, element2);
      expect(isColliding).toBeFalsy();
    });

    it('returns false when entities are not colliding 6', () => {
      const element1 = { x: 100, y: 200, height: 50, width: 40 };
      const element2 = { x: 40, y: 149, height: 50, width: 40 };
      const isColliding = actions.checkElementCollision(element1, element2);
      expect(isColliding).toBeFalsy();
    });

    it('returns false when entities are not colliding 7', () => {
      const element1 = { x: 100, y: 200, height: 50, width: 40 };
      const element2 = { x: 40, y: 100, height: 50, width: 40 };
      const isColliding = actions.checkElementCollision(element1, element2);
      expect(isColliding).toBeFalsy();
    });
  });

  // TODO: Add tests for the getTargetDirection and some of the other more
  // intensive functions

  describe('getTargetDirection;', () => {
  });
});