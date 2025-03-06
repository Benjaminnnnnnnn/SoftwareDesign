import { Board } from "./board";
import { ShopPhase, BattlePhase, NetworkPhase, Phase } from "./loop";

export default class GameHandler {
  currentState: Phase;
  currentBoard: Board;
  lastBoard: Board;
  stateTable: {
    Shop: ShopPhase;
    Battle: BattlePhase;
    Network: NetworkPhase;
  };

  constructor(b: Board) {
    this.stateTable = {
      Shop: new ShopPhase(),
      Battle: new BattlePhase(),
      Network: new NetworkPhase(),
    };
    this.currentState = this.stateTable["Shop"];
    this.lastBoard = b;
    this.currentBoard = b;
  }

  run() {}

  nextPhase() {}
}
