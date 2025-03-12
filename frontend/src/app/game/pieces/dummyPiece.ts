import Piece from "./piece";
import dummyImage from '../../../../public/gameObjectImages/dummyt.png';
import * as PIXI from "pixi.js";
import { Assets } from "pixi.js";

// Ensure "export default" is used
export default class DummyPiece extends Piece {
  constructor(allied: boolean) {
    super(allied); // Call the parent constructor
    this.id = "dummy"; // Set a unique ID for the dummy piece
  }

  public attack(): number {
    return this.ad; // Example: Return the attack damage
  }

  public takeDamage(): void {
    this.current_health -= 1; // Example: Reduce health by 1
  }

  public applyItemModifier(): number {
    return 0; // Example: No item modifier
  }

  // Asynchronous method to get the sprite
  public async getSprite(): Promise<PIXI.Sprite | null> {
    try {
      const texture = await Assets.load(dummyImage.src);
      const piece = new PIXI.Sprite(texture);

      // Customize the sprite
      piece.anchor.set(0.5);
      piece.width = 75;
      piece.height = 75; 

      return piece;
    } catch (error) {
      console.error("Failed to load texture for dummy piece:", error);
      return null; // Return null if there's an error
    }
  }
}