import React, { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { Board, Hex } from "../game/board"; // Import your Board class
import lilypadImage from '../../../public/render_images/lilypad.png';
import dummyPiece from "../game/pieces/dummyPiece"
import dummyItem from "../game/items/dummyItem"

const HexGrid = () => {
  const appRef = useRef<PIXI.Application | null>(null); // Explicitly type appRef
  const canvasRef = useRef<HTMLCanvasElement | null>(null); // Explicitly type canvasRef

  useEffect(() => {

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

    const board = new Board(3);
    const hexRadius = 70;
    const hexHeight = Math.sqrt(3) * hexRadius;
    const hexWidth = 2 * hexRadius;

    const axialToPixel = (q: number, r: number) => {
      const x = hexWidth * (q + r / 2);
      const y = hexHeight * r;
      return { x, y };
    };

    const createHexagon = (x: number, y: number, radius: number, tile: any) => {
      const hexagon = new PIXI.Graphics();
      hexagon.lineStyle(2, 0x6d86ad); // Blend in with background
      hexagon.beginFill(0x6d86ad); 
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI/6;
        const px = x + radius * Math.cos(angle);
        const py = y + radius * Math.sin(angle);
        if (i === 0) hexagon.moveTo(px, py);
        else hexagon.lineTo(px, py);
      }
      hexagon.closePath();
      hexagon.endFill();

      // Add interactivity
      hexagon.interactive = true;
      hexagon.on("click", () => {
        console.log(`Hexagon clicked: ${tile.id}`);
        hexagon.tint = 0xff0000; // Change color on click
      });

      // Load the lilypad image and add it as a sprite to the hexagon
      const img = new Image();
      img.src = lilypadImage.src;
      img.onload = () => { // don't render until image is loaded
        const texture = PIXI.Texture.from(img);
        const sprite = new PIXI.Sprite(texture);

        sprite.anchor.set(0.5);
        sprite.x = x;
        sprite.y = y;
        sprite.width = radius * 1.8;
        sprite.height = radius * 1.8;

        hexagon.addChild(sprite);
      };
      return hexagon;
    };

    // Render the board
    board.tiles.forEach((tile: Hex) => {
      const { x, y } = axialToPixel(tile.coord.q, tile.coord.r);
      const hexagon = createHexagon(x + 400, y + 325, hexRadius, tile); // Center the grid

      // Render each hexagon
      if (appRef.current) {
        appRef.current.stage.addChild(hexagon);
      }

      // If the hexagon/tile has a piece, render the piece on the hexagon
      if (tile.piece) {
        tile.piece.getSprite().then((sprite: PIXI.Sprite | null) => {
          if (sprite) {
            sprite.x = x + 400; 
            sprite.y = y + 325;
            if (appRef.current) {
              appRef.current.stage.addChild(sprite);
            }
          } else {
            console.error("Failed to create sprite for piece on tile:", tile.id);
          }
        }).catch((error) => {
          console.error("Error while rendering piece on tile:", error);
        });
      }
    });

    // Cleanup on component unmount
    return () => {
      if (appRef.current) {
        appRef.current.destroy(true);
      }
    };
  }, []);

  return <canvas ref={canvasRef} />;
};

export default HexGrid;