import Command from "./Command";

export function shuffleArray(arr: Array<Command>) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Pick a random index
    [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
  }
  return arr;
}
