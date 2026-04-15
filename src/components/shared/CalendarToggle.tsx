import db from "../../db";

interface CalendarToggleProps {
  id: string;
  name: string;
  color: string;
  visible: boolean;
  ownerName?: string;
}

export default function CalendarToggle({
  id,
  name,
  color,
  visible,
  ownerName,
}: CalendarToggleProps) {
  const toggle = () => {
    db.transact(db.tx.calendars[id].update({ visible: !visible }));
  };

  return (
    <label
      className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer group"
      data-testid={`calendar-toggle-${id}`}
    >
      <input
        type="checkbox"
        checked={visible}
        onChange={toggle}
        className="sr-only"
      />
      <span
        className="w-3.5 h-3.5 rounded-sm border-2 flex items-center justify-center transition-colors flex-shrink-0"
        style={{
          borderColor: color,
          backgroundColor: visible ? color : "transparent",
        }}
      >
        {visible && (
          <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </span>
      <div className="min-w-0">
        <span className="text-sm text-gray-700 dark:text-gray-300 truncate block">{name}</span>
        {ownerName && (
          <span className="text-xs text-gray-400 dark:text-gray-500 truncate block">{ownerName}</span>
        )}
      </div>
    </label>
  );
}
