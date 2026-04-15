import { useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  getDaysInRange,
  isToday,
  isCurrentMonth,
} from "../../utils/dateHelpers";
import { endOfWeek } from "date-fns";
import { toPacific } from "../../utils/timezone";
import EventBlock from "./EventBlock";
import type { CalendarEvent } from "../../types";

interface MonthGridProps {
  month: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  compact?: boolean;
  maxEventsPerDay?: number;
}

export default function MonthGrid({
  month,
  events,
  onEventClick,
  compact,
  maxEventsPerDay = 3,
}: MonthGridProps) {
  const gridStart = startOfWeek(startOfMonth(month), { weekStartsOn: 0 });
  const gridEnd = endOfWeek(endOfMonth(month), { weekStartsOn: 0 });
  const days = getDaysInRange({ start: gridStart, end: gridEnd });

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const day of days) {
      map.set(format(day, "yyyy-MM-dd"), []);
    }
    for (const event of events) {
      const key = format(toPacific(event.startTime), "yyyy-MM-dd");
      if (map.has(key)) {
        map.get(key)!.push(event);
      }
    }
    return map;
  }, [days, events]);

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Split days into weeks
  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="flex flex-col h-full" data-testid="month-grid">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
        {weekdays.map((day) => (
          <div
            key={day}
            className="text-center py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400"
          >
            {compact ? day[0] : day}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="flex-1 grid" style={{ gridTemplateRows: `repeat(${weeks.length}, minmax(0, 1fr))` }}>
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 border-b border-gray-100 dark:border-gray-800 min-h-0">
            {week.map((day) => {
              const key = format(day, "yyyy-MM-dd");
              const dayEvents = eventsByDay.get(key) ?? [];
              const today = isToday(day);
              const inMonth = isCurrentMonth(day, month);
              const shown = dayEvents.slice(0, compact ? 0 : maxEventsPerDay);
              const more = dayEvents.length - shown.length;

              return (
                <div
                  key={key}
                  className={`border-l border-gray-100 dark:border-gray-800 first:border-l-0 p-0.5 min-h-0 overflow-hidden ${
                    !inMonth ? "bg-gray-50/50 dark:bg-gray-800/50" : ""
                  }`}
                >
                  <div className="flex justify-center mb-0.5">
                    <span
                      className={`text-xs leading-5 w-5 h-5 flex items-center justify-center rounded-full ${
                        today
                          ? "bg-blue-600 text-white font-semibold"
                          : inMonth
                            ? "text-gray-700 dark:text-gray-300"
                            : "text-gray-300 dark:text-gray-600"
                      }`}
                    >
                      {format(day, "d")}
                    </span>
                  </div>

                  {compact ? (
                    // Dot indicators for compact view
                    dayEvents.length > 0 && (
                      <div className="flex justify-center gap-0.5 flex-wrap">
                        {dayEvents.slice(0, 4).map((event) => (
                          <div
                            key={event.id}
                            className="w-1.5 h-1.5 rounded-full cursor-pointer"
                            style={{ backgroundColor: event.calendar?.color ?? "#6366F1" }}
                            title={event.title}
                            onClick={() => onEventClick(event)}
                          />
                        ))}
                      </div>
                    )
                  ) : (
                    <div className="space-y-0.5">
                      {shown.map((event) => (
                        <EventBlock
                          key={event.id}
                          event={event}
                          onClick={onEventClick}
                          compact
                        />
                      ))}
                      {more > 0 && (
                        <div className="text-[10px] text-gray-400 dark:text-gray-500 text-center">
                          +{more} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
