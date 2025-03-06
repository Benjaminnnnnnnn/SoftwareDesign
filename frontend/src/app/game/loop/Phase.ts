import { States } from "../types";

export default abstract class Phase {
  running: boolean;

  constructor() {
    this.running = false;
  }
  abstract nextPhase(): States;

  abstract start(): void;

  abstract update(): void;

  abstract end(): void;
}
