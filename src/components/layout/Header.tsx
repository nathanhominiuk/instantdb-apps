import ViewSelector from "../shared/ViewSelector";
import DateNavigator from "../shared/DateNavigator";
import type { ViewType } from "../../types";

interface HeaderProps {
  view: ViewType;
  onViewChange: (view: ViewType) => void;
  title: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export default function Header({
  view,
  onViewChange,
  title,
  onPrev,
  onNext,
  onToday,
}: HeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white px-4 py-3">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-900 whitespace-nowrap">
            Calendar Coordinator
          </h1>
          <DateNavigator
            title={title}
            onPrev={onPrev}
            onNext={onNext}
            onToday={onToday}
          />
        </div>
        <div className="flex items-center gap-3">
          <span
            className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded"
            data-testid="timezone-indicator"
          >
            All times in Pacific Time (PT)
          </span>
          <ViewSelector current={view} onChange={onViewChange} />
        </div>
      </div>
    </header>
  );
}
