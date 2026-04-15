import FreeTimePanel from "../shared/FreeTimePanel";
import type { CalendarEvent } from "../../types";

interface RightPanelProps {
  visibleEvents: CalendarEvent[];
  rangeStartUTC: number;
  rangeEndUTC: number;
  collapsed: boolean;
  onToggle: () => void;
}

export default function RightPanel({
  visibleEvents,
  rangeStartUTC,
  rangeEndUTC,
  collapsed,
  onToggle,
}: RightPanelProps) {
  return (
    <aside
      className={`border-l border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex flex-col flex-shrink-0 transition-all duration-200 ${
        collapsed ? "w-10" : "w-64"
      }`}
      data-testid="right-panel"
    >
      {/* Toggle button */}
      <div className="p-1.5 border-b border-gray-200 dark:border-gray-700 flex justify-start">
        <button
          onClick={onToggle}
          data-testid="right-panel-toggle"
          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded"
          title={collapsed ? "Expand panel" : "Collapse panel"}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {collapsed ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            )}
          </svg>
        </button>
      </div>

      {!collapsed && (
        <div className="flex-1 overflow-y-auto p-3">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Free Time Windows
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
            Times when all visible calendars are free (8 AM - 8 PM PT)
          </p>
          <FreeTimePanel
            events={visibleEvents}
            rangeStartUTC={rangeStartUTC}
            rangeEndUTC={rangeEndUTC}
          />
        </div>
      )}
    </aside>
  );
}
