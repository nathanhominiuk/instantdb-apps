import { useState, useRef } from "react";
import { id } from "@instantdb/react";
import { useSettings, type CalendarFeed } from "../../contexts/SettingsContext";
import { CALENDAR_COLORS } from "../../utils/colors";
import { syncFeed, removeFeedData, updateFeedMetadata } from "../../utils/feedManager";

export default function CalendarFeedsSection() {
  const { settings, addFeed, removeFeed, updateFeed } = useSettings();
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [color, setColor] = useState(CALENDAR_COLORS[0]);
  const [syncing, setSyncing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");
  // Track which feeds are currently syncing (by feed ID)
  const syncingFeeds = useRef(new Set<string>());
  const [, forceUpdate] = useState(0);

  const handleAdd = async () => {
    const trimmedUrl = url.trim();
    const trimmedName = name.trim();
    if (!trimmedUrl || !trimmedName) return;

    const feedId = id();
    const newFeed: CalendarFeed = {
      id: feedId,
      name: trimmedName,
      url: trimmedUrl,
      color,
      addedAt: Date.now(),
    };

    // Add feed immediately so it appears in the list
    addFeed(newFeed);
    setName("");
    setUrl("");
    setColor(CALENDAR_COLORS[0]);

    // Sync in background
    setSyncing(true);
    syncingFeeds.current.add(feedId);
    forceUpdate((n) => n + 1);

    try {
      const result = await syncFeed(newFeed);
      updateFeed(feedId, {
        calendarId: result.calendarId,
        personId: result.personId,
        lastSyncedAt: Date.now(),
        syncError: undefined,
      });
    } catch (err: unknown) {
      updateFeed(feedId, {
        syncError: err instanceof Error ? err.message : "Failed to sync feed",
      });
    } finally {
      syncingFeeds.current.delete(feedId);
      setSyncing(false);
      forceUpdate((n) => n + 1);
    }
  };

  const handleRemove = async (feed: CalendarFeed) => {
    try {
      await removeFeedData(feed);
    } catch {
      // Best-effort cleanup; remove from localStorage regardless
    }
    removeFeed(feed.id);
  };

  const handleEditStart = (feed: CalendarFeed) => {
    setEditingId(feed.id);
    setEditName(feed.name);
    setEditColor(feed.color);
  };

  const handleEditSave = async (feed: CalendarFeed) => {
    const trimmedName = editName.trim();
    if (!trimmedName) return;

    const updates: { name?: string; color?: string } = {};
    if (trimmedName !== feed.name) updates.name = trimmedName;
    if (editColor !== feed.color) updates.color = editColor;

    if (Object.keys(updates).length > 0) {
      // Update InstantDB records
      try {
        await updateFeedMetadata(feed, updates);
      } catch {
        // Best-effort; update localStorage regardless
      }
      // Update localStorage
      updateFeed(feed.id, updates);
    }

    setEditingId(null);
  };

  const handleEditCancel = () => {
    setEditingId(null);
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
          disabled={!name.trim() || !url.trim() || syncing}
          data-testid="add-feed-button"
          className="w-full px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {syncing ? "Adding..." : "Add Feed"}
        </button>
      </div>

      {settings.calendarFeeds.length > 0 && (
        <div className="space-y-1.5">
          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Configured Feeds
          </h4>
          {settings.calendarFeeds.map((feed) => {
            const isEditing = editingId === feed.id;
            const isFeedSyncing = syncingFeeds.current.has(feed.id);

            return (
              <div
                key={feed.id}
                data-testid="feed-item"
                className="px-2 py-1.5 rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600"
              >
                {isEditing ? (
                  /* Edit mode */
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      data-testid="edit-feed-name-input"
                      className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-500 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100"
                    />
                    <div className="flex gap-1 flex-wrap">
                      {CALENDAR_COLORS.map((c) => (
                        <button
                          key={c}
                          onClick={() => setEditColor(c)}
                          className={`w-5 h-5 rounded-full border-2 transition-all ${
                            editColor === c ? "border-gray-900 dark:border-white scale-110" : "border-transparent"
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEditSave(feed)}
                        disabled={!editName.trim()}
                        data-testid="save-feed-button"
                        className="flex-1 px-2 py-1 text-xs font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleEditCancel}
                        data-testid="cancel-edit-button"
                        className="flex-1 px-2 py-1 text-xs font-medium border border-gray-300 dark:border-gray-500 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* View mode */
                  <>
                    <div className="flex items-center gap-2">
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
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {isFeedSyncing && (
                          <span className="text-[10px] text-indigo-500 dark:text-indigo-400 animate-pulse">
                            syncing...
                          </span>
                        )}
                        <button
                          onClick={() => handleEditStart(feed)}
                          data-testid="edit-feed-button"
                          className="text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                          title="Edit feed"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleRemove(feed)}
                          data-testid="remove-feed-button"
                          className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                          title="Remove feed"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    {/* Sync status */}
                    {feed.syncError && !isFeedSyncing && (
                      <div className="mt-1 text-[10px] text-red-500 dark:text-red-400 break-words">
                        Error: {feed.syncError}
                      </div>
                    )}
                    {feed.lastSyncedAt && !feed.syncError && !isFeedSyncing && (
                      <div className="mt-1 text-[10px] text-green-600 dark:text-green-400">
                        Synced
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
