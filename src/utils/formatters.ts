import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { PACIFIC_TZ } from "./timezone";
import type { Settings } from "../contexts/SettingsContext";

export function formatTime(utcMs: number, timeFormat: Settings["timeFormat"]): string {
  const zoned = toZonedTime(new Date(utcMs), PACIFIC_TZ);
  return format(zoned, timeFormat === "24h" ? "HH:mm" : "h:mm a");
}

export function formatTimeRange(
  startUtcMs: number,
  endUtcMs: number,
  timeFormat: Settings["timeFormat"]
): string {
  return `${formatTime(startUtcMs, timeFormat)} - ${formatTime(endUtcMs, timeFormat)} PT`;
}

export function getHourLabel(hour: number, timeFormat: Settings["timeFormat"]): string {
  if (timeFormat === "24h") {
    return `${hour.toString().padStart(2, "0")}:00`;
  }
  const ampm = hour < 12 ? "AM" : "PM";
  const h = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${h} ${ampm}`;
}

export function getHourLabelsFormatted(timeFormat: Settings["timeFormat"]): string[] {
  const labels: string[] = [];
  for (let h = 0; h < 24; h++) {
    labels.push(getHourLabel(h, timeFormat));
  }
  return labels;
}

export function formatDateByPreference(
  date: Date,
  dateFormat: Settings["dateFormat"]
): string {
  switch (dateFormat) {
    case "DD/MM/YYYY":
      return format(date, "dd/MM/yyyy");
    case "YYYY-MM-DD":
      return format(date, "yyyy-MM-dd");
    case "MM/DD/YYYY":
    default:
      return format(date, "MM/dd/yyyy");
  }
}
