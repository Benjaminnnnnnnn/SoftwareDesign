import * as PIXI from "pixi.js";
import { Board, Hex } from "../game/board";
import { createHexagon } from "./Hexagon";
import { createBattleHexagon } from "./BattleHexagon";
import { renderTrash } from "./renderTrash";

export const renderBoard = (board: Board) => {
    const hexRadius = 70;
    const hexHeight = Math.sqrt(3) * hexRadius;
    const hexWidth = 2 * hexRadius;

    // Create containers for hexagons and pieces
    const hexContainer = new PIXI.Container();
    const pieceContainer = new PIXI.Container();
    const uiContainer = new PIXI.Container();

    const axialToPixel = (q: number, r: number) => {
        const x = hexWidth * (q + r / 2);
        const y = hexHeight * r;
        return { x, y };
    };

    // Track animations by movement instance rather than just piece ID
    const movementsToAnimate = new Map<string, {move: any, toTile: Hex}>();

    board.movementHistory.forEach((move, index) => {
        if (!move.piece) return;
        // Use a unique key combining piece ID and movement index
        const movementKey = `${move.piece.id}-${index}`;
        movementsToAnimate.set(movementKey, {
            move,
            toTile: board.tiles.get(move.toId)!
        });
    });

 // Render the board
 board.tiles.forEach((tile: Hex) => {
    const { x, y } = axialToPixel(tile.coord.q, tile.coord.r);
    try {
        // Create hex visuals
        const battleHexagon = createBattleHexagon(x + 400, y + 325, hexRadius, tile, board);
        hexContainer.addChild(battleHexagon);
        
        const hexagon = createHexagon(x + 400, y + 325, hexRadius, tile, board);
        uiContainer.addChild(hexagon);

        // Handle pieces
        if (tile.piece) {
            tile.piece.getSprite().then((sprite: PIXI.Sprite | null) => {
                if (!sprite) {
                    console.error("Failed to create sprite for piece on tile:", tile.id);
                    return;
                }

                sprite.anchor.set(0.5, 0.5);
                sprite.eventMode = 'none';
                sprite.hitArea = null;

                // Check if this tile is the destination for any movement
                for (const [movementKey, {move, toTile}] of movementsToAnimate.entries()) {
                    if (toTile.id === tile.id && move.piece.id === tile.piece?.id) {
                        const fromTile = board.tiles.get(move.fromId);
                        if (fromTile) {
                            const startPos = axialToPixel(fromTile.coord.q, fromTile.coord.r);
                            sprite.position.set(startPos.x + 400, startPos.y + 325);
                            pieceContainer.addChild(sprite);

                            tile.piece?.slideTo(
                                sprite, 
                                x + 400, 
                                y + 325, 
                                300
                            ).then(() => {
                                console.log("Finished animating movement:", movementKey);
                                // Remove this specific movement
                                movementsToAnimate.delete(movementKey);
                                // Remove from board's movement history
                                board.movementHistory = board.movementHistory.filter(
                                    m => !(m.piece?.id === move.piece?.id && 
                                          m.fromId === move.fromId && 
                                          m.toId === move.toId)
                                );
                            }).catch(console.error);
                            
                            return; // Skip static placement
                        }
                    }
                }
                if (tile.piece?.attackHistory?.size != 0) {
                    console.log("ATTACK ANIMATION TRIGGERED")
                    tile.piece?.shake(sprite, 100, x + 400, y + 325)
                }
                if (tile.piece?.damageHistory?.size != 0) {
                    console.log("DAMAGE ANIMATION TRIGGERED")
                    tile.piece?.turnRed(sprite, 100);
                }
                //check if attack animation is needed


                // Static placement if no animation needed
                sprite.position.set(x + 400, y + 325);
                pieceContainer.addChild(sprite);
            }).catch(console.error);
        }
    } catch (error) {
        console.error("Failed to create hexagon:", error);
    }
});

// Add trash bin
const trash = renderTrash(board);
uiContainer.addChild(trash);

return { hexContainer, pieceContainer, uiContainer };
};

export default renderBoard;