export type HexCoordinate = { q: number; r: number };
export enum States {
  Shop,
  Battle,
  Network,
}
export type state = {
  current_user: string;
  current_board: string;
  game_state: string;
  currency: number;
};
