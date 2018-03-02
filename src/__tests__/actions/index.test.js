import Baobab from 'baobab';

import { Carrot } from '../../components/Food';

import * as actions from '../../actions';
import { __RewireAPI__ as ActionsRewire } from '../../actions';

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

  describe('getClosestOpenGap;', () => {
    describe('no collisions between character and exit', () => {
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

      /* -----------------------
          X    E
      */
      it('returns correct gap when exit is to the right', () => {
        const character = { x: 200, y: 400, height: 40, width: 40 };
        const exitPosition = { x: 400, y: 400 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        expect(closestGap.x).toEqual(exitPosition.x);
        expect(closestGap.y).toEqual(exitPosition.y);
      });

      /* -----------------------
          E    X
      */
      it('returns correct gap when exit is to the left', () => {
        const character = { x: 400, y: 400, height: 40, width: 40 };
        const exitPosition = { x: 200, y: 400 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        expect(closestGap.x).toEqual(exitPosition.x);
        expect(closestGap.y).toEqual(exitPosition.y);
      });

      /* -----------------------
          E

          X
      */
      it('returns correct gap when exit is to the top', () => {
        const character = { x: 200, y: 400, height: 40, width: 40 };
        const exitPosition = { x: 200, y: 200 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        expect(closestGap.x).toEqual(exitPosition.x);
        expect(closestGap.y).toEqual(exitPosition.y);
      });

      /* -----------------------
          X

          E
      */
      it('returns correct gap when exit is to the bottom', () => {
        const character = { x: 200, y: 200, height: 40, width: 40 };
        const exitPosition = { x: 200, y: 400 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        expect(closestGap.x).toEqual(exitPosition.x);
        expect(closestGap.y).toEqual(exitPosition.y);
      });

      /* -----------------------
          X
               E
      */
      it('returns correct gap when exit is to the bottom right', () => {
        const character = { x: 200, y: 200, height: 40, width: 40 };
        const exitPosition = { x: 300, y: 400 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        expect(closestGap.x).toEqual(exitPosition.x);
        expect(closestGap.y).toEqual(exitPosition.y);
      });

      /* -----------------------
               E
          X
      */
      it('returns correct gap when exit is to the top right', () => {
        const character = { x: 200, y: 400, height: 40, width: 40 };
        const exitPosition = { x: 300, y: 200 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        expect(closestGap.x).toEqual(exitPosition.x);
        expect(closestGap.y).toEqual(exitPosition.y);
      });

      /* -----------------------
               X
          E
      */
      it('returns correct gap when exit is to the bottom left', () => {
        const character = { x: 300, y: 200, height: 40, width: 40 };
        const exitPosition = { x: 200, y: 400 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        expect(closestGap.x).toEqual(exitPosition.x);
        expect(closestGap.y).toEqual(exitPosition.y);
      });

      /* -----------------------
          E
               X
      */
      it('returns correct gap when exit is to the top left', () => {
        const character = { x: 300, y: 400, height: 40, width: 40 };
        const exitPosition = { x: 200, y: 200 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        expect(closestGap.x).toEqual(exitPosition.x);
        expect(closestGap.y).toEqual(exitPosition.y);
      });

      /* -----------------------
             E

          X
      */
      it('returns correct gap when exit is to the top right', () => {
        const character = { x: 200, y: 400, height: 40, width: 40 };
        const exitPosition = { x: 400, y: 200 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        expect(closestGap.x).toEqual(exitPosition.x);
        expect(closestGap.y).toEqual(exitPosition.y);
      });

      /* -----------------------
          E

             X
      */
      it('returns correct gap when exit is to the top left', () => {
        const character = { x: 400, y: 400, height: 40, width: 40 };
        const exitPosition = { x: 200, y: 200 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        expect(closestGap.x).toEqual(exitPosition.x);
        expect(closestGap.y).toEqual(exitPosition.y);
      });

      /* -----------------------
          X

             E
      */
      it('returns correct gap when exit is to the bottom right', () => {
        const character = { x: 200, y: 200, height: 40, width: 40 };
        const exitPosition = { x: 400, y: 400 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        expect(closestGap.x).toEqual(exitPosition.x);
        expect(closestGap.y).toEqual(exitPosition.y);
      });

      /* -----------------------
             X

          E
      */
      it('returns correct gap when exit is to the bottom left', () => {
        const character = { x: 400, y: 200, height: 40, width: 40 };
        const exitPosition = { x: 200, y: 400 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        expect(closestGap.x).toEqual(exitPosition.x);
        expect(closestGap.y).toEqual(exitPosition.y);
      });
    });

    describe('there are collisions between character and exit;', () => {
      afterEach(() => {
        ActionsRewire.__ResetDependency__('tree');
      });

      /* -----------------------
             X  |  E
                 G
      */
      it('returns correct gap when exit is to the right of character, with a collision in the way', () => {
        const collisionPositions = [
          // Right collision
          { x: 300, y: 400 }
        ];
        const tree = new Baobab({
          tile: {
            x: 1,
            y: 1,
            scenery: [],
            food: collisionPositions.map((position, id) => new Carrot(position, id))
          },
          boardDimensions
        });

        ActionsRewire.__Rewire__('tree', tree);
        const character = { x: 200, y: 400, height: 40, width: 40 };
        const exitPosition = { x: 400, y: 400 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        expect(closestGap.x).toEqual(320);
        expect(closestGap.y).toEqual(426);
      });

      /* -----------------------
             E  |  X
                 G
      */
      it('returns correct gap when exit is to the left of character, with a collision in the way', () => {
        const collisionPositions = [
          // Left collision
          { x: 300, y: 400 }
        ];
        const tree = new Baobab({
          tile: {
            x: 1,
            y: 1,
            scenery: [],
            food: collisionPositions.map((position, id) => new Carrot(position, id))
          },
          boardDimensions
        });

        ActionsRewire.__Rewire__('tree', tree);
        const character = { x: 400, y: 400, height: 40, width: 40 };
        const exitPosition = { x: 200, y: 400 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        expect(closestGap.x).toEqual(320);
        expect(closestGap.y).toEqual(426);
      });

      /* -----------------------
             E
            G-
             X
      */
      it('returns correct gap when exit is to the top of character, with a collision in the way', () => {
        const collisionPositions = [
          // Top collision
          { x: 200, y: 300 }
        ];
        const tree = new Baobab({
          tile: {
            x: 1,
            y: 1,
            scenery: [],
            food: collisionPositions.map((position, id) => new Carrot(position, id))
          },
          boardDimensions
        });

        ActionsRewire.__Rewire__('tree', tree);
        const character = { x: 200, y: 400, height: 40, width: 40 };
        const exitPosition = { x: 200, y: 200 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        expect(closestGap.x).toEqual(220);
        expect(closestGap.y).toEqual(326);
      });

      /* -----------------------
             X
             -G
             E
      */
      it('returns correct gap when exit is to the bottom of character, with a collision in the way', () => {
        const collisionPositions = [
          // Bottom collision
          { x: 200, y: 300 }
        ];
        const tree = new Baobab({
          tile: {
            x: 1,
            y: 1,
            scenery: [],
            food: collisionPositions.map((position, id) => new Carrot(position, id))
          },
          boardDimensions
        });

        ActionsRewire.__Rewire__('tree', tree);
        const character = { x: 200, y: 200, height: 40, width: 40 };
        const exitPosition = { x: 200, y: 400 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        expect(closestGap.x).toEqual(220);
        expect(closestGap.y).toEqual(326);
      });

      /* -----------------------
                  X
             -
             E
      */
      it('returns correct gap when exit is below and to the left of character, with a collision in the way', () => {
        const collisionPositions = [
          // Bottom collision
          { x: 200, y: 300 }
        ];
        const tree = new Baobab({
          tile: {
            x: 1,
            y: 1,
            scenery: [],
            food: collisionPositions.map((position, id) => new Carrot(position, id))
          },
          boardDimensions
        });

        ActionsRewire.__Rewire__('tree', tree);
        const character = { x: 400, y: 200, height: 40, width: 40 };
        const exitPosition = { x: 200, y: 400 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        // Gap will be exit position until character is going the direction with the collision
        expect(closestGap.x).toEqual(200);
        expect(closestGap.y).toEqual(400);
      });

      /* -----------------------
           G     |
          |      |
          | X    |
          |______|

                    E
      */
      it('returns correct gap when exit is below and to the right, but there are collisions to the bottom, left and right', () => {
        const collisionPositions = [
          // Left collisions
          { x: 260, y: 190 },
          { x: 260, y: 230 },
          // Right collisions
          { x: 460, y: 70 },
          { x: 460, y: 110 },
          { x: 460, y: 150 },
          { x: 460, y: 190 },
          { x: 460, y: 230 },
          // Bottom collisions
          { x: 260, y: 270 },
          { x: 300, y: 270 },
          { x: 340, y: 270 },
          { x: 380, y: 270 },
          { x: 420, y: 270 },
          { x: 460, y: 270 }
        ];
        const tree = new Baobab({
          tile: {
            x: 1,
            y: 1,
            scenery: [],
            food: collisionPositions.map((position, id) => new Carrot(position, id))
          },
          boardDimensions
        });

        ActionsRewire.__Rewire__('tree', tree);
        const character = { x: 300, y: 230, height: 40, width: 40 };
        const exitPosition = { x: 600, y: 600 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        expect(closestGap.x).toEqual(280);
        expect(closestGap.y).toEqual(150);
      });

      /* -----------------------
          |___G  |
          |      |
          | X    |
          |______|

                    E
      */
      it('returns correct gap when exit is below and to the right, but there are collisions to the bottom, left and right and left has another collision above the gap', () => {
        const collisionPositions = [
          // Top collisions
          { x: 300, y: 190 },
          { x: 340, y: 190 },
          // Left collisions
          { x: 260, y: 190 },
          { x: 260, y: 150 },
          { x: 260, y: 230 },
          // Right collisions
          { x: 460, y: 70 },
          { x: 460, y: 110 },
          { x: 460, y: 150 },
          { x: 460, y: 190 },
          { x: 460, y: 230 },
          // Bottom collisions
          { x: 460, y: 270 },
          { x: 420, y: 270 },
          { x: 380, y: 270 },
          { x: 340, y: 270 },
          { x: 300, y: 270 },
          { x: 260, y: 270 },
        ];
        const tree = new Baobab({
          tile: {
            x: 1,
            y: 1,
            scenery: [],
            food: collisionPositions.map((position, id) => new Carrot(position, id))
          },
          boardDimensions
        });

        ActionsRewire.__Rewire__('tree', tree);
        const character = { x: 300, y: 230, height: 40, width: 40 };
        const exitPosition = { x: 500, y: 500 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        expect(closestGap.x).toEqual(360);
        expect(closestGap.y).toEqual(216);
      });

      /* -----------------------
           ___G  |
          |      |
          | X    |
          |______|

                    E
      */
      it('returns correct gap when exit is below and to the right, but there are collisions to the bottom, left, right, and top has partial collisions 1', () => {
        const collisionPositions = [
          // Top collisions
          { x: 300, y: 190 },
          { x: 340, y: 190 },
          // Left collisions
          { x: 260, y: 190 },
          { x: 260, y: 230 },
          // Right collisions
          { x: 460, y: 70 },
          { x: 460, y: 110 },
          { x: 460, y: 150 },
          { x: 460, y: 190 },
          { x: 460, y: 230 },
          // Bottom collisions
          { x: 460, y: 270 },
          { x: 420, y: 270 },
          { x: 380, y: 270 },
          { x: 340, y: 270 },
          { x: 300, y: 270 },
          { x: 260, y: 270 },
        ];
        const tree = new Baobab({
          tile: {
            x: 1,
            y: 1,
            scenery: [],
            food: collisionPositions.map((position, id) => new Carrot(position, id))
          },
          boardDimensions
        });

        ActionsRewire.__Rewire__('tree', tree);
        const character = { x: 300, y: 230, height: 40, width: 40 };
        const exitPosition = { x: 500, y: 500 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        expect(closestGap.x).toEqual(360);
        expect(closestGap.y).toEqual(216);
      });

      /* -----------------------
           ___G _|
          |      |
          | X    |
          |______|

                    E
      */
      it('returns correct gap when exit is below and to the right, but there are collisions to the bottom, left, right, and top has partial collisions 2', () => {
        const collisionPositions = [
          // Top collisions
          { x: 300, y: 190 },
          { x: 340, y: 190 },
          { x: 420, y: 190 },
          // Left collisions
          { x: 260, y: 190 },
          { x: 260, y: 230 },
          // Right collisions
          { x: 460, y: 70 },
          { x: 460, y: 110 },
          { x: 460, y: 150 },
          { x: 460, y: 190 },
          { x: 460, y: 230 },
          // Bottom collisions
          { x: 460, y: 270 },
          { x: 420, y: 270 },
          { x: 380, y: 270 },
          { x: 340, y: 270 },
          { x: 300, y: 270 },
          { x: 260, y: 270 },
        ];
        const tree = new Baobab({
          tile: {
            x: 1,
            y: 1,
            scenery: [],
            food: collisionPositions.map((position, id) => new Carrot(position, id))
          },
          boardDimensions
        });

        ActionsRewire.__Rewire__('tree', tree);
        const character = { x: 300, y: 230, height: 40, width: 40 };
        const exitPosition = { x: 500, y: 500 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        expect(closestGap.x).toEqual(360);
        expect(closestGap.y).toEqual(216);
      });

      /* -----------------------
         G         |
          |        |
          | X      |
          |___   __|

                    E
      */
      it('returns correct gap when exit is below and to the right, but there are collisions to the left, right, and bottom has partial collisions', () => {
        const collisionPositions = [
          // Left collisions
          { x: 260, y: 190 },
          { x: 260, y: 230 },
          // Right collisions
          { x: 460, y: 70 },
          { x: 460, y: 110 },
          { x: 460, y: 150 },
          { x: 460, y: 190 },
          { x: 460, y: 230 },
          // Bottom collisions
          { x: 460, y: 270 },
          { x: 420, y: 270 },
          { x: 340, y: 270 },
          { x: 300, y: 270 },
          { x: 260, y: 270 },
        ];
        const tree = new Baobab({
          tile: {
            x: 1,
            y: 1,
            scenery: [],
            food: collisionPositions.map((position, id) => new Carrot(position, id))
          },
          boardDimensions
        });

        ActionsRewire.__Rewire__('tree', tree);
        const character = { x: 300, y: 230, height: 40, width: 40 };
        const exitPosition = { x: 500, y: 500 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        // Gaps without any collisions in the path will take precedence over
        // those that have collisions, even if they're closer to the destination
        expect(closestGap.x).toEqual(280);
        expect(closestGap.y).toEqual(150);
      });

      /* -----------------------
        G        |
         |       |
         | X     |
         |__   __|
            | |
            |_|
                   E
      */
      it('returns correct gap when exit is below and to the right, but there are collisions to the left, right, and bottom has spaced collisions', () => {
        const collisionPositions = [
          // Left collisions
          { x: 260, y: 190 },
          { x: 260, y: 230 },
          // Right collisions
          { x: 460, y: 70 },
          { x: 460, y: 110 },
          { x: 460, y: 150 },
          { x: 460, y: 190 },
          { x: 460, y: 230 },
          // Bottom collisions
          { x: 460, y: 270 },
          { x: 420, y: 270 },
          { x: 340, y: 270 },
          { x: 300, y: 270 },
          { x: 260, y: 270 },
          { x: 340, y: 310 },
          { x: 420, y: 310 },
          { x: 340, y: 350 },
          { x: 380, y: 350 },
          { x: 420, y: 350 },
        ];
        const tree = new Baobab({
          tile: {
            x: 1,
            y: 1,
            scenery: [],
            food: collisionPositions.map((position, id) => new Carrot(position, id))
          },
          boardDimensions
        });

        ActionsRewire.__Rewire__('tree', tree);
        const character = { x: 300, y: 230, height: 40, width: 40 };
        const exitPosition = { x: 500, y: 500 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        expect(closestGap.x).toEqual(280);
        expect(closestGap.y).toEqual(150);
      });

      /* -----------------------
             _
            | |     E
         ___| |___
         |       |
         | X     |
         |       |
          G
      */
      it('returns correct gap when exit is up and to the right, but there are collisions to the left, right, and top has spaced collisions', () => {
        const collisionPositions = [
          // Top collisions
          { x: 300, y: 110 },
          { x: 340, y: 110 },
          { x: 380, y: 110 },
          { x: 300, y: 150 },
          { x: 380, y: 150 },
          { x: 300, y: 190 },
          { x: 380, y: 190 },
          // Left collisions
          { x: 260, y: 190 },
          { x: 260, y: 230 },
          { x: 260, y: 270 },
          // Right collisions
          { x: 420, y: 190 },
          { x: 420, y: 230 },
          { x: 420, y: 270 },
        ];
        const tree = new Baobab({
          tile: {
            x: 1,
            y: 1,
            scenery: [],
            food: collisionPositions.map((position, id) => new Carrot(position, id))
          },
          boardDimensions
        });

        ActionsRewire.__Rewire__('tree', tree);
        const character = { x: 300, y: 230, height: 40, width: 40 };
        const exitPosition = { x: 600, y: 50 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        expect(closestGap.x).toEqual(280);
        expect(closestGap.y).toEqual(296);
      });

      /* -----------------------
            G      |
          __|      |
         |__  X    |
            |______|
                   E
      */
      it('returns correct gap when exit is below and to the right, but there are collisions to the left, right, and bottom has spaced collisions', () => {
        const collisionPositions = [
          // Left collisions
          { x: 260, y: 190 },
          { x: 260, y: 230 },
          // Right collisions
          { x: 460, y: 70 },
          { x: 460, y: 110 },
          { x: 460, y: 150 },
          { x: 460, y: 190 },
          { x: 460, y: 230 },
          // Bottom collisions
          { x: 460, y: 270 },
          { x: 420, y: 270 },
          { x: 340, y: 270 },
          { x: 300, y: 270 },
          { x: 260, y: 270 },
          { x: 340, y: 310 },
          { x: 420, y: 310 },
          { x: 340, y: 350 },
          { x: 380, y: 350 },
          { x: 420, y: 350 },
        ];
        const tree = new Baobab({
          tile: {
            x: 1,
            y: 1,
            scenery: [],
            food: collisionPositions.map((position, id) => new Carrot(position, id))
          },
          boardDimensions
        });

        ActionsRewire.__Rewire__('tree', tree);
        const character = { x: 300, y: 230, height: 40, width: 40 };
        const exitPosition = { x: 500, y: 500 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        expect(closestGap.x).toEqual(280);
        expect(closestGap.y).toEqual(150);
      });

      /* -----------------------
        G        |
         |       |___
         | X      ___|
         |_______|
                   E
      */
      it('returns correct gap when exit is below and to the right, but there are collisions to the left, right, and right has spaced collisions', () => {
        const collisionPositions = [
          // Left collisions
          { x: 260, y: 190 },
          { x: 260, y: 230 },
          // Right collisions
          { x: 460, y: 70 },
          { x: 460, y: 110 },
          { x: 460, y: 150 },
          { x: 460, y: 190 },
          { x: 460, y: 230 },
          // Bottom collisions
          { x: 460, y: 270 },
          { x: 420, y: 270 },
          { x: 340, y: 270 },
          { x: 300, y: 270 },
          { x: 260, y: 270 },
          { x: 340, y: 310 },
          { x: 420, y: 310 },
          { x: 340, y: 350 },
          { x: 380, y: 350 },
          { x: 420, y: 350 },
        ];
        const tree = new Baobab({
          tile: {
            x: 1,
            y: 1,
            scenery: [],
            food: collisionPositions.map((position, id) => new Carrot(position, id))
          },
          boardDimensions
        });

        ActionsRewire.__Rewire__('tree', tree);
        const character = { x: 300, y: 230, height: 40, width: 40 };
        const exitPosition = { x: 500, y: 500 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        expect(closestGap.x).toEqual(280);
        expect(closestGap.y).toEqual(150);
      });

      /* -----------------------
        G          |
         |         |
          | X      |
           |_______|

                   E
      */
      it('returns correct gap when exit is below and to the right, but there are collisions to the right, bottom, and left has diagonal outward collisions', () => {
        const collisionPositions = [
          // Left collisions
          { x: 180, y: 190 },
          { x: 220, y: 230 },
          // Right collisions
          { x: 460, y: 70 },
          { x: 460, y: 110 },
          { x: 460, y: 150 },
          { x: 460, y: 190 },
          { x: 460, y: 230 },
          // Bottom collisions
          { x: 460, y: 270 },
          { x: 420, y: 270 },
          { x: 380, y: 270 },
          { x: 340, y: 270 },
          { x: 300, y: 270 },
          { x: 260, y: 270 },
        ];
        const tree = new Baobab({
          tile: {
            x: 1,
            y: 1,
            scenery: [],
            food: collisionPositions.map((position, id) => new Carrot(position, id))
          },
          boardDimensions
        });

        ActionsRewire.__Rewire__('tree', tree);
        const character = { x: 300, y: 230, height: 40, width: 40 };
        const exitPosition = { x: 500, y: 500 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        expect(closestGap.x).toEqual(140);
        expect(closestGap.y).toEqual(150);
      });

      /* -----------------------
           G       |
         ||        |
         || X      |
           |_______|

                   E
      */
      it('returns correct gap when exit is below and to the right, but there are collisions to the right, bottom, and left has diagonal/chunked outward collisions', () => {
        const collisionPositions = [
          // Left collisions
          { x: 180, y: 190 },
          { x: 180, y: 230 },
          { x: 220, y: 190 },
          { x: 220, y: 230 },
          // Right collisions
          { x: 460, y: 70 },
          { x: 460, y: 110 },
          { x: 460, y: 150 },
          { x: 460, y: 190 },
          { x: 460, y: 230 },
          // Bottom collisions
          { x: 460, y: 270 },
          { x: 420, y: 270 },
          { x: 380, y: 270 },
          { x: 340, y: 270 },
          { x: 300, y: 270 },
          { x: 260, y: 270 },
        ];
        const tree = new Baobab({
          tile: {
            x: 1,
            y: 1,
            scenery: [],
            food: collisionPositions.map((position, id) => new Carrot(position, id))
          },
          boardDimensions
        });

        ActionsRewire.__Rewire__('tree', tree);
        const character = { x: 300, y: 230, height: 40, width: 40 };
        const exitPosition = { x: 500, y: 500 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        expect(closestGap.x).toEqual(240);
        expect(closestGap.y).toEqual(150);
      });

      /* -----------------------
            G      |
           |       |
          |        |
         |         |
          | X      |
           |_______|

                   E
      */
      it('returns correct gap when exit is below and to the right, but there are collisions to the right, bottom, and left has diagonal outward, then inward collisions', () => {
        const collisionPositions = [
          // Left collisions
          { x: 260, y: 110 },
          { x: 220, y: 150 },
          { x: 180, y: 190 },
          { x: 220, y: 230 },
          // Right collisions
          { x: 460, y: 70 },
          { x: 460, y: 110 },
          { x: 460, y: 150 },
          { x: 460, y: 190 },
          { x: 460, y: 230 },
          // Bottom collisions
          { x: 460, y: 270 },
          { x: 420, y: 270 },
          { x: 380, y: 270 },
          { x: 340, y: 270 },
          { x: 300, y: 270 },
          { x: 260, y: 270 },
        ];
        const tree = new Baobab({
          tile: {
            x: 1,
            y: 1,
            scenery: [],
            food: collisionPositions.map((position, id) => new Carrot(position, id))
          },
          boardDimensions
        });

        ActionsRewire.__Rewire__('tree', tree);
        const character = { x: 300, y: 230, height: 40, width: 40 };
        const exitPosition = { x: 500, y: 500 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        expect(closestGap.x).toEqual(280);
        expect(closestGap.y).toEqual(70);
      });

      /* -----------------------
              G    |
             |     |
            | X    |
           |_______|

                   E
      */
      it('returns correct gap when exit is below and to the right, but there are collisions to the right, bottom, and left has diagonal inward collisions', () => {
        const collisionPositions = [
          // Left collisions
          { x: 340, y: 190 },
          { x: 300, y: 230 },
          // Right collisions
          { x: 460, y: 70 },
          { x: 460, y: 110 },
          { x: 460, y: 150 },
          { x: 460, y: 190 },
          { x: 460, y: 230 },
          // Bottom collisions
          { x: 460, y: 270 },
          { x: 420, y: 270 },
          { x: 380, y: 270 },
          { x: 340, y: 270 },
          { x: 300, y: 270 },
          { x: 260, y: 270 },
        ];
        const tree = new Baobab({
          tile: {
            x: 1,
            y: 1,
            scenery: [],
            food: collisionPositions.map((position, id) => new Carrot(position, id))
          },
          boardDimensions
        });

        ActionsRewire.__Rewire__('tree', tree);
        const character = { x: 300, y: 230, height: 40, width: 40 };
        const exitPosition = { x: 500, y: 500 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        expect(closestGap.x).toEqual(360);
        expect(closestGap.y).toEqual(150);
      });

      /* -----------------------
              G    |
            ||     |
            || X   |
           |_______|

                   E
      */
      it('returns correct gap when exit is below and to the right, but there are collisions to the right, bottom, and left has diagonal inward/chunked collisions', () => {
        const collisionPositions = [
          // Left collisions
          { x: 220, y: 150 },
          { x: 180, y: 150 },
          { x: 220, y: 190 },
          { x: 180, y: 190 },
          { x: 140, y: 230 },
          // Right collisions
          { x: 460, y: 70 },
          { x: 460, y: 110 },
          { x: 460, y: 150 },
          { x: 460, y: 190 },
          { x: 460, y: 230 },
          // Bottom collisions
          { x: 460, y: 270 },
          { x: 420, y: 270 },
          { x: 380, y: 270 },
          { x: 340, y: 270 },
          { x: 300, y: 270 },
          { x: 260, y: 270 },
          { x: 220, y: 270 },
          { x: 180, y: 270 },
          { x: 140, y: 270 },
        ];
        const tree = new Baobab({
          tile: {
            x: 1,
            y: 1,
            scenery: [],
            food: collisionPositions.map((position, id) => new Carrot(position, id))
          },
          boardDimensions
        });

        ActionsRewire.__Rewire__('tree', tree);
        const character = { x: 300, y: 230, height: 40, width: 40 };
        const exitPosition = { x: 500, y: 500 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        expect(closestGap.x).toEqual(240);
        expect(closestGap.y).toEqual(110);
      });

      /* -----------------------
           |          G
           |         |
           | X      |
           |_______|

                           E
      */
      it('returns correct gap when exit is below and to the right, but there are collisions to the right, bottom, and right has diagonal outward collisions', () => {
        const collisionPositions = [
          // Left collisions
          { x: 260, y: 70 },
          { x: 260, y: 110 },
          { x: 260, y: 150 },
          { x: 260, y: 190 },
          { x: 260, y: 230 },
          // Right collisions
          { x: 540, y: 190 },
          { x: 500, y: 230 },
          // Bottom collisions
          { x: 460, y: 270 },
          { x: 420, y: 270 },
          { x: 380, y: 270 },
          { x: 340, y: 270 },
          { x: 300, y: 270 },
          { x: 260, y: 270 },
        ];
        const tree = new Baobab({
          tile: {
            x: 1,
            y: 1,
            scenery: [],
            food: collisionPositions.map((position, id) => new Carrot(position, id))
          },
          boardDimensions
        });

        ActionsRewire.__Rewire__('tree', tree);
        const character = { x: 300, y: 230, height: 40, width: 40 };
        const exitPosition = { x: 600, y: 500 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        expect(closestGap.x).toEqual(560);
        expect(closestGap.y).toEqual(150);
      });

      /* -----------------------
           |       G
           |        ||
           | X      ||
           |_______|

                   E
      */
      it('returns correct gap when exit is below and to the right, but there are collisions to the right, bottom, and right has diagonal outward/chunked collisions', () => {
        const collisionPositions = [
          // Left collisions
          { x: 140, y: 70 },
          { x: 140, y: 110 },
          { x: 140, y: 150 },
          { x: 140, y: 190 },
          { x: 140, y: 230 },
          // Right collisions
          { x: 500, y: 190 },
          { x: 540, y: 190 },
          { x: 500, y: 230 },
          { x: 540, y: 230 },
          // Bottom collisions
          { x: 460, y: 270 },
          { x: 420, y: 270 },
          { x: 380, y: 270 },
          { x: 340, y: 270 },
          { x: 300, y: 270 },
          { x: 260, y: 270 },
          { x: 220, y: 270 },
          { x: 180, y: 270 },
          { x: 140, y: 270 },
        ];
        const tree = new Baobab({
          tile: {
            x: 1,
            y: 1,
            scenery: [],
            food: collisionPositions.map((position, id) => new Carrot(position, id))
          },
          boardDimensions
        });

        ActionsRewire.__Rewire__('tree', tree);
        const character = { x: 300, y: 230, height: 40, width: 40 };
        const exitPosition = { x: 600, y: 500 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        expect(closestGap.x).toEqual(460);
        expect(closestGap.y).toEqual(150);
      });

      /* -----------------------
           |       G
           |        ||    E
           | X      ||
           |_______|
      */
      it('returns correct gap when exit is to the right, but there are collisions to the right, bottom, and right has diagonal outward/chunked collisions', () => {
        const collisionPositions = [
          // Left collisions
          { x: 140, y: 70 },
          { x: 140, y: 110 },
          { x: 140, y: 150 },
          { x: 140, y: 190 },
          { x: 140, y: 230 },
          // Right collisions
          { x: 500, y: 190 },
          { x: 540, y: 190 },
          { x: 500, y: 230 },
          { x: 540, y: 230 },
          // Bottom collisions
          { x: 460, y: 270 },
          { x: 420, y: 270 },
          { x: 380, y: 270 },
          { x: 340, y: 270 },
          { x: 300, y: 270 },
          { x: 260, y: 270 },
          { x: 220, y: 270 },
          { x: 180, y: 270 },
          { x: 140, y: 270 },
        ];
        const tree = new Baobab({
          tile: {
            x: 1,
            y: 1,
            scenery: [],
            food: collisionPositions.map((position, id) => new Carrot(position, id))
          },
          boardDimensions
        });

        ActionsRewire.__Rewire__('tree', tree);
        const character = { x: 300, y: 230, height: 40, width: 40 };
        const exitPosition = { x: 600, y: 200 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        expect(closestGap.x).toEqual(460);
        expect(closestGap.y).toEqual(150);
      });

      /* -----------------------
           |       G
           |        ||
        E  | X      ||
           |_______|
      */
      it('returns correct gap when exit is to the left, but there are collisions to the right, bottom, and right has diagonal outward/chunked collisions', () => {
        const collisionPositions = [
          // Left collisions
          { x: 140, y: 70 },
          { x: 140, y: 110 },
          { x: 140, y: 150 },
          { x: 140, y: 190 },
          { x: 140, y: 230 },
          // Right collisions
          { x: 500, y: 190 },
          { x: 540, y: 190 },
          { x: 500, y: 230 },
          { x: 540, y: 230 },
          // Bottom collisions
          { x: 460, y: 270 },
          { x: 420, y: 270 },
          { x: 380, y: 270 },
          { x: 340, y: 270 },
          { x: 300, y: 270 },
          { x: 260, y: 270 },
          { x: 220, y: 270 },
          { x: 180, y: 270 },
          { x: 140, y: 270 },
        ];
        const tree = new Baobab({
          tile: {
            x: 1,
            y: 1,
            scenery: [],
            food: collisionPositions.map((position, id) => new Carrot(position, id))
          },
          boardDimensions
        });

        ActionsRewire.__Rewire__('tree', tree);
        const character = { x: 300, y: 230, height: 40, width: 40 };
        const exitPosition = { x: 100, y: 200 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        expect(closestGap.x).toEqual(460);
        expect(closestGap.y).toEqual(150);
      });

      /* -----------------------
           |      G
           |       |
           |        |
           |         |
           | X      |
           |_______|

                   E
      */
      it('returns correct gap when exit is below and to the right, but there are collisions to the right, bottom, and right has diagonal outward, then inward collisions', () => {
        const collisionPositions = [
          // Left collisions
          { x: 260, y: 70 },
          { x: 260, y: 110 },
          { x: 260, y: 150 },
          { x: 260, y: 190 },
          { x: 260, y: 230 },
          // Right collisions
          { x: 460, y: 110 },
          { x: 500, y: 150 },
          { x: 540, y: 190 },
          { x: 500, y: 230 },
          // Bottom collisions
          { x: 460, y: 270 },
          { x: 420, y: 270 },
          { x: 380, y: 270 },
          { x: 340, y: 270 },
          { x: 300, y: 270 },
          { x: 260, y: 270 },
        ];
        const tree = new Baobab({
          tile: {
            x: 1,
            y: 1,
            scenery: [],
            food: collisionPositions.map((position, id) => new Carrot(position, id))
          },
          boardDimensions
        });

        ActionsRewire.__Rewire__('tree', tree);
        const character = { x: 300, y: 230, height: 40, width: 40 };
        const exitPosition = { x: 500, y: 500 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        expect(closestGap.x).toEqual(420);
        expect(closestGap.y).toEqual(70);
      });

      /* -----------------------
           |    G
           |     |
           | X    |
           |_______|

                   E
      */
      it('returns correct gap when exit is below and to the right, but there are collisions to the right, bottom, and right has diagonal inward collisions', () => {
        const collisionPositions = [
          // Left collisions
          { x: 260, y: 70 },
          { x: 260, y: 110 },
          { x: 260, y: 150 },
          { x: 260, y: 190 },
          { x: 260, y: 230 },
          // Right collisions
          { x: 380, y: 190 },
          { x: 420, y: 230 },
          // Bottom collisions
          { x: 460, y: 270 },
          { x: 420, y: 270 },
          { x: 380, y: 270 },
          { x: 340, y: 270 },
          { x: 300, y: 270 },
          { x: 260, y: 270 },
        ];
        const tree = new Baobab({
          tile: {
            x: 1,
            y: 1,
            scenery: [],
            food: collisionPositions.map((position, id) => new Carrot(position, id))
          },
          boardDimensions
        });

        ActionsRewire.__Rewire__('tree', tree);
        const character = { x: 300, y: 230, height: 40, width: 40 };
        const exitPosition = { x: 500, y: 500 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        expect(closestGap.x).toEqual(340);
        expect(closestGap.y).toEqual(150);
      });

      /* -----------------------
           |    G
           |     ||
           | X   ||
           |_______|

                   E
      */
      it('returns correct gap when exit is below and to the right, but there are collisions to the right, bottom, and right has diagonal inward/chunked collisions', () => {
        const collisionPositions = [
          // Left collisions
          { x: 260, y: 70 },
          { x: 260, y: 110 },
          { x: 260, y: 150 },
          { x: 260, y: 190 },
          { x: 260, y: 230 },
          // Right collisions
          { x: 380, y: 190 },
          { x: 380, y: 230 },
          { x: 420, y: 190 },
          { x: 420, y: 230 },
          // Bottom collisions
          { x: 460, y: 270 },
          { x: 420, y: 270 },
          { x: 380, y: 270 },
          { x: 340, y: 270 },
          { x: 300, y: 270 },
          { x: 260, y: 270 },
        ];
        const tree = new Baobab({
          tile: {
            x: 1,
            y: 1,
            scenery: [],
            food: collisionPositions.map((position, id) => new Carrot(position, id))
          },
          boardDimensions
        });

        ActionsRewire.__Rewire__('tree', tree);
        const character = { x: 300, y: 230, height: 40, width: 40 };
        const exitPosition = { x: 500, y: 500 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        expect(closestGap.x).toEqual(340);
        expect(closestGap.y).toEqual(150);
      });

      /* -----------------------
           G
            |
           X |
              |
                   E
      */
      it('returns correct gap when exit is below and to the right, but there are outward diagonal collisions to the right', () => {
        const collisionPositions = [
          // Right collisions
          { x: 380, y: 190 },
          { x: 420, y: 230 },
          { x: 460, y: 270 },
        ];
        const tree = new Baobab({
          tile: {
            x: 1,
            y: 1,
            scenery: [],
            food: collisionPositions.map((position, id) => new Carrot(position, id))
          },
          boardDimensions
        });

        ActionsRewire.__Rewire__('tree', tree);
        const character = { x: 300, y: 230, height: 40, width: 40 };
        const exitPosition = { x: 600, y: 500 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        expect(closestGap.x).toEqual(340);
        expect(closestGap.y).toEqual(150);
      });

      /* -----------------------

             |
        X   |
           |
          G
                   E
      */
      it('returns correct gap when exit is below and to the right, but there are inward diagonal collisions to the right', () => {
        const collisionPositions = [
          // Right collisions
          { x: 380, y: 270 },
          { x: 420, y: 230 },
          { x: 460, y: 190 },
        ];
        const tree = new Baobab({
          tile: {
            x: 1,
            y: 1,
            scenery: [],
            food: collisionPositions.map((position, id) => new Carrot(position, id))
          },
          boardDimensions
        });

        ActionsRewire.__Rewire__('tree', tree);
        const character = { x: 300, y: 230, height: 40, width: 40 };
        const exitPosition = { x: 600, y: 500 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        expect(closestGap.x).toEqual(340);
        expect(closestGap.y).toEqual(296);
      });

      /* -----------------------

                     |
                    |  X
                   |
                    G
            E
      */
      it('returns correct gap when exit is below and to the left, but there are outward diagonal collisions to the left', () => {
        const collisionPositions = [
          // Left collisions
          { x: 380, y: 190 },
          { x: 340, y: 230 },
          { x: 300, y: 270 },
        ];
        const tree = new Baobab({
          tile: {
            x: 1,
            y: 1,
            scenery: [],
            food: collisionPositions.map((position, id) => new Carrot(position, id))
          },
          boardDimensions
        });

        ActionsRewire.__Rewire__('tree', tree);
        const character = { x: 300, y: 230, height: 40, width: 40 };
        const exitPosition = { x: 50, y: 500 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        expect(closestGap.x).toEqual(260);
        expect(closestGap.y).toEqual(296);
      });

      /* -----------------------
                   |
                    |   X
                     |
            E
      */
      it('returns exit position when exit is below and to the left, but there are inward diagonal collisions to the left', () => {
        const collisionPositions = [
          // Left collisions
          { x: 380, y: 190 },
          { x: 420, y: 230 },
          { x: 460, y: 270 },
        ];
        const tree = new Baobab({
          tile: {
            x: 1,
            y: 1,
            scenery: [],
            food: collisionPositions.map((position, id) => new Carrot(position, id))
          },
          boardDimensions
        });

        ActionsRewire.__Rewire__('tree', tree);
        const character = { x: 300, y: 230, height: 40, width: 40 };
        const exitPosition = { x: 50, y: 500 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        expect(closestGap.x).toEqual(50);
        expect(closestGap.y).toEqual(500);
      });

      /* -----------------------
                   |
            E       |  X
                     |
                      G
      */
      it('returns correct gap when exit is to the left, but there are inward diagonal collisions to the left', () => {
        const collisionPositions = [
          // Left collisions
          { x: 380, y: 190 },
          { x: 420, y: 230 },
          { x: 460, y: 270 },
        ];
        const tree = new Baobab({
          tile: {
            x: 1,
            y: 1,
            scenery: [],
            food: collisionPositions.map((position, id) => new Carrot(position, id))
          },
          boardDimensions
        });

        ActionsRewire.__Rewire__('tree', tree);
        const character = { x: 450, y: 230, height: 40, width: 40 };
        const exitPosition = { x: 50, y: 200 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        expect(closestGap.x).toEqual(480);
        expect(closestGap.y).toEqual(296);
      });

      /* -----------------------

             G |
         ___|  |
        |      |   E
        | X    |
        |______|
      */
      it('returns correct gap when exit is to the right, but there are collisions to the left, right, bottom, and top has partial collisions', () => {
        const collisionPositions = [
          // Top collisions
          { x: 300, y: 190 },
          { x: 340, y: 190 },
          { x: 340, y: 150 },
          // Left collisions
          { x: 260, y: 190 },
          { x: 260, y: 230 },
          // Right collisions
          { x: 460, y: 70 },
          { x: 460, y: 110 },
          { x: 460, y: 150 },
          { x: 460, y: 190 },
          { x: 460, y: 230 },
          // Bottom collisions
          { x: 460, y: 270 },
          { x: 420, y: 270 },
          { x: 380, y: 270 },
          { x: 340, y: 270 },
          { x: 300, y: 270 },
          { x: 260, y: 270 },
        ];
        const tree = new Baobab({
          tile: {
            x: 1,
            y: 1,
            scenery: [],
            food: collisionPositions.map((position, id) => new Carrot(position, id))
          },
          boardDimensions
        });

        ActionsRewire.__Rewire__('tree', tree);
        const character = { x: 300, y: 230, height: 40, width: 40 };
        const exitPosition = { x: 500, y: 500 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        expect(closestGap.x).toEqual(360);
        expect(closestGap.y).toEqual(110);
      });

      /* -----------------------
             G
            |   |
         __|    | <-- diagonal collisions within offset
         |      |   E
         | X    |
         |______|
      */
      it('returns correct gap when exit is to the right, but there are collisions to the left, right, bottom, and top has partial and diagonal collisions', () => {
        const collisionPositions = [
          // Top collisions
          { x: 300, y: 190 },
          { x: 340, y: 190 },
          { x: 380, y: 150 },
          // Left collisions
          { x: 260, y: 190 },
          { x: 260, y: 230 },
          // Right collisions
          { x: 460, y: 70 },
          { x: 460, y: 110 },
          { x: 460, y: 150 },
          { x: 460, y: 190 },
          { x: 460, y: 230 },
          // Bottom collisions
          { x: 460, y: 270 },
          { x: 420, y: 270 },
          { x: 380, y: 270 },
          { x: 340, y: 270 },
          { x: 300, y: 270 },
          { x: 260, y: 270 },
        ];
        const tree = new Baobab({
          tile: {
            x: 1,
            y: 1,
            scenery: [],
            food: collisionPositions.map((position, id) => new Carrot(position, id))
          },
          boardDimensions
        });

        ActionsRewire.__Rewire__('tree', tree);
        const character = { x: 300, y: 230, height: 40, width: 40 };
        const exitPosition = { x: 500, y: 500 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        expect(closestGap.x).toEqual(400);
        expect(closestGap.y).toEqual(110);
      });

      /* -----------------------
           G     |
          |      |
          | X    |
          |__   _|
          | _____|
                    E
      */
      it('returns correct gap when exit is below and to the right, but there are collisions to the left, right, top, and bottom has partial collisions', () => {
        const collisionPositions = [
          // Left collisions
          { x: 260, y: 190 },
          { x: 260, y: 230 },
          { x: 260, y: 350 },
          // Right collisions
          { x: 460, y: 70 },
          { x: 460, y: 110 },
          { x: 460, y: 150 },
          { x: 460, y: 190 },
          { x: 460, y: 230 },
          { x: 460, y: 350 },
          // Bottom collisions
          { x: 460, y: 270 },
          { x: 420, y: 270 },
          { x: 340, y: 270 },
          { x: 300, y: 270 },
          { x: 260, y: 270 },
          { x: 460, y: 350 },
          { x: 420, y: 350 },
          { x: 340, y: 350 },
          { x: 260, y: 350 },
        ];
        const tree = new Baobab({
          tile: {
            x: 1,
            y: 1,
            scenery: [],
            food: collisionPositions.map((position, id) => new Carrot(position, id))
          },
          boardDimensions
        });

        ActionsRewire.__Rewire__('tree', tree);
        const character = { x: 300, y: 230, height: 40, width: 40 };
        const exitPosition = { x: 500, y: 500 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        // Gaps without any collisions in the path will take precedence over
        // those that have collisions, even if they're closer to the destination
        expect(closestGap.x).toEqual(280);
        expect(closestGap.y).toEqual(150);
      });

      /* -----------------------
          ------|
            X   |
         G------|

                    E
      */
      it('returns correct gap when exit is below and to the right, but there are collisions to the top, bottom and right, where the top and bottom furthest collision is on the same Y axis', () => {
        const collisionPositions = [
          // Top collisions
          { x: 460, y: 190 },
          { x: 420, y: 190 },
          { x: 380, y: 190 },
          { x: 340, y: 190 },
          { x: 300, y: 190 },
          { x: 260, y: 190 },
          // Right collisions
          { x: 460, y: 230 },
          // Bottom collisions
          { x: 460, y: 270 },
          { x: 420, y: 270 },
          { x: 380, y: 270 },
          { x: 340, y: 270 },
          { x: 300, y: 270 },
          { x: 260, y: 270 },
        ];
        const tree = new Baobab({
          tile: {
            x: 1,
            y: 1,
            scenery: [],
            food: collisionPositions.map((position, id) => new Carrot(position, id))
          },
          boardDimensions
        });

        ActionsRewire.__Rewire__('tree', tree);
        const character = { x: 300, y: 230, height: 40, width: 40 };
        const exitPosition = { x: 500, y: 500 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        expect(closestGap.x).toEqual(220);
        expect(closestGap.y).toEqual(296);
      });

      /* -----------------------
           -----|
            X   |
          ------|
         G
                    E
      */
      it('returns correct gap when exit is below and to the right, but there are collisions to the top, bottom and right, where the bottom has the furthest collision', () => {
        const collisionPositions = [
          // Top collisions
          { x: 300, y: 190 },
          { x: 340, y: 190 },
          { x: 380, y: 190 },
          { x: 420, y: 190 },
          { x: 460, y: 190 },
          // Right collisions
          { x: 460, y: 230 },
          // Bottom collisions
          { x: 260, y: 270 },
          { x: 300, y: 270 },
          { x: 340, y: 270 },
          { x: 380, y: 270 },
          { x: 420, y: 270 },
          { x: 460, y: 270 },
        ];
        const tree = new Baobab({
          tile: {
            x: 1,
            y: 1,
            scenery: [],
            food: collisionPositions.map((position, id) => new Carrot(position, id))
          },
          boardDimensions
        });

        ActionsRewire.__Rewire__('tree', tree);
        const character = { x: 300, y: 230, height: 40, width: 40 };
        const exitPosition = { x: 600, y: 600 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        expect(closestGap.x).toEqual(220);
        expect(closestGap.y).toEqual(296);
      });

      /* -----------------------
           -----|         E
          G  X  |
          ------|
      */
      it('returns correct gap when exit is up and to the right, but there are collisions to the top, bottom and right, where the bottom has the furthest collision', () => {
        const collisionPositions = [
          // Top collisions
          { x: 300, y: 190 },
          { x: 340, y: 190 },
          { x: 380, y: 190 },
          { x: 420, y: 190 },
          { x: 460, y: 190 },
          // Right collisions
          { x: 460, y: 230 },
          // Bottom collisions
          { x: 260, y: 270 },
          { x: 300, y: 270 },
          { x: 340, y: 270 },
          { x: 380, y: 270 },
          { x: 420, y: 270 },
          { x: 460, y: 270 },
        ];
        const tree = new Baobab({
          tile: {
            x: 1,
            y: 1,
            scenery: [],
            food: collisionPositions.map((position, id) => new Carrot(position, id))
          },
          boardDimensions
        });

        ActionsRewire.__Rewire__('tree', tree);
        const character = { x: 300, y: 230, height: 40, width: 40 };
        const exitPosition = { x: 600, y: 200 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        expect(closestGap.x).toEqual(260);
        expect(closestGap.y).toEqual(216);
      });

      /* -----------------------
          ------|
            X   |
           -----|
          G

                    E
      */
      it('returns correct gap when exit is below and to the right, but there are collisions to the top, bottom and right, where the top has the furthest collision', () => {
        const collisionPositions = [
          // Top collisions
          { x: 260, y: 190 },
          { x: 300, y: 190 },
          { x: 340, y: 190 },
          { x: 380, y: 190 },
          { x: 420, y: 190 },
          { x: 460, y: 190 },
          // Right collisions
          { x: 460, y: 70 },
          { x: 460, y: 110 },
          { x: 460, y: 150 },
          { x: 460, y: 230 },
          // Bottom collisions
          { x: 300, y: 270 },
          { x: 340, y: 270 },
          { x: 380, y: 270 },
          { x: 420, y: 270 },
          { x: 460, y: 270 },
        ];
        const tree = new Baobab({
          tile: {
            x: 1,
            y: 1,
            scenery: [],
            food: collisionPositions.map((position, id) => new Carrot(position, id))
          },
          boardDimensions
        });

        ActionsRewire.__Rewire__('tree', tree);
        const character = { x: 300, y: 230, height: 40, width: 40 };
        const exitPosition = { x: 600, y: 600 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        expect(closestGap.x).toEqual(260);
        expect(closestGap.y).toEqual(296);
      });

      /* -----------------------
          ------|        E
            X   |
           -----|
         G
      */
      it('returns correct gap when exit is up and to the right, but there are collisions to the top, bottom and right, where the top has the furthest collision', () => {
        const collisionPositions = [
          // Top collisions
          { x: 260, y: 190 },
          { x: 300, y: 190 },
          { x: 340, y: 190 },
          { x: 380, y: 190 },
          { x: 420, y: 190 },
          { x: 460, y: 190 },
          // Right collisions
          { x: 460, y: 70 },
          { x: 460, y: 110 },
          { x: 460, y: 150 },
          { x: 460, y: 230 },
          // Bottom collisions
          { x: 300, y: 270 },
          { x: 340, y: 270 },
          { x: 380, y: 270 },
          { x: 420, y: 270 },
          { x: 460, y: 270 },
        ];
        const tree = new Baobab({
          tile: {
            x: 1,
            y: 1,
            scenery: [],
            food: collisionPositions.map((position, id) => new Carrot(position, id))
          },
          boardDimensions
        });

        ActionsRewire.__Rewire__('tree', tree);
        const character = { x: 300, y: 230, height: 40, width: 40 };
        const exitPosition = { x: 600, y: 200 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        expect(closestGap.x).toEqual(260);
        expect(closestGap.y).toEqual(296);
      });

      /* -----------------------
          -------|
           X     |
          ---   -|
        G

                    E
      */
      it('returns correct gap where exit is below and to the right, but top, ' +
        'right and bottom have collisions, but there is a gap in bottom collisions ' +
        'closer to the exit and big enough for the character to go through 1', () => {
        const collisionPositions = [
          // Top collisions
          { x: 460, y: 190 },
          { x: 420, y: 190 },
          { x: 380, y: 190 },
          { x: 340, y: 190 },
          { x: 300, y: 190 },
          { x: 260, y: 190 },
          // Right collisions
          { x: 460, y: 70 },
          { x: 460, y: 110 },
          { x: 460, y: 150 },
          { x: 460, y: 230 },
          // Bottom collisions
          { x: 460, y: 270 },
          { x: 340, y: 270 },
          { x: 300, y: 270 },
          { x: 260, y: 270 },
        ];
        const tree = new Baobab({
          tile: {
            x: 1,
            y: 1,
            scenery: [],
            food: collisionPositions.map((position, id) => new Carrot(position, id))
          },
          boardDimensions
        });

        ActionsRewire.__Rewire__('tree', tree);
        const character = { x: 300, y: 230, height: 40, width: 40 };
        const exitPosition = { x: 500, y: 500 };
        const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
        expect(closestGap.x).toEqual(220);
        expect(closestGap.y).toEqual(296);
      });
    });

    /* -----------------------
        -------|
         X     |
        ---   -|
            G  |
               |
                 |
               |

                  E
    */
    it('returns correct gap where exit is below and to the right, but top, ' +
      'right and bottom have collisions, but there is a gap in bottom collisions ' +
      'closer to the exit and big enough for the character to go through 2', () => {
      const collisionPositions = [
        // Top collisions
        { x: 460, y: 190 },
        { x: 420, y: 190 },
        { x: 380, y: 190 },
        { x: 340, y: 190 },
        { x: 300, y: 190 },
        { x: 260, y: 190 },
        // Right collisions
        { x: 460, y: 70 },
        { x: 460, y: 110 },
        { x: 460, y: 150 },
        { x: 460, y: 230 },
        { x: 500, y: 310 },
        { x: 460, y: 350 },
        // Bottom collisions
        { x: 460, y: 270 },
        { x: 420, y: 270 },
        { x: 340, y: 270 },
        { x: 300, y: 270 },
        { x: 260, y: 270 },
      ];
      const tree = new Baobab({
        tile: {
          x: 1,
          y: 1,
          scenery: [],
          food: collisionPositions.map((position, id) => new Carrot(position, id))
        },
        boardDimensions
      });

      ActionsRewire.__Rewire__('tree', tree);
      const character = { x: 300, y: 230, height: 40, width: 40 };
      const exitPosition = { x: 650, y: 500 };
      const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
      expect(closestGap.x).toEqual(380);
      expect(closestGap.y).toEqual(296);
    });

    /* -----------------------
        -------|
         X    G|
        ---    |
               |
               |
                 |
               |

                  E
    */
    it('returns correct gap where exit is below and to the right, but top, ' +
      'right and bottom have collisions, but there is a gap in bottom collisions ' +
      'closer to the exit and big enough for the character to go through 3', () => {
      const collisionPositions = [
        // Top collisions
        { x: 460, y: 190 },
        { x: 420, y: 190 },
        { x: 380, y: 190 },
        { x: 340, y: 190 },
        { x: 300, y: 190 },
        { x: 260, y: 190 },
        // Right collisions
        { x: 460, y: 70 },
        { x: 460, y: 110 },
        { x: 460, y: 150 },
        { x: 460, y: 230 },
        { x: 500, y: 310 },
        { x: 460, y: 350 },
        // Bottom collisions
        { x: 460, y: 270 },
        { x: 340, y: 270 },
        { x: 300, y: 270 },
        { x: 260, y: 270 },
      ];
      const tree = new Baobab({
        tile: {
          x: 1,
          y: 1,
          scenery: [],
          food: collisionPositions.map((position, id) => new Carrot(position, id))
        },
        boardDimensions
      });

      ActionsRewire.__Rewire__('tree', tree);
      const character = { x: 300, y: 230, height: 40, width: 40 };
      const exitPosition = { x: 650, y: 500 };
      const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
      expect(closestGap.x).toEqual(420);
      expect(closestGap.y).toEqual(230);
    });

    /* -----------------------
       --------|
       | X     |
       ----   -|
            G  |
               |
                 |
               |

                  E
    */
    it('returns correct gap where exit is below and to the right, but top, ' +
      'left, right and bottom have collisions, but there is a gap in bottom ' +
      'collisions closer to the exit and big enough for the character to go through', () => {
      const collisionPositions = [
        // Top collisions
        { x: 460, y: 190 },
        { x: 420, y: 190 },
        { x: 380, y: 190 },
        { x: 340, y: 190 },
        { x: 300, y: 190 },
        { x: 260, y: 190 },
        // Right collisions
        { x: 460, y: 70 },
        { x: 460, y: 110 },
        { x: 460, y: 150 },
        { x: 460, y: 230 },
        { x: 500, y: 310 },
        { x: 460, y: 350 },
        // Bottom collisions
        { x: 460, y: 270 },
        { x: 420, y: 270 },
        { x: 340, y: 270 },
        { x: 300, y: 270 },
        { x: 260, y: 270 },
        // Left collisions
        { x: 260, y: 230 },
      ];
      const tree = new Baobab({
        tile: {
          x: 1,
          y: 1,
          scenery: [],
          food: collisionPositions.map((position, id) => new Carrot(position, id))
        },
        boardDimensions
      });

      ActionsRewire.__Rewire__('tree', tree);
      const character = { x: 300, y: 230, height: 40, width: 40 };
      const exitPosition = { x: 650, y: 500 };
      const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
      expect(closestGap.x).toEqual(380);
      expect(closestGap.y).toEqual(296);
    });

    /* -----------------------
        -------|
       G  X    |    E
        ---   -|
               |
               |
                 |
               |
    */
    it('returns correct gap where exit is to the right, but top, right and ' +
      'bottom have collisions, but there is a gap in bottom collisions closer to ' +
      'the exit and big enough for the character to go through', () => {
      const collisionPositions = [
        // Top collisions
        { x: 460, y: 190 },
        { x: 420, y: 190 },
        { x: 380, y: 190 },
        { x: 340, y: 190 },
        { x: 300, y: 190 },
        { x: 260, y: 190 },
        // Right collisions
        { x: 460, y: 70 },
        { x: 460, y: 110 },
        { x: 460, y: 150 },
        { x: 460, y: 230 },
        { x: 500, y: 310 },
        { x: 460, y: 350 },
        // Bottom collisions
        { x: 460, y: 270 },
        { x: 420, y: 270 },
        { x: 340, y: 270 },
        { x: 300, y: 270 },
        { x: 260, y: 270 },
      ];
      const tree = new Baobab({
        tile: {
          x: 1,
          y: 1,
          scenery: [],
          food: collisionPositions.map((position, id) => new Carrot(position, id))
        },
        boardDimensions
      });

      ActionsRewire.__Rewire__('tree', tree);
      const character = { x: 300, y: 230, height: 40, width: 40 };
      const exitPosition = { x: 600, y: 230 };
      const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
      expect(closestGap.x).toEqual(380);
      expect(closestGap.y).toEqual(296);
    });

    /* -----------------------
       --------|
       | X     |   E
       ----   -|
            G  |
               |
                 |
               |
    */
    it('returns correct gap where exit is to the right, but top, left, right ' +
      'and bottom have collisions, but there is a gap in bottom collisions closer ' +
      'to the exit and big enough for the character to go through', () => {
      const collisionPositions = [
        // Top collisions
        { x: 460, y: 190 },
        { x: 420, y: 190 },
        { x: 380, y: 190 },
        { x: 340, y: 190 },
        { x: 300, y: 190 },
        { x: 260, y: 190 },
        // Right collisions
        { x: 460, y: 70 },
        { x: 460, y: 110 },
        { x: 460, y: 150 },
        { x: 460, y: 230 },
        { x: 500, y: 310 },
        { x: 460, y: 350 },
        // Bottom collisions
        { x: 460, y: 270 },
        { x: 420, y: 270 },
        { x: 340, y: 270 },
        { x: 300, y: 270 },
        { x: 260, y: 270 },
        // Left collisions
        { x: 260, y: 230 },
      ];
      const tree = new Baobab({
        tile: {
          x: 1,
          y: 1,
          scenery: [],
          food: collisionPositions.map((position, id) => new Carrot(position, id))
        },
        boardDimensions
      });

      ActionsRewire.__Rewire__('tree', tree);
      const character = { x: 300, y: 230, height: 40, width: 40 };
      const exitPosition = { x: 600, y: 230 };
      const closestGap = actions.getClosestOpenGap(character, exitPosition).gap;
      expect(closestGap.x).toEqual(380);
      expect(closestGap.y).toEqual(296);
    });
  });
});