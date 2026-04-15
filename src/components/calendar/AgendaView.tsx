import { useMemo } from "react";
import { format } from "../../utils/dateHelpers";
import { toPacific, formatInPacific } from "../../utils/timezone";
import { isToday } from "../../utils/dateHelpers";
import type { CalendarEvent } from "../../types";
import type { DateRange } from "../../utils/dateHelpers";
import { getDaysInRange } from "../../utils/dateHelpers";

interface AgendaViewProps {
  range: DateRange;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

export default function AgendaView({ range, events, onEventClick }: AgendaViewProps) {
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
    // Sort events within each day
    for (const [, dayEvents] of map) {
      dayEvents.sort((a, b) => {
        if (a.allDay && !b.allDay) return -1;
        if (!a.allDay && b.allDay) return 1;
        return a.startTime - b.startTime;
      });
    }
    return map;
  }, [days, events]);

  return (
    <div className="h-full overflow-y-auto p-4" data-testid="agenda-view">
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
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {format(day, "EEEE, MMMM d")}
              {today && " (Today)"}
            </div>

            {dayEvents.length === 0 ? (
              <div className="py-2 px-3 text-sm text-gray-400 italic">
                No events
              </div>
            ) : (
              <div className="space-y-1">
                {dayEvents.map((event) => {
                  const color = event.calendar?.color ?? "#6366F1";
                  return (
                    <button
                      key={event.id}
                      onClick={() => onEventClick(event)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                      data-testid="event-block"
                    >
                      <div
                        className="w-1 self-stretch rounded-full flex-shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <div className="min-w-[80px] flex-shrink-0">
                        <span className="text-xs text-gray-500">
                          {event.allDay
                            ? "All day"
                            : formatInPacific(event.startTime, "h:mm a")}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {event.title}
                        </div>
                        {event.location && (
                          <div className="text-xs text-gray-400 truncate">
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
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
