import { useSettings, type Settings } from "../../contexts/SettingsContext";
import { formatTime, formatDateByPreference } from "../../utils/formatters";

const TIME_FORMATS: { value: Settings["timeFormat"]; label: string }[] = [
  { value: "12h", label: "12-hour (3:30 PM)" },
  { value: "24h", label: "24-hour (15:30)" },
];

const DATE_FORMATS: { value: Settings["dateFormat"]; label: string }[] = [
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
];

// Fixed sample timestamp for preview (2024-04-15 15:30 UTC)
const PREVIEW_TIMESTAMP = 1713192600000;

export default function DateTimeSection() {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="space-y-5">
      {/* Time Format */}
      <div>
        <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
          Time Format
        </h4>
        <div className="space-y-1.5">
          {TIME_FORMATS.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name="timeFormat"
                value={opt.value}
                checked={settings.timeFormat === opt.value}
                onChange={() => updateSettings({ timeFormat: opt.value })}
                className="accent-indigo-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
        <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
          Preview: {formatTime(PREVIEW_TIMESTAMP, settings.timeFormat)}
        </div>
      </div>

      {/* Date Format */}
      <div>
        <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
          Date Format
        </h4>
        <div className="space-y-1.5">
          {DATE_FORMATS.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name="dateFormat"
                value={opt.value}
                checked={settings.dateFormat === opt.value}
                onChange={() => updateSettings({ dateFormat: opt.value })}
                className="accent-indigo-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
        <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
          Preview: {formatDateByPreference(new Date(PREVIEW_TIMESTAMP), settings.dateFormat)}
        </div>
      </div>
    </div>
  );
}
