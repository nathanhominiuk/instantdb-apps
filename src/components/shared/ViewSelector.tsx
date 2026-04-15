import type { ViewType } from "../../types";

const views: { key: ViewType; label: string }[] = [
  { key: "agenda", label: "Agenda" },
  { key: "day", label: "Day" },
  { key: "week", label: "Week" },
  { key: "fortnight", label: "2 Weeks" },
  { key: "month", label: "Month" },
  { key: "quarter", label: "Quarter" },
  { key: "year", label: "Year" },
];

interface ViewSelectorProps {
  current: ViewType;
  onChange: (view: ViewType) => void;
}

export default function ViewSelector({ current, onChange }: ViewSelectorProps) {
  return (
    <div className="flex gap-1 bg-gray-100 rounded-lg p-1" data-testid="view-selector">
      {views.map((v) => (
        <button
          key={v.key}
          onClick={() => onChange(v.key)}
          data-testid={`view-${v.key}`}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            current === v.key
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {v.label}
        </button>
      ))}
    </div>
  );
}
