import Piece from "./piece";

// Ensure "export default" is used
export default class DummyPiece extends Piece {
  // TODO : Finish Implementation
  constructor(allied: boolean) {
    super(allied); 
    this.id = "u001";
    this.max_health = 5;
    this.ad = 2;
    this.range = 1;
    this.speed = 1;
  }

  public attack(): number {
    return this.ad;
    // returns damage that will be deault
  }

  public takeDamage(damage: number): void {
    this.current_health -= damage;
    if (this.current_health <0){
        this.alive = false;
    }
  }
}