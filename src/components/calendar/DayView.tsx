import TimeGrid from "./TimeGrid";
import type { CalendarEvent } from "../../types";
import type { DateRange } from "../../utils/dateHelpers";
import { getDaysInRange } from "../../utils/dateHelpers";

interface DayViewProps {
  range: DateRange;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

export default function DayView({ range, events, onEventClick }: DayViewProps) {
  const days = getDaysInRange({ start: range.start, end: range.start }); // single day
  return (
    <div className="h-full" data-testid="day-view">
      <TimeGrid days={days} events={events} onEventClick={onEventClick} />
    </div>
  );
}
