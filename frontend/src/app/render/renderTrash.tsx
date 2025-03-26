import * as PIXI from "pixi.js";
import trashImage from '../../../public/render_images/trash.png';
import {Board} from "../game/board";

export const renderTrash = (board: Board): PIXI.Container => {
    const container = new PIXI.Container();
    
    // 1. Add debug graphics (always visible)
    const debug = new PIXI.Graphics()
        .beginFill(0x888888)
        .drawRect(0, 0, 100, 100)
        .endFill();
    container.addChild(debug);

    // 2. Create hover text (larger and better styled)
    const hoverText = new PIXI.Text("Sell?", { // maybe change this to html so the quality is better
        fontFamily: 'Arial',
        fontSize: 24, // Increased from 16
        fill: 0xffffff,
        align: 'center',
        fontWeight: 'bold',
    });
    hoverText.anchor.set(0.5);
    hoverText.position.set(150, 50);
    hoverText.visible = false;

    // 3. Load image
    const img = new Image();
    img.src = trashImage.src;
    
    img.onload = () => {
        console.log("Image loaded - dimensions:", img.width, "x", img.height);
        
        try {
            const texture = PIXI.Texture.from(img);
            const sprite = new PIXI.Sprite(texture);
            
            // 4. Set sprite properties (no initial tint)
            sprite.width = 100;
            sprite.height = 100;
            
            // 5. Position at bottom-left (relative to container)
            sprite.anchor.set(0, 1);
            sprite.position.set(0, 100);
            
            // 6. Add text to container (not sprite) so it stays above
            container.addChild(hoverText);
            
            // 7. Make interactive
            sprite.eventMode = 'static';
            sprite.cursor = 'pointer';
            sprite.on("pointerover", () => {
                sprite.tint = 0xffcc00; // Only tint on hover
                hoverText.visible = true;
            });
            sprite.on("pointerout", () => {
                sprite.tint = 0xffffff; // Reset to normal
                hoverText.visible = false;
            });
            sprite.on("click", () => {
                console.log('Trash clicked');
                board.interactWithTrash();
            });

            // 8. Replace debug with sprite
            container.removeChild(debug);
            container.addChild(sprite);
            
            console.log("Sprite successfully added");
            
        } catch (e) {
            console.error("Error creating sprite:", e);
            debug.tint = 0xFF0000;
        }
    };

    img.onerror = () => {
        console.error("Failed to load trash image!");
        debug.tint = 0xFF0000;
    };

    return container;
};