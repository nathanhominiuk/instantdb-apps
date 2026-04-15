import { useMemo, useState } from "react";
import { format } from "../../utils/dateHelpers";
import { toPacific } from "../../utils/timezone";
import { isToday } from "../../utils/dateHelpers";
import { formatTime } from "../../utils/formatters";
import { useSettings } from "../../contexts/SettingsContext";
import type { CalendarEvent } from "../../types";
import type { DateRange } from "../../utils/dateHelpers";
import { getDaysInRange } from "../../utils/dateHelpers";

interface AgendaViewProps {
  range: DateRange;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

export default function AgendaView({ range, events, onEventClick }: AgendaViewProps) {
  const { settings } = useSettings();
  const [groupByCalendar, setGroupByCalendar] = useState(false);
  const days = getDaysInRange(range);

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
    for (const [, dayEvents] of map) {
      dayEvents.sort((a, b) => {
        if (a.allDay && !b.allDay) return -1;
        if (!a.allDay && b.allDay) return 1;
        return a.startTime - b.startTime;
      });
    }
    return map;
  }, [days, events]);

  // Group events by calendar for multi-column mode
  const calendarColumns = useMemo(() => {
    const map = new Map<string, { id: string; name: string; color: string; ownerName?: string; events: CalendarEvent[] }>();
    for (const event of events) {
      const calId = event.calendar?.id ?? "unknown";
      if (!map.has(calId)) {
        map.set(calId, {
          id: calId,
          name: event.calendar?.name ?? "Unknown",
          color: event.calendar?.color ?? "#6366F1",
          ownerName: event.calendar?.owner?.name,
          events: [],
        });
      }
      map.get(calId)!.events.push(event);
    }
    // Sort events within each calendar by time
    for (const [, col] of map) {
      col.events.sort((a, b) => {
        if (a.allDay && !b.allDay) return -1;
        if (!a.allDay && b.allDay) return 1;
        return a.startTime - b.startTime;
      });
    }
    return Array.from(map.values());
  }, [events]);

  const renderEventRow = (event: CalendarEvent) => {
    const color = event.calendar?.color ?? "#6366F1";
    return (
      <button
        key={event.id}
        onClick={() => onEventClick(event)}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
        data-testid="event-block"
      >
        <div
          className="w-1 self-stretch rounded-full flex-shrink-0"
          style={{ backgroundColor: color }}
        />
        <div className="min-w-[80px] flex-shrink-0">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {event.allDay
              ? "All day"
              : formatTime(event.startTime, settings.timeFormat)}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
            {event.title}
          </div>
          {event.location && (
            <div className="text-xs text-gray-400 dark:text-gray-500 truncate">
              {event.location}
            </div>
          )}
        </div>
        <div className="flex-shrink-0">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>
      </button>
    );
  };

  return (
    <div className="h-full flex flex-col" data-testid="agenda-view">
      {/* Mode toggle */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1 flex-shrink-0">
        <span className="text-sm text-gray-500 dark:text-gray-400">Agenda</span>
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
          <button
            onClick={() => setGroupByCalendar(false)}
            data-testid="agenda-list-mode"
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              !groupByCalendar
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            List
          </button>
          <button
            onClick={() => setGroupByCalendar(true)}
            data-testid="agenda-calendar-mode"
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              groupByCalendar
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            By Calendar
          </button>
        </div>
      </div>

      {groupByCalendar ? (
        /* Multi-column mode: one column per calendar */
        <div className="flex-1 flex gap-4 p-4 overflow-x-auto">
          {calendarColumns.map((col) => (
            <div key={col.id} className="flex-1 min-w-[250px] flex flex-col" data-testid="agenda-calendar-column">
              <div
                className="sticky top-0 z-10 py-2 px-3 rounded-lg mb-2 font-semibold text-sm"
                style={{
                  backgroundColor: `${col.color}20`,
                  borderLeft: `4px solid ${col.color}`,
                }}
              >
                <span className="text-gray-900 dark:text-gray-100">{col.name}</span>
                {col.ownerName && (
                  <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">
                    ({col.ownerName})
                  </span>
                )}
              </div>
              <div className="flex-1 overflow-y-auto">
                {days.map((day) => {
                  const key = format(day, "yyyy-MM-dd");
                  const today = isToday(day);
                  const dayEvents = col.events.filter(
                    (e) => format(toPacific(e.startTime), "yyyy-MM-dd") === key
                  );

                  if (dayEvents.length === 0) return null;

                  return (
                    <div key={key} className="mb-3">
                      <div
                        className={`py-1 px-2 text-xs font-medium rounded mb-1 ${
                          today
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {format(day, "EEE, MMM d")}
                        {today && " (Today)"}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.map(renderEventRow)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {calendarColumns.length === 0 && (
            <div className="flex-1 flex items-center justify-center text-sm text-gray-400 dark:text-gray-500 italic">
              No events to display
            </div>
          )}
        </div>
      ) : (
        /* List mode: all events grouped by day */
        <div className="flex-1 overflow-y-auto p-4">
          {days.map((day) => {
            const key = format(day, "yyyy-MM-dd");
            const dayEvents = eventsByDay.get(key) ?? [];
            const today = isToday(day);

            return (
              <div key={key} className="mb-4">
                <div
                  className={`sticky top-0 z-10 py-2 px-3 text-sm font-semibold rounded-lg mb-1 ${
                    today
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {format(day, "EEEE, MMMM d")}
                  {today && " (Today)"}
                </div>

                {dayEvents.length === 0 ? (
                  <div className="py-2 px-3 text-sm text-gray-400 dark:text-gray-500 italic">
                    No events
                  </div>
                ) : (
                  <div className="space-y-1">
                    {dayEvents.map(renderEventRow)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
