import { Board } from "./board";

export type HexCoordinate = { q: number; r: number };

export enum States {
  Shop,
  Battle,
  Network,
}
export type state = {
  loggedin: boolean;
  current_user: string;
  current_boardstr: string;
  //current_board_obj: Board;
  current_game_stage: number;
  game_state: string;
  currency: number;
};
