import { Board } from "./board";

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
): Array<{
  q: number;
  r: number;
  id: string;
  max_health: number;
  ad: number;
  item: string | null;
}> {
  // Split the string into individual piece segments
  const pieceSegments = s.split("!").filter((segment) => segment.trim() !== "");

  // Initialize an array to hold the decoded pieces
  const decodedPieces: Array<{
    q: number;
    r: number;
    id: string;
    max_health: number;
    ad: number;
    item: string | null;
  }> = [];

  // Iterate over each segment and extract the piece information
  pieceSegments.forEach((segment) => {
    const pieceData: { [key: string]: string } = {};
    const keyValuePairs = segment
      .split("#")
      .filter((pair) => pair.trim() !== "");

    // Extract key-value pairs
    for (let i = 0; i < keyValuePairs.length; i += 2) {
      const key = keyValuePairs[i];
      const value = keyValuePairs[i + 1];
      pieceData[key] = value;
    }

    // Construct the piece object, inverting the coordinated depending on if it's friendly or not.
    const piece = {
      q: allied ? parseInt(pieceData["Q"], 10) : -parseInt(pieceData["Q"], 10),
      r: allied ? parseInt(pieceData["R"], 10) : -parseInt(pieceData["R"], 10),
      id: pieceData["I"],
      max_health: parseInt(pieceData["H"], 10),
      ad: parseInt(pieceData["A"], 10),
      item: pieceData["M"] || null, // If no item, set to null
    };

    // Add the piece to the decoded pieces array
    decodedPieces.push(piece);
  });

  return decodedPieces;
}
