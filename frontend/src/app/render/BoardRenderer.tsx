import React, { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import { Board, Hex } from "../game/board"; // Import your Board class
import { renderBoard } from "./handleRender";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../context/context";
import { setPieceImBuying } from "../context/gameSlice";

const HexGrid = () => {
  const [imHolding, updateImHolding] = useState<boolean>(false);
  const [iPlaced, updateIPlaced] = useState<boolean>(false);
  // const [pieceImBuying, updatePieceImBuying] = useState<string | null>(null);
    const game = useSelector((state: RootState) => state.game);
    const dispatch = useDispatch();

  const appRef = useRef<PIXI.Application | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const boardRef = useRef<Board | null>(null); // Ref to store the board instance
  const hexContainerRef = useRef<PIXI.Container | null>(null); // Ref to store the hex container
  const pieceContainerRef = useRef<PIXI.Container | null>(null); // Ref to store the piece container

  // Initialize Pixi.js app
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

  // Render the board (hexes and pieces)
  const renderBoardOnce = () => {
    if (appRef.current && !boardRef.current) {
      const board = new Board(3, updateImHolding, updateIPlaced, imHolding);
      const { hexContainer, pieceContainer } = renderBoard(board);
      appRef.current.stage.addChild(hexContainer);
      appRef.current.stage.addChild(pieceContainer);

      // Store references for later use
      boardRef.current = board;
      hexContainerRef.current = hexContainer;
      pieceContainerRef.current = pieceContainer;

      console.log("Board rendered"); // Debugging log
    }
  };

  // Re-render only the pieces
  const updatePieces = () => {
    if (appRef.current && boardRef.current && pieceContainerRef.current) {
      console.log("Updating pieces..."); // Debugging log
      pieceContainerRef.current.removeChildren();

      const { pieceContainer } = renderBoard(boardRef.current);
      appRef.current.stage.addChild(pieceContainer);
      pieceContainerRef.current = pieceContainer;

      console.log("Pieces re-rendered"); // Debugging log
    }
  };

  // Initialize Pixi.js app and render the board once on mount
  useEffect(() => {
    initializePixiApp();
    renderBoardOnce();

    return () => {
      if (appRef.current) {
        appRef.current.destroy(true); // Clean up Pixi.js app on unmount
        appRef.current = null;
        boardRef.current = null;
        hexContainerRef.current = null;
        pieceContainerRef.current = null;
      }
    };
  }, []); // Empty dependency array: runs only once on mount

  // Handle changes to `pieceImBuying`
  useEffect(() => {
    console.log("pieceImBuying updated:", game.pieceImBuying); // Debugging log
    if (game.pieceImBuying != "") {
      console.log("Piece being bought:", game.pieceImBuying);

      if (boardRef.current) {
        const targetTileId = "0,0"; // Replace with the actual target tile ID
        boardRef.current.createPiece(game.pieceImBuying, targetTileId, true);
        console.log("Piece creation attempted");
      }

      dispatch(setPieceImBuying("")); // Reset after handling
    }
  }, [game.pieceImBuying]);

  // Update pieces when `iPlaced` changes
  useEffect(() => {
    if (appRef.current) {
      if (iPlaced) {
        updatePieces();
      }
      updateIPlaced(false);
    }
  }, [iPlaced]); // Re-run only when `iPlaced` changes

  return <canvas ref={canvasRef} />;
};

export default HexGrid;