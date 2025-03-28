import { Hex } from "../board";
import Piece from "../pieces/piece";
import { TargetInfo } from "../types";

export function findNearestEnemy(start: Hex, allied: boolean) : TargetInfo {
  // This should return the path to the nearest enemy as well as the enemy

  const visited = new Set<string>();
  let lowest = 99999;
  let Obj: TargetInfo = {
    target: undefined,
    path: undefined,
  }

  function dfs(node: Hex, depth: Array<string>) {
    if (visited.has(node.id) || depth.length > lowest) {
      return;
    }
    visited.add(node.id);
    if (node.piece && (node.piece.allied !== allied)) {
      if (depth.length < lowest) {
        lowest = depth.length;
        Obj.target = node;
        Obj.path = depth;
      }
    }
    node.neighbors.forEach((v) => {
      dfs(v, [...depth, node.id]);
    });
  }

  dfs(start, []);
  return Obj;
}
