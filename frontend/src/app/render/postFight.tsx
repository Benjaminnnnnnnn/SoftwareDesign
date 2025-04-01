import * as PIXI from "pixi.js";
import trophyImage from '../../../public/render_images/trophy.png';
import {Board} from "../game/board";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../context/context";
import { 
    setGameState,
    resetAll
 } from "../context/gameSlice";
import { Dispatch } from "redux";



export const postFight = (wins: number, losses: number, recent: string, dispatch: Dispatch): PIXI.Container => {
    const container = new PIXI.Container();
    
    // 1. Create a semi-transparent background overlay (now 1000x800)
    const overlay = new PIXI.Graphics()
        .beginFill(0x6d86ad, 0.7)
        .drawRect(0, 0, 1000, 800)
        .endFill();
    container.addChild(overlay);

    // 2. Create main panel (centered, scaled up)
    const panel = new PIXI.Graphics()
        .beginFill(0xfacacb)
        .lineStyle(4, 0xed6669)
        .drawRoundedRect(250, 185, 500, 430, 20) // Adjusted position and size
        .endFill();
    container.addChild(panel);

    // 3. Add result text (centered)
    const resultText = new PIXI.Text(
        recent == "W" ? "VICTORY!" : "DEFEAT",
        {
            fontFamily: 'Impact, Charcoal, sans-serif',
            fontSize: 48,
            fill: recent == "W" ? 0x2ecc71 : 0xe74c3c,
            align: 'center',
            fontWeight: 'bold',
            stroke: 0x000000,
        }
    );
    resultText.anchor.set(0.5);
    resultText.position.set(500, 250); // Adjusted position
    container.addChild(resultText);

    // 4. Add stats display
    const statsText = new PIXI.Text(
        `Wins: ${wins} / 5\nLosses: ${losses} / 3`,
        {
            fontFamily: 'Comic Sans MS',
            fontSize: 28,
            fill: 0x913335,
            align: 'center',
            lineHeight: 40
        }
    );
    statsText.anchor.set(0.5);
    statsText.position.set(500, 350); // Adjusted position
    container.addChild(statsText);

    // 5. Add continue button
    const button = new PIXI.Graphics()
        .beginFill(0xdb7099)
        .drawRoundedRect(375, 430, 250, 75, 15) // Adjusted position and size
        .endFill();
    
    const buttonText = new PIXI.Text(
        (wins < 5 && losses < 3) ? "Continue" : "End Run",
        {
            fontFamily: 'Comic Sans MS',
            fontSize: 24,
            fill: 0xffffff,
            fontWeight: 'bold'
        });
    buttonText.anchor.set(0.5);
    buttonText.position.set(500, 470); // Adjusted position
    
    // Make button interactive
    button.eventMode = 'static';
    button.cursor = 'pointer';
    
    // Button hover effects
    button.on('pointerover', () => {
        button.tint = 0x86d3a0;
    });
    button.on('pointerout', () => {
        button.tint = 0xFFFFFF;
    });
    button.on('click', () => {
        if(wins < 5 && losses < 3){
            dispatch(setGameState("PLANNING"));
        }
        else{
            // reset everything
            dispatch(resetAll(true));
            dispatch(setGameState("PLANNING"));
        }
    });

    container.addChild(button);
    container.addChild(buttonText);

    // 6. Load trophy image
    const img = new Image();
    img.src = trophyImage.src;
    
    img.onload = () => {
        console.log("Image loaded - dimensions:", img.width, "x", img.height);
        
        try {
            const texture = PIXI.Texture.from(img);
            const sprite = new PIXI.Sprite(texture);
            
            // Set sprite properties
            sprite.width = 120; // Slightly larger
            sprite.height = 120;
            
            // Position at bottom-right (adjusted)
            sprite.anchor.set(0.5);
            sprite.position.set(675, 450); // Adjusted position
            if (wins == 5) container.addChild(sprite);
            
            console.log("Sprite successfully added");
            
        } catch (e) {
            console.error("Error creating sprite:", e);
        }
    };

    img.onerror = () => {
        console.error("Failed to load trophy image!");
    };

    return container;
};