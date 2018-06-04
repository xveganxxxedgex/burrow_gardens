import Baobab from 'baobab';

import * as actions from '../../actions';
import { __RewireAPI__ as ActionsRewire } from '../../actions';
import * as sceneryConstants from 'components/Scenery/constants';

describe('Actions;', () => {
  const boardDimensions = {
    height: 600,
    width: 1200,
    top: 0,
    bottom: 600,
    left: 0,
    right: 1200
  };


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

    it('returns correct value when direction is top', () => {
      const isOnYAxis = actions.isMovingOnYAxis('top');
      expect(isOnYAxis).toBeTruthy();
    });

    it('returns correct value when direction is bottom', () => {
      const isOnYAxis = actions.isMovingOnYAxis('bottom');
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

    it('returns correct value when direction is top', () => {
      const axis = actions.getAxisFromDirection('top');
      expect(axis).toEqual('y');
    });

    it('returns correct value when direction is bottom', () => {
      const axis = actions.getAxisFromDirection('bottom');
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


  describe('isBackwardsDirection;', () => {
    it('returns correct value when direction is up', () => {
      const isMovingBack = actions.isBackwardsDirection('up');
      expect(isMovingBack).toBeTruthy();
    });

    it('returns correct value when direction is down', () => {
      const isMovingBack = actions.isBackwardsDirection('down');
      expect(isMovingBack).toBeFalsy();
    });

    it('returns correct value when direction is top', () => {
      const isMovingBack = actions.isBackwardsDirection('top');
      expect(isMovingBack).toBeTruthy();
    });

    it('returns correct value when direction is bottom', () => {
      const isMovingBack = actions.isBackwardsDirection('bottom');
      expect(isMovingBack).toBeFalsy();
    });

    it('returns correct value when direction is left', () => {
      const isMovingBack = actions.isBackwardsDirection('left');
      expect(isMovingBack).toBeTruthy();
    });

    it('returns correct value when direction is right', () => {
      const isMovingBack = actions.isBackwardsDirection('right');
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


    describe('excludeEquals is true', () => {
      it('returns true when entities are at the same position', () => {
        const element1 = { x: 100, y: 200, height: 50, width: 40 };
        const element2 = { x: 100, y: 200, height: 50, width: 40 };
        const isColliding = actions.checkElementCollision(element1, element2, null, null, true);
        expect(isColliding).toBeTruthy();
      });

      it('returns false when entities are colliding 2', () => {
        const element1 = { x: 100, y: 200, height: 50, width: 40 };
        const element2 = { x: 140, y: 249, height: 50, width: 40 };
        const isColliding = actions.checkElementCollision(element1, element2, null, null, true);
        expect(isColliding).toBeFalsy();
      });

      it('returns false when entities are colliding 3', () => {
        const element1 = { x: 100, y: 200, height: 50, width: 40 };
        const element2 = { x: 140, y: 210, height: 50, width: 40 };
        const isColliding = actions.checkElementCollision(element1, element2, null, null, true);
        expect(isColliding).toBeFalsy();
      });

      it('returns false when entities are colliding 4', () => {
        const element1 = { x: 100, y: 200, height: 50, width: 40 };
        const element2 = { x: 139, y: 250, height: 50, width: 40 };
        const isColliding = actions.checkElementCollision(element1, element2, null, null, true);
        expect(isColliding).toBeFalsy();
      });

      it('returns false when entities are colliding 5', () => {
        const element1 = { x: 100, y: 200, height: 50, width: 40 };
        const element2 = { x: 110, y: 250, height: 50, width: 40 };
        const isColliding = actions.checkElementCollision(element1, element2, null, null, true);
        expect(isColliding).toBeFalsy();
      });

      it('returns true when entities are colliding 6', () => {
        const element1 = { x: 100, y: 200, height: 50, width: 40 };
        const element2 = { x: 110, y: 210, height: 50, width: 40 };
        const isColliding = actions.checkElementCollision(element1, element2, null, null, true);
        expect(isColliding).toBeTruthy();
      });

      it('returns false when entities are colliding 7', () => {
        const element1 = { x: 100, y: 200, height: 50, width: 40 };
        const element2 = { x: 60, y: 160, height: 50, width: 40 };
        const isColliding = actions.checkElementCollision(element1, element2, null, null, true);
        expect(isColliding).toBeFalsy();
      });

      it('returns false when entities are colliding 8', () => {
        const element1 = { x: 100, y: 200, height: 50, width: 40 };
        const element2 = { x: 60, y: 150, height: 50, width: 40 };
        const isColliding = actions.checkElementCollision(element1, element2, null, null, true);
        expect(isColliding).toBeFalsy();
      });

      it('returns false when entities are colliding 9', () => {
        const element1 = { x: 100, y: 200, height: 50, width: 40 };
        const element2 = { x: 40, y: 150, height: 50, width: 60 };
        const isColliding = actions.checkElementCollision(element1, element2, null, null, true);
        expect(isColliding).toBeFalsy();
      });

      it('returns false when entities are colliding 10', () => {
        const element1 = { x: 100, y: 200, height: 50, width: 40 };
        const element2 = { x: 50, y: 120, height: 80, width: 50 };
        const isColliding = actions.checkElementCollision(element1, element2, null, null, true);
        expect(isColliding).toBeFalsy();
      });

      it('returns false when entities are not colliding 1', () => {
        const element1 = { x: 100, y: 200, height: 50, width: 40 };
        const element2 = { x: 200, y: 300, height: 50, width: 40 };
        const isColliding = actions.checkElementCollision(element1, element2, null, null, true);
        expect(isColliding).toBeFalsy();
      });

      it('returns false when entities are not colliding 2', () => {
        const element1 = { x: 100, y: 200, height: 50, width: 40 };
        const element2 = { x: 141, y: 300, height: 50, width: 40 };
        const isColliding = actions.checkElementCollision(element1, element2, null, null, true);
        expect(isColliding).toBeFalsy();
      });

      it('returns false when entities are not colliding 3', () => {
        const element1 = { x: 100, y: 200, height: 50, width: 40 };
        const element2 = { x: 200, y: 251, height: 50, width: 40 };
        const isColliding = actions.checkElementCollision(element1, element2, null, null, true);
        expect(isColliding).toBeFalsy();
      });

      it('returns false when entities are not colliding 4', () => {
        const element1 = { x: 100, y: 200, height: 50, width: 40 };
        const element2 = { x: 141, y: 251, height: 50, width: 40 };
        const isColliding = actions.checkElementCollision(element1, element2, null, null, true);
        expect(isColliding).toBeFalsy();
      });

      it('returns false when entities are not colliding 5', () => {
        const element1 = { x: 100, y: 200, height: 50, width: 40 };
        const element2 = { x: 59, y: 100, height: 50, width: 40 };
        const isColliding = actions.checkElementCollision(element1, element2, null, null, true);
        expect(isColliding).toBeFalsy();
      });

      it('returns false when entities are not colliding 6', () => {
        const element1 = { x: 100, y: 200, height: 50, width: 40 };
        const element2 = { x: 40, y: 149, height: 50, width: 40 };
        const isColliding = actions.checkElementCollision(element1, element2, null, null, true);
        expect(isColliding).toBeFalsy();
      });

      it('returns false when entities are not colliding 7', () => {
        const element1 = { x: 100, y: 200, height: 50, width: 40 };
        const element2 = { x: 40, y: 100, height: 50, width: 40 };
        const isColliding = actions.checkElementCollision(element1, element2, null, null, true);
        expect(isColliding).toBeFalsy();
      });
    });


    describe('heightOffset is provided;', () => {
      it('returns true when elements are at the same position', () => {
        const element1 = { x: 100, y: 200, height: 50, width: 40 };
        const element2 = { x: 100, y: 200, height: 50, width: 40 };
        const isColliding = actions.checkElementCollision(element1, element2, 50);
        expect(isColliding).toBeTruthy();
      });

      it('returns true when element is colliding within the y threshold', () => {
        const element1 = { x: 100, y: 299, height: 50, width: 40 };
        const element2 = { x: 100, y: 200, height: 50, width: 40 };
        const isColliding = actions.checkElementCollision(element1, element2, 50);
        expect(isColliding).toBeTruthy();
      });

      it('returns true when element is colliding at the y threshold', () => {
        const element1 = { x: 100, y: 300, height: 50, width: 40 };
        const element2 = { x: 100, y: 200, height: 50, width: 40 };
        const isColliding = actions.checkElementCollision(element1, element2, 50);
        expect(isColliding).toBeTruthy();
      });

      it('returns false when element is not colliding', () => {
        const element1 = { x: 300, y: 500, height: 50, width: 40 };
        const element2 = { x: 100, y: 200, height: 50, width: 40 };
        const isColliding = actions.checkElementCollision(element1, element2, 50);
        expect(isColliding).toBeFalsy();
      });


      describe('excludeEquals is true;', () => {
        it('returns true when elements are at the same position', () => {
          const element1 = { x: 100, y: 200, height: 50, width: 40 };
          const element2 = { x: 100, y: 200, height: 50, width: 40 };
          const isColliding = actions.checkElementCollision(element1, element2, 50, null, true);
          expect(isColliding).toBeTruthy();
        });

        it('returns true when element is colliding within the y threshold', () => {
          const element1 = { x: 100, y: 299, height: 50, width: 40 };
          const element2 = { x: 100, y: 200, height: 50, width: 40 };
          const isColliding = actions.checkElementCollision(element1, element2, 50, null, true);
          expect(isColliding).toBeTruthy();
        });

        it('returns false when element is at the y threshold', () => {
          const element1 = { x: 100, y: 300, height: 50, width: 40 };
          const element2 = { x: 100, y: 200, height: 50, width: 40 };
          const isColliding = actions.checkElementCollision(element1, element2, 50, null, true);
          expect(isColliding).toBeFalsy();
        });

        it('returns false when element is not colliding', () => {
          const element1 = { x: 300, y: 500, height: 50, width: 40 };
          const element2 = { x: 100, y: 200, height: 50, width: 40 };
          const isColliding = actions.checkElementCollision(element1, element2, 50, null, true);
          expect(isColliding).toBeFalsy();
        });
      });


      describe('widthOffset is provided;', () => {
        it('returns true when elements are at the same position', () => {
          const element1 = { x: 100, y: 200, height: 50, width: 40 };
          const element2 = { x: 100, y: 200, height: 50, width: 40 };
          const isColliding = actions.checkElementCollision(element1, element2, 50, 50);
          expect(isColliding).toBeTruthy();
        });

        it('returns true when element is colliding at the x threshold', () => {
          const element1 = { x: 190, y: 200, height: 50, width: 40 };
          const element2 = { x: 100, y: 200, height: 50, width: 40 };
          const isColliding = actions.checkElementCollision(element1, element2, 50, 50);
          expect(isColliding).toBeTruthy();
        });

        it('returns true when element is colliding at the y threshold', () => {
          const element1 = { x: 100, y: 300, height: 50, width: 40 };
          const element2 = { x: 100, y: 200, height: 50, width: 40 };
          const isColliding = actions.checkElementCollision(element1, element2, 50, 50);
          expect(isColliding).toBeTruthy();
        });

        it('returns true when element is colliding within the x threshold', () => {
          const element1 = { x: 189, y: 200, height: 50, width: 40 };
          const element2 = { x: 100, y: 200, height: 50, width: 40 };
          const isColliding = actions.checkElementCollision(element1, element2, 50, 50);
          expect(isColliding).toBeTruthy();
        });

        it('returns true when element is colliding within the y threshold', () => {
          const element1 = { x: 100, y: 299, height: 50, width: 40 };
          const element2 = { x: 100, y: 200, height: 50, width: 40 };
          const isColliding = actions.checkElementCollision(element1, element2, 50, 50);
          expect(isColliding).toBeTruthy();
        });

        it('returns false when element is not colliding', () => {
          const element1 = { x: 300, y: 500, height: 50, width: 40 };
          const element2 = { x: 100, y: 200, height: 50, width: 40 };
          const isColliding = actions.checkElementCollision(element1, element2, 50, 50);
          expect(isColliding).toBeFalsy();
        });


        describe('excludeEquals is true;', () => {
          it('returns true when elements are at the same position', () => {
            const element1 = { x: 100, y: 200, height: 50, width: 40 };
            const element2 = { x: 100, y: 200, height: 50, width: 40 };
            const isColliding = actions.checkElementCollision(element1, element2, 50, 50, true);
            expect(isColliding).toBeTruthy();
          });

          it('returns false when element is at the x threshold', () => {
            const element1 = { x: 190, y: 200, height: 50, width: 40 };
            const element2 = { x: 100, y: 200, height: 50, width: 40 };
            const isColliding = actions.checkElementCollision(element1, element2, 50, 50, true);
            expect(isColliding).toBeFalsy();
          });

          it('returns false when element is at the y threshold', () => {
            const element1 = { x: 100, y: 300, height: 50, width: 40 };
            const element2 = { x: 100, y: 200, height: 50, width: 40 };
            const isColliding = actions.checkElementCollision(element1, element2, 50, 50, true);
            expect(isColliding).toBeFalsy();
          });

          it('returns false when element is not colliding', () => {
            const element1 = { x: 300, y: 500, height: 50, width: 40 };
            const element2 = { x: 100, y: 200, height: 50, width: 40 };
            const isColliding = actions.checkElementCollision(element1, element2, 50, 50);
            expect(isColliding).toBeFalsy();
          });
        });
      });
    });


    describe('widthOffset is provided;', () => {
      it('returns true when elements are at the same position', () => {
        const element1 = { x: 100, y: 200, height: 50, width: 40 };
        const element2 = { x: 100, y: 200, height: 50, width: 40 };
        const isColliding = actions.checkElementCollision(element1, element2, null, 50);
        expect(isColliding).toBeTruthy();
      });

      it('returns true when element is colliding at the x threshold', () => {
        const element1 = { x: 190, y: 200, height: 50, width: 40 };
        const element2 = { x: 100, y: 200, height: 50, width: 40 };
        const isColliding = actions.checkElementCollision(element1, element2, null, 50);
        expect(isColliding).toBeTruthy();
      });

      it('returns true when element is colliding within the x threshold', () => {
        const element1 = { x: 189, y: 200, height: 50, width: 40 };
        const element2 = { x: 100, y: 200, height: 50, width: 40 };
        const isColliding = actions.checkElementCollision(element1, element2, null, 50);
        expect(isColliding).toBeTruthy();
      });

      it('returns false when element is not colliding', () => {
        const element1 = { x: 300, y: 500, height: 50, width: 40 };
        const element2 = { x: 100, y: 200, height: 50, width: 40 };
        const isColliding = actions.checkElementCollision(element1, element2, null, 50);
        expect(isColliding).toBeFalsy();
      });


      describe('excludeEquals is true;', () => {
        it('returns true when elements are at the same position', () => {
          const element1 = { x: 100, y: 200, height: 50, width: 40 };
          const element2 = { x: 100, y: 200, height: 50, width: 40 };
          const isColliding = actions.checkElementCollision(element1, element2, null, 50, true);
          expect(isColliding).toBeTruthy();
        });

        it('returns false when element is colliding at the x threshold', () => {
          const element1 = { x: 190, y: 200, height: 50, width: 40 };
          const element2 = { x: 100, y: 200, height: 50, width: 40 };
          const isColliding = actions.checkElementCollision(element1, element2, null, 50, true);
          expect(isColliding).toBeFalsy();
        });

        it('returns true when element is colliding within the x threshold', () => {
          const element1 = { x: 189, y: 200, height: 50, width: 40 };
          const element2 = { x: 100, y: 200, height: 50, width: 40 };
          const isColliding = actions.checkElementCollision(element1, element2, null, 50, true);
          expect(isColliding).toBeTruthy();
        });

        it('returns false when element is not colliding', () => {
          const element1 = { x: 300, y: 500, height: 50, width: 40 };
          const element2 = { x: 100, y: 200, height: 50, width: 40 };
          const isColliding = actions.checkElementCollision(element1, element2, null, 50, true);
          expect(isColliding).toBeFalsy();
        });
      });
    });
  });


  describe('getTargetDirection;', () => {
    it('returns right when exit is directly to the right', () => {
      const characterPos = { x: 100, y: 200 };
      const targetPosition = { x: 200, y: 200 };
      const direction = actions.getTargetDirection(characterPos, targetPosition);
      expect(direction).toEqual('right');
    });

    it('returns down when exit is to the bottom right', () => {
      const characterPos = { x: 100, y: 200 };
      const targetPosition = { x: 200, y: 400 };
      const direction = actions.getTargetDirection(characterPos, targetPosition);
      expect(direction).toEqual('down');
    });

    it('returns up when exit is to the top right', () => {
      const characterPos = { x: 100, y: 200 };
      const targetPosition = { x: 200, y: 50 };
      const direction = actions.getTargetDirection(characterPos, targetPosition);
      expect(direction).toEqual('up');
    });

    it('returns up when exit is directly to the right, but the last direction was right', () => {
      const characterPos = { x: 100, y: 200 };
      const targetPosition = { x: 200, y: 200 };
      const direction = actions.getTargetDirection(characterPos, targetPosition, 'right');
      expect(direction).toEqual('up');
    });

    it('returns right when exit is to the bottom right, but the last direction was down', () => {
      const characterPos = { x: 100, y: 200 };
      const targetPosition = { x: 200, y: 400 };
      const direction = actions.getTargetDirection(characterPos, targetPosition, 'down');
      expect(direction).toEqual('right');
    });

    it('returns right when exit is to the top right, but the last direction was up', () => {
      const characterPos = { x: 100, y: 200 };
      const targetPosition = { x: 200, y: 50 };
      const direction = actions.getTargetDirection(characterPos, targetPosition, 'up');
      expect(direction).toEqual('right');
    });

    it('returns left when exit is directly to the left', () => {
      const characterPos = { x: 400, y: 200 };
      const targetPosition = { x: 200, y: 200 };
      const direction = actions.getTargetDirection(characterPos, targetPosition);
      expect(direction).toEqual('left');
    });

    it('returns down when exit is to the bottom left', () => {
      const characterPos = { x: 400, y: 200 };
      const targetPosition = { x: 200, y: 400 };
      const direction = actions.getTargetDirection(characterPos, targetPosition);
      expect(direction).toEqual('down');
    });

    it('returns up when exit is to the top left', () => {
      const characterPos = { x: 400, y: 300 };
      const targetPosition = { x: 200, y: 50 };
      const direction = actions.getTargetDirection(characterPos, targetPosition);
      expect(direction).toEqual('up');
    });

    it('returns up when exit is directly to the left, but the last direction was left', () => {
      const characterPos = { x: 400, y: 200 };
      const targetPosition = { x: 200, y: 200 };
      const direction = actions.getTargetDirection(characterPos, targetPosition, 'left');
      expect(direction).toEqual('up');
    });

    it('returns left when exit is to the bottom left, but the last direction was down', () => {
      const characterPos = { x: 400, y: 200 };
      const targetPosition = { x: 200, y: 400 };
      const direction = actions.getTargetDirection(characterPos, targetPosition, 'down');
      expect(direction).toEqual('left');
    });

    it('returns left when exit is to the top left, but the last direction was up', () => {
      const characterPos = { x: 400, y: 200 };
      const targetPosition = { x: 200, y: 50 };
      const direction = actions.getTargetDirection(characterPos, targetPosition, 'up');
      expect(direction).toEqual('left');
    });

    it('returns up when exit is directly to the top', () => {
      const characterPos = { x: 200, y: 200 };
      const targetPosition = { x: 200, y: 50 };
      const direction = actions.getTargetDirection(characterPos, targetPosition);
      expect(direction).toEqual('up');
    });

    it('returns left when exit is directly to the top, but last direction was up', () => {
      const characterPos = { x: 200, y: 200 };
      const targetPosition = { x: 200, y: 50 };
      const direction = actions.getTargetDirection(characterPos, targetPosition, 'up');
      expect(direction).toEqual('left');
    });

    it('returns down when exit is directly to the bottom', () => {
      const characterPos = { x: 200, y: 200 };
      const targetPosition = { x: 200, y: 400 };
      const direction = actions.getTargetDirection(characterPos, targetPosition);
      expect(direction).toEqual('down');
    });

    it('returns left when exit is directly to the bottom, but last direction was down', () => {
      const characterPos = { x: 200, y: 200 };
      const targetPosition = { x: 200, y: 400 };
      const direction = actions.getTargetDirection(characterPos, targetPosition, 'down');
      expect(direction).toEqual('left');
    });
  });


  describe('getMinBoardXLimit;', () => {
    beforeAll(() => {
      const tree = new Baobab({
        tile: { x: 1, y: 1, scenery: [], food: [] },
        boardDimensions
      });

      ActionsRewire.__Rewire__('tree', tree);
    });

    afterAll(() => {
      ActionsRewire.__ResetDependency__('tree');
    });

    it('returns the correct min X limit', () => {
      const limit = actions.getMinBoardXLimit();
      expect(limit).toEqual(-20);
    });

    it('returns the correct min X limit when usingBurrow is true', () => {
      const limit = actions.getMinBoardXLimit(true);
      expect(limit).toEqual(62);
    });
  });


  describe('getMinBoardYLimit;', () => {
    beforeAll(() => {
      const tree = new Baobab({
        tile: { x: 1, y: 1, scenery: [], food: [] },
        boardDimensions
      });

      ActionsRewire.__Rewire__('tree', tree);
    });

    afterAll(() => {
      ActionsRewire.__ResetDependency__('tree');
    });

    it('returns the correct min Y limit', () => {
      const limit = actions.getMinBoardYLimit();
      expect(limit).toEqual(-20);
    });

    it('returns the correct min Y limit when usingBurrow is true', () => {
      const limit = actions.getMinBoardYLimit(true);
      expect(limit).toEqual(40);
    });
  });


  describe('getMaxBoardXLimit;', () => {
    beforeAll(() => {
      const tree = new Baobab({
        tile: { x: 1, y: 1, scenery: [], food: [] },
        boardDimensions
      });

      ActionsRewire.__Rewire__('tree', tree);
    });

    afterAll(() => {
      ActionsRewire.__ResetDependency__('tree');
    });

    it('returns the correct max X limit', () => {
      const limit = actions.getMaxBoardXLimit();
      expect(limit).toEqual(1180);
    });

    it('returns the correct max X limit when usingBurrow is true', () => {
      const limit = actions.getMaxBoardXLimit(true);
      expect(limit).toEqual(1098);
    });
  });


  describe('getMaxBoardYLimit;', () => {
    beforeAll(() => {
      const tree = new Baobab({
        tile: { x: 1, y: 1, scenery: [], food: [] },
        boardDimensions
      });

      ActionsRewire.__Rewire__('tree', tree);
    });

    afterAll(() => {
      ActionsRewire.__ResetDependency__('tree');
    });

    it('returns the correct max Y limit', () => {
      const limit = actions.getMaxBoardYLimit();
      expect(limit).toEqual(580);
    });

    it('returns the correct max Y limit when usingBurrow is true', () => {
      const limit = actions.getMaxBoardYLimit(true);
      expect(limit).toEqual(520);
    });
  });


  describe('heuristic;', () => {
    it('returns the correct value', () => {
      const obj1 = { x: 10, y: 50 };
      const obj2 = { x: 200, y: 30 };
      const obj3 = { x: 0, y: 600 };
      const obj4 = { x: 150, y: 0 };
      expect(actions.heuristic(obj1, obj1)).toEqual(0);
      expect(actions.heuristic(obj1, obj2)).toEqual(210);
      expect(actions.heuristic(obj1, obj3)).toEqual(560);
      expect(actions.heuristic(obj1, obj4)).toEqual(190);
      expect(actions.heuristic(obj2, obj3)).toEqual(770);
      expect(actions.heuristic(obj2, obj4)).toEqual(80);
      expect(actions.heuristic(obj3, obj4)).toEqual(750);
      expect(actions.heuristic(obj4, obj2)).toEqual(80);
    });
  });


  describe('findTileExit;', () => {
    const setTileExits = (exits) => {
      const tree = new Baobab({
        tile: { x: 3, y: 3, scenery: [], food: [], exits },
        boardDimensions
      });

      ActionsRewire.__Rewire__('tree', tree);
    };

    afterAll(() => {
      ActionsRewire.__ResetDependency__('tree');
    });

    it('returns false when already on the target tile', () => {
      setTileExits({ right: true });
      const exit = actions.findTileExit({ x: 3, y: 3 });
      expect(exit).toBeFalsy();
    });


    describe('target tile is to the right;', () => {
      it('returns right when an exit is to the right', () => {
        setTileExits({ right: true });
        const exit = actions.findTileExit({ x: 3, y: 4 });
        expect(exit).toEqual('right');
      });

      it('returns left when it is the only exit', () => {
        setTileExits({ left: true });
        const exit = actions.findTileExit({ x: 3, y: 4 });
        expect(exit).toEqual('left');
      });

      it('returns bottom when it is the only exit', () => {
        setTileExits({ bottom: true });
        const exit = actions.findTileExit({ x: 3, y: 4 });
        expect(exit).toEqual('bottom');
      });

      it('returns top when it is the only exit', () => {
        setTileExits({ top: true });
        const exit = actions.findTileExit({ x: 3, y: 4 });
        expect(exit).toEqual('top');
      });

      it('returns left when no exit to the right, and left is the first exit in the list', () => {
        setTileExits({ left: true, top: true });
        const exit = actions.findTileExit({ x: 3, y: 4 });
        expect(exit).toEqual('left');
      });
    });


    describe('target tile is to the left;', () => {
      it('returns left when an exit is to the left', () => {
        setTileExits({ left: true });
        const exit = actions.findTileExit({ x: 3, y: 2 });
        expect(exit).toEqual('left');
      });

      it('returns right when it is the only exit', () => {
        setTileExits({ right: true });
        const exit = actions.findTileExit({ x: 3, y: 2 });
        expect(exit).toEqual('right');
      });

      it('returns bottom when it is the only exit', () => {
        setTileExits({ bottom: true });
        const exit = actions.findTileExit({ x: 3, y: 2 });
        expect(exit).toEqual('bottom');
      });

      it('returns top when it is the only exit', () => {
        setTileExits({ top: true });
        const exit = actions.findTileExit({ x: 3, y: 2 });
        expect(exit).toEqual('top');
      });

      it('returns right when no exit to the left, and right is the first exit in the list', () => {
        setTileExits({ right: true, top: true });
        const exit = actions.findTileExit({ x: 3, y: 2 });
        expect(exit).toEqual('right');
      });
    });


    describe('target tile is to the top;', () => {
      it('returns top when an exit is to the top', () => {
        setTileExits({ top: true });
        const exit = actions.findTileExit({ x: 2, y: 3 });
        expect(exit).toEqual('top');
      });

      it('returns right when it is the only exit', () => {
        setTileExits({ right: true });
        const exit = actions.findTileExit({ x: 2, y: 3 });
        expect(exit).toEqual('right');
      });

      it('returns bottom when it is the only exit', () => {
        setTileExits({ bottom: true });
        const exit = actions.findTileExit({ x: 2, y: 3 });
        expect(exit).toEqual('bottom');
      });

      it('returns left when it is the only exit', () => {
        setTileExits({ left: true });
        const exit = actions.findTileExit({ x: 2, y: 3 });
        expect(exit).toEqual('left');
      });

      it('returns right when no exit to the top, and right is the first exit in the list', () => {
        setTileExits({ right: true, left: true });
        const exit = actions.findTileExit({ x: 2, y: 3 });
        expect(exit).toEqual('right');
      });
    });


    describe('target tile is to the bottom;', () => {
      it('returns bottom when an exit is to the bottom', () => {
        setTileExits({ bottom: true });
        const exit = actions.findTileExit({ x: 4, y: 3 });
        expect(exit).toEqual('bottom');
      });

      it('returns right when it is the only exit', () => {
        setTileExits({ right: true });
        const exit = actions.findTileExit({ x: 4, y: 3 });
        expect(exit).toEqual('right');
      });

      it('returns top when it is the only exit', () => {
        setTileExits({ top: true });
        const exit = actions.findTileExit({ x: 4, y: 3 });
        expect(exit).toEqual('top');
      });

      it('returns left when it is the only exit', () => {
        setTileExits({ left: true });
        const exit = actions.findTileExit({ x: 4, y: 3 });
        expect(exit).toEqual('left');
      });

      it('returns right when no exit to the bottom, and right is the first exit in the list', () => {
        setTileExits({ right: true, left: true });
        const exit = actions.findTileExit({ x: 4, y: 3 });
        expect(exit).toEqual('right');
      });
    });


    describe('target tile is to the bottom left;', () => {
      it('returns bottom when an exit is to the bottom', () => {
        setTileExits({ bottom: true });
        const exit = actions.findTileExit({ x: 4, y: 2 });
        expect(exit).toEqual('bottom');
      });

      it('returns right when it is the only exit', () => {
        setTileExits({ right: true });
        const exit = actions.findTileExit({ x: 4, y: 2 });
        expect(exit).toEqual('right');
      });

      it('returns top when it is the only exit', () => {
        setTileExits({ top: true });
        const exit = actions.findTileExit({ x: 4, y: 2 });
        expect(exit).toEqual('top');
      });

      it('returns left when it is the only exit', () => {
        setTileExits({ left: true });
        const exit = actions.findTileExit({ x: 4, y: 2 });
        expect(exit).toEqual('left');
      });

      it('returns right when no exit to the bottom, and right is the first exit in the list', () => {
        setTileExits({ right: true, left: true });
        const exit = actions.findTileExit({ x: 4, y: 2 });
        expect(exit).toEqual('right');
      });
    });


    describe('target tile is to the bottom right;', () => {
      it('returns bottom when an exit is to the bottom', () => {
        setTileExits({ bottom: true });
        const exit = actions.findTileExit({ x: 4, y: 4 });
        expect(exit).toEqual('bottom');
      });

      it('returns right when it is the only exit', () => {
        setTileExits({ right: true });
        const exit = actions.findTileExit({ x: 4, y: 4 });
        expect(exit).toEqual('right');
      });

      it('returns top when it is the only exit', () => {
        setTileExits({ top: true });
        const exit = actions.findTileExit({ x: 4, y: 4 });
        expect(exit).toEqual('top');
      });

      it('returns left when it is the only exit', () => {
        setTileExits({ left: true });
        const exit = actions.findTileExit({ x: 4, y: 4 });
        expect(exit).toEqual('left');
      });

      it('returns top when no exit to the bottom, and top is the first exit in the list', () => {
        setTileExits({ top: true, left: true });
        const exit = actions.findTileExit({ x: 4, y: 4 });
        expect(exit).toEqual('top');
      });
    });


    describe('target tile is to the top left;', () => {
      it('returns top when an exit is to the top', () => {
        setTileExits({ top: true });
        const exit = actions.findTileExit({ x: 2, y: 2 });
        expect(exit).toEqual('top');
      });

      it('returns right when it is the only exit', () => {
        setTileExits({ right: true });
        const exit = actions.findTileExit({ x: 2, y: 2 });
        expect(exit).toEqual('right');
      });

      it('returns bottom when it is the only exit', () => {
        setTileExits({ bottom: true });
        const exit = actions.findTileExit({ x: 2, y: 2 });
        expect(exit).toEqual('bottom');
      });

      it('returns left when it is the only exit', () => {
        setTileExits({ left: true });
        const exit = actions.findTileExit({ x: 2, y: 2 });
        expect(exit).toEqual('left');
      });

      it('returns right when no exit to the top, and right is the first exit in the list', () => {
        setTileExits({ right: true, left: true });
        const exit = actions.findTileExit({ x: 2, y: 2 });
        expect(exit).toEqual('right');
      });
    });


    describe('target tile is to the top right;', () => {
      it('returns top when an exit is to the top', () => {
        setTileExits({ top: true });
        const exit = actions.findTileExit({ x: 2, y: 4 });
        expect(exit).toEqual('top');
      });

      it('returns right when it is the only exit', () => {
        setTileExits({ right: true });
        const exit = actions.findTileExit({ x: 2, y: 4 });
        expect(exit).toEqual('right');
      });

      it('returns bottom when it is the only exit', () => {
        setTileExits({ bottom: true });
        const exit = actions.findTileExit({ x: 2, y: 4 });
        expect(exit).toEqual('bottom');
      });

      it('returns left when it is the only exit', () => {
        setTileExits({ left: true });
        const exit = actions.findTileExit({ x: 2, y: 4 });
        expect(exit).toEqual('left');
      });

      it('returns top when no exit to the top, and top is the first exit in the list', () => {
        setTileExits({ top: true, left: true });
        const exit = actions.findTileExit({ x: 2, y: 4 });
        expect(exit).toEqual('top');
      });
    });
  });


  describe('getDirectionForAxis;', () => {
    it('returns correct direction when target value is to the right', () => {
      const direction = actions.getDirectionForAxis('x', { x: 50, y: 100 }, { x: 100, y: 100 });
      expect(direction).toEqual('right');
    });

    it('returns correct direction when target value is to the left', () => {
      const direction = actions.getDirectionForAxis('x', { x: 100, y: 100 }, { x: 50, y: 100 });
      expect(direction).toEqual('left');
    });

    it('returns correct direction when target value is to the bottom', () => {
      const direction = actions.getDirectionForAxis('y', { x: 100, y: 50 }, { x: 100, y: 100 });
      expect(direction).toEqual('down');
    });

    it('returns correct direction when target value is to the top', () => {
      const direction = actions.getDirectionForAxis('y', { x: 100, y: 100 }, { x: 100, y: 50 });
      expect(direction).toEqual('up');
    });
  });


  describe('checkIfAtTargetPosition;', () => {
    describe('character is moving right', () => {
      it('returns true when character is at the exit x position', () => {
        const atPosition = actions.checkIfAtTargetPosition('right', { x: 200, y: 100 }, { x: 200, y: 300 });
        expect(atPosition).toBeTruthy();
      });

      it('returns true when character is more than the exit x position', () => {
        const atPosition = actions.checkIfAtTargetPosition('right', { x: 250, y: 100 }, { x: 200, y: 300 });
        expect(atPosition).toBeTruthy();
      });

      it('returns false when character is not at the exit x position', () => {
        const atPosition = actions.checkIfAtTargetPosition('right', { x: 199, y: 100 }, { x: 200, y: 300 });
        expect(atPosition).toBeFalsy();
      });

      it('returns false when character is not at the exit x position, and y is the same', () => {
        const atPosition = actions.checkIfAtTargetPosition('right', { x: 199, y: 100 }, { x: 200, y: 100 });
        expect(atPosition).toBeFalsy();
      });
    });


    describe('character is moving left', () => {
      it('returns true when character is at the exit x position', () => {
        const atPosition = actions.checkIfAtTargetPosition('left', { x: 100, y: 100 }, { x: 100, y: 300 });
        expect(atPosition).toBeTruthy();
      });

      it('returns true when character is less than the exit x position', () => {
        const atPosition = actions.checkIfAtTargetPosition('left', { x: 50, y: 100 }, { x: 100, y: 300 });
        expect(atPosition).toBeTruthy();
      });

      it('returns false when character is not at the exit x position', () => {
        const atPosition = actions.checkIfAtTargetPosition('left', { x: 101, y: 100 }, { x: 100, y: 300 });
        expect(atPosition).toBeFalsy();
      });

      it('returns false when character is not at the exit x position, and y is the same', () => {
        const atPosition = actions.checkIfAtTargetPosition('left', { x: 101, y: 100 }, { x: 100, y: 100 });
        expect(atPosition).toBeFalsy();
      });
    });


    describe('character is moving up', () => {
      it('returns true when character is at the exit y position', () => {
        const atPosition = actions.checkIfAtTargetPosition('up', { x: 200, y: 300 }, { x: 400, y: 300 });
        expect(atPosition).toBeTruthy();
      });

      it('returns true when character is more than the exit y position', () => {
        const atPosition = actions.checkIfAtTargetPosition('up', { x: 200, y: 250 }, { x: 400, y: 300 });
        expect(atPosition).toBeTruthy();
      });

      it('returns false when character is not at the exit y position', () => {
        const atPosition = actions.checkIfAtTargetPosition('up', { x: 200, y: 301 }, { x: 400, y: 300 });
        expect(atPosition).toBeFalsy();
      });

      it('returns false when character is not at the exit y position, and x is the same', () => {
        const atPosition = actions.checkIfAtTargetPosition('up', { x: 200, y: 301 }, { x: 200, y: 300 });
        expect(atPosition).toBeFalsy();
      });
    });


    describe('character is moving down', () => {
      it('returns true when character is at the exit y position', () => {
        const atPosition = actions.checkIfAtTargetPosition('down', { x: 200, y: 300 }, { x: 400, y: 300 });
        expect(atPosition).toBeTruthy();
      });

      it('returns true when character is more than the exit y position', () => {
        const atPosition = actions.checkIfAtTargetPosition('down', { x: 200, y: 350 }, { x: 400, y: 300 });
        expect(atPosition).toBeTruthy();
      });

      it('returns false when character is not at the exit y position', () => {
        const atPosition = actions.checkIfAtTargetPosition('down', { x: 200, y: 299 }, { x: 400, y: 300 });
        expect(atPosition).toBeFalsy();
      });

      it('returns false when character is not at the exit y position, and x is the same', () => {
        const atPosition = actions.checkIfAtTargetPosition('down', { x: 200, y: 299 }, { x: 200, y: 300 });
        expect(atPosition).toBeFalsy();
      });
    });
  });


  describe('getStepCost;', () => {
    it('returns the correct cost value', () => {
      const cost = actions.getStepCost(10, { x: 10, y: 20 }, { x: 30, y: 40 }, { x: 50, y: 60 });
      expect(cost).toEqual(130);
    });
  });


  describe('valueIsBefore;', () => {
    it('returns true when moving back and value1 is less than value2', () => {
      const isBefore = actions.valueIsBefore(5, 10, true);
      expect(isBefore).toBeTruthy();
    });

    it('returns false when moving back and value1 is more than value2', () => {
      const isBefore = actions.valueIsBefore(15, 10, true);
      expect(isBefore).toBeFalsy();
    });

    it('returns false when not moving back and value1 is less than value2', () => {
      const isBefore = actions.valueIsBefore(5, 10);
      expect(isBefore).toBeFalsy();
    });

    it('returns true when moving back and value1 is more than value2', () => {
      const isBefore = actions.valueIsBefore(15, 10);
      expect(isBefore).toBeTruthy();
    });
  });


  describe('isAtExitPosition;', () => {
    const characterRect = { width: 40, height: 40 };

    beforeAll(() => {
      const tree = new Baobab({
        tile: { x: 1, y: 1, scenery: [], food: [] },
        boardDimensions
      });

      ActionsRewire.__Rewire__('tree', tree);
    });

    afterAll(() => {
      ActionsRewire.__ResetDependency__('tree');
    });

    it('returns true when character is at left exit position', () => {
      const isAtExit = actions.isAtExitPosition({ x: -characterRect.width, y: 200 }, { x: -characterRect.width, y: 100 }, characterRect);
      expect(isAtExit).toBeTruthy();
    });

    it('returns true when character is before left exit position', () => {
      const isAtExit = actions.isAtExitPosition({ x: -(characterRect.width + 1), y: 200 }, { x: -characterRect.width, y: 100 }, characterRect);
      expect(isAtExit).toBeTruthy();
    });

    it('returns false when character is after left exit position', () => {
      const isAtExit = actions.isAtExitPosition({ x: -(characterRect.width - 1), y: 200 }, { x: -characterRect.width, y: 100 }, characterRect);
      expect(isAtExit).toBeFalsy();
    });

    it('returns true when character is at right exit position', () => {
      const isAtExit = actions.isAtExitPosition({ x: boardDimensions.width, y: 200 }, { x: boardDimensions.width, y: 100 }, characterRect);
      expect(isAtExit).toBeTruthy();
    });

    it('returns true when character is past right exit position', () => {
      const isAtExit = actions.isAtExitPosition({ x: boardDimensions.width + 1, y: 200 }, { x: boardDimensions.width, y: 100 }, characterRect);
      expect(isAtExit).toBeTruthy();
    });

    it('returns false when character is past right exit position', () => {
      const isAtExit = actions.isAtExitPosition({ x: boardDimensions.width - 1, y: 200 }, { x: boardDimensions.width, y: 100 }, characterRect);
      expect(isAtExit).toBeFalsy();
    });

    it('returns true when character is at top exit position', () => {
      const isAtExit = actions.isAtExitPosition({ x: 200, y: -characterRect.height }, { x: 200, y: -characterRect.height }, characterRect);
      expect(isAtExit).toBeTruthy();
    });

    it('returns true when character is before top exit position', () => {
      const isAtExit = actions.isAtExitPosition({ x: 200, y: -(characterRect.height + 1) }, { x: 200, y: -characterRect.height }, characterRect);
      expect(isAtExit).toBeTruthy();
    });

    it('returns false when character is after top exit position', () => {
      const isAtExit = actions.isAtExitPosition({ x: 200, y: -(characterRect.height - 1) }, { x: 200, y: -characterRect.height }, characterRect);
      expect(isAtExit).toBeFalsy();
    });

    it('returns true when character is at bottom exit position', () => {
      const isAtExit = actions.isAtExitPosition({ x: 200, y: boardDimensions.height }, { x: 200, y: boardDimensions.height }, characterRect);
      expect(isAtExit).toBeTruthy();
    });

    it('returns false when character is before bottom exit position', () => {
      const isAtExit = actions.isAtExitPosition({ x: 200, y: boardDimensions.height - 1 }, { x: 200, y: boardDimensions.height }, characterRect);
      expect(isAtExit).toBeFalsy();
    });

    it('returns true when character is after bottom exit position', () => {
      const isAtExit = actions.isAtExitPosition({ x: 200, y: boardDimensions.height + 1 }, { x: 200, y: boardDimensions.height }, characterRect);
      expect(isAtExit).toBeTruthy();
    });

    it('returns true when character is at exit position', () => {
      const isAtExit = actions.isAtExitPosition({ x: 200, y: 400 }, { x: 200, y: 400 }, characterRect);
      expect(isAtExit).toBeTruthy();
    });

    it('returns false when character is not at exit x position', () => {
      const isAtExit = actions.isAtExitPosition({ x: 201, y: 400 }, { x: 200, y: 400 }, characterRect);
      expect(isAtExit).toBeFalsy();
    });

    it('returns false when character is not at exit y position', () => {
      const isAtExit = actions.isAtExitPosition({ x: 200, y: 401 }, { x: 200, y: 400 }, characterRect);
      expect(isAtExit).toBeFalsy();
    });

    it('returns false when character is not at exit x or y positions', () => {
      const isAtExit = actions.isAtExitPosition({ x: 201, y: 401 }, { x: 200, y: 400 }, characterRect);
      expect(isAtExit).toBeFalsy();
    });
  });


  describe('checkIfValidGap;', () => {
    const characterRect = { width: 40, height: 40 };

    beforeAll(() => {
      const tree = new Baobab({
        tile: { x: 1, y: 1, scenery: [], food: [] },
        boardDimensions
      });

      ActionsRewire.__Rewire__('tree', tree);
    });

    afterAll(() => {
      ActionsRewire.__ResetDependency__('tree');
    });

    it('returns true when gap is valid near top and left', () => {
      const isValid = actions.checkIfValidGap({ x: boardDimensions.left + 1, y: boardDimensions.top + 1, ...characterRect }, { x: 100, y: 100 }, characterRect);
      expect(isValid).toBeTruthy();
    });

    it('returns true when gap is valid near bottom and left', () => {
      const isValid = actions.checkIfValidGap({ x: boardDimensions.left + 1, y: boardDimensions.height - 1, ...characterRect }, { x: 100, y: 100 }, characterRect);
      expect(isValid).toBeTruthy();
    });

    it('returns true when gap is valid near top and right', () => {
      const isValid = actions.checkIfValidGap({ x: boardDimensions.width - 1, y: boardDimensions.top + 1, ...characterRect }, { x: 100, y: 100 }, characterRect);
      expect(isValid).toBeTruthy();
    });

    it('returns true when gap is valid near bottom and right', () => {
      const isValid = actions.checkIfValidGap({ x: boardDimensions.width - 1, y: boardDimensions.height - 1, ...characterRect }, { x: 100, y: 100 }, characterRect);
      expect(isValid).toBeTruthy();
    });

    it('returns true when gap is at zero on the left', () => {
      const isValid = actions.checkIfValidGap({ x: boardDimensions.left, y: boardDimensions.height - 1, ...characterRect }, { x: 100, y: 100 }, characterRect);
      expect(isValid).toBeTruthy();
    });

    it('returns true when gap is at zero on the top', () => {
      const isValid = actions.checkIfValidGap({ x: boardDimensions.width - 1, y: boardDimensions.top, ...characterRect }, { x: 100, y: 100 }, characterRect);
      expect(isValid).toBeTruthy();
    });

    it('returns true when gap is at zero on the top and left', () => {
      const isValid = actions.checkIfValidGap({ x: boardDimensions.left, y: boardDimensions.top, ...characterRect }, { x: 100, y: 100 }, characterRect);
      expect(isValid).toBeTruthy();
    });

    it('returns true when gap is at exit position', () => {
      const isValid = actions.checkIfValidGap({ x: 100, y: 100, ...characterRect }, { x: 100, y: 100 }, characterRect);
      expect(isValid).toBeTruthy();
    });

    it('returns false when gap is before top and left', () => {
      const isValid = actions.checkIfValidGap({ x: boardDimensions.left - 1, y: boardDimensions.top - 1, ...characterRect }, { x: 100, y: 100 }, characterRect);
      expect(isValid).toBeFalsy();
    });

    it('returns false when gap is near bottom and but before left', () => {
      const isValid = actions.checkIfValidGap({ x: boardDimensions.left - 1, y: boardDimensions.height - 1, ...characterRect }, { x: 100, y: 100 }, characterRect);
      expect(isValid).toBeFalsy();
    });

    it('returns false when gap is near bottom and but after right', () => {
      const isValid = actions.checkIfValidGap({ x: boardDimensions.width + 1, y: boardDimensions.height - 1, ...characterRect }, { x: 100, y: 100 }, characterRect);
      expect(isValid).toBeFalsy();
    });

    it('returns false when gap is near left and but after bottom', () => {
      const isValid = actions.checkIfValidGap({ x: boardDimensions.left + 1, y: boardDimensions.height + 1, ...characterRect }, { x: 100, y: 100 }, characterRect);
      expect(isValid).toBeFalsy();
    });

    it('returns false when gap is before top', () => {
      const isValid = actions.checkIfValidGap({ x: boardDimensions.width - 1, y: boardDimensions.top - 1, ...characterRect }, { x: 100, y: 100 }, characterRect);
      expect(isValid).toBeFalsy();
    });

    it('returns false when gap is near top but after right', () => {
      const isValid = actions.checkIfValidGap({ x: boardDimensions.width + 1, y: boardDimensions.top + 1, ...characterRect }, { x: 100, y: 100 }, characterRect);
      expect(isValid).toBeFalsy();
    });

    it('returns true when gap is at zero on the left, but is after bottom', () => {
      const isValid = actions.checkIfValidGap({ x: boardDimensions.left, y: boardDimensions.height + 1, ...characterRect }, { x: 100, y: 100 }, characterRect);
      expect(isValid).toBeFalsy();
    });

    it('returns true when gap is at zero on the left, but is before top', () => {
      const isValid = actions.checkIfValidGap({ x: boardDimensions.left, y: boardDimensions.top - 1, ...characterRect }, { x: 100, y: 100 }, characterRect);
      expect(isValid).toBeFalsy();
    });

    it('returns true when gap is at zero on the top, but is after right', () => {
      const isValid = actions.checkIfValidGap({ x: boardDimensions.width + 1, y: boardDimensions.top, ...characterRect }, { x: 100, y: 100 }, characterRect);
      expect(isValid).toBeFalsy();
    });

    it('returns true when gap is at zero on the top, but is before left', () => {
      const isValid = actions.checkIfValidGap({ x: boardDimensions.left - 1, y: boardDimensions.top, ...characterRect }, { x: 100, y: 100 }, characterRect);
      expect(isValid).toBeFalsy();
    });
  });


  describe('getCollisionEntities;', () => {
    beforeAll(() => {
      const tree = new Baobab({
        tile: {
          x: 1,
          y: 1,
          scenery: [
            { type: sceneryConstants.BURROW_TYPE },
            { type: 'Bush' },
            { type: 'Tree' }
          ],
          food: [
            { type: 'Apple', collected: true },
            { type: 'Broccoli' },
            { type: 'Carrot' }
          ]
        },
        boardDimensions
      });

      ActionsRewire.__Rewire__('tree', tree);
    });

    afterAll(() => {
      ActionsRewire.__ResetDependency__('tree');
    });

    it('returns correct entities when filterCollected is not provided', () => {
      const entities = actions.getCollisionEntities();
      expect(entities).toEqual([
        { type: 'Apple', collected: true },
        { type: 'Broccoli' },
        { type: 'Carrot' },
        { type: 'Bush' },
        { type: 'Tree' },
      ]);
    });

    it('returns correct entities when filterCollected is true', () => {
      const entities = actions.getCollisionEntities(true);
      expect(entities).toEqual([
        { type: 'Broccoli' },
        { type: 'Carrot' },
        { type: 'Bush' },
        { type: 'Tree' },
      ]);
    });
  });


  describe('getNeighboursOfPosition;', () => {
    it('returns correct neighbours 1', () => {
      const dimensions = { height: 40, width: 40 };
      const neighbours = actions.getNeighboursOfPosition({ x: 100, y: 200 }, dimensions.height, dimensions.width);
      expect(neighbours).toEqual({
        left: { x: 60, y: 200, ...dimensions },
        right: { x: 140, y: 200, ...dimensions },
        top: { x: 100, y: 160, ...dimensions },
        bottom: { x: 100, y: 240, ...dimensions }
      });
    });

    it('returns correct neighbours 2', () => {
      const dimensions = { height: 100, width: 130 };
      const neighbours = actions.getNeighboursOfPosition({ x: 300, y: 400 }, dimensions.height, dimensions.width);
      expect(neighbours).toEqual({
        left: { x: 170, y: 400, ...dimensions },
        right: { x: 430, y: 400, ...dimensions },
        top: { x: 300, y: 300, ...dimensions },
        bottom: { x: 300, y: 500, ...dimensions }
      });
    });
  });


  describe('isInBoardBoundsOnAxis;', () => {
    const dimensions = { height: 40, width: 40 };

    beforeAll(() => {
      const tree = new Baobab({
        tile: { x: 1, y: 1, scenery: [], food: [] },
        boardDimensions
      });

      ActionsRewire.__Rewire__('tree', tree);
    });

    afterAll(() => {
      ActionsRewire.__ResetDependency__('tree');
    });


    describe('x axis;', () => {
      const axis = 'x';

      it('returns true when x is near left and useAxisDimension is true', () => {
        const isInBounds = actions.isInBoardBoundsOnAxis({
          x: boardDimensions.left + 1,
          y: 100,
          right: (boardDimensions.left + 1) + dimensions.width,
          bottom: 100 + dimensions.height,
          ...dimensions,
        }, axis, true);
        expect(isInBounds).toBeTruthy();
      });

      it('returns true when x is near left and useAxisDimension is not provided', () => {
        const isInBounds = actions.isInBoardBoundsOnAxis({
          x: boardDimensions.left + 1,
          y: 100,
          right: (boardDimensions.left + 1) + dimensions.width,
          bottom: 100 + dimensions.height,
          ...dimensions,
        }, axis);
        expect(isInBounds).toBeTruthy();
      });

      it('returns true when x is at left and useAxisDimension is true', () => {
        const isInBounds = actions.isInBoardBoundsOnAxis({
          x: boardDimensions.left,
          y: 100,
          right: boardDimensions.left + dimensions.width,
          bottom: 100 + dimensions.height,
          ...dimensions,
        }, axis, true);
        expect(isInBounds).toBeTruthy();
      });

      it('returns true when x is at left and useAxisDimension is not provided', () => {
        const isInBounds = actions.isInBoardBoundsOnAxis({
          x: boardDimensions.left,
          y: 100,
          right: boardDimensions.left + dimensions.width,
          bottom: 100 + dimensions.height,
          ...dimensions,
        }, axis);
        expect(isInBounds).toBeTruthy();
      });

      it('returns false when x is before left and useAxisDimension is true', () => {
        const isInBounds = actions.isInBoardBoundsOnAxis({
          x: boardDimensions.left - 1,
          y: 100,
          right: (boardDimensions.left - 1) + dimensions.width,
          bottom: 100 + dimensions.height,
          ...dimensions,
        }, axis, true);
        expect(isInBounds).toBeFalsy();
      });

      it('returns false when x is before left and useAxisDimension is not provided', () => {
        const isInBounds = actions.isInBoardBoundsOnAxis({
          x: boardDimensions.left - 1,
          y: 100,
          right: (boardDimensions.left - 1) + dimensions.width,
          bottom: 100 + dimensions.height,
          ...dimensions,
        }, axis);
        expect(isInBounds).toBeFalsy();
      });


      describe('useAxisDimension is true;', () => {
        it('returns true when x is near right', () => {
          const isInBounds = actions.isInBoardBoundsOnAxis({
            x: boardDimensions.width - 1,
            y: 100,
            right: (boardDimensions.width - 1) + dimensions.width,
            bottom: 100 + dimensions.height,
            ...dimensions,
          }, axis, true);
          expect(isInBounds).toBeTruthy();
        });

        it('returns false when x is after right', () => {
          const isInBounds = actions.isInBoardBoundsOnAxis({
            x: boardDimensions.width + 1,
            y: 100,
            right: (boardDimensions.width + 1) + dimensions.width,
            bottom: 100 + dimensions.height,
            ...dimensions,
          }, axis, true);
          expect(isInBounds).toBeFalsy();
        });
      });


      describe('useAxisDimension is not provided;', () => {
        it('returns false when x is near right and the rect.right is above the offset threshold', () => {
          const isInBounds = actions.isInBoardBoundsOnAxis({
            x: boardDimensions.width + 1,
            y: 100,
            right: (boardDimensions.width + 1) + dimensions.width,
            bottom: 100 + dimensions.height,
            ...dimensions,
          }, axis);
          expect(isInBounds).toBeFalsy();
        });

        it('returns false when x is near right and the rect.right is just above the offset threshold', () => {
          const isInBounds = actions.isInBoardBoundsOnAxis({
            x: boardDimensions.width - (dimensions.width - 1),
            y: 100,
            right: (boardDimensions.width - (dimensions.width - 1)) + dimensions.width,
            bottom: 100 + dimensions.height,
            ...dimensions,
          }, axis);
          expect(isInBounds).toBeFalsy();
        });

        it('returns true when x is near right and the rect.right is below the offset threshold', () => {
          const isInBounds = actions.isInBoardBoundsOnAxis({
            x: boardDimensions.width - (dimensions.width - 1),
            y: 100,
            right: (boardDimensions.width - (dimensions.width - 1)) + dimensions.width,
            bottom: 100 + dimensions.height,
            ...dimensions,
          }, axis);
          expect(isInBounds).toBeFalsy();
        });

        it('returns false when x is after right', () => {
          const isInBounds = actions.isInBoardBoundsOnAxis({
            x: boardDimensions.width + 1,
            y: 100,
            right: (boardDimensions.width + 1) + dimensions.width,
            bottom: 100 + dimensions.height,
            ...dimensions,
          }, axis);
          expect(isInBounds).toBeFalsy();
        });
      });
    });


    describe('y axis;', () => {
      const axis = 'y';

      it('returns true when y is near top and useAxisDimension is true', () => {
        const isInBounds = actions.isInBoardBoundsOnAxis({
          x: 100,
          y: boardDimensions.top + 1,
          right: 100 + dimensions.width,
          bottom: (boardDimensions.top + 1) + dimensions.height,
          ...dimensions,
        }, axis, true);
        expect(isInBounds).toBeTruthy();
      });

      it('returns true when y is near top and useAxisDimension is not provided', () => {
        const isInBounds = actions.isInBoardBoundsOnAxis({
          x: 100,
          y: boardDimensions.top + 1,
          right: 100 + dimensions.width,
          bottom: (boardDimensions.top + 1) + dimensions.height,
          ...dimensions,
        }, axis);
        expect(isInBounds).toBeTruthy();
      });

      it('returns true when y is at top and useAxisDimension is true', () => {
        const isInBounds = actions.isInBoardBoundsOnAxis({
          x: 100,
          y: boardDimensions.top,
          right: 100 + dimensions.width,
          bottom: boardDimensions.top + dimensions.height,
          ...dimensions,
        }, axis, true);
        expect(isInBounds).toBeTruthy();
      });

      it('returns true when y is at top and useAxisDimension is not provided', () => {
        const isInBounds = actions.isInBoardBoundsOnAxis({
          x: 100,
          y: boardDimensions.top,
          right: 100 + dimensions.width,
          bottom: boardDimensions.top + dimensions.height,
          ...dimensions,
        }, axis);
        expect(isInBounds).toBeTruthy();
      });

      it('returns false when y is before top and useAxisDimension is true', () => {
        const isInBounds = actions.isInBoardBoundsOnAxis({
          x: 100,
          y: boardDimensions.top - 1,
          right: 100 + dimensions.width,
          bottom: (boardDimensions.top - 1) + dimensions.height,
          ...dimensions,
        }, axis, true);
        expect(isInBounds).toBeFalsy();
      });

      it('returns false when y is before top and useAxisDimension is not provided', () => {
        const isInBounds = actions.isInBoardBoundsOnAxis({
          x: 100,
          y: boardDimensions.top - 1,
          right: 100 + dimensions.width,
          bottom: (boardDimensions.top - 1) + dimensions.height,
          ...dimensions,
        }, axis);
        expect(isInBounds).toBeFalsy();
      });


      describe('useAxisDimension is true;', () => {
        it('returns true when y is near bottom', () => {
          const isInBounds = actions.isInBoardBoundsOnAxis({
            x: 100,
            y: boardDimensions.height - 1,
            right: 100 + dimensions.width,
            bottom: (boardDimensions.height - 1) + dimensions.height,
            ...dimensions,
          }, axis, true);
          expect(isInBounds).toBeTruthy();
        });

        it('returns false when y is after bottom', () => {
          const isInBounds = actions.isInBoardBoundsOnAxis({
            x: 100,
            y: boardDimensions.height + 1,
            right: 100 + dimensions.width,
            bottom: (boardDimensions.height + 1) + dimensions.height,
            ...dimensions,
          }, axis, true);
          expect(isInBounds).toBeFalsy();
        });
      });


      describe('useAxisDimension is not provided;', () => {
        it('returns false when y is near bottom and the rect.bottom is above the offset threshold', () => {
          const isInBounds = actions.isInBoardBoundsOnAxis({
            x: 100,
            y: boardDimensions.height - 1,
            right: 100 + dimensions.width,
            bottom: (boardDimensions.height - 1) + dimensions.height,
            ...dimensions,
          }, axis);
          expect(isInBounds).toBeFalsy();
        });

        it('returns false when y is near bottom and the rect.bottom is just above the offset threshold', () => {
          const isInBounds = actions.isInBoardBoundsOnAxis({
            x: 100,
            y: boardDimensions.height - (dimensions.height - 1),
            right: 100 + dimensions.width,
            bottom: (boardDimensions.height - (dimensions.height - 1)) + dimensions.height,
            ...dimensions,
          }, axis);
          expect(isInBounds).toBeFalsy();
        });

        it('returns true when y is near bottom and the rect.bottom is below the offset threshold', () => {
          const isInBounds = actions.isInBoardBoundsOnAxis({
            x: 100,
            y: boardDimensions.height - (dimensions.height - 1),
            right: 100 + dimensions.width,
            bottom: (boardDimensions.height - (dimensions.height - 1)) + dimensions.height,
            ...dimensions,
          }, axis);
          expect(isInBounds).toBeFalsy();
        });

        it('returns false when y is after bottom', () => {
          const isInBounds = actions.isInBoardBoundsOnAxis({
            x: 100,
            y: boardDimensions.height + 1,
            right: 100 + dimensions.width,
            bottom: (boardDimensions.height + 1) + dimensions.height,
            ...dimensions,
          }, axis);
          expect(isInBounds).toBeFalsy();
        });
      });
    });
  });


  describe('getExitPosition;', () => {
    const dimensions = { height: 40, width: 40 };
    const tile = { x: 3, y: 3, scenery: [], food: [] };

    afterAll(() => {
      ActionsRewire.__ResetDependency__('tree');
    });


    describe('targetTile is not provided;', () => {
      beforeEach(() => {
        const exits = { right: { start: 50, end: 150 } };
        const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
        ActionsRewire.__Rewire__('tree', tree);
      });

      describe('exit is to the right;', () => {
        it('returns correct exit position when character is between exit start and end', () => {
          const exitPosition = actions.getExitPosition({ x: 100, y: 100, ...dimensions });
          expect(exitPosition).toEqual({ x: boardDimensions.width, y: 100 });
        });

        it('returns correct exit position at the top when character is not between exit start and end', () => {
          const exitPosition = actions.getExitPosition({ x: 100, y: 30, ...dimensions });
          expect(exitPosition).toEqual({ x: boardDimensions.width, y: 50 });
        });

        it('returns correct exit position at the bottom when character is not between exit start and end', () => {
          const exitPosition = actions.getExitPosition({ x: 100, y: 180, ...dimensions });
          expect(exitPosition).toEqual({ x: boardDimensions.width, y: 130 });
        });
      });


      describe('exit is to the left;', () => {
        beforeEach(() => {
          const exits = { left: { start: 50, end: 150 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);
        });

        it('returns correct exit position when character is between exit start and end', () => {
          const exitPosition = actions.getExitPosition({ x: 100, y: 100, ...dimensions });
          expect(exitPosition).toEqual({ x: -dimensions.width, y: 100 });
        });

        it('returns correct exit position at the top when character is not between exit start and end', () => {
          const exitPosition = actions.getExitPosition({ x: 100, y: 30, ...dimensions });
          expect(exitPosition).toEqual({ x: -dimensions.width, y: 50 });
        });

        it('returns correct exit position at the bottom when character is not between exit start and end', () => {
          const exitPosition = actions.getExitPosition({ x: 100, y: 180, ...dimensions });
          expect(exitPosition).toEqual({ x: -dimensions.width, y: 130 });
        });
      });


      describe('exit is to the bottom;', () => {
        beforeEach(() => {
          const exits = { bottom: { start: 50, end: 150 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);
        });

        it('returns correct exit position when character is between exit start and end', () => {
          const exitPosition = actions.getExitPosition({ x: 100, y: 100, ...dimensions });
          expect(exitPosition).toEqual({ x: 100, y: boardDimensions.height });
        });

        it('returns correct exit position at the top when character is not between exit start and end', () => {
          const exitPosition = actions.getExitPosition({ x: 30, y: 100, ...dimensions });
          expect(exitPosition).toEqual({ x: 50, y: boardDimensions.height });
        });

        it('returns correct exit position at the bottom when character is not between exit start and end', () => {
          const exitPosition = actions.getExitPosition({ x: 180, y: 100, ...dimensions });
          expect(exitPosition).toEqual({ x: 130, y: boardDimensions.height });
        });
      });


      describe('exit is to the top;', () => {
        beforeEach(() => {
          const exits = { top: { start: 50, end: 150 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);
        });

        it('returns correct exit position when character is between exit start and end', () => {
          const exitPosition = actions.getExitPosition({ x: 100, y: 100, ...dimensions });
          expect(exitPosition).toEqual({ x: 100, y: -dimensions.height });
        });

        it('returns correct exit position at the top when character is not between exit start and end', () => {
          const exitPosition = actions.getExitPosition({ x: 30, y: 100, ...dimensions });
          expect(exitPosition).toEqual({ x: 50, y: -dimensions.height });
        });

        it('returns correct exit position at the bottom when character is not between exit start and end', () => {
          const exitPosition = actions.getExitPosition({ x: 180, y: 100, ...dimensions });
          expect(exitPosition).toEqual({ x: 130, y: -dimensions.height });
        });
      });


      describe('exits are to the top and left;', () => {
        it('returns correct exit when top is closer', () => {
          const exits = { top: { start: 50, end: 100 }, left: { start: 500, end: 550 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);

          const exitPosition = actions.getExitPosition({ x: 100, y: 100, ...dimensions });
          expect(exitPosition).toEqual({ x: 100, y: -dimensions.height });
        });

        it('returns correct exit when left is closer', () => {
          const exits = { top: { start: 50, end: 100 }, left: { start: 500, end: 550 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);

          const exitPosition = actions.getExitPosition({ x: 100, y: 450, ...dimensions });
          expect(exitPosition).toEqual({ x: -dimensions.width, y: 500 });
        });

        it('returns correct exit when both exits are the same distance', () => {
          const exits = { top: { start: 50, end: 100 }, left: { start: 50, end: 100 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);

          const exitPosition = actions.getExitPosition({ x: 100, y: 100, ...dimensions });
          expect(exitPosition).toEqual({ x: 100, y: -dimensions.height });
        });
      });


      describe('exits are to the top and right;', () => {
        it('returns correct exit when top is closer', () => {
          const exits = { top: { start: 50, end: 100 }, right: { start: 50, end: 100 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);

          const exitPosition = actions.getExitPosition({ x: 100, y: 100, ...dimensions });
          expect(exitPosition).toEqual({ x: 100, y: -dimensions.height });
        });

        it('returns correct exit when right is closer', () => {
          const exits = { top: { start: 50, end: 100 }, right: { start: 50, end: 100 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);

          const exitPosition = actions.getExitPosition({ x: 1000, y: 450, ...dimensions });
          expect(exitPosition).toEqual({ x: boardDimensions.width, y: 90 });
        });

        it('returns correct exit when both exits are the same distance', () => {
          const exits = { top: { start: boardDimensions.width - 100, end: boardDimensions.width - 50 }, right: { start: 60, end: 110 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);

          const exitPosition = actions.getExitPosition({ x: 1000, y: 100, ...dimensions });
          expect(exitPosition).toEqual({ x: boardDimensions.width, y: 100 });
        });
      });


      describe('exits are to the top and bottom;', () => {
        it('returns correct exit when top is closer', () => {
          const exits = { top: { start: 50, end: 100 }, bottom: { start: 50, end: 100 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);

          const exitPosition = actions.getExitPosition({ x: 100, y: 100, ...dimensions });
          expect(exitPosition).toEqual({ x: 100, y: -dimensions.height });
        });

        it('returns correct exit when bottom is closer', () => {
          const exits = { top: { start: 50, end: 100 }, bottom: { start: 50, end: 100 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);

          const exitPosition = actions.getExitPosition({ x: 100, y: 450, ...dimensions });
          expect(exitPosition).toEqual({ x: 100, y: boardDimensions.height });
        });

        it('returns correct exit when both exits are the same distance', () => {
          const exits = { top: { start: 50, end: 100 }, bottom: { start: 50, end: 100 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);

          const exitPosition = actions.getExitPosition({ x: 100, y: ((boardDimensions.height / 2) - (dimensions.height / 2)), ...dimensions });
          expect(exitPosition).toEqual({ x: 100, y: -dimensions.height });
        });
      });


      describe('exits are to the left and right;', () => {
        it('returns correct exit when left is closer', () => {
          const exits = { left: { start: 50, end: 100 }, right: { start: 50, end: 100 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);

          const exitPosition = actions.getExitPosition({ x: 100, y: 100, ...dimensions });
          expect(exitPosition).toEqual({ x: -dimensions.width, y: 100 });
        });

        it('returns correct exit when right is closer', () => {
          const exits = { left: { start: 50, end: 100 }, right: { start: 50, end: 100 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);

          const exitPosition = actions.getExitPosition({ x: 1100, y: 100, ...dimensions });
          expect(exitPosition).toEqual({ x: boardDimensions.width, y: 100 });
        });

        it('returns correct exit when both exits are the same distance', () => {
          const exits = { left: { start: 50, end: 100 }, right: { start: 50, end: 100 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);

          const exitPosition = actions.getExitPosition({ x: ((boardDimensions.width / 2) - (dimensions.width / 2)), y: 100, ...dimensions });
          expect(exitPosition).toEqual({ x: -dimensions.width, y: 100 });
        });
      });


      describe('exits are to the bottom and left;', () => {
        it('returns correct exit when left is closer', () => {
          const exits = { left: { start: 50, end: 100 }, bottom: { start: 50, end: 100 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);

          const exitPosition = actions.getExitPosition({ x: 100, y: 100, ...dimensions });
          expect(exitPosition).toEqual({ x: -dimensions.width, y: 100 });
        });

        it('returns correct exit when bottom is closer', () => {
          const exits = { left: { start: 50, end: 100 }, bottom: { start: 50, end: 100 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);

          const exitPosition = actions.getExitPosition({ x: 100, y: 500, ...dimensions });
          expect(exitPosition).toEqual({ x: 100, y: boardDimensions.height });
        });

        it('returns correct exit when both exits are the same distance', () => {
          const exits = { left: { start: boardDimensions.height - 100, end: boardDimensions.height - 50 }, bottom: { start: 60, end: 110 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);

          const exitPosition = actions.getExitPosition({ x: 100, y: boardDimensions.height - 200, ...dimensions });
          expect(exitPosition).toEqual({ x: 100, y: boardDimensions.height });
        });
      });


      describe('exits are to the bottom and right;', () => {
        it('returns correct exit when right is closer', () => {
          const exits = { right: { start: 50, end: 100 }, bottom: { start: 50, end: 100 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);

          const exitPosition = actions.getExitPosition({ x: 1000, y: 100, ...dimensions });
          expect(exitPosition).toEqual({ x: boardDimensions.width, y: 100 });
        });

        it('returns correct exit when bottom is closer', () => {
          const exits = { right: { start: 50, end: 100 }, bottom: { start: 50, end: 100 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);

          const exitPosition = actions.getExitPosition({ x: 100, y: 500, ...dimensions });
          expect(exitPosition).toEqual({ x: 100, y: boardDimensions.height });
        });

        it('returns correct exit when both exits are the same distance', () => {
          const exits = {
            right: { start: boardDimensions.height - 100, end: boardDimensions.height - 50 },
            bottom: { start: boardDimensions.width - 100, end: boardDimensions.width - 50 }
          };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);

          const exitPosition = actions.getExitPosition({ x: boardDimensions.width - 200, y: boardDimensions.height - 200, ...dimensions });
          expect(exitPosition).toEqual({ x: boardDimensions.width, y: boardDimensions.height - 100 });
        });
      });
    });


    describe('targetTile is provided;', () => {
      describe('targetTile is to the right', () => {
        it('returns correct exit position', () => {
          const exits = { right: { start: 50, end: 100 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);

          const exitPosition = actions.getExitPosition({ x: 100, y: 100, ...dimensions }, { x: 3, y: 4 });
          expect(exitPosition).toEqual({ x: boardDimensions.width, y: 50 });
        });

        it('returns correct exit position when tile only has an exit to the bottom', () => {
          const exits = { bottom: { start: 50, end: 100 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);

          const exitPosition = actions.getExitPosition({ x: 100, y: 100, ...dimensions }, { x: 3, y: 4 });
          expect(exitPosition).toEqual({ x: 50, y: boardDimensions.height });
        });

        it('returns correct exit position when tile only has an exit to the left', () => {
          const exits = { left: { start: 50, end: 100 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);

          const exitPosition = actions.getExitPosition({ x: 100, y: 100, ...dimensions }, { x: 3, y: 4 });
          expect(exitPosition).toEqual({ x: -dimensions.width, y: 50 });
        });

        it('returns correct exit position when tile only has an exit to the top', () => {
          const exits = { top: { start: 50, end: 100 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);

          const exitPosition = actions.getExitPosition({ x: 100, y: 100, ...dimensions }, { x: 3, y: 4 });
          expect(exitPosition).toEqual({ x: 50, y: -dimensions.height });
        });

        it('returns correct exit position when tile has top, bottom and left exits', () => {
          const exits = { top: { start: 50, end: 100 }, bottom: { start: 50, end: 100 }, left: { start: 50, end: 100 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);

          const exitPosition = actions.getExitPosition({ x: 100, y: 100, ...dimensions }, { x: 3, y: 4 });
          expect(exitPosition).toEqual({ x: 50, y: -dimensions.height });
        });

        it('returns correct exit position when tile has top and left exits', () => {
          const exits = { top: { start: 50, end: 100 }, left: { start: 50, end: 100 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);

          const exitPosition = actions.getExitPosition({ x: 100, y: 100, ...dimensions }, { x: 3, y: 4 });
          expect(exitPosition).toEqual({ x: 50, y: -dimensions.height });
        });

        it('returns correct exit position when tile has top and bottom exits', () => {
          const exits = { top: { start: 50, end: 100 }, bottom: { start: 50, end: 100 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);

          const exitPosition = actions.getExitPosition({ x: 100, y: 100, ...dimensions }, { x: 3, y: 4 });
          expect(exitPosition).toEqual({ x: 50, y: -dimensions.height });
        });

        it('returns correct exit position when tile has left and bottom exits', () => {
          const exits = { bottom: { start: 50, end: 100 }, left: { start: 50, end: 100 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);

          const exitPosition = actions.getExitPosition({ x: 100, y: 100, ...dimensions }, { x: 3, y: 4 });
          expect(exitPosition).toEqual({ x: 50, y: boardDimensions.height });
        });
      });


      describe('targetTile is to the left', () => {
        it('returns correct exit position', () => {
          const exits = { left: { start: 50, end: 100 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);

          const exitPosition = actions.getExitPosition({ x: 100, y: 100, ...dimensions }, { x: 3, y: 2 });
          expect(exitPosition).toEqual({ x: -dimensions.width, y: 50 });
        });

        it('returns correct exit position when tile only has an exit to the bottom', () => {
          const exits = { bottom: { start: 50, end: 100 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);

          const exitPosition = actions.getExitPosition({ x: 100, y: 100, ...dimensions }, { x: 3, y: 2 });
          expect(exitPosition).toEqual({ x: 50, y: boardDimensions.height });
        });

        it('returns correct exit position when tile only has an exit to the right', () => {
          const exits = { right: { start: 50, end: 100 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);

          const exitPosition = actions.getExitPosition({ x: 100, y: 100, ...dimensions }, { x: 3, y: 2 });
          expect(exitPosition).toEqual({ x: boardDimensions.width, y: 50 });
        });

        it('returns correct exit position when tile only has an exit to the top', () => {
          const exits = { top: { start: 50, end: 100 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);

          const exitPosition = actions.getExitPosition({ x: 100, y: 100, ...dimensions }, { x: 3, y: 2 });
          expect(exitPosition).toEqual({ x: 50, y: -dimensions.height });
        });

        it('returns correct exit position when tile has top, bottom and right exits', () => {
          const exits = { top: { start: 50, end: 100 }, bottom: { start: 50, end: 100 }, right: { start: 50, end: 100 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);

          const exitPosition = actions.getExitPosition({ x: 100, y: 100, ...dimensions }, { x: 3, y: 2 });
          expect(exitPosition).toEqual({ x: 50, y: -dimensions.height });
        });

        it('returns correct exit position when tile has top and right exits', () => {
          const exits = { top: { start: 50, end: 100 }, right: { start: 50, end: 100 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);

          const exitPosition = actions.getExitPosition({ x: 100, y: 100, ...dimensions }, { x: 3, y: 2 });
          expect(exitPosition).toEqual({ x: 50, y: -dimensions.height });
        });

        it('returns correct exit position when tile but has top and bottom exits', () => {
          const exits = { top: { start: 50, end: 100 }, bottom: { start: 50, end: 100 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);

          const exitPosition = actions.getExitPosition({ x: 100, y: 100, ...dimensions }, { x: 3, y: 2 });
          expect(exitPosition).toEqual({ x: 50, y: -dimensions.height });
        });

        it('returns correct exit position when tile has right and bottom exits', () => {
          const exits = { bottom: { start: 50, end: 100 }, right: { start: 50, end: 100 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);

          const exitPosition = actions.getExitPosition({ x: 100, y: 100, ...dimensions }, { x: 3, y: 2 });
          expect(exitPosition).toEqual({ x: 50, y: boardDimensions.height });
        });
      });


      describe('targetTile is to the top', () => {
        it('returns correct exit position when target tile is to the top', () => {
          const exits = { top: { start: 50, end: 100 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);

          const exitPosition = actions.getExitPosition({ x: 100, y: 100, ...dimensions }, { x: 2, y: 3 });
          expect(exitPosition).toEqual({ x: 50, y: -dimensions.height });
        });

        it('returns correct exit position when tile only has an exit to the bottom', () => {
          const exits = { bottom: { start: 50, end: 100 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);

          const exitPosition = actions.getExitPosition({ x: 100, y: 100, ...dimensions }, { x: 2, y: 3 });
          expect(exitPosition).toEqual({ x: 50, y: boardDimensions.height });
        });

        it('returns correct exit position when tile only has an exit to the left', () => {
          const exits = { left: { start: 50, end: 100 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);

          const exitPosition = actions.getExitPosition({ x: 100, y: 100, ...dimensions }, { x: 2, y: 3 });
          expect(exitPosition).toEqual({ x: -dimensions.width, y: 50 });
        });

        it('returns correct exit position when tile only has an exit to the right', () => {
          const exits = { right: { start: 50, end: 100 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);

          const exitPosition = actions.getExitPosition({ x: 100, y: 100, ...dimensions }, { x: 2, y: 3 });
          expect(exitPosition).toEqual({ x: boardDimensions.width, y: 50 });
        });

        it('returns correct exit position when tile has right, bottom and left exits', () => {
          const exits = { right: { start: 50, end: 100 }, bottom: { start: 50, end: 100 }, left: { start: 50, end: 100 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);

          const exitPosition = actions.getExitPosition({ x: 100, y: 100, ...dimensions }, { x: 2, y: 3 });
          expect(exitPosition).toEqual({ x: boardDimensions.width, y: 50 });
        });

        it('returns correct exit position when tile has right and left exits', () => {
          const exits = { right: { start: 50, end: 100 }, left: { start: 50, end: 100 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);

          const exitPosition = actions.getExitPosition({ x: 100, y: 100, ...dimensions }, { x: 2, y: 3 });
          expect(exitPosition).toEqual({ x: boardDimensions.width, y: 50 });
        });

        it('returns correct exit position when tile has right and bottom exits', () => {
          const exits = { right: { start: 50, end: 100 }, bottom: { start: 50, end: 100 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);

          const exitPosition = actions.getExitPosition({ x: 100, y: 100, ...dimensions }, { x: 2, y: 3 });
          expect(exitPosition).toEqual({ x: boardDimensions.width, y: 50 });
        });

        it('returns correct exit position when tile has left and bottom exits', () => {
          const exits = { bottom: { start: 50, end: 100 }, left: { start: 50, end: 100 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);

          const exitPosition = actions.getExitPosition({ x: 100, y: 100, ...dimensions }, { x: 2, y: 3 });
          expect(exitPosition).toEqual({ x: 50, y: boardDimensions.height });
        });
      });


      describe('targetTile is to the bottom', () => {
        it('returns correct exit position when target tile is to the bottom', () => {
          const exits = { bottom: { start: 50, end: 100 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);

          const exitPosition = actions.getExitPosition({ x: 100, y: 100, ...dimensions }, { x: 4, y: 3 });
          expect(exitPosition).toEqual({ x: 50, y: boardDimensions.height });
        });

        it('returns correct exit position when tile only has an exit to the top', () => {
          const exits = { top: { start: 50, end: 100 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);

          const exitPosition = actions.getExitPosition({ x: 100, y: 100, ...dimensions }, { x: 4, y: 3 });
          expect(exitPosition).toEqual({ x: 50, y: -dimensions.height });
        });

        it('returns correct exit position when tile only has an exit to the left', () => {
          const exits = { left: { start: 50, end: 100 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);

          const exitPosition = actions.getExitPosition({ x: 100, y: 100, ...dimensions }, { x: 4, y: 3 });
          expect(exitPosition).toEqual({ x: -dimensions.width, y: 50 });
        });

        it('returns correct exit position when tile only has an exit to the right', () => {
          const exits = { right: { start: 50, end: 100 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);

          const exitPosition = actions.getExitPosition({ x: 100, y: 100, ...dimensions }, { x: 4, y: 3 });
          expect(exitPosition).toEqual({ x: boardDimensions.width, y: 50 });
        });

        it('returns correct exit position when tile has right, top and left exits', () => {
          const exits = { right: { start: 50, end: 100 }, top: { start: 50, end: 100 }, left: { start: 50, end: 100 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);

          const exitPosition = actions.getExitPosition({ x: 100, y: 100, ...dimensions }, { x: 4, y: 3 });
          expect(exitPosition).toEqual({ x: boardDimensions.width, y: 50 });
        });

        it('returns correct exit position when tile has right and left exits', () => {
          const exits = { right: { start: 50, end: 100 }, left: { start: 50, end: 100 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);

          const exitPosition = actions.getExitPosition({ x: 100, y: 100, ...dimensions }, { x: 4, y: 3 });
          expect(exitPosition).toEqual({ x: boardDimensions.width, y: 50 });
        });

        it('returns correct exit position when tile has right and top exits', () => {
          const exits = { right: { start: 50, end: 100 }, top: { start: 50, end: 100 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);

          const exitPosition = actions.getExitPosition({ x: 100, y: 100, ...dimensions }, { x: 4, y: 3 });
          expect(exitPosition).toEqual({ x: boardDimensions.width, y: 50 });
        });

        it('returns correct exit position when tile has left and top exits', () => {
          const exits = { top: { start: 50, end: 100 }, left: { start: 50, end: 100 } };
          const tree = new Baobab({ tile: { ...tile, exits }, boardDimensions });
          ActionsRewire.__Rewire__('tree', tree);

          const exitPosition = actions.getExitPosition({ x: 100, y: 100, ...dimensions }, { x: 4, y: 3 });
          expect(exitPosition).toEqual({ x: 50, y: -dimensions.height });
        });
      });
    });
  });


  // TODO: add tests
  describe('moveEntityForward;', () => {

  });


  describe('moveEntityBack;', () => {

  });
});