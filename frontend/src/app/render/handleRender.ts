import * as PIXI from "pixi.js";
import { Board, Hex } from "../game/board"; // Import your Board class
import { createHexagon } from "./Hexagon";
import { renderTrash } from "./renderTrash";

export const renderBoard = (board: Board): { hexContainer: PIXI.Container, pieceContainer: PIXI.Container, uiContainer: PIXI.Container } => {
  const hexRadius = 70;
  const hexHeight = Math.sqrt(3) * hexRadius;
  const hexWidth = 2 * hexRadius;

  // Create containers for hexagons and pieces
  const hexContainer = new PIXI.Container();
  const pieceContainer = new PIXI.Container();
  const uiContainer = new PIXI.Container();

  const axialToPixel = (q: number, r: number) => {
    const x = hexWidth * (q + r / 2);
    const y = hexHeight * r;
    return { x, y };
  };

  // Render the board
  board.tiles.forEach((tile: Hex) => {
    const { x, y } = axialToPixel(tile.coord.q, tile.coord.r);
    try {
      const hexagon = createHexagon(x + 400, y + 325, hexRadius, tile, board);
      hexContainer.addChild(hexagon); // Add hexagon to the hex container

      // If the tile has a piece, render the piece and add it to the piece container
      if (tile.piece) {
        console.log("tile has a piece")
        tile.piece.getSprite().then((sprite: PIXI.Sprite | null) => {
          if (sprite) {
            sprite.anchor.set(0.5, 0.5);
            sprite.x = x + 400;
            sprite.y = y + 325;
            sprite.eventMode = 'none';  // <-- This makes it ignore all interactions
            sprite.hitArea = null;      // <-- This removes any automatic hit area
            pieceContainer.addChild(sprite); // Add piece to the piece container
          } else {
            console.error("Failed to create sprite for piece on tile:", tile.id);
          }
        }).catch((error) => {
          console.error("Error while rendering piece on tile:", error);
        });
      }
    } catch (error) {
      console.error("Failed to create hexagon:", error);
    }
  });
  const trash = renderTrash(board);
  uiContainer.addChild(trash);

  // Return both containers
  return { hexContainer, pieceContainer, uiContainer };
};

export default renderBoard;