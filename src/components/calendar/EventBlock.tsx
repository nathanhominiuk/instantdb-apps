import { formatInPacific } from "../../utils/timezone";
import type { CalendarEvent } from "../../types";

interface EventBlockProps {
  event: CalendarEvent;
  onClick: (event: CalendarEvent) => void;
  style?: React.CSSProperties;
  compact?: boolean;
}

export default function EventBlock({ event, onClick, style, compact }: EventBlockProps) {
  const color = event.calendar?.color ?? "#6366F1";
  const timeStr = event.allDay
    ? "All day"
    : `${formatInPacific(event.startTime, "h:mm a")}`;

  return (
    <button
      onClick={() => onClick(event)}
      style={{
        backgroundColor: `${color}18`,
        borderLeftColor: color,
        ...style,
      }}
      className="w-full text-left border-l-3 rounded-r-md px-2 py-1 hover:brightness-95 transition-all cursor-pointer overflow-hidden group"
      data-testid="event-block"
      title={event.title}
    >
      {compact ? (
        <span className="text-xs truncate block" style={{ color }}>
          {event.title}
        </span>
      ) : (
        <>
          <div className="text-xs font-medium truncate" style={{ color }}>
            {event.title}
          </div>
          <div className="text-[10px] text-gray-500 truncate">{timeStr}</div>
        </>
      )}
    </button>
  );
}
