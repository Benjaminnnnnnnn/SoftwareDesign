// features/game/gameSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { state } from "../game/types";
import { Hex } from "../game/board";

const initialState: state = {
  loggedin: false,
  current_user: "",
  current_boardstr: "",
  imBuying: false,
  pieceImBuying: "",
  current_game_stage: 0,
  game_state: "PLANNING",
  currency: 10,
  imHolding: false,
  forceRerender: 0,
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
    setPieceImBuying: (state, action: PayloadAction<string>) => {
      state.pieceImBuying = action.payload;
    },
    setImBuying: (state, action: PayloadAction<boolean>) => {
      state.imBuying = action.payload;
    },
    setCurrentGameStage: (state, action: PayloadAction<number>) => {
      state.current_game_stage = action.payload;
    },
    setGameState: (state, action: PayloadAction<string>) => {
      state.game_state = action.payload;
    },
    setCurrency: (state, action: PayloadAction<number>) => {
      state.currency = state.currency + action.payload;
    },
    setImHolding: (state, action: PayloadAction<boolean>) => {
      state.imHolding = action.payload;
    },
    setForceRerender: (state, action: PayloadAction<number>) => {
      state.forceRerender = state.forceRerender + action.payload;
    },
  },
});

export const {
  setLoggedInStatus,
  setCurrentUser,
  setCurrentBoardString,
  setImBuying,
  setPieceImBuying,
  setCurrentGameStage,
  setGameState,
  setCurrency,
  setImHolding,
  setForceRerender,
} = gameSlice.actions;
export default gameSlice.reducer;
