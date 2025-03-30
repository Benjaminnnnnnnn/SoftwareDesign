import * as PIXI from "pixi.js";
import lilypadImage from '../../../public/render_images/lilypad.png';
import {Board} from "../game/board";

export const createBattleHexagon = (x: number, y: number, radius: number, tile: any, board : Board) => {
  // Creates Hexagons for the board, doesnt have interactibility
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

    hexagon.addChild(sprite);
  };
  return hexagon;
};