import React from "react";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../context/context";
import {
  setCurrentUser,
  setGameState,
  setCurrency,
  setCurrentBoardString,
  setImBuying,
  setPieceImBuying,
  setPreCombatString,
} from "../context/gameSlice";
import { statMasterList } from "../game/pieces/statMasterList";
import { attributeMasterList } from "../game/items/attributeMasterList";

// Image imports
import soldImage from "../../../public/gameObjectImages/sold.png";
import dummyImage from "../../../public/gameObjectImages/dummy.png";
import warriorImage from "../../../public/gameObjectImages/warrior.png";
import archerImage from "../../../public/gameObjectImages/archer.png";
import butterflyImage from "../../../public/gameObjectImages/butterfly.png";
import caterpillarImage from "../../../public/gameObjectImages/caterpillar.png";
import gunImage from "../../../public/gameObjectImages/gun.png";
import { StaticImageData } from "next/image";
import { uploadBoard } from "../requests/requests";
import icecubeImage from "../../../public/gameObjectImages/icecube.png";
import dimflyImage from "../../../public/gameObjectImages/dimfly.png";
import litflyImage from "../../../public/gameObjectImages/litfly.png";
import fireflyOnImage from "../../../public/gameObjectImages/firefly_on.jpg";
import { DummyPiece } from "../game/pieces";
import { decodeStringToBoard, encodeBoardToString } from "../game/codification";

const gameObjects: Record<string, string> = {
  BLANK: "x000",
  WARRIOR: "u001",
  ARCHER: "u002",
  BUTTERFLY: "i001",
  CATERPILLAR: "i002",
  GUN: "i003",
};

const images: Record<string, StaticImageData> = {
  x000: soldImage,
  u001: warriorImage,
  u002: archerImage,
  i001: butterflyImage,
  i002: caterpillarImage,
  i003: gunImage,
};

const Shop = () => {
  // Store loading :)
  const game = useSelector((state: RootState) => state.game);
  const dispatch = useDispatch();
  // instantiate values
  const unitArray = Object.values(gameObjects).filter((obj) => {
    return obj[0] === "u";
  });
  const itemArray = Object.values(gameObjects).filter((obj) => {
    return obj[0] === "i";
  });

  const [refresh, updateRefresh] = useState(0);
  const [selectedSquare, updateSelectedSquare] = useState(-1);

  const [objList, updateObjList] = useState(Array(6).fill("x000"));

  const [frozenArray, updateFrozenArray] = useState(Array(6).fill(false));

  // click handler for the refresh button
  const clickRefresh = () => {
    console.log(game.currency);
    if (game.currency >= 1) {
      updateRefresh(refresh + 1);
      dispatch(setCurrency( - 1));
    }
  };

  const freezeObject = () => {
    // Create a new array with the updated value
    const newFrozenArray = frozenArray.map((value, index) =>
      index === selectedSquare ? !value : value,
    );

    // Update the state with the new array
    updateFrozenArray(newFrozenArray);
  };

  const Square = ({ index }: { index: number }) => {
    const squareClick = () => {
      updateSelectedSquare(index);
    };

    // Determine the class based on the state
    const squareClass = frozenArray[index]
      ? "frozen"
      : selectedSquare === index
        ? "selected"
        : "";
    return (
      <div className={`square ${squareClass}`}>
        <button onClick={squareClick}>
          <img src={images[objList[index]].src} alt={objList[index]} />
        </button>
      </div>
    );
  };

  // When the value of refresh changes this code runs since this useEffect() is dependant on refresh
  useEffect(() => {
    const newObjList = [];
    let chosenObject: string = gameObjects["BLANK"];
    for (let i = 0; i < 4; i++) {
      if (frozenArray[i]) {
        chosenObject = objList[i];
      } else {
        const rand = Math.floor(Math.random() * unitArray.length);
        chosenObject = unitArray[rand];
      }
      newObjList.push(chosenObject);
    }
    for (let j = 4; j < 6; j++) {
      if (frozenArray[j]) {
        chosenObject = objList[j];
      } else {
        const rand = Math.floor(Math.random() * itemArray.length);
        chosenObject = itemArray[rand];
      }
      newObjList.push(chosenObject);
    }
    updateObjList(newObjList);
  }, [refresh]);

  // buys an object if the user can afford it, if it is purchased empty the shop space
  const buyObject = () => {
    if (game.currency >= 3 && (game.imHolding == false) && objList[selectedSquare] != gameObjects["BLANK"] && objList[selectedSquare] != null) {
      console.log("CURRENT:",objList[selectedSquare])
      dispatch(setCurrency( - 3));
      dispatch(
        setCurrentBoardString(game.current_boardstr + objList[selectedSquare]),
      );
      dispatch(setImBuying(true));
      dispatch(setPieceImBuying(objList[selectedSquare]));
      objList[selectedSquare] = gameObjects["BLANK"];
    }
  };

  const handleEndShopPhase = () => {
    if (game.currentPieces > 5) {
      console.log("dont allow fight") // maybe display some message to the user here
    }
    else{
    uploadBoard(game.current_boardstr, game.current_game_stage);
    dispatch(setPreCombatString(game.current_boardstr))
    dispatch(setGameState("BATTLE"));
    }
  };

  // Helper function to format amplification values
  const formatAmp = (amp: number[] = [0, 1]): string => {
    const [add, mult] = amp;
    if (add !== 0 && mult !== 1) return `+${add} ×${mult}`;
    if (add !== 0) return `+${add}`;
    if (mult !== 1) return `×${mult}`;
    return "";
  };

  // Helper component for stat/attribute display
  interface StatDisplayProps {
    label: string;
    unitValue?: number | [number, number];
    itemAmp?: number[];
  }

  const StatDisplay: React.FC<StatDisplayProps> = ({ label, unitValue, itemAmp }) => {
    const value = objList[selectedSquare]?.startsWith('u')
      ? unitValue?.toString()
      : objList[selectedSquare]?.startsWith('i')
      ? formatAmp(itemAmp)
      : "";
  
    return value ? (
      <div className="stat-display">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
      </div>
    ) : null;
  };

  return (
    <div>
      <div className="grid-container">
        <div className="grid-row">
        <div className="simple-retro-shop">SHOP</div> 
        </div>
        <div className="grid-row">
        <div className="player-stats-container">
          <div className="player-stat-item">
            <img 
              className="player-stat-icon"
              src={game.currency > 0 ? litflyImage.src : dimflyImage.src}
              alt="Currency"
            />
            <span className="player-stat-value">{game.currency}</span>
          </div>
          
          <div className="player-stat-item">
            <span className="player-stat-label">Stage:</span>
            <span className="player-stat-value">{game.current_game_stage}</span>
          </div>
          
          <div className="player-stat-item">
            <span className="player-stat-label win">W:</span>
            <span className="player-stat-value">{game.wins}</span>
          </div>
          
          <div className="player-stat-item">
            <span className="player-stat-label loss">L:</span>
            <span className="player-stat-value">{game.losses}</span>
          </div>
        </div>
        </div>
        <div className="grid-row">
          <Square index={0} />
          <Square index={1} />
        </div>
        <div className="grid-row">
          <Square index={2} />
          <Square index={3} />
        </div>
        <div className="grid-row">
          <Square index={4} />
          <Square index={5} />
        </div>
        <div className="grid-row">
          {selectedSquare > -1 ? (
            <Square index={selectedSquare} />
          ) : (
            <div className="square"></div>
          )}
          <div className="flex-grid-container">
            <div className="grid-row">
            {selectedSquare > -1 && (
              <div className="stats-container">
                {/* First row for HP and AD */}
                <div className="stats-row">
                  <StatDisplay
                    label="HP:"
                    unitValue={statMasterList[objList[selectedSquare]]?.max_health}
                    itemAmp={attributeMasterList[objList[selectedSquare]]?.max_health_amp}
                  />
                  <StatDisplay
                    label="AD:"
                    unitValue={statMasterList[objList[selectedSquare]]?.ad}
                    itemAmp={attributeMasterList[objList[selectedSquare]]?.ad_amp}
                  />
                </div>
                
                {/* Second row for Range and Speed */}
                <div className="stats-row">
                  <StatDisplay
                    label="Range:"
                    unitValue={statMasterList[objList[selectedSquare]]?.range}
                    itemAmp={attributeMasterList[objList[selectedSquare]]?.range_amp}
                  />
                  <StatDisplay
                    label="Bonus:"
                    unitValue={statMasterList[objList[selectedSquare]]?.level}
                    itemAmp={attributeMasterList[objList[selectedSquare]]?.speed_amp}
                  />
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
        <div className="grid-row">
          <div className="button-container">
            <button 
              className="button flex items-center gap-1" 
              onClick={freezeObject}
            >
              Freeze
              <img
                className="h-4 w-"
                src={icecubeImage.src}
                alt="Freeze"
              />
            </button>
              <button 
              className="button flex items-center gap-1" 
              onClick={buyObject}>
                {" "}
                Buy
                <img
                className="h-4 w-"
                src={litflyImage.src}
                alt="Freeze"
              />
              </button>
              <button className="button" onClick={clickRefresh}>
            Refresh
          </button>
            </div>
            </div>
        <div className="grid-row">
          <button className="button" onClick={handleEndShopPhase}>
            Fight
          </button>
        </div>
      </div>
    </div>
  );
};

export default Shop;
