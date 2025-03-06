import React from "react";
import { useState, useEffect, useRef } from "react";
import { randomInt } from "crypto";

// Image imports
import dummyImage from "../game/pieces/images/dummy.png"
import warriorImage from "../game/pieces/images/warrior.png"
import archerImage from "../game/pieces/images/archer.png"

enum units {
  DUMMY = "000",
  WARRIOR = "001",
  ARCHER = "002",
}

const unitImages = {
  [units.DUMMY] : dummyImage,
  [units.WARRIOR] : warriorImage,
  [units.ARCHER] : archerImage,
};

const Square = ({ unit }: { unit: units }) => (
  <div className="square">
    <img src={unitImages[unit].src} alt={unit} />
  </div>
);

const Shop = () => {
  const unitArray = Object.values(units);
  const [unitsList, updateUnitsList] = useState([
    units.DUMMY,
    units.DUMMY,
    units.DUMMY,
    units.DUMMY,
    units.DUMMY,
    units.DUMMY,
  ]);

  useEffect(() => {
    const newList = [];
    for (let i = 0; i < unitsList.length; i++) {
      const rand = Math.floor(Math.random() * unitArray.length);
      const chosenUnit: units = unitArray[rand];
      newList.push(chosenUnit);
    }
    updateUnitsList(newList);
  }, []);

  
  return (
    <div className="grid-container">
      <div className="grid-row">
        <Square unit={unitsList[0]} />
        <Square unit={unitsList[1]} />
      </div>
      <div className="grid-row">
        <Square unit={unitsList[2]} />
        <Square unit={unitsList[3]} />
      </div>
      <div className="grid-row">
        <Square unit={unitsList[4]} />
        <Square unit={unitsList[5]} />
      </div>
    </div>
  );
};

export default Shop;
