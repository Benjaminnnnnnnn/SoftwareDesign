import React from "react";
import { useState, useEffect, useRef } from "react";
import { randomInt } from "crypto";

enum units {
  DUMMY = "000",
  WARRIOR = "001",
  ARCHER = "002",
}

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
        <div className="square">{unitsList[0]}</div>
        <div className="square">{unitsList[1]}</div>
      </div>
      <div className="grid-row">
        <div className="square">{unitsList[2]}</div>
        <div className="square">{unitsList[3]}</div>
      </div>
      <div className="grid-row">
        <div className="square">{unitsList[4]}</div>
        <div className="square">{unitsList[5]}</div>
      </div>
    </div>
  );
};

export default Shop;
