export const PASTEL_COLORS = [
  // Orange
  "#FFEDD5",

  // Yellow
  "#FEF9C3",

  // Red
  "#FEE2E2",

  // Green
  "#DCFCE7",

  // Blue
  "#DBEAFE",

  // Purple
  "#F3E8FF",

  // Pink
  "#FCE7F3",
];

export function randomPastelColor() {
  return PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)];
}
