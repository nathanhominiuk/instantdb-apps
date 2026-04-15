export type ViewType =
  | "agenda"
  | "day"
  | "week"
  | "fortnight"
  | "month"
  | "quarter"
  | "year";

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  location?: string;
  startTime: number;
  endTime: number;
  allDay: boolean;
  createdAt: number;
  calendar?: {
    id: string;
    name: string;
    color: string;
    visible: boolean;
    owner?: {
      id: string;
      name: string;
      color: string;
    };
  };
}

export interface Calendar {
  id: string;
  name: string;
  color: string;
  visible: boolean;
  createdAt: number;
  owner?: {
    id: string;
    name: string;
    email: string;
    color: string;
  };
  events?: CalendarEvent[];
}

export interface Person {
  id: string;
  name: string;
  email: string;
  color: string;
  createdAt: number;
  calendars?: Calendar[];
}

export interface FreeWindow {
  start: number;
  end: number;
  durationMinutes: number;
}
