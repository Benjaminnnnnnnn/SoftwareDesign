// Image imports
import dummyImage from "../../../public/gameObjectImages/dummy.png";
import warriorImage from "../../../public/gameObjectImages/warrior.png";
import archerImage from "../../../public/gameObjectImages/archer.png";
import targetImage from "../../../public/gameObjectImages/target.png";
import smileyImage from "../../../public/gameObjectImages/smiley.png";
import gunImage from "../../../public/gameObjectImages/gun.png";
import blankImage from "../../../public/gameObjectImages/blank.png";
import soldImage from "../../../public/gameObjectImages/sold.png";
import ninjaImage from "../../../public/gameObjectImages/ninja.png";
import mummyImage from "../../../public/gameObjectImages/mummy.png";
import glitterImage from "../../../public/gameObjectImages/glitter.png";
import dudeImage from "../../../public/gameObjectImages/dude.png";
import superImage from "../../../public/gameObjectImages/super.png";
import doctorImage from "../../../public/gameObjectImages/doctor.png";
import kirbyImage from "../../../public/gameObjectImages/kirby.png";

import { StaticImageData } from "next/image";

export const gameObjects: Record<string, string> = {
  BLANK : "x000",
  DUMMY_UNIT: "du000",
  WARRIOR: "u001",
  ARCHER: "u002",
  NINJA: "u003",
  MUMMY: "u004",
  GLITTER: "u005",
  DUDE: "u006",
  SUPER: "u007",
  DOCTOR: "u008",
  KIRBY: "u009",
  DUMMY_ITEM: "di000",
  TARGET: "i001",
  SMILEY: "i002",
  GUN: "i003",
};

export const images: Record<string, StaticImageData> = {
  x000: soldImage,
  u000: dummyImage,
  u001: warriorImage,
  u002: archerImage,
  u003: ninjaImage,
  u004: mummyImage,
  u005: glitterImage,
  u006: dudeImage,
  u007: superImage,
  u008: doctorImage,
  u009: kirbyImage,
  i000: blankImage,
  i001: targetImage,
  i002: smileyImage,
  i003: gunImage,
};

