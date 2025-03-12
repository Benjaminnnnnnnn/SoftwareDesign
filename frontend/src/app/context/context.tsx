import { configureStore } from "@reduxjs/toolkit";

type state = {
  current_user: string;
  current_board: string;
  game_state: string;
};
