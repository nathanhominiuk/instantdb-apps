import { toZonedTime, fromZonedTime } from "date-fns-tz";
import { startOfDay, addDays, format } from "date-fns";
import { PACIFIC_TZ } from "./timezone";
import type { CalendarEvent, FreeWindow } from "../types";

interface BusyInterval {
  start: number;
  end: number;
}

interface FreeTimeOptions {
  dayStartHour?: number;
  dayEndHour?: number;
  minDurationMinutes?: number;
  maxResults?: number;
}

export function findFreeWindows(
  events: CalendarEvent[],
  rangeStartUTC: number,
  rangeEndUTC: number,
  options: FreeTimeOptions = {}
): FreeWindow[] {
  const {
    dayStartHour = 8,
    dayEndHour = 20,
    minDurationMinutes = 30,
    maxResults = 20,
  } = options;

  // Collect busy intervals from all events
  const busy: BusyInterval[] = events
    .filter((e) => !e.allDay)
    .map((e) => ({ start: e.startTime, end: e.endTime }))
    .sort((a, b) => a.start - b.start);

  // Merge overlapping intervals
  const merged: BusyInterval[] = [];
  for (const interval of busy) {
    if (merged.length === 0 || merged[merged.length - 1].end < interval.start) {
      merged.push({ ...interval });
    } else {
      merged[merged.length - 1].end = Math.max(
        merged[merged.length - 1].end,
        interval.end
      );
    }
  }

  // Generate candidate windows for each day in range
  const windows: FreeWindow[] = [];
  const rangeStart = toZonedTime(new Date(rangeStartUTC), PACIFIC_TZ);
  const rangeEnd = toZonedTime(new Date(rangeEndUTC), PACIFIC_TZ);

  let day = startOfDay(rangeStart);
  while (day < rangeEnd) {
    const dayWorkStart = new Date(day);
    dayWorkStart.setHours(dayStartHour, 0, 0, 0);
    const dayWorkEnd = new Date(day);
    dayWorkEnd.setHours(dayEndHour, 0, 0, 0);

    const workStartUTC = fromZonedTime(dayWorkStart, PACIFIC_TZ).getTime();
    const workEndUTC = fromZonedTime(dayWorkEnd, PACIFIC_TZ).getTime();

    // Find free slots within work hours for this day
    let cursor = workStartUTC;
    for (const interval of merged) {
      if (interval.start >= workEndUTC) break;
      if (interval.end <= cursor) continue;

      if (interval.start > cursor) {
        const freeStart = Math.max(cursor, workStartUTC);
        const freeEnd = Math.min(interval.start, workEndUTC);
        const durationMinutes = (freeEnd - freeStart) / 60000;
        if (durationMinutes >= minDurationMinutes) {
          windows.push({ start: freeStart, end: freeEnd, durationMinutes });
        }
      }
      cursor = Math.max(cursor, interval.end);
    }

    // Check remaining time after last busy interval
    if (cursor < workEndUTC) {
      const freeStart = Math.max(cursor, workStartUTC);
      const durationMinutes = (workEndUTC - freeStart) / 60000;
      if (durationMinutes >= minDurationMinutes) {
        windows.push({
          start: freeStart,
          end: workEndUTC,
          durationMinutes,
        });
      }
    }

    day = addDays(day, 1);
  }

  // Sort by duration (longest first), then by start time
  windows.sort((a, b) => b.durationMinutes - a.durationMinutes || a.start - b.start);

  return windows.slice(0, maxResults);
}

export function formatFreeWindow(
  window: FreeWindow,
  timeFormat: "12h" | "24h" = "12h"
): string {
  const start = toZonedTime(new Date(window.start), PACIFIC_TZ);
  const end = toZonedTime(new Date(window.end), PACIFIC_TZ);
  const dayStr = format(start, "EEE, MMM d");
  const timePattern = timeFormat === "24h" ? "HH:mm" : "h:mm a";
  const startStr = format(start, timePattern);
  const endStr = format(end, timePattern);
  const hours = Math.floor(window.durationMinutes / 60);
  const mins = window.durationMinutes % 60;
  const durationStr =
    hours > 0 ? `${hours}h${mins > 0 ? ` ${mins}m` : ""}` : `${mins}m`;

  return `${dayStr}: ${startStr} - ${endStr} (${durationStr})`;
}
