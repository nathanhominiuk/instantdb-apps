import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { id } from "@instantdb/react";

export interface CalendarFeed {
  id: string;
  name: string;
  url: string;
  color: string;
  addedAt: number;
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
  addFeed: (feed: Omit<CalendarFeed, "id" | "addedAt">) => void;
  removeFeed: (id: string) => void;
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

  const addFeed = useCallback((feed: Omit<CalendarFeed, "id" | "addedAt">) => {
    setSettings((prev) => ({
      ...prev,
      calendarFeeds: [
        ...prev.calendarFeeds,
        { ...feed, id: id(), addedAt: Date.now() },
      ],
    }));
  }, []);

  const removeFeed = useCallback((id: string) => {
    setSettings((prev) => ({
      ...prev,
      calendarFeeds: prev.calendarFeeds.filter((f) => f.id !== id),
    }));
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, addFeed, removeFeed }}>
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
