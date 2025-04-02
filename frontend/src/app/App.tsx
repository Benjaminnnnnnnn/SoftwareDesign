"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./context/context";
import HexGrid from "./render/BoardRenderer";
import Shop from "./render/Shop";
import {
  resetCurrency,
  setCurrentGameStage,
} from "./context/gameSlice";

export default function App() {
  const game = useSelector((state: RootState) => state.game);
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuthenticated = localStorage.getItem("loggedIn");
      if (!isAuthenticated) {
        window.location.href = "/login"; // Hard redirect
        return; // Stop further execution
      }
    }
  }, []);
  // resetting useEffect;
  useEffect(() => {
    if (game.game_state === "CLEANUP") {
      dispatch(resetCurrency(10));
      dispatch(setCurrentGameStage(1));
     // dispatch(setGameState("PLANNING"));
    }
  }, [game.game_state]);

  return (
    <div className="screen-container">
      {game.game_state == "PLANNING" && (
        <div className="shop-container">
          <Shop />
        </div>
      )}
      <div className="board-container">
        <HexGrid />
      </div>
    </div>
  );
}
