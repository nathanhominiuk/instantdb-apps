interface DateNavigatorProps {
  title: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export default function DateNavigator({
  title,
  onPrev,
  onNext,
  onToday,
}: DateNavigatorProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onToday}
        data-testid="nav-today"
        className="px-3 py-1.5 text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        Today
      </button>
      <button
        onClick={onPrev}
        data-testid="nav-prev"
        className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
        aria-label="Previous"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={onNext}
        data-testid="nav-next"
        className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
        aria-label="Next"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100" data-testid="nav-title">
        {title}
      </h2>
    </div>
  );
}
