import Item from "./item";
import { attributeMasterList } from "./attributeMasterList"

// Ensure "export default" is used
export default class ButterflyItem extends Item {
  constructor(allied: boolean) {
      super(allied);
      this.id = "i002";
      const { max_health_amp, ad_amp, range_amp, speed_amp } = attributeMasterList[this.id];
      this.max_health_amp = max_health_amp;
      this.ad_amp = ad_amp;
      this.range_amp = range_amp;
      this.speed_amp = speed_amp;
    }
}