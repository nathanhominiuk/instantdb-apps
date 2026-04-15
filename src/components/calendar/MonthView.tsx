import MonthGrid from "./MonthGrid";
import type { CalendarEvent } from "../../types";
import type { DateRange } from "../../utils/dateHelpers";

interface MonthViewProps {
  range: DateRange;
  events: CalendarEvent[];
  currentDate: Date;
  onEventClick: (event: CalendarEvent) => void;
}

export default function MonthView({ events, currentDate, onEventClick }: MonthViewProps) {
  return (
    <div className="h-full" data-testid="month-view">
      <MonthGrid month={currentDate} events={events} onEventClick={onEventClick} />
    </div>
  );
}
