import item from "../items/item";
import { Stats } from "../types";
import Piece from "./piece";
import { statMasterList } from "./statMasterList";
import * as PIXI from "pixi.js";
import { Assets } from "pixi.js";

// Ensure "export default" is used
export default class DudePiece extends Piece {
  // TODO : Finish Implementation
  constructor(
    allied: boolean,
    stats: Stats | undefined,
    item: item | undefined,
  ) {
    super(allied);
    this.id = "u006";
    const { max_health, ad, range, speed } = stats
      ? stats
      : statMasterList[this.id];
    this.max_health = max_health;
    this.current_health = max_health
    this.ad = ad;
    this.range = range;
    this.speed = speed;
    this.item = item;
  }

  public override async slideTo(
    sprite: PIXI.Sprite, 
    targetX: number, 
    targetY: number, 
    duration: number
  ): Promise<void> {
    return new Promise((resolve) => {
        const startX = sprite.x;
        const startY = sprite.y;
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
            const scaleFactor = 0; // How much it grows (20%)
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
}