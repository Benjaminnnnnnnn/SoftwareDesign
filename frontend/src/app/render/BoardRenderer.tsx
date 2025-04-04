import React, { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import { Board, Hex } from "../game/board"; // Import your Board class
import { renderBoard } from "./handleRender";
import { postFight } from "./postFight";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../context/context";
import { setCurrentBoardString, setPieceImBuying } from "../context/gameSlice";
import { encodeBoardToString } from "../game/codification";
import BattleHandler from "../game/battle/BattleHandler";
import CursorIndicator from "./cursorIndicator";
import { decodeStringToBoard } from "../game/codification";
import { pieceAsObj, Stats } from "../game/types";

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
  const cursorContainerRef = useRef<PIXI.Container | null>(null);
  const postFightContainer = useRef<PIXI.Container | null>(null);

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
      width: 1000,
      height: 800,
      backgroundColor: 0x6d86ad,
      view: canvasRef.current,
    });
  };

  // Render the board (hexes and pieces)
  const renderBoardOnce = () => {
    console.log("render board once called");
    if (appRef.current && !boardRef.current) {
      const board = new Board(3, updateIPlaced, dispatch);
      const battleHandler = new BattleHandler(board, dispatch);
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

    // Store cursor position before clearing
    const cursorPos = cursorIndicatorRef.current?.indicator.position.clone();

    // Clear stage
    appRef.current.stage.removeChildren();

    // Render game elements
    const { pieceContainer } = renderBoard(boardRef.current);
    appRef.current.stage.addChild(pieceContainer);
    pieceContainerRef.current = pieceContainer;

    if (game.game_state === "BATTLE") {
        const { hexContainer } = renderBoard(boardRef.current);
        appRef.current.stage.addChild(hexContainer);
        hexContainerRef.current = hexContainer;
    } else if (game.game_state === "PLANNING") {
        const { uiContainer } = renderBoard(boardRef.current);
        appRef.current.stage.addChild(uiContainer);
    } else if (game.game_state === "CLEANUP") {
        const postFightContainer  = postFight(game.wins, game.losses, game.recentResult, dispatch);
        appRef.current.stage.addChild((postFightContainer));
    }

    // Re-add and reposition cursor
    if (cursorIndicatorRef.current) {
        appRef.current.stage.addChild(cursorIndicatorRef.current.indicator);
        if (cursorPos) {
            cursorIndicatorRef.current.indicator.position.copyFrom(cursorPos);
        }
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
      console.log("Current pieces increased");

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
        battleHandlerRef.current.prepare(game.current_game_stage);
        setTimeout(() => {
          if (battleHandlerRef.current) {
            battleHandlerRef.current.run_combat_loop();
          }
        }, 500);
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

  // Fill the board with the last board you had
  useEffect(() => {
    if (game.game_state == "PLANNING") {
      const friendlyBoardAsObjects = decodeStringToBoard(
        game.pre_combat_string,
        true,
      );
      // Destructure each obj into it's attributes, then pass those attributes to the createPiece function which uses teh factory
      console.log("FRIENDLY BOARD", friendlyBoardAsObjects);
      friendlyBoardAsObjects.forEach((obj: pieceAsObj) => {
        console.log("OBJECT HAPPENING", obj);
        const stats: Stats = {
          max_health: obj.max_health,
          ad: obj.ad,
          speed: obj.speed,
          range: obj.range,
        };
        boardRef.current?.createPiece(
          obj.id,
          String(obj.q) + "," + String(obj.r),
          true,
          stats,
          obj.item,
          true,
        );
      });
    }
    updatePieces();
  }, [game.game_state]);
  // For rerender;
  useEffect(() => {
    if (appRef.current) {
      updatePieces();
    }
  }, [game.forceRerender]);
  // Remount board when the game state changes
  useEffect(() => {
    if (appRef.current) {
      renderBoardOnce();
      console.log("use effect activated", game.game_state);
    }
  }, [game.game_state]);

  return <canvas ref={canvasRef} />;
};
 
export default HexGrid;
