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

  // TODO: modify these stats!
  // Ninja
  u003: {
    max_health: 1,
    ad: 4,
    range: 1,
    speed: 1,
    level: [0, 1],
  },

  // Mummy
  u004: {
    max_health: 2,
    ad: 2,
    range: 1,
    speed: 1,
    level: [3, 0],
  },

  // Glitter (bomber)
  u005: {
    max_health: 3,
    ad: 3,
    range: 2,
    speed: 1,
    level: [0, 1],
  },

  // (the) Dude
  u006: {
    max_health: 10,
    ad: 0,
    range: 0,
    speed: 1,
    level: [5, 0],
  },
};
