"use client";

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./context/context";
import { store } from "./context/context";
import HexGrid from "./render/BoardRenderer";
import Shop from "./render/Shop";
import { useState } from "react";

export default function App() {
  const game = useSelector((state: RootState) => state.game);
  const dispatch = useDispatch();
  // Pulls all relevent data from the data base about a user's current game state.
  function setup() {}

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
