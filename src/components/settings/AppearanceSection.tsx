import { useSettings, type Settings } from "../../contexts/SettingsContext";

const THEMES: { value: Settings["theme"]; label: string; icon: string }[] = [
  { value: "light", label: "Light", icon: "sun" },
  { value: "dark", label: "Dark", icon: "moon" },
];

export default function AppearanceSection() {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
        Theme
      </h4>
      <div className="flex gap-3">
        {THEMES.map((t) => (
          <button
            key={t.value}
            onClick={() => updateSettings({ theme: t.value })}
            data-testid={`theme-${t.value}`}
            className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
              settings.theme === t.value
                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30"
                : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
            }`}
          >
            {t.icon === "sun" ? (
              <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            )}
            <span className={`text-sm font-medium ${
              settings.theme === t.value
                ? "text-indigo-700 dark:text-indigo-300"
                : "text-gray-600 dark:text-gray-400"
            }`}>
              {t.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
