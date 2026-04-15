import Modal from "../shared/Modal";
import { formatInPacific } from "../../utils/timezone";
import type { CalendarEvent } from "../../types";

interface EventDetailProps {
  event: CalendarEvent | null;
  onClose: () => void;
}

export default function EventDetail({ event, onClose }: EventDetailProps) {
  if (!event) return null;

  const color = event.calendar?.color ?? "#6366F1";
  const dateStr = formatInPacific(event.startTime, "EEEE, MMMM d, yyyy");
  const timeStr = event.allDay
    ? "All day"
    : `${formatInPacific(event.startTime, "h:mm a")} - ${formatInPacific(event.endTime, "h:mm a")} PT`;
  const ownerName = event.calendar?.owner?.name;
  const calendarName = event.calendar?.name;

  return (
    <Modal open={!!event} onClose={onClose}>
      <div data-testid="event-detail-modal">
        {/* Color bar */}
        <div className="h-2 rounded-t-xl" style={{ backgroundColor: color }} />

        <div className="p-5">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            {event.title}
          </h2>

          <div className="space-y-3 mt-4">
            {/* Date & time */}
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <div className="text-sm text-gray-900">{dateStr}</div>
                <div className="text-sm text-gray-500">{timeStr}</div>
              </div>
            </div>

            {/* Location */}
            {event.location && (
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm text-gray-700">{event.location}</span>
              </div>
            )}

            {/* Description */}
            {event.description && (
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                <span className="text-sm text-gray-700">{event.description}</span>
              </div>
            )}

            {/* Calendar info */}
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <span
                  className="inline-block w-2.5 h-2.5 rounded-sm mr-1.5"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm text-gray-700">
                  {calendarName}
                  {ownerName && <span className="text-gray-400"> ({ownerName})</span>}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
