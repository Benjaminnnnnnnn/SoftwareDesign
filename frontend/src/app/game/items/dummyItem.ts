import Item from "./item";

// Ensure "export default" is used
export default class DummyItem extends Item {
  constructor(allied: boolean) {
    super(allied); 
    this.id = "i000";
    this.cost = 1; // same for all items
    this.max_health_amp = [0,1];
    this.ad_amp = [0,1]; 
    this.range_amp = [0,1]; 
    this.speed_amp = [0,1]; 
  }
}