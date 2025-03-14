import { Board } from "./board";

// Takes in a whole board and creates and string representing it's units
export function encodeBoardToString(b: Board): string {
  const encodedString: string = "";

  const hexesOnBoard = b.tiles.values();

  // Each hex is checked for a piece, and then each of it's relevant memebers are extracted and placed into the string.
  hexesOnBoard.forEach((hex) => {
    if (hex.piece) {
      const p = hex.piece;
      let item = "";
      if (p.item) {
        item = p.item.id;
      }
      encodedString.concat(
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
export function decodeStringToBoard(s: string, allied: boolean) {}
