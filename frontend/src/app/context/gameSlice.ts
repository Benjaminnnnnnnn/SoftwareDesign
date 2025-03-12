// features/game/gameSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { state } from "../game/types";

const initialState: state = {
  current_user: "",
  current_board: "",
  game_state: "",
  currency: 10,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<string>) => {
      state.current_user = action.payload;
    },
    setCurrentBoard: (state, action: PayloadAction<string>) => {
      state.current_board = action.payload;
    },
    setGameState: (state, action: PayloadAction<string>) => {
      state.game_state = action.payload;
    },
    setCurrency: (state, action: PayloadAction<number>) => {
      state.currency = action.payload;
    },
  },
});

export const { setCurrentUser, setCurrentBoard, setGameState, setCurrency } =
  gameSlice.actions;
export default gameSlice.reducer;
