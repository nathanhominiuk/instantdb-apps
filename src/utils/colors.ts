export const CALENDAR_COLORS = [
  "#4285F4", // blue
  "#EA4335", // red
  "#34A853", // green
  "#FBBC04", // yellow
  "#FF6D01", // orange
  "#46BDC6", // teal
  "#7B61FF", // purple
  "#E91E63", // pink
  "#00BCD4", // cyan
  "#8BC34A", // lime
];

export const PERSON_COLORS = [
  "#6366F1", // indigo
  "#EC4899", // pink
  "#14B8A6", // teal
  "#F97316", // orange
];

export function getCalendarColor(index: number): string {
  return CALENDAR_COLORS[index % CALENDAR_COLORS.length];
}

export function getPersonColor(index: number): string {
  return PERSON_COLORS[index % PERSON_COLORS.length];
}
