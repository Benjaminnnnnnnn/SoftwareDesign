"use client";

import { useEffect, useRef, useState } from "react";
import HexGrid from "./render/BoardRenderer";
import Shop from "./render/Shop";

export default function Home() {
  return (
    <div className="screen-container">
      <div className="shop-container">
        <Shop />
      </div>
      <div className="board-container">
        <HexGrid />
      </div>
    </div>
  );
}
