import TimeGrid from "./TimeGrid";
import type { CalendarEvent } from "../../types";
import type { DateRange } from "../../utils/dateHelpers";
import { getDaysInRange } from "../../utils/dateHelpers";

interface WeekViewProps {
  range: DateRange;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

export default function WeekView({ range, events, onEventClick }: WeekViewProps) {
  const days = getDaysInRange(range);
  return (
    <div className="h-full" data-testid="week-view">
      <TimeGrid days={days} events={events} onEventClick={onEventClick} />
    </div>
  );
}
