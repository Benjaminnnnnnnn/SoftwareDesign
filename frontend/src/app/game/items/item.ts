import * as PIXI from "pixi.js";
import { images } from "../ImageRef";
import { Assets } from "pixi.js";
import { Iitem } from "../types";

export default abstract class item implements Iitem {
  id: string;
  cost: number;
  max_health_amp: number[];
  ad_amp: number[];
  range_amp: number[];
  speed_amp: number[];
  allied: boolean;

  constructor(_allied: boolean) {
    this.id = "i000";
    this.cost = 1; // same for all items
    this.max_health_amp = [0, 1];
    this.ad_amp = [0, 1];
    this.range_amp = [0, 1];
    this.speed_amp = [0, 1];
    this.allied = _allied;

    // first number represents addition amplification, second number represents multiplication
  }

  public async getSprite(): Promise<PIXI.Sprite | null> {
    if (!images[this.id]) {
      // if no image is associated with id, load default
      try {
        const texture = await Assets.load(images["i000"].src);
        const piece = new PIXI.Sprite(texture);

        // Customize the sprite
        piece.anchor.set(0.5);
        piece.width = 250;
        piece.height = 250;

        return piece;
      } catch (error) {
        console.error("Failed to load texture for piece:", error);
        return null; // Return null if there's an error
      }
    } else {
      // otherwise, load corresponding image
      try {
        const texture = await Assets.load(images[this.id].src);
        const piece = new PIXI.Sprite(texture);

        // Customize the sprite
        piece.anchor.set(0.5);
        piece.width = 250;
        piece.height = 250;
        // TODO : add item as a child to the sprite

        return piece;
      } catch (error) {
        console.error("Failed to load texture for piece:", error);
        return null; // Return null if there's an error
      }
    }
  }
}
