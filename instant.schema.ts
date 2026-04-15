import { i } from "@instantdb/react";

const _schema = i.schema({
  entities: {
    people: i.entity({
      name: i.string(),
      email: i.string().unique().indexed(),
      color: i.string(),
      createdAt: i.number().indexed(),
    }),
    calendars: i.entity({
      name: i.string(),
      color: i.string(),
      visible: i.boolean(),
      createdAt: i.number().indexed(),
    }),
    events: i.entity({
      title: i.string(),
      description: i.string().optional(),
      location: i.string().optional(),
      startTime: i.number().indexed(),
      endTime: i.number().indexed(),
      allDay: i.boolean(),
      createdAt: i.number().indexed(),
    }),
  },
  links: {
    calendarOwner: {
      forward: { on: "calendars", has: "one", label: "owner" },
      reverse: { on: "people", has: "many", label: "calendars" },
    },
    eventCalendar: {
      forward: { on: "events", has: "one", label: "calendar" },
      reverse: { on: "calendars", has: "many", label: "events" },
    },
  },
  rooms: {},
});

type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
