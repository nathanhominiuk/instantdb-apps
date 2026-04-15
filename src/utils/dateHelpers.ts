import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
  addWeeks,
  addMonths,
  addQuarters,
  addYears,
  subDays,
  subWeeks,
  subMonths,
  subQuarters,
  subYears,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  differenceInMinutes,
  format,
} from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import { PACIFIC_TZ } from "./timezone";
import type { ViewType } from "../types";

export interface DateRange {
  start: Date;
  end: Date;
}

export function getViewDateRange(view: ViewType, currentDate: Date): DateRange {
  const zoned = toZonedTime(currentDate, PACIFIC_TZ);

  switch (view) {
    case "agenda":
      return { start: startOfDay(zoned), end: endOfDay(addDays(zoned, 13)) };
    case "day":
      return { start: startOfDay(zoned), end: endOfDay(zoned) };
    case "week":
      return {
        start: startOfWeek(zoned, { weekStartsOn: 0 }),
        end: endOfWeek(zoned, { weekStartsOn: 0 }),
      };
    case "fortnight":
      return {
        start: startOfWeek(zoned, { weekStartsOn: 0 }),
        end: endOfDay(addDays(startOfWeek(zoned, { weekStartsOn: 0 }), 13)),
      };
    case "month":
      return {
        start: startOfWeek(startOfMonth(zoned), { weekStartsOn: 0 }),
        end: endOfWeek(endOfMonth(zoned), { weekStartsOn: 0 }),
      };
    case "quarter":
      return {
        start: startOfQuarter(zoned),
        end: endOfQuarter(zoned),
      };
    case "year":
      return {
        start: startOfYear(zoned),
        end: endOfYear(zoned),
      };
  }
}

export function navigateDate(
  view: ViewType,
  currentDate: Date,
  direction: "prev" | "next"
): Date {
  const fn = direction === "next" ? 1 : -1;
  switch (view) {
    case "agenda":
      return addDays(currentDate, fn * 14);
    case "day":
      return direction === "next"
        ? addDays(currentDate, 1)
        : subDays(currentDate, 1);
    case "week":
      return direction === "next"
        ? addWeeks(currentDate, 1)
        : subWeeks(currentDate, 1);
    case "fortnight":
      return direction === "next"
        ? addWeeks(currentDate, 2)
        : subWeeks(currentDate, 2);
    case "month":
      return direction === "next"
        ? addMonths(currentDate, 1)
        : subMonths(currentDate, 1);
    case "quarter":
      return direction === "next"
        ? addQuarters(currentDate, 1)
        : subQuarters(currentDate, 1);
    case "year":
      return direction === "next"
        ? addYears(currentDate, 1)
        : subYears(currentDate, 1);
  }
}

export function getViewTitle(view: ViewType, currentDate: Date): string {
  const zoned = toZonedTime(currentDate, PACIFIC_TZ);

  switch (view) {
    case "agenda":
      return `${format(zoned, "MMM d")} - ${format(addDays(zoned, 13), "MMM d, yyyy")}`;
    case "day":
      return format(zoned, "EEEE, MMMM d, yyyy");
    case "week":
    case "fortnight": {
      const range = getViewDateRange(view, currentDate);
      return `${format(range.start, "MMM d")} - ${format(range.end, "MMM d, yyyy")}`;
    }
    case "month":
      return format(zoned, "MMMM yyyy");
    case "quarter": {
      const q = Math.floor(zoned.getMonth() / 3) + 1;
      return `Q${q} ${format(zoned, "yyyy")}`;
    }
    case "year":
      return format(zoned, "yyyy");
  }
}

export function getDateRangeUTC(range: DateRange): { startUTC: number; endUTC: number } {
  return {
    startUTC: fromZonedTime(range.start, PACIFIC_TZ).getTime(),
    endUTC: fromZonedTime(range.end, PACIFIC_TZ).getTime(),
  };
}

export function getDaysInRange(range: DateRange): Date[] {
  return eachDayOfInterval({ start: range.start, end: range.end });
}

export function getWeeksInRange(range: DateRange): Date[] {
  return eachWeekOfInterval(
    { start: range.start, end: range.end },
    { weekStartsOn: 0 }
  );
}

export function getMonthsInRange(range: DateRange): Date[] {
  return eachMonthOfInterval({ start: range.start, end: range.end });
}

export function isToday(date: Date): boolean {
  const now = toZonedTime(new Date(), PACIFIC_TZ);
  return isSameDay(date, now);
}

export function isCurrentMonth(date: Date, refDate: Date): boolean {
  return isSameMonth(date, refDate);
}

export function isEventInRange(
  eventStart: number,
  eventEnd: number,
  range: DateRange
): boolean {
  const { startUTC, endUTC } = getDateRangeUTC(range);
  return eventStart < endUTC && eventEnd > startUTC;
}

export function getHourLabels(): string[] {
  const labels: string[] = [];
  for (let h = 0; h < 24; h++) {
    const ampm = h < 12 ? "AM" : "PM";
    const hour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    labels.push(`${hour} ${ampm}`);
  }
  return labels;
}

export function getEventTopPercent(startTime: number): number {
  const zoned = toZonedTime(new Date(startTime), PACIFIC_TZ);
  return ((zoned.getHours() * 60 + zoned.getMinutes()) / 1440) * 100;
}

export function getEventHeightPercent(startTime: number, endTime: number): number {
  const minutes = differenceInMinutes(new Date(endTime), new Date(startTime));
  return Math.max((minutes / 1440) * 100, 0.7); // min height
}

export { isSameDay, isWithinInterval, format, addDays, startOfDay, endOfDay, startOfMonth, endOfMonth, startOfWeek };
