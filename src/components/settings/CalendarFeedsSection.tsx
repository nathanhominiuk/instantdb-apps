import { useState } from "react";
import { useSettings } from "../../contexts/SettingsContext";
import { CALENDAR_COLORS } from "../../utils/colors";

export default function CalendarFeedsSection() {
  const { settings, addFeed, removeFeed } = useSettings();
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [color, setColor] = useState(CALENDAR_COLORS[0]);

  const handleAdd = () => {
    const trimmedUrl = url.trim();
    const trimmedName = name.trim();
    if (!trimmedUrl || !trimmedName) return;
    addFeed({ name: trimmedName, url: trimmedUrl, color });
    setName("");
    setUrl("");
    setColor(CALENDAR_COLORS[0]);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
          Feed Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Work Calendar"
          data-testid="feed-name-input"
          className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
        />
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
          Feed URL (iCal/ICS)
        </label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://calendar.example.com/feed.ics"
          data-testid="feed-url-input"
          className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
        />
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
          Color
        </label>
        <div className="flex gap-1.5 flex-wrap">
          {CALENDAR_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-6 h-6 rounded-full border-2 transition-all ${
                color === c ? "border-gray-900 dark:border-white scale-110" : "border-transparent"
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <button
          onClick={handleAdd}
          disabled={!name.trim() || !url.trim()}
          data-testid="add-feed-button"
          className="w-full px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          Add Feed
        </button>
      </div>

      {settings.calendarFeeds.length > 0 && (
        <div className="space-y-1.5">
          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Configured Feeds
          </h4>
          {settings.calendarFeeds.map((feed) => (
            <div
              key={feed.id}
              data-testid="feed-item"
              className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600"
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: feed.color }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">
                  {feed.name}
                </div>
                <div className="text-[10px] text-gray-400 truncate">{feed.url}</div>
              </div>
              <button
                onClick={() => removeFeed(feed.id)}
                data-testid="remove-feed-button"
                className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
