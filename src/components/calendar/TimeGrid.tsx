import { useMemo, useRef, useEffect } from "react";
import {
  getEventTopPercent,
  getEventHeightPercent,
  format,
} from "../../utils/dateHelpers";
import { toPacific, PACIFIC_TZ } from "../../utils/timezone";
import { isToday } from "../../utils/dateHelpers";
import { getHourLabelsFormatted } from "../../utils/formatters";
import { computeCardStackLayout } from "../../utils/eventLayout";
import { useSettings } from "../../contexts/SettingsContext";
import EventBlock from "./EventBlock";
import type { CalendarEvent } from "../../types";
import { toZonedTime } from "date-fns-tz";

interface TimeGridProps {
  days: Date[];
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  compact?: boolean;
}

export default function TimeGrid({ days, events, onEventClick, compact }: TimeGridProps) {
  const { settings } = useSettings();
  const hours = getHourLabelsFormatted(settings.timeFormat);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to 7am on mount
  useEffect(() => {
    if (scrollRef.current) {
      const hourHeight = scrollRef.current.scrollHeight / 24;
      scrollRef.current.scrollTop = hourHeight * 7;
    }
  }, []);

  // Group events by day
  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const day of days) {
      const key = format(day, "yyyy-MM-dd");
      map.set(key, []);
    }
    for (const event of events) {
      if (event.allDay) continue;
      const eventDate = toPacific(event.startTime);
      const key = format(eventDate, "yyyy-MM-dd");
      if (map.has(key)) {
        map.get(key)!.push(event);
      }
    }
    return map;
  }, [days, events]);

  // All-day events
  const allDayEvents = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const day of days) {
      const key = format(day, "yyyy-MM-dd");
      map.set(key, []);
    }
    for (const event of events) {
      if (!event.allDay) continue;
      const eventDate = toPacific(event.startTime);
      const key = format(eventDate, "yyyy-MM-dd");
      if (map.has(key)) {
        map.get(key)!.push(event);
      }
    }
    return map;
  }, [days, events]);

  const hasAllDay = Array.from(allDayEvents.values()).some((e) => e.length > 0);

  // Current time indicator
  const now = toZonedTime(new Date(), PACIFIC_TZ);
  const nowPercent = ((now.getHours() * 60 + now.getMinutes()) / 1440) * 100;

  return (
    <div className="flex flex-col h-full" data-testid="time-grid">
      {/* Day headers */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-0 z-10">
        <div className="w-16 flex-shrink-0" />
        {days.map((day) => {
          const today = isToday(day);
          return (
            <div
              key={format(day, "yyyy-MM-dd")}
              className={`flex-1 text-center py-2 border-l border-gray-100 dark:border-gray-800 ${today ? "bg-blue-50 dark:bg-blue-900/30" : ""}`}
            >
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {compact ? format(day, "EEE") : format(day, "EEE")}
              </div>
              <div
                className={`text-sm font-semibold ${
                  today
                    ? "bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center mx-auto"
                    : "text-gray-900 dark:text-gray-100"
                }`}
              >
                {format(day, "d")}
              </div>
            </div>
          );
        })}
      </div>

      {/* All-day events row */}
      {hasAllDay && (
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="w-16 flex-shrink-0 text-[10px] text-gray-400 dark:text-gray-500 px-2 py-1">
            ALL DAY
          </div>
          {days.map((day) => {
            const key = format(day, "yyyy-MM-dd");
            const dayAllDay = allDayEvents.get(key) ?? [];
            return (
              <div key={key} className="flex-1 border-l border-gray-100 dark:border-gray-800 p-0.5 space-y-0.5">
                {dayAllDay.map((event) => (
                  <EventBlock
                    key={event.id}
                    event={event}
                    onClick={onEventClick}
                    compact
                  />
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* Scrollable time grid */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="relative flex" style={{ height: `${24 * 60}px` }}>
          {/* Hour labels */}
          <div className="w-16 flex-shrink-0 relative">
            {hours.map((label, i) => (
              <div
                key={i}
                className="absolute w-full text-right pr-2 text-[10px] text-gray-400 dark:text-gray-500"
                style={{ top: `${i * 60}px`, height: "60px" }}
              >
                <span className="relative -top-2">{label}</span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map((day) => {
            const key = format(day, "yyyy-MM-dd");
            const dayEvents = eventsByDay.get(key) ?? [];
            const today = isToday(day);

            return (
              <div key={key} className="flex-1 relative border-l border-gray-100 dark:border-gray-800">
                {/* Hour lines */}
                {hours.map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-full border-t border-gray-100 dark:border-gray-800"
                    style={{ top: `${i * 60}px`, height: "60px" }}
                  />
                ))}

                {/* Current time line */}
                {today && (
                  <div
                    className="absolute w-full z-10 pointer-events-none"
                    style={{ top: `${(nowPercent / 100) * 24 * 60}px` }}
                  >
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-red-500 -ml-1" />
                      <div className="flex-1 h-0.5 bg-red-500" />
                    </div>
                  </div>
                )}

                {/* Events */}
                {(() => {
                  const layoutMap = computeCardStackLayout(dayEvents);
                  return dayEvents.map((event) => {
                    const top = (getEventTopPercent(event.startTime) / 100) * 24 * 60;
                    const height = Math.max(
                      (getEventHeightPercent(event.startTime, event.endTime) / 100) * 24 * 60,
                      20
                    );
                    const layout = layoutMap.get(event.id);
                    const stackIndex = layout?.stackIndex ?? 0;
                    const leftOffset = 2 + stackIndex * 20;

                    return (
                      <div
                        key={event.id}
                        className="absolute right-0.5"
                        style={{
                          top: `${top}px`,
                          height: `${height}px`,
                          left: `${leftOffset}px`,
                          zIndex: 5 + stackIndex,
                        }}
                      >
                        <EventBlock
                          event={event}
                          onClick={onEventClick}
                          compact={height < 40}
                          style={{ height: "100%" }}
                        />
                      </div>
                    );
                  });
                })()}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
