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
  }

  public async getSprite(): Promise<PIXI.Sprite | null> {
    console.log("get sprite is called");
    if (!images[this.id]) {
      console.log("no image for given id"); // if no image is associated with id, load default
      try {
        console.log("load default");
        const texture = await Assets.load(images["u000"].src);
        const piece = new PIXI.Sprite(texture);

        // Customize the sprite
        piece.anchor.set(0.5);
        piece.width = 90;
        piece.height = 90;
        // Add item as a child to piece sprite
        if (!this.item) {
          console.log("no item");
        } else {
          console.log("there is an image");
          const item_sprite = await this.item.getSprite();
          console.log("piece has item");
          if (!item_sprite) {
          } else {
            console.log("item added to piece");
            piece.addChild(item_sprite);
          }
        }
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
        piece.width = 90;
        piece.height = 90;
        // TODO : add item as a child to the sprite
        if (!this.item) {
          console.log("no item");
        } else {
          console.log("there is an image");
          const item_sprite = await this.item.getSprite();
          console.log("piece has item");
          if (!item_sprite) {
          } else {
            console.log("item added to piece");
            piece.addChild(item_sprite);
          }
        }
        return piece;
      } catch (error) {
        console.error("Failed to load texture for piece:", error);
        return null; // Return null if there's an error
      }
    }
  }
}
