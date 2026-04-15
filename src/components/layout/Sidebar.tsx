import { useState } from "react";
import PersonBadge from "../shared/PersonBadge";
import CalendarToggle from "../shared/CalendarToggle";
import type { Person } from "../../types";
import { seedDatabase, clearDatabase } from "../../utils/seedData";

interface SidebarProps {
  people: Person[];
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({
  people,
  collapsed,
  onToggle,
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
    <aside
      className={`border-r border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex flex-col flex-shrink-0 transition-all duration-200 ${
        collapsed ? "w-10" : "w-64"
      }`}
    >
      {/* Toggle button */}
      <div className="p-1.5 border-b border-gray-200 dark:border-gray-700 flex justify-end">
        <button
          onClick={onToggle}
          data-testid="sidebar-toggle"
          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {collapsed ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            )}
          </svg>
        </button>
      </div>

      {!collapsed && (
        <>
          {/* Seed / Clear buttons */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex gap-2">
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
              className="flex-1 px-3 py-1.5 text-xs font-medium border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
            >
              {clearing ? "Clearing..." : "Clear All"}
            </button>
          </div>

          {/* Calendars by person */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-3">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Calendars
              </h3>
              {people.length === 0 ? (
                <p className="text-sm text-gray-400 dark:text-gray-500 italic">
                  No calendars yet. Click &quot;Seed Data&quot; to add sample data.
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
          </div>
        </>
      )}
    </aside>
  );
}
