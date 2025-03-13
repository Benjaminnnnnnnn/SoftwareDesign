// Image imports
import dummyImage from "../../../public/gameObjectImages/dummy.png";
import warriorImage from "../../../public/gameObjectImages/warrior.png";
import archerImage from "../../../public/gameObjectImages/archer.png";
import butterflyImage from "../../../public/gameObjectImages/butterfly.png";
import caterpillarImage from "../../../public/gameObjectImages/caterpillar.png";
import gunImage from "../../../public/gameObjectImages/gun.png";
import blankImage from "../../../public/gameObjectImages/Blank.png";
import { StaticImageData } from "next/image";

export const gameObjects: Record<string, string> = {
  DUMMY_UNIT: "u000",
  WARRIOR: "u001",
  ARCHER: "u002",
  DUMMY_ITEM: "i000",
  BUTTERFLY: "i001",
  CATERPILLAR: "i002",
  GUN: "i003",
};

export const images: Record<string, StaticImageData> = {
  u000: dummyImage,
  u001: warriorImage,
  u002: archerImage,
  i000: blankImage,
  i001: butterflyImage,
  i002: caterpillarImage,
  i003: gunImage,
};

