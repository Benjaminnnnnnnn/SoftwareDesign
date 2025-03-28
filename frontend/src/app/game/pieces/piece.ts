import * as PIXI from "pixi.js";
import { Assets } from "pixi.js";
import Item from "../items/item";
import { images } from "../ImageRef";
import { IPiece } from "../types";
import { Hex } from "../board";

export default abstract class Piece implements IPiece {
  public id: string;
  public cost: number;
  public max_health: number;
  public current_health: number;
  public ad: number;
  public range: number;
  public speed: number;
  public item?: Item; // Optional property declaration
  public allied: boolean;
  public alive: boolean;
  public target?: Hex;
  public path?: Array<string>;
  public tile_id: string | null;

  constructor(_allied: boolean) {
    this.id = "u000"; // modify
    this.cost = 3;
    this.max_health = 1; // modify
    this.current_health = this.max_health;
    this.ad = 1; // modify
    this.range = 1; // modify
    this.speed = 1; // modify
    this.item = undefined; // Initialization (no ?)
    this.allied = _allied;
    this.alive = true;
    this.tile_id = null;
  }

  public attack(): number {
    return this.ad;
    // returns damage that will be deault
  }

  public takeDamage(damage: number): void {
    this.current_health -= damage;
    if (this.current_health < 0) {
      this.alive = false;
    }
  }

  public resetPiece(): void {
    this.current_health = this.max_health;
  }

  public giveItem(_item: Item): void {
    if (!this.item) {
      // if there is no item
      this.item = _item; // give it the specified item
      this.applyItemModifier(); // apply item modifier of given item
    } else {
      this.removeItemModifier();
      this.item = _item;
      this.applyItemModifier();
    }
  }

  private applyItemModifier(): void {
    // apply item amplifications
    if (!this.item) {
    } else {
      this.max_health += this.item.max_health_amp[0];
      this.max_health *= this.item.max_health_amp[1];
      this.ad += this.item.ad_amp[0];
      this.ad *= this.item.ad_amp[1];
      this.range += this.item.range_amp[0];
      this.range *= this.item.range_amp[1];
      this.speed += this.item.speed_amp[0];
      this.speed *= this.item.speed_amp[1];
    }
    this.current_health = this.max_health;
  }

  private removeItemModifier(): void {
    // undo item amplifications
    if (!this.item) {
    } else {
      this.max_health /= this.item.max_health_amp[1];
      this.max_health -= this.item.max_health_amp[0];
      this.ad /= this.item.ad_amp[1];
      this.ad -= this.item.ad_amp[0];
      this.range /= this.item.range_amp[1];
      this.range -= this.item.range_amp[0];
      this.speed /= this.item.speed_amp[1];
      this.speed -= this.item.speed_amp[0];
    }
    this.current_health = this.max_health;
  }

  public async getSprite(): Promise<PIXI.Sprite | null> {
    console.log("get sprite is called");
    
    // Try to load the main sprite texture
    let texture: PIXI.Texture;
    try {
      const imageId = images[this.id] ? this.id : "u000"; // Fallback to default
      texture = await Assets.load(images[imageId].src);
    } catch (error) {
      console.error("Failed to load texture for piece:", error);
      return null;
    }
  
    // Create the main sprite
    const piece = new PIXI.Sprite(texture);
    piece.anchor.set(0.5);
    piece.width = 90;
    piece.height = 90;
  
    const statsText = new PIXI.Text({
      text: `❤️${this.current_health}/${this.max_health}   ⚔️${this.ad}`,
      style: new PIXI.TextStyle({
          fontFamily: 'Arial',
          fontSize: 75,  // Slightly larger for better readability
          fontWeight: 'bold',
          fill: this.allied ? 0xffffff : 0xff0000,  // Green for allied, red for enemy
          align: 'center',
          stroke: 0x000000,
          lineHeight: 24,
          wordWrap: false,
          wordWrapWidth: 200
      })
  });
  
  // Position the text at the bottom center of the sprite
  statsText.anchor.set(0.5);
  statsText.position.set(
      0,  // Center horizontally
      250  // position to bottom
  );
  
  // Add to sprite (make sure this is after other children)
  piece.addChild(statsText);
  
    // Add item sprite if exists
    if (this.item) {
      try {
        const itemSprite = await this.item.getSprite();
        if (itemSprite) {
          piece.addChild(itemSprite);
        }
      } catch (error) {
        console.error("Failed to load item sprite:", error);
      }
    }
  
    return piece;
  }
}
