// features/game/gameSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { state } from "../game/types";
import { Board } from "../game/board";

const initialState: state = {
  loggedin: false,
  current_user: "",
  current_boardstr: "",
  //current_board_obj: new Board(3),
  current_game_stage: 0,
  game_state: "PLANNING",
  currency: 10,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setLoggedInStatus: (state, action: PayloadAction<boolean>) => {
      state.loggedin = action.payload;
    },
    setCurrentUser: (state, action: PayloadAction<string>) => {
      state.current_user = action.payload;
    },
    setCurrentBoardString: (state, action: PayloadAction<string>) => {
      state.current_boardstr = action.payload;
    },
    // setCurrentBoardObject: (state, action: PayloadAction<Board>) => {
    //   state.current_board_obj = action.payload;
    // },
    setCurrentGameStage: (state, action: PayloadAction<number>) => {
      state.current_game_stage = action.payload;
    },
    setGameState: (state, action: PayloadAction<string>) => {
      state.game_state = action.payload;
    },
    setCurrency: (state, action: PayloadAction<number>) => {
      state.currency = action.payload;
    },
  },
});

export const {
  setLoggedInStatus,
  setCurrentUser,
  setCurrentBoardString,
  //setCurrentBoardObject,
  setCurrentGameStage,
  setGameState,
  setCurrency,
} = gameSlice.actions;
export default gameSlice.reducer;
