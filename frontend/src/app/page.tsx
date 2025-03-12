"use client";

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "./context/context";
import HexGrid from "./render/BoardRenderer";
import Shop from "./render/Shop";

export default function Home() {
  return (
    <Provider store={store}>
      <div className="screen-container">
        <div className="shop-container">
          <Shop />
        </div>
        <div className="board-container">
          <HexGrid />
        </div>
      </div>
    </Provider>
  );
}
