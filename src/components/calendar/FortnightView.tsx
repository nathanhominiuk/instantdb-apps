import TimeGrid from "./TimeGrid";
import type { CalendarEvent } from "../../types";
import type { DateRange } from "../../utils/dateHelpers";
import { getDaysInRange } from "../../utils/dateHelpers";

interface FortnightViewProps {
  range: DateRange;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

export default function FortnightView({ range, events, onEventClick }: FortnightViewProps) {
  const days = getDaysInRange(range);
  return (
    <div className="h-full" data-testid="fortnight-view">
      <TimeGrid days={days} events={events} onEventClick={onEventClick} compact />
    </div>
  );
}
