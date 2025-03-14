"use client";

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "./context/context";
import App from "./App";
import { useState } from "react";

export default function Home() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}
