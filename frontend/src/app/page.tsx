"use client";

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "./context/context";
import { BrowserRouter } from "react-router-dom";
import App from "./render/App";

export default function Home() {
  console.log("page");
  return (
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
}
