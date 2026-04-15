import type { ViewType, CalendarEvent } from "../../types";
import type { DateRange } from "../../utils/dateHelpers";
import AgendaView from "./AgendaView";
import DayView from "./DayView";
import WeekView from "./WeekView";
import FortnightView from "./FortnightView";
import MonthView from "./MonthView";
import QuarterView from "./QuarterView";
import YearView from "./YearView";

interface CalendarViewProps {
  view: ViewType;
  range: DateRange;
  events: CalendarEvent[];
  currentDate: Date;
  onEventClick: (event: CalendarEvent) => void;
}

export default function CalendarView({
  view,
  range,
  events,
  currentDate,
  onEventClick,
}: CalendarViewProps) {
  switch (view) {
    case "agenda":
      return <AgendaView range={range} events={events} onEventClick={onEventClick} />;
    case "day":
      return <DayView range={range} events={events} onEventClick={onEventClick} />;
    case "week":
      return <WeekView range={range} events={events} onEventClick={onEventClick} />;
    case "fortnight":
      return <FortnightView range={range} events={events} onEventClick={onEventClick} />;
    case "month":
      return <MonthView range={range} events={events} currentDate={currentDate} onEventClick={onEventClick} />;
    case "quarter":
      return <QuarterView range={range} events={events} onEventClick={onEventClick} />;
    case "year":
      return <YearView range={range} events={events} onEventClick={onEventClick} />;
  }
}
