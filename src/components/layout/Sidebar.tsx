import { useState } from "react";
import PersonBadge from "../shared/PersonBadge";
import CalendarToggle from "../shared/CalendarToggle";
import FreeTimePanel from "../shared/FreeTimePanel";
import type { Person, CalendarEvent } from "../../types";
import { seedDatabase, clearDatabase } from "../../utils/seedData";

interface SidebarProps {
  people: Person[];
  visibleEvents: CalendarEvent[];
  rangeStartUTC: number;
  rangeEndUTC: number;
}

export default function Sidebar({
  people,
  visibleEvents,
  rangeStartUTC,
  rangeEndUTC,
}: SidebarProps) {
  const [seeding, setSeeding] = useState(false);
  const [clearing, setClearing] = useState(false);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await seedDatabase();
    } finally {
      setSeeding(false);
    }
  };

  const handleClear = async () => {
    setClearing(true);
    try {
      await clearDatabase();
    } finally {
      setClearing(false);
    }
  };

  return (
    <aside className="w-64 border-r border-gray-200 bg-gray-50/50 flex flex-col overflow-y-auto flex-shrink-0">
      {/* Seed / Clear buttons */}
      <div className="p-3 border-b border-gray-200 flex gap-2">
        <button
          onClick={handleSeed}
          disabled={seeding}
          data-testid="seed-button"
          className="flex-1 px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {seeding ? "Seeding..." : "Seed Data"}
        </button>
        <button
          onClick={handleClear}
          disabled={clearing}
          data-testid="clear-button"
          className="flex-1 px-3 py-1.5 text-xs font-medium border border-gray-300 text-gray-600 rounded-md hover:bg-gray-100 disabled:opacity-50 transition-colors"
        >
          {clearing ? "Clearing..." : "Clear All"}
        </button>
      </div>

      {/* Calendars by person */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Calendars
          </h3>
          {people.length === 0 ? (
            <p className="text-sm text-gray-400 italic">
              No calendars yet. Click "Seed Data" to add sample data.
            </p>
          ) : (
            <div className="space-y-3">
              {people.map((person) => (
                <div key={person.id}>
                  <PersonBadge name={person.name} color={person.color} />
                  <div className="ml-2 mt-1 space-y-0.5">
                    {person.calendars?.map((cal) => (
                      <CalendarToggle
                        key={cal.id}
                        id={cal.id}
                        name={cal.name}
                        color={cal.color}
                        visible={cal.visible}
                        ownerName={person.name}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Free time section */}
        <div className="p-3 border-t border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Free Time Windows
          </h3>
          <p className="text-xs text-gray-400 mb-2">
            Times when all visible calendars are free (8 AM - 8 PM PT)
          </p>
          <FreeTimePanel
            events={visibleEvents}
            rangeStartUTC={rangeStartUTC}
            rangeEndUTC={rangeEndUTC}
          />
        </div>
      </div>
    </aside>
  );
}
