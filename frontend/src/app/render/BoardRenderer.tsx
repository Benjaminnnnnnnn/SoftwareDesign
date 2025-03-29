import React, { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import { Board, Hex } from "../game/board"; // Import your Board class
import { renderBoard } from "./handleRender";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../context/context";
import { setCurrentBoardString, setPieceImBuying } from "../context/gameSlice";
import { encodeBoardToString } from "../game/codification";
import BattleHandler from "../game/battle/BattleHandler";
import CursorIndicator from "./cursorIndicator";

const HexGrid = () => {
  const [iPlaced, updateIPlaced] = useState<boolean>(false);

  // dispatch to access game state
  const game = useSelector((state: RootState) => state.game);
  const dispatch = useDispatch();

  const appRef = useRef<PIXI.Application | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const boardRef = useRef<Board | null>(null); // Ref to store the board instance
  const battleHandlerRef = useRef<BattleHandler | null>(null);
  const hexContainerRef = useRef<PIXI.Container | null>(null); // Ref to store the hex container
  const pieceContainerRef = useRef<PIXI.Container | null>(null); // Ref to store the piece container
  const { imHolding } = useSelector((state: RootState) => state.game);
  const cursorIndicatorRef = useRef<CursorIndicator | null>(null);

  // Initialize cursor indicator
  useEffect(() => {
    if (appRef.current) {
      cursorIndicatorRef.current = new CursorIndicator(appRef.current);
    }

    return () => {
      cursorIndicatorRef.current?.destroy();
    };
  }, [appRef.current]);

  // Toggle visibility based on imHolding state
  useEffect(() => {
    if (!cursorIndicatorRef.current) return;

    if (imHolding) {
      cursorIndicatorRef.current.show();
    } else {
      cursorIndicatorRef.current.hide();
    }
  }, [imHolding]);

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
    console.log("render board once called");
    if (appRef.current && !boardRef.current) {
      const board = new Board(3, updateIPlaced, dispatch);
      const battleHandler = new BattleHandler(board);
      const { hexContainer, pieceContainer, uiContainer } = renderBoard(board);
      appRef.current.stage.addChild(hexContainer);
      appRef.current.stage.addChild(pieceContainer);
      appRef.current.stage.addChild(uiContainer);

      // Store references for later use
      boardRef.current = board;
      hexContainerRef.current = hexContainer;
      pieceContainerRef.current = pieceContainer;
      battleHandlerRef.current = battleHandler;

      console.log("Board rendered"); // Debugging log
    }
  };

  const renderGameState = () => {
    if (!appRef.current || !boardRef.current) return;
  
    // Clear the stage first
    appRef.current.stage.removeChildren();
  
    // Always render pieces (needed in both states)
    const { pieceContainer } = renderBoard(boardRef.current);
    appRef.current.stage.addChild(pieceContainer);
    pieceContainerRef.current = pieceContainer;
  
    // Render state-specific containers
    if (game.game_state === "BATTLE") {
      const { hexContainer } = renderBoard(boardRef.current);
      appRef.current.stage.addChild(hexContainer);
      hexContainerRef.current = hexContainer;
      console.log("Rendered BATTLE state");
    } else if (game.game_state === "PLANNING") {
      const { uiContainer } = renderBoard(boardRef.current);
      appRef.current.stage.addChild(uiContainer);
      console.log("Rendered PLANNING state");
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
    if (battleHandlerRef.current && game.game_state === "BATTLE") {
      battleHandlerRef.current.prepare(1);
    }
    if (game.pieceImBuying != "") {
      console.log("Piece being bought:", game.pieceImBuying);

      if (boardRef.current) {
        const targetTileId = "0,0"; // Replace with the actual target tile ID
        boardRef.current.createPiece(game.pieceImBuying, targetTileId, true);
        console.log("Piece creation attempted");
      }

      dispatch(setPieceImBuying("")); // Reset after handling
    }
  }, [game.pieceImBuying, game.game_state]);

  // Handle game state changes
useEffect(() => {
  if (appRef.current && boardRef.current) {
    renderGameState();
    console.log("Game state changed to:", game.game_state);
    
    if (game.game_state === "BATTLE" && battleHandlerRef.current) {
      battleHandlerRef.current.prepare(1);
    }
  }
}, [game.game_state]);

  // Update pieces when `iPlaced` changes
  useEffect(() => {
    if (appRef.current) {
      if (iPlaced && boardRef.current) {
        updatePieces();
        const encodedboard = encodeBoardToString(boardRef.current);
        dispatch(setCurrentBoardString(encodedboard));
      }
      updateIPlaced(false);
    }
  }, [iPlaced]); // Re-run only when `iPlaced` changes

  // Remount board when the game state changes
  useEffect(() => {
    if(appRef.current){
      renderBoardOnce()
      console.log("use effect activated", game.game_state);
    }
  }, [game.game_state])

  return <canvas ref={canvasRef} />;
};

export default HexGrid;
