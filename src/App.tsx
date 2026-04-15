import { useState, useMemo, useCallback, useEffect } from "react";
import db from "./db";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import RightPanel from "./components/layout/RightPanel";
import CalendarView from "./components/calendar/CalendarView";
import EventDetail from "./components/calendar/EventDetail";
import { useSettings } from "./contexts/SettingsContext";
import {
  getViewDateRange,
  getViewTitle,
  navigateDate,
  getDateRangeUTC,
} from "./utils/dateHelpers";
import type { ViewType, CalendarEvent, Person } from "./types";

export default function App() {
  const { settings, updateSettings } = useSettings();
  const [view, setView] = useState<ViewType>("week");
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Apply theme class to document
  useEffect(() => {
    if (settings.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings.theme]);

  // Query all data from InstantDB
  const { data } = db.useQuery({
    people: {
      calendars: {
        events: {},
      },
    },
  });

  // Compute date range for current view
  const range = useMemo(
    () => getViewDateRange(view, currentDate),
    [view, currentDate]
  );
  const { startUTC, endUTC } = useMemo(() => getDateRangeUTC(range), [range]);
  const title = useMemo(
    () => getViewTitle(view, currentDate),
    [view, currentDate]
  );

  // Flatten events from visible calendars
  const { visibleEvents, people } = useMemo(() => {
    if (!data?.people) return { visibleEvents: [] as CalendarEvent[], people: [] as Person[] };

    const allPeople = data.people as Person[];
    const events: CalendarEvent[] = [];

    for (const person of allPeople) {
      for (const calendar of person.calendars ?? []) {
        if (!calendar.visible) continue;
        for (const event of (calendar as any).events ?? []) {
          // Filter events in range
          if (event.startTime < endUTC && event.endTime > startUTC) {
            events.push({
              ...event,
              calendar: {
                id: calendar.id,
                name: calendar.name,
                color: calendar.color,
                visible: calendar.visible,
                owner: {
                  id: person.id,
                  name: person.name,
                  color: person.color,
                },
              },
            });
          }
        }
      }
    }

    events.sort((a, b) => a.startTime - b.startTime);
    return { visibleEvents: events, people: allPeople };
  }, [data, startUTC, endUTC]);

  // All visible events (not range-filtered) for free time calc
  const allVisibleEvents = useMemo(() => {
    if (!data?.people) return [] as CalendarEvent[];
    const events: CalendarEvent[] = [];
    for (const person of data.people as Person[]) {
      for (const calendar of person.calendars ?? []) {
        if (!calendar.visible) continue;
        for (const event of (calendar as any).events ?? []) {
          events.push({
            ...event,
            calendar: {
              id: calendar.id,
              name: calendar.name,
              color: calendar.color,
              visible: calendar.visible,
              owner: {
                id: person.id,
                name: person.name,
                color: person.color,
              },
            },
          });
        }
      }
    }
    return events;
  }, [data]);

  // Navigation
  const handlePrev = useCallback(
    () => setCurrentDate((d) => navigateDate(view, d, "prev")),
    [view]
  );
  const handleNext = useCallback(
    () => setCurrentDate((d) => navigateDate(view, d, "next")),
    [view]
  );
  const handleToday = useCallback(() => setCurrentDate(new Date()), []);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
        return;
      if (e.key === "ArrowLeft") handlePrev();
      else if (e.key === "ArrowRight") handleNext();
      else if (e.key === "t" || e.key === "T") handleToday();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handlePrev, handleNext, handleToday]);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      <Header
        view={view}
        onViewChange={setView}
        title={title}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
      />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          people={people}
          collapsed={settings.leftPanelCollapsed}
          onToggle={() => updateSettings({ leftPanelCollapsed: !settings.leftPanelCollapsed })}
        />
        <main className="flex-1 overflow-hidden">
          <CalendarView
            view={view}
            range={range}
            events={visibleEvents}
            currentDate={currentDate}
            onEventClick={setSelectedEvent}
          />
        </main>
        <RightPanel
          visibleEvents={allVisibleEvents}
          rangeStartUTC={startUTC}
          rangeEndUTC={endUTC}
          collapsed={settings.rightPanelCollapsed}
          onToggle={() => updateSettings({ rightPanelCollapsed: !settings.rightPanelCollapsed })}
        />
      </div>
      <EventDetail
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
}
