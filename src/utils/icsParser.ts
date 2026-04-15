import { fromZonedTime } from "date-fns-tz";

export interface ParsedICSEvent {
  uid: string;
  summary: string;
  description: string;
  location: string;
  startTime: number; // UTC ms
  endTime: number; // UTC ms
  allDay: boolean;
}

export interface ParsedICSCalendar {
  name: string;
  events: ParsedICSEvent[];
}

/** Unfold ICS lines: continuation lines start with a space or tab (RFC 5545 §3.1) */
function unfoldLines(text: string): string {
  return text.replace(/\r\n[ \t]/g, "").replace(/\n[ \t]/g, "");
}

/** Unescape ICS text values (RFC 5545 §3.3.11) */
function unescapeValue(value: string): string {
  return value
    .replace(/\\n/gi, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\");
}

/**
 * Parse an ICS date/time string.
 * Formats:
 *   20240101T100000Z         (UTC)
 *   20240101T100000          (floating or with external TZID)
 *   20240101                 (all-day, VALUE=DATE)
 */
function parseICSDateTime(
  dateStr: string,
  tzid?: string
): { time: number; allDay: boolean } {
  const clean = dateStr.trim();

  // All-day: exactly 8 digits (YYYYMMDD)
  if (/^\d{8}$/.test(clean)) {
    const year = parseInt(clean.slice(0, 4), 10);
    const month = parseInt(clean.slice(4, 6), 10) - 1;
    const day = parseInt(clean.slice(6, 8), 10);
    const date = new Date(Date.UTC(year, month, day));
    return { time: date.getTime(), allDay: true };
  }

  // DateTime: YYYYMMDDTHHmmss[Z]
  const match = clean.match(
    /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z)?$/
  );
  if (!match) {
    return { time: 0, allDay: false };
  }

  const [, yr, mo, dy, hr, mn, sc, utcFlag] = match;
  const year = parseInt(yr, 10);
  const month = parseInt(mo, 10) - 1;
  const day = parseInt(dy, 10);
  const hour = parseInt(hr, 10);
  const minute = parseInt(mn, 10);
  const second = parseInt(sc, 10);

  if (utcFlag) {
    return {
      time: Date.UTC(year, month, day, hour, minute, second),
      allDay: false,
    };
  }

  if (tzid) {
    // Build a local date and convert from the specified timezone to UTC
    const localDate = new Date(year, month, day, hour, minute, second);
    const utcDate = fromZonedTime(localDate, tzid);
    return { time: utcDate.getTime(), allDay: false };
  }

  // Floating time (no timezone) - treat as UTC
  return {
    time: Date.UTC(year, month, day, hour, minute, second),
    allDay: false,
  };
}

/**
 * Parse a full ICS property line like "DTSTART;TZID=America/New_York:20240101T100000"
 * Returns the value portion and any TZID parameter.
 */
function parsePropertyLine(line: string): {
  value: string;
  params: Record<string, string>;
} {
  // Split on first colon that isn't inside a parameter value
  const colonIdx = line.indexOf(":");
  if (colonIdx === -1) return { value: "", params: {} };

  const beforeColon = line.slice(0, colonIdx);
  const value = line.slice(colonIdx + 1);

  const params: Record<string, string> = {};
  // Parse parameters like ;TZID=America/New_York;VALUE=DATE
  const paramParts = beforeColon.split(";").slice(1); // skip property name
  for (const part of paramParts) {
    const eqIdx = part.indexOf("=");
    if (eqIdx !== -1) {
      params[part.slice(0, eqIdx).toUpperCase()] = part.slice(eqIdx + 1);
    }
  }

  return { value, params };
}

function parseVEvent(lines: string[]): ParsedICSEvent | null {
  const props = new Map<string, string>();

  for (const line of lines) {
    // Extract property name (before ; or :)
    const nameEnd = Math.min(
      line.indexOf(":") >= 0 ? line.indexOf(":") : line.length,
      line.indexOf(";") >= 0 ? line.indexOf(";") : line.length
    );
    const propName = line.slice(0, nameEnd).toUpperCase();

    // Store full line keyed by property name (first occurrence wins)
    if (!props.has(propName)) {
      props.set(propName, line);
    }
  }

  // Parse DTSTART
  const dtStartLine = props.get("DTSTART");
  if (!dtStartLine) return null;

  const dtStartParsed = parsePropertyLine(dtStartLine);
  const startResult = parseICSDateTime(
    dtStartParsed.value,
    dtStartParsed.params["TZID"]
  );

  if (startResult.time === 0) return null;

  // Determine allDay from VALUE=DATE parameter or from date format
  const isAllDay =
    startResult.allDay || dtStartParsed.params["VALUE"] === "DATE";

  // Parse DTEND
  let endTime: number;
  const dtEndLine = props.get("DTEND");
  if (dtEndLine) {
    const dtEndParsed = parsePropertyLine(dtEndLine);
    const endResult = parseICSDateTime(
      dtEndParsed.value,
      dtEndParsed.params["TZID"]
    );
    endTime = endResult.time || startResult.time + (isAllDay ? 86400000 : 3600000);
  } else {
    // Default: all-day = +24h, timed = +1h
    endTime = startResult.time + (isAllDay ? 86400000 : 3600000);
  }

  // Extract text properties
  const summaryLine = props.get("SUMMARY");
  const summary = summaryLine
    ? unescapeValue(parsePropertyLine(summaryLine).value)
    : "Untitled Event";

  const descLine = props.get("DESCRIPTION");
  const description = descLine
    ? unescapeValue(parsePropertyLine(descLine).value)
    : "";

  const locLine = props.get("LOCATION");
  const location = locLine
    ? unescapeValue(parsePropertyLine(locLine).value)
    : "";

  const uidLine = props.get("UID");
  const uid = uidLine ? parsePropertyLine(uidLine).value : "";

  return {
    uid,
    summary,
    description,
    location,
    startTime: startResult.time,
    endTime,
    allDay: isAllDay,
  };
}

export function parseICS(
  icsText: string,
  fallbackName: string
): ParsedICSCalendar {
  const unfolded = unfoldLines(icsText);
  const lines = unfolded.split(/\r?\n/);

  let calendarName = fallbackName;
  const events: ParsedICSEvent[] = [];

  let inVEvent = false;
  let currentEventLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === "BEGIN:VEVENT") {
      inVEvent = true;
      currentEventLines = [];
      continue;
    }

    if (trimmed === "END:VEVENT") {
      inVEvent = false;
      const event = parseVEvent(currentEventLines);
      if (event) {
        events.push(event);
      }
      continue;
    }

    if (inVEvent) {
      currentEventLines.push(trimmed);
      continue;
    }

    // Outside VEVENT - look for calendar-level properties
    if (trimmed.startsWith("X-WR-CALNAME:")) {
      calendarName = unescapeValue(trimmed.slice("X-WR-CALNAME:".length));
    }
  }

  return { name: calendarName, events };
}
