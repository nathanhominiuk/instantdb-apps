import { useMemo } from "react";
import { getMonthsInRange, format } from "../../utils/dateHelpers";
import MonthGrid from "./MonthGrid";
import type { CalendarEvent } from "../../types";
import type { DateRange } from "../../utils/dateHelpers";

interface YearViewProps {
  range: DateRange;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

export default function YearView({ range, events, onEventClick }: YearViewProps) {
  const months = useMemo(() => getMonthsInRange(range), [range]);

  return (
    <div
      className="h-full grid grid-cols-4 gap-3 p-4 overflow-y-auto"
      data-testid="year-view"
    >
      {months.map((month) => (
        <div
          key={format(month, "yyyy-MM")}
          className="border border-gray-200 rounded-lg overflow-hidden"
        >
          <div className="bg-gray-50 px-2 py-1 border-b border-gray-200">
            <h3 className="text-xs font-semibold text-gray-600">
              {format(month, "MMM")}
            </h3>
          </div>
          <div className="h-44">
            <MonthGrid
              month={month}
              events={events}
              onEventClick={onEventClick}
              compact
            />
          </div>
        </div>
      ))}
    </div>
  );
}
