import { useState } from "react";
import Modal from "./Modal";
import CalendarFeedsSection from "../settings/CalendarFeedsSection";
import DateTimeSection from "../settings/DateTimeSection";
import AppearanceSection from "../settings/AppearanceSection";

type Tab = "feeds" | "datetime" | "appearance";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

const TABS: { key: Tab; label: string }[] = [
  { key: "feeds", label: "Calendar Feeds" },
  { key: "datetime", label: "Date & Time" },
  { key: "appearance", label: "Appearance" },
];

export default function SettingsModal({ open, onClose }: SettingsModalProps) {
  const [tab, setTab] = useState<Tab>("feeds");

  return (
    <Modal open={open} onClose={onClose}>
      <div data-testid="settings-modal">
        <div className="px-5 pt-5 pb-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Settings
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex gap-1">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                data-testid={`settings-tab-${t.key}`}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  tab === t.key
                    ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5 min-h-[200px]">
          {tab === "feeds" && <CalendarFeedsSection />}
          {tab === "datetime" && <DateTimeSection />}
          {tab === "appearance" && <AppearanceSection />}
        </div>
      </div>
    </Modal>
  );
}
