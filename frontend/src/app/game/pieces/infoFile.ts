import { Stats } from "../types";

export const infoFile: Record<string, { name: string; desc: string }> = {
  // Dummy
  u000: {
    name: "Dummy",
    desc: "Placeholder",
  },

  // Warrior
  u001: {
    name: "Warrior",
    desc: "Basic Melee Fighter",
  },

  // Archer
  u002: {
    name: "Archer",
    desc: "Basic Ranged Unit",
  },

  // TODO: modify these stats!
  // Ninja
  u003: {
    name: "Ninja",
    desc: "Glass Cannon melee unit",
  },

  // Mummy
  u004: {
    name: "Mummy",
    desc: "Reanimates once per comabt",
  },

  // Glitter (bomber)
  u005: {
    name: "Glitter Bomber",
    desc: "More advanced range unit",
  },

  // (the) Dude
  u006: {
    name: "The Dude",
    desc: "He abides with a beverage in hand, does not like nihilists",
  },

  // Dummy
  i000: {
    name: "Dummy Item",
    desc: "Placeholder",
  },

  // butterfly
  i001: {
    name: "Bullseye Sticker",
    desc: "Increases a unit's range",
  },

  // caterpillar
  i002: {
    name: "Caterpillar Sticker",
    desc: "Increases a unit's health",
  },

  // gun
  i003: {
    name: "Gun Sticker",
    desc: "Increases a unit's attack",
  },
};
