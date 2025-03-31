// features/game/gameSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { state } from "../game/types";
import { Hex } from "../game/board";

const initialState: state = {
  loggedin: false,
  current_user: "",
  current_boardstr: "",
  pre_combat_string: "",
  imBuying: false,
  pieceImBuying: "",
  current_game_stage: 1,
  game_state: "PLANNING",
  currency: 10,
  imHolding: false,
  wins: 0,
  losses: 0,
  forceRerender: 0,
  currentPieces: 0,
  recentResult: "",
  currentTrophies: 0,
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
    setPreCombatString: (state, action: PayloadAction<string>) => {
      state.pre_combat_string = action.payload;
    },
    setPieceImBuying: (state, action: PayloadAction<string>) => {
      state.pieceImBuying = action.payload;
    },
    setImBuying: (state, action: PayloadAction<boolean>) => {
      state.imBuying = action.payload;
    },
    setCurrentGameStage: (state, action: PayloadAction<number>) => {
      state.current_game_stage = state.current_game_stage + action.payload;
    },
    setGameState: (state, action: PayloadAction<string>) => {
      state.game_state = action.payload;
    },
    setCurrency: (state, action: PayloadAction<number>) => {
      state.currency = state.currency + action.payload;
    },
    resetCurrency: (state, action: PayloadAction<number>) => {
      state.currency = action.payload;
    },
    setImHolding: (state, action: PayloadAction<boolean>) => {
      state.imHolding = action.payload;
    },
    setForceRerender: (state, action: PayloadAction<number>) => {
      state.forceRerender = state.forceRerender + action.payload;
    },
    setCurrentWins: (state, action: PayloadAction<number>) => {
      state.wins = state.wins + action.payload;
      state.recentResult = "W";
    },
    setCurrentLosses: (state, action: PayloadAction<number>) => {
      state.losses = state.losses + action.payload;
      state.recentResult = "L";
    },
    setCurrentPieces: (state, action: PayloadAction<number>) => {
      state.currentPieces = state.currentPieces + action.payload;
    },
    setRecentResult: (state, action: PayloadAction<string>) => {
      state.recentResult = action.payload;
    },
    resetAll: (state, action: PayloadAction<boolean>) => {
      state.wins = 0;
      state.losses = 0;
      state.current_game_stage = 1;
      state.current_boardstr = "";
      state.pre_combat_string = "";
      if (state.recentResult = "W"){
        state.currentTrophies = state.currentTrophies + 1
      }
    }
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
  setCurrentLosses,
  setCurrentWins,
  resetCurrency,
  setPreCombatString,
  setCurrentPieces,
  resetAll
} = gameSlice.actions;
export default gameSlice.reducer;
