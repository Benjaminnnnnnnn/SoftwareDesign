import * as PIXI from "pixi.js";
import lilypadImage from '../../../public/render_images/lilypad.png';
import dummyPiece from "../game/pieces/dummyPiece"
import {Board} from "../game/board";


export const createHexagon = (x: number, y: number, radius: number, tile: any, board : Board) => {
  // Creates Hexagons for the board
  const hexagon = new PIXI.Graphics();
  hexagon.lineStyle(2, 0x6d86ad); // Blend in with background
  hexagon.beginFill(0x6d86ad);
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const px = x + radius * Math.cos(angle);
    const py = y + radius * Math.sin(angle);
    if (i === 0) hexagon.moveTo(px, py);
    else hexagon.lineTo(px, py);
  }
  hexagon.closePath();
  hexagon.endFill();
  hexagon.interactive = false;

  // Load the lilypad image and add it as a sprite to the hexagon
  const img = new Image();
  img.src = lilypadImage.src;
  img.onload = () => {
    const texture = PIXI.Texture.from(img);
    const sprite = new PIXI.Sprite(texture);

    sprite.anchor.set(0.5);
    sprite.x = x;
    sprite.y = y;
    sprite.width = radius * 1.8; 
    sprite.height = radius * 1.8;

    // Make the sprite interactive
    sprite.eventMode = 'static';

    // Define the hit area
    const hitBox = new PIXI.Circle(
        0, // x offset
        0, // y offset
        sprite.width / 0.4
      );
    sprite.hitArea = hitBox;

    // Add hover interactivity to the sprite
    sprite.on("pointerover", () => {
      sprite.tint = 0xffcc00; // Tint on hover
    });

    sprite.on("pointerout", () => {
      sprite.tint = 0xffffff; // Reset tint to white
    });

    // Add click interactivity to the sprite
    sprite.on("click", () => {
      console.log(`Lilypad clicked: ${tile.id}`);
      board.interactWithTile(tile.id);
    });

    hexagon.addChild(sprite);
  };

  return hexagon;
};