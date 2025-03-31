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



export const postFight = ( wins: number, losses: number, recent: string, dispatch: Dispatch): PIXI.Container => {
    const container = new PIXI.Container();
    
    // 1. Create a semi-transparent background overlay
    const overlay = new PIXI.Graphics()
        .beginFill(0x6d86ad, 0.7)
        .drawRect(0, 0, 800, 650)
        .endFill();
    container.addChild(overlay);

    // 2. Create main panel
    const panel = new PIXI.Graphics()
        .beginFill(0xfacacb)
        .lineStyle(4, 0xed6669)
        .drawRoundedRect(200, 150, 400, 350, 15)
        .endFill();
    container.addChild(panel);

    // 3. Add result text
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
    resultText.position.set(400, 200);
    container.addChild(resultText);

    // 4. Add stats display
    const statsText = new PIXI.Text(
        `Wins: ${wins} / 5\nLosses: ${losses} / 3`,
        {
            fontFamily: 'Arial',
            fontSize: 28,
            fill: 0x913335,
            align: 'center',
            lineHeight: 40
        }
    );
    statsText.anchor.set(0.5);
    statsText.position.set(400, 280);
    container.addChild(statsText);

    // 5. Add continue button
    const button = new PIXI.Graphics()
        .beginFill(0xdb7099)
        .drawRoundedRect(300, 350, 200, 60, 10)
        .endFill();
    
    const buttonText = new PIXI.Text(
        (wins < 5 && losses < 3) ? "Continue" : "End Run",
        {
        fontFamily: 'Arial',
        fontSize: 24,
        fill: 0xffffff,
        fontWeight: 'bold'
    });
    buttonText.anchor.set(0.5);
    buttonText.position.set(400, 380);
    
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

    // 3. Load image
    const img = new Image();
    img.src = trophyImage.src;
    
    img.onload = () => {
        console.log("Image loaded - dimensions:", img.width, "x", img.height);
        
        try {
            const texture = PIXI.Texture.from(img);
            const sprite = new PIXI.Sprite(texture);
            
            // 4. Set sprite properties (no initial tint)
            sprite.width = 100;
            sprite.height = 100;
            
            // 5. Position at bottom-left (relative to container)
            sprite.anchor.set(0.5);
            sprite.position.set(540, 425);
            if (wins == 5) container.addChild(sprite);
            
            console.log("Sprite successfully added");
            
        } catch (e) {
            console.error("Error creating sprite:", e);
        }
    };

    img.onerror = () => {
        console.error("Failed to load trash image!");
    };

    return container;
};