import { useMemo } from "react";
import { findFreeWindows, formatFreeWindow } from "../../utils/freeTime";
import { useSettings } from "../../contexts/SettingsContext";
import type { CalendarEvent } from "../../types";

interface FreeTimePanelProps {
  events: CalendarEvent[];
  rangeStartUTC: number;
  rangeEndUTC: number;
}

export default function FreeTimePanel({
  events,
  rangeStartUTC,
  rangeEndUTC,
}: FreeTimePanelProps) {
  const { settings } = useSettings();
  const windows = useMemo(
    () => findFreeWindows(events, rangeStartUTC, rangeEndUTC),
    [events, rangeStartUTC, rangeEndUTC]
  );

  if (windows.length === 0) {
    return (
      <div className="p-3 text-sm text-gray-400 dark:text-gray-500 italic">
        No free windows found in this range.
      </div>
    );
  }

  return (
    <div className="space-y-1" data-testid="free-time-panel">
      {windows.slice(0, 10).map((w, i) => (
        <div
          key={i}
          className="px-3 py-2 rounded-md bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-800 text-xs text-green-800 dark:text-green-300"
          data-testid="free-time-slot"
        >
          <div className="font-medium">{formatFreeWindow(w, settings.timeFormat)}</div>
        </div>
      ))}
    </div>
  );
}
