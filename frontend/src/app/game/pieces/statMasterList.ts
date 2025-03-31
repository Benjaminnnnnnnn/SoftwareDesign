import { Stats } from "../types";

export const statMasterList: Record<string, Stats> = {
  // Dummy
  u000: {
    max_health: 5,
    ad: 2,
    range: 1,
    speed: 1,
    level: [1, 1],
  },

  // Warrior
  u001: {
    max_health: 7,
    ad: 3,
    range: 1,
    speed: 1,
    level: [2, 0],
  },

  // Archer
  u002: {
    max_health: 3,
    ad: 2,
    range: 2,
    speed: 1,
    level: [0, 1],
  },
};
