import React from "react";
import { useState, useEffect, useRef } from "react";

// Image imports
import dummyImage from "../../../public/gameObjectImages/dummy.png";
import warriorImage from "../../../public/gameObjectImages/warrior.png";
import archerImage from "../../../public/gameObjectImages/archer.png";
import butterflyImage from "../../../public/gameObjectImages/butterfly.png";
import caterpillarImage from "../../../public/gameObjectImages/caterpillar.png";
import gunImage from "../../../public/gameObjectImages/gun.png";

enum units {
  DUMMY = "000",
  WARRIOR = "001",
  ARCHER = "002",
}

enum items {
  DUMMY = "000",
  BUTTERFLY = "001",
  CATERPILLAR = "002",
  GUN = "003",
}

const unitImages = {
  [units.DUMMY]: dummyImage,
  [units.WARRIOR]: warriorImage,
  [units.ARCHER]: archerImage,
};

const itemImages = {
  [items.DUMMY]: dummyImage,
  [items.BUTTERFLY]: butterflyImage,
  [items.CATERPILLAR]: caterpillarImage,
  [items.GUN]: gunImage,
};

const Shop = () => {
  // instantiate values
  const unitArray = Object.values(units);
  const itemArray = Object.values(items);
  const [refresh, updateRefresh] = useState(0);
  const [selectedSquare, updateSelectedSquare] = useState(-1);

  const [unitsList, updateUnitsList] = useState([
    units.DUMMY,
    units.DUMMY,
    units.DUMMY,
    units.DUMMY,
  ]);

  const [shopItems, updateShopItems] = useState([items.DUMMY, items.DUMMY]);

  // click handler for the refresh button
  const clickRefresh = () => {
    updateRefresh(refresh + 1);
  };

  const UnitSquare = ({ index }: { index: number }) => {
    const squareClick = () => {
      updateSelectedSquare(index);
    };
    return (
      <div className={`square ${selectedSquare === index ? "selected" : ""}`}>
        {selectedSquare === index ? (
          <h1>Test</h1>
        ) : (
          <button onClick={squareClick}>
            <img
              src={unitImages[unitsList[index]].src}
              alt={unitsList[index]}
            />
          </button>
        )}
      </div>
    );
  };

  const ItemSquare = ({ item }: { item: items }) => (
    <div className="square">
      <img src={itemImages[item].src} alt={item} />
    </div>
  );

  // When the value of refresh changes this code runs since this useEffect() is dependant on refresh
  useEffect(() => {
    const newUnitList = [];
    for (let i = 0; i < unitsList.length; i++) {
      const rand = Math.floor(Math.random() * unitArray.length);
      const chosenUnit: units = unitArray[rand];
      newUnitList.push(chosenUnit);
    }
    updateUnitsList(newUnitList);
    const newItemList = [];
    for (let j = 0; j < shopItems.length; j++) {
      const rand = Math.floor(Math.random() * itemArray.length);
      const chosenItem: items = itemArray[rand];
      newItemList.push(chosenItem);
    }
    updateShopItems(newItemList);
  }, [refresh]);

  return (
    <div>
      <div className="grid-container">
        <div className="grid-row">
          <UnitSquare index={0} />
          <UnitSquare index={1} />
        </div>
        <div className="grid-row">
          <UnitSquare index={2} />
          <UnitSquare index={3} />
        </div>
        <div className="grid-row">
          <ItemSquare item={shopItems[0]} />
          <ItemSquare item={shopItems[1]} />
        </div>
        <button className="button" onClick={clickRefresh}>
          Refresh
        </button>
      </div>
    </div>
  );
};

export default Shop;
