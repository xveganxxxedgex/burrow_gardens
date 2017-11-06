import Tile1_1 from 'Maps/Tile1_1';
import Tile1_2 from 'Maps/Tile1_2';
import Tile2_1 from 'Maps/Tile2_1';
import Tile2_2 from 'Maps/Tile2_2';

const tiles = {
  Tile1_1: Tile1_1,
  Tile1_2: Tile1_2,
  Tile2_1: Tile2_1,
  Tile2_2: Tile2_2
};

export function getTile(x, y) {
  return tiles[`Tile${x}_${y}`];
}
