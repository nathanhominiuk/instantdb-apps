import { useMemo } from "react";
import { getMonthsInRange, format } from "../../utils/dateHelpers";
import MonthGrid from "./MonthGrid";
import type { CalendarEvent } from "../../types";
import type { DateRange } from "../../utils/dateHelpers";

interface QuarterViewProps {
  range: DateRange;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

export default function QuarterView({ range, events, onEventClick }: QuarterViewProps) {
  const months = useMemo(() => getMonthsInRange(range), [range]);

  return (
    <div className="h-full grid grid-cols-3 gap-4 p-4 overflow-y-auto" data-testid="quarter-view">
      {months.map((month) => (
        <div key={format(month, "yyyy-MM")} className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-3 py-1.5 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700">
              {format(month, "MMMM yyyy")}
            </h3>
          </div>
          <div className="h-64">
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
