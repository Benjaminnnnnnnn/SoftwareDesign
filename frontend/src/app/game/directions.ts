// Directions for 6 neighbors (hexagonal directions)
export default const directions = [
  { dq: 1, dr: 0 }, // Right
  { dq: -1, dr: 0 }, // Left
  { dq: 0, dr: 1 }, // Top-right
  { dq: 0, dr: -1 }, // Bottom-left
  { dq: 1, dr: -1 }, // Bottom-right
  { dq: -1, dr: 1 }, // Top-left
];
