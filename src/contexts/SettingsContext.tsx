import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export interface CalendarFeed {
  id: string;
  name: string;
  url: string;
  color: string;
  addedAt: number;
  calendarId?: string;
  personId?: string;
  lastSyncedAt?: number;
  syncError?: string;
}

export interface Settings {
  calendarFeeds: CalendarFeed[];
  timeFormat: "12h" | "24h";
  dateFormat: "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD";
  theme: "light" | "dark";
  leftPanelCollapsed: boolean;
  rightPanelCollapsed: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  calendarFeeds: [],
  timeFormat: "12h",
  dateFormat: "MM/DD/YYYY",
  theme: "dark",
  leftPanelCollapsed: false,
  rightPanelCollapsed: false,
};

const STORAGE_KEY = "calendar-settings";

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch {
    // ignore parse errors
  }
  return DEFAULT_SETTINGS;
}

function saveSettings(settings: Settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

interface SettingsContextValue {
  settings: Settings;
  updateSettings: (partial: Partial<Settings>) => void;
  addFeed: (feed: CalendarFeed) => void;
  removeFeed: (id: string) => void;
  updateFeed: (id: string, updates: Partial<CalendarFeed>) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(loadSettings);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const updateSettings = useCallback((partial: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  const addFeed = useCallback((feed: CalendarFeed) => {
    setSettings((prev) => ({
      ...prev,
      calendarFeeds: [...prev.calendarFeeds, feed],
    }));
  }, []);

  const removeFeed = useCallback((feedId: string) => {
    setSettings((prev) => ({
      ...prev,
      calendarFeeds: prev.calendarFeeds.filter((f) => f.id !== feedId),
    }));
  }, []);

  const updateFeed = useCallback((feedId: string, updates: Partial<CalendarFeed>) => {
    setSettings((prev) => ({
      ...prev,
      calendarFeeds: prev.calendarFeeds.map((f) =>
        f.id === feedId ? { ...f, ...updates } : f
      ),
    }));
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, addFeed, removeFeed, updateFeed }}>
      {children}
    </SettingsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
