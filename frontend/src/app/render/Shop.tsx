import React from "react";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../context/context";
import {
  setCurrentUser,
  setCurrentBoard,
  setGameState,
  setCurrency,
} from "../context/gameSlice";

// Image imports
import dummyImage from "../../../public/gameObjectImages/dummy.png";
import warriorImage from "../../../public/gameObjectImages/warrior.png";
import archerImage from "../../../public/gameObjectImages/archer.png";
import butterflyImage from "../../../public/gameObjectImages/butterfly.png";
import caterpillarImage from "../../../public/gameObjectImages/caterpillar.png";
import gunImage from "../../../public/gameObjectImages/gun.png";
import { StaticImageData } from "next/image";

const gameObjects: Record<string, string> = {
  BLANK: "x000",
  WARRIOR: "u001",
  ARCHER: "u002",
  BUTTERFLY: "i001",
  CATERPILLAR: "i002",
  GUN: "i003",
};

const images: Record<string, StaticImageData> = {
  x000: dummyImage,
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
      dispatch(setCurrency(game.currency - 1));
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
    if (game.currency >= 3) {
      dispatch(setCurrency(game.currency - 3));
      dispatch(setCurrentBoard(game.current_board + objList[selectedSquare]));
      objList[selectedSquare] = gameObjects["BLANK"];
    }
  };

  return (
    <div>
      <div>
        <h1> {game.currency} </h1>
        <h1> {game.current_board} </h1>
      </div>
      <div className="grid-container">
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
        <div className="infoBox">
          <button className="button" onClick={freezeObject}>
            Freeze
          </button>
          <button className="button" onClick={buyObject}>
            {" "}
            {selectedSquare}{" "}
          </button>
        </div>
        <button className="button" onClick={clickRefresh}>
          Refresh
        </button>
      </div>
    </div>
  );
};

export default Shop;
