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
  const unitArray = Object.values(units).slice(1);
  const itemArray = Object.values(items).slice(1);
  const [currency, updateCurrency] = useState(10);
  const [refresh, updateRefresh] = useState(0);
  const [selectedSquare, updateSelectedSquare] = useState(-1);

  const [unitsList, updateUnitsList] = useState([
    units.DUMMY,
    units.DUMMY,
    units.DUMMY,
    units.DUMMY,
  ]);

  const [shopItems, updateShopItems] = useState([items.DUMMY, items.DUMMY]);

  const [objList, updateObjList] = useState([units.DUMMY, items.DUMMY]);
  const [frozenArray, updateFrozenArray] = useState(Array(6).fill(false));
  // click handler for the refresh button
  const clickRefresh = () => {
    if (currency >= 1) {
      updateRefresh(refresh + 1);
      updateCurrency(currency - 1);
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

  const UnitSquare = ({ index }: { index: number }) => {
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
          <img src={unitImages[unitsList[index]].src} alt={unitsList[index]} />
        </button>
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

  const buyObject = () => {
    if (currency >= 3) {
      unitsList[selectedSquare] = units.DUMMY;
      updateCurrency(currency - 3);
    }
  };
  return (
    <div>
      <div>
        <h1> {currency} </h1>
      </div>
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
