import { Hex } from "../board";
import Piece from "../pieces/piece";

export function findNearestEnemy(start: Hex) {
  // This should return the path to the nearest enemy as well as the enemy

  const visited = new Set<string>();
  let lowest = 99999;
  let target;

  function dfs(node: Hex, depth = 0) {
    if (visited.has(node.id) || depth > lowest) {
      return;
    }
    visited.add(node.id);
    if (node.piece && !node.piece.allied) {
      if (depth < lowest) {
        lowest = depth;
        target = node;
      }
    }
    node.neighbors.forEach((v) => {
      dfs(v, depth + 1);
    });
  }

  dfs(start);
  return target;
}
