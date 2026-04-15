import { format } from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";

export const PACIFIC_TZ = "America/Los_Angeles";

export function toPacific(utcMs: number): Date {
  return toZonedTime(new Date(utcMs), PACIFIC_TZ);
}

export function toUTC(pacificDate: Date): number {
  return fromZonedTime(pacificDate, PACIFIC_TZ).getTime();
}

export function formatInPacific(utcMs: number, formatStr: string): string {
  const zonedDate = toPacific(utcMs);
  return format(zonedDate, formatStr);
}

export function nowInPacific(): Date {
  return toZonedTime(new Date(), PACIFIC_TZ);
}

export function startOfDayPacific(date: Date): Date {
  const zoned = toZonedTime(date, PACIFIC_TZ);
  zoned.setHours(0, 0, 0, 0);
  return zoned;
}

export function endOfDayPacific(date: Date): Date {
  const zoned = toZonedTime(date, PACIFIC_TZ);
  zoned.setHours(23, 59, 59, 999);
  return zoned;
}
