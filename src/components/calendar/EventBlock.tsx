import { formatTime } from "../../utils/formatters";
import { useSettings } from "../../contexts/SettingsContext";
import type { CalendarEvent } from "../../types";

interface EventBlockProps {
  event: CalendarEvent;
  onClick: (event: CalendarEvent) => void;
  style?: React.CSSProperties;
  compact?: boolean;
}

export default function EventBlock({ event, onClick, style, compact }: EventBlockProps) {
  const { settings } = useSettings();
  const color = event.calendar?.color ?? "#6366F1";
  const timeStr = event.allDay
    ? "All day"
    : formatTime(event.startTime, settings.timeFormat);

  const bgOpacity = settings.theme === "dark" ? "30" : "18";
  return (
    <button
      onClick={() => onClick(event)}
      style={{
        backgroundColor: `${color}${bgOpacity}`,
        borderLeftColor: color,
        ...style,
      }}
      className="w-full text-left border-l-3 rounded-r-md px-2 py-1 hover:brightness-95 dark:hover:brightness-110 transition-all cursor-pointer overflow-hidden group"
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
