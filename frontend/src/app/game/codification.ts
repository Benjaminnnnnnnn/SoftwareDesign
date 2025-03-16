import { Pipe } from "node:stream";
import { Board } from "./board";
import { pieceAsObj } from "./types";

// Takes in a whole board and creates and string representing it's units
export function encodeBoardToString(b: Board): string {
  let encodedString: string = "";
  const hexesOnBoard = b.tiles.values();
  // Each hex is checked for a piece, and then each of it's relevant memebers are extracted and placed into the string.
  hexesOnBoard.forEach((hex) => {
    if (hex.piece) {
      const p = hex.piece;
      let item = "";
      if (p.item) {
        item = p.item.id;
      }
      encodedString = encodedString.concat(
        "!",
        "#Q",
        String(hex.coord.q),
        "#R",
        String(hex.coord.r),
        "#I",
        p.id,
        "#H",
        String(p.max_health),
        "#A",
        String(p.ad),
        "#R",
        String(p.range),
        "#S",
        String(p.speed),
        "#M",
        item,
      );
    }
  });
  return encodedString;
}

// turns a string into a set of objects to be placed on the board
//
// test with this string: !#Q-2#R2#Iu002#H4#A4#M!#Q-1#R1#Iu001#H7#A3#M!#Q-1#R2#Iu002#H4#A4#M
export function decodeStringToBoard(
  s: string,
  allied: boolean,
): Array<pieceAsObj> {
  // Split the string into individual piece segments
  const pieceSegments = s.split("!").filter((segment) => segment.trim() !== "");
  // Initialize an array to hold the decoded pieces
  const decodedPieces: Array<pieceAsObj> = [];

  // Iterate over each segment and extract the piece information
  pieceSegments.forEach((segment) => {
    const pieceData: { [key: string]: string } = {};
    const keyValuePairs = segment
      .split("#")
      .filter((pair) => pair.trim() !== "");

    keyValuePairs.forEach((pair) => {
      pieceData[pair[0]] = pair.slice(1);
    });

    // Construct the piece object, handling multi-digit and negative numbers
    const piece = {
      q: allied ? parseInt(pieceData["Q"], 10) : -parseInt(pieceData["Q"], 10),
      r: allied ? parseInt(pieceData["R"], 10) : -parseInt(pieceData["R"], 10),
      id: pieceData["I"],
      max_health: parseInt(pieceData["H"], 10),
      ad: parseInt(pieceData["A"], 10),
      item: pieceData["M"] || undefined,
      speed: parseInt(pieceData["S"], 10),
      range: parseInt(pieceData["R"], 10),
    };
    console.log(piece);
    decodedPieces.push(piece);
  });

  return decodedPieces;
}
