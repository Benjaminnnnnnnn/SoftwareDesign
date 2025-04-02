import * as PIXI from "pixi.js";
import { Assets } from "pixi.js";
import Item from "../items/item";
import { images } from "../ImageRef";
import { IPiece, IAnimatedPiece, IAnimate } from "../types";
import { statMasterList } from "./statMasterList";

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
  public target?: Piece;
  public last_target_id? : string; // to store the hex of the last target
  public path?: Array<string>;
  public tile_id: string | null;
  public attackHistory: Set<string>;
  public damageHistory: Set<string>;
  public deathHistory: Set<string>;
  private animationQueue: Array<() => Promise<void>> = []; // for animations
  public currentSprite: PIXI.Sprite | null = null; // Track the active sprite

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
    this.attackHistory = new Set();
    this.damageHistory = new Set();
    this.deathHistory = new Set();
  }

  public attack() {
    if (this.target && this.tile_id) {
      this.attackHistory.add(this.tile_id);
      this.target.takeDamage(this.ad);
    }
    console.log(this.target);
    // returns damage that will be deault
  }

  public takeDamage(damage: number): void {
    this.current_health -= damage;
    if (this.tile_id) {
      this.damageHistory.add(this.tile_id);
    }
    if (this.current_health <= 0) {
      this.alive = false;
    }
  }

  public die(): void {
    if(this.tile_id){
      this.deathHistory.add(this.tile_id)
    }
  }

  public level(): void {
    console.log("In level");
    if (statMasterList[this.id]?.level) {
      this.max_health += statMasterList[this.id]!.level![0]; // "!" asserts non-null
      this.ad += statMasterList[this.id]!.level![1];
      this.current_health = this.max_health;
    }
  }

  public resetPiece(): void {
    this.current_health = this.max_health;
    this.alive = true;
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
  private hexDiffToRotation(dq: number, dr: number): number {
    const absDq = Math.abs(dq);
    const absDr = Math.abs(dr);
    const step = Math.PI/6;
    
    if (dq > 1 && dr < 1 && absDq < absDr){ return step}
    else if (dq > 1 && dr < 1 && absDq == absDr){ return 2*step}
    else if (dq > 0 && dr < 0 && absDq > absDr) return 2 * step;
    else if (dq > 0 && dr === 0) return 3 * step;
    else if (dq > 0 && dr > 0) return 4 * step;
    else if (dq === 0 && dr > 0) return 5 * step;
    else if (dq < 0 && dr > 0 && absDq < absDr) return 6 * step;
    else if (dq < 0 && dr > 0 && absDq === absDr) return 7 * step;
    else if (dq < 0 && dr > 0 && absDq > absDr) return 8 * step;
    else if (dq < 0 && dr === 0) return 9 * step;
    else if (dq < 0 && dr < 0) return 10 * step;
    else if (dq === 0 && dr < 0) return 11 * step;
    else return 0; // default case (shouldn't occur with valid inputs)
}

  private getDirectionAngle (
    target_tile : string | null | undefined  = this.target?.tile_id,
    current_tile : string | null | undefined = this.tile_id

  ): number { // for potential implementation
    if (target_tile) {this.last_target_id = target_tile}

    const target_qr = this.last_target_id?.split(",");
    const current_qr = current_tile?.split(",");
    if (target_qr && current_qr) {
  
      const tq = Number(target_qr[0])
      const tr = Number(target_qr[1])

      const cq = Number(current_qr[0])
      const cr = Number(current_qr[1])

      const angle = this.hexDiffToRotation(tq-cq,tr-cr)
      console.log("ANGLES",tq-cq,tr-cr)

      return angle;
    }
    return 0;
  }
  // sprite methods


  public async getSprite(): Promise<PIXI.Sprite | null> {
    // Try to load the main sprite texture
    let texture: PIXI.Texture;
    try {
      const imageId = images[this.id] ? this.id : "du000"; // Fallback to default
      texture = await Assets.load(images[imageId].src);
      console.log("piece id",imageId)
    } catch (error) {
      console.error("Failed to load texture for piece:", error);
      return null;
    }

    // Create the main sprite
    const piece = new PIXI.Sprite(texture);
    piece.anchor.set(0.5);
    piece.width = 140;
    piece.height = 140;
    if (this.allied == false){piece.rotation = Math.PI;}
    //if(this.target != undefined){piece.rotation = this.getDirectionAngle();}

    const statsText = new PIXI.Text({
      text: `❤️${this.current_health}/${this.max_health}   ⚔️${this.ad}`,
      style: new PIXI.TextStyle({
        fontFamily: "Arial",
        fontSize: 300, // Slightly larger for better readability
        fontWeight: "bold",
        fill: this.allied ? 0xffffff : 0xff0000, // Green for allied, red for enemy
        align: "center",
        stroke: 0x000000,
        lineHeight: 24,
        wordWrap: false,
        wordWrapWidth: 200,
      }),
    });
  
    // Position the text at the bottom center of the sprite
    statsText.anchor.set(0.5);
    statsText.position.set(
      0, // Center horizontally
      650, // position to bottom
    );
    if(this.allied == false){statsText.rotation = Math.PI;}

    // Add to sprite (make sure this is after other children)
    piece.addChild(statsText);

    // Add item sprite if exists
    if (this.item) {
      try {
        const itemSprite = await this.item.getSprite();
        if (itemSprite) {
          itemSprite.width = 600;
          itemSprite.height = 500;
          piece.addChild(itemSprite);
        }
      } catch (error) {
        console.error("Failed to load item sprite:", error);
      }
    }
    this.currentSprite = piece; // Store reference to the sprite
    return piece;
  }
// SHOULD MOVE THESE INTO AN ANIMATOR CLASS
public async slideTo(
  sprite: PIXI.Sprite, 
  targetX: number, 
  targetY: number, 
  duration: number
): Promise<void> {
  return new Promise((resolve) => {
      const startX = sprite.x;
      const startY = sprite.y;
      sprite.rotation = this.getDirectionAngle();
      const startScale = sprite.scale.x; // Assuming uniform scaling
      const startTime = Date.now();

      const animate = () => {
          const now = Date.now();
          const progress = Math.min((now - startTime) / duration, 1);
          
          // Linear movement
          sprite.x = startX + (targetX - startX) * progress;
          sprite.y = startY + (targetY - startY) * progress;
          
          // Bouncing scale effect (peaks at midpoint)
          const scaleProgress = Math.sin(progress * Math.PI); // 0→1→0
          const scaleFactor = 0.075; // How much it grows (20%)
          sprite.scale.set(
              startScale + scaleFactor * scaleProgress,
              startScale + scaleFactor * scaleProgress
          );
          
          if (progress < 1) {
              requestAnimationFrame(animate);
          } else {
              // Reset to original scale when done
              sprite.scale.set(startScale, startScale);
              resolve();
          }
      };
      animate();
  });
}
  
  public async shake(sprite: PIXI.Sprite, duration: number, anchorX: number, anchorY: number): Promise<void> {
    return new Promise((resolve) => {
      const startX = anchorX
      const startY = anchorY;
      const startTime = Date.now();
      sprite.rotation = this.getDirectionAngle();

      const animate = () => {
        const now = Date.now();
        const progress = (now - startTime) / duration;
        const shake = Math.sin(progress * Math.PI * 20) * 20;

        sprite.y = startY + shake;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          sprite.y = startY;
          resolve();
        }
      };

      animate();
    });
  }

  public async turnRed(sprite: PIXI.Sprite, duration: number): Promise<void> {
    return new Promise((resolve) => {
      // Store original tint
      const originalTint = sprite.tint;

      // Set to red
      sprite.tint = 0xff0000; // Red color
      sprite.rotation = this.getDirectionAngle();

      // Revert after duration
      setTimeout(() => {
        sprite.tint = originalTint;
        resolve();
      }, duration);
    });
  }
  public async showDeath(sprite: PIXI.Sprite, duration: number = 350): Promise<void> {
    return new Promise((resolve) => {
        const startAlpha = sprite.alpha;
        const startScale = sprite.scale.x;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            sprite.tint = 0xff0000;
            // Fade out linearly
            sprite.alpha = startAlpha * (1 - progress);
            
            // Shrink with slight acceleration at the end
            const shrinkProgress = Math.pow(progress, 1.5); // Makes shrink faster at end
            sprite.scale.set(startScale * (1 - shrinkProgress));
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                sprite.visible = false;
                resolve();
            }
        };
        
        animate();
    });
}
}
