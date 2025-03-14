import React, { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import { Board, Hex } from "../game/board"; // Import your Board class
import { renderBoard } from "./handleRender";

const HexGrid = () => {
  const appRef = useRef<PIXI.Application | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const initializePixiApp = () => {
    if (!canvasRef.current) {
      console.error("Canvas element not found");
      return;
    }
    appRef.current = new PIXI.Application();
    appRef.current.init({
      width: 800,
      height: 650,
      backgroundColor: 0x6d86ad,
      view: canvasRef.current,
    });
  };

  

  useEffect(() => {
    initializePixiApp();
    const board = new Board(3);
    if (appRef.current) {
      const { hexContainer: _board, pieceContainer: _pieces } = renderBoard(board);
      appRef.current.stage.addChild(_board);
      appRef.current.stage.addChild(_pieces);

    }

    return () => {
      if (appRef.current) {
        appRef.current.destroy(true);
      }
    };
  }, []);

  return <canvas ref={canvasRef} />;
};

export default HexGrid;