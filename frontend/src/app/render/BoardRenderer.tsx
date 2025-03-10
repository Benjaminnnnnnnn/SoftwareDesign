import React, { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { Board, Hex } from "../game/board"; // Import your Board class

const HexGrid = () => {
  const appRef = useRef<PIXI.Application | null>(null); // Explicitly type appRef
  const canvasRef = useRef<HTMLCanvasElement | null>(null); // Explicitly type canvasRef

  useEffect(() => {
    console.log("UseEffect");

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
      hexagon.lineStyle(2, 0x000000); // Border color
      hexagon.beginFill(0x7db07b); // Fill color
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
      
      return hexagon;
    };

    // Render the board
    board.tiles.forEach((tile: Hex) => {
      const { x, y } = axialToPixel(tile.coord.q, tile.coord.r);
      const hexagon = createHexagon(x + 400, y + 325, hexRadius, tile); // Center the grid
      if (appRef.current) {
        appRef.current.stage.addChild(hexagon);
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
