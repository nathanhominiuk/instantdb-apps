import { id } from "@instantdb/react";
import db from "../db";
import { CALENDAR_COLORS, PERSON_COLORS } from "./colors";
import { fromZonedTime } from "date-fns-tz";
import { PACIFIC_TZ } from "./timezone";
import { addDays, startOfWeek, addHours, setHours, setMinutes } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export async function seedDatabase() {
  const now = new Date();
  const pacific = toZonedTime(now, PACIFIC_TZ);

  // People
  const aliceId = id();
  const bobId = id();
  const carolId = id();
  const daveId = id();

  // Calendars
  const aliceWorkId = id();
  const alicePersonalId = id();
  const bobWorkId = id();
  const bobPersonalId = id();
  const carolWorkId = id();
  const carolSideId = id();
  const daveWorkId = id();
  const davePersonalId = id();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const txs: any[] = [
    // Create people
    db.tx.people[aliceId].update({
      name: "Alice Chen",
      email: "alice@example.com",
      color: PERSON_COLORS[0],
      createdAt: Date.now(),
    }),
    db.tx.people[bobId].update({
      name: "Bob Martinez",
      email: "bob@example.com",
      color: PERSON_COLORS[1],
      createdAt: Date.now(),
    }),
    db.tx.people[carolId].update({
      name: "Carol Williams",
      email: "carol@example.com",
      color: PERSON_COLORS[2],
      createdAt: Date.now(),
    }),
    db.tx.people[daveId].update({
      name: "Dave Kim",
      email: "dave@example.com",
      color: PERSON_COLORS[3],
      createdAt: Date.now(),
    }),

    // Create calendars + link to owners
    db.tx.calendars[aliceWorkId]
      .update({ name: "Work", color: CALENDAR_COLORS[0], visible: true, createdAt: Date.now() })
      .link({ owner: aliceId }),
    db.tx.calendars[alicePersonalId]
      .update({ name: "Personal", color: CALENDAR_COLORS[1], visible: true, createdAt: Date.now() })
      .link({ owner: aliceId }),
    db.tx.calendars[bobWorkId]
      .update({ name: "Work", color: CALENDAR_COLORS[2], visible: true, createdAt: Date.now() })
      .link({ owner: bobId }),
    db.tx.calendars[bobPersonalId]
      .update({ name: "Personal", color: CALENDAR_COLORS[3], visible: true, createdAt: Date.now() })
      .link({ owner: bobId }),
    db.tx.calendars[carolWorkId]
      .update({ name: "Work", color: CALENDAR_COLORS[4], visible: true, createdAt: Date.now() })
      .link({ owner: carolId }),
    db.tx.calendars[carolSideId]
      .update({ name: "Side Project", color: CALENDAR_COLORS[5], visible: true, createdAt: Date.now() })
      .link({ owner: carolId }),
    db.tx.calendars[daveWorkId]
      .update({ name: "Work", color: CALENDAR_COLORS[6], visible: true, createdAt: Date.now() })
      .link({ owner: daveId }),
    db.tx.calendars[davePersonalId]
      .update({ name: "Personal", color: CALENDAR_COLORS[7], visible: true, createdAt: Date.now() })
      .link({ owner: daveId }),
  ];

  // Generate events
  const weekStart = startOfWeek(pacific, { weekStartsOn: 0 });

  interface EventDef {
    title: string;
    calId: string;
    dayOffset: number;
    startHour: number;
    durationHours: number;
    description?: string;
    location?: string;
    allDay?: boolean;
  }

  const eventDefs: EventDef[] = [
    // Alice Work
    { title: "Team Standup", calId: aliceWorkId, dayOffset: 1, startHour: 9, durationHours: 0.5, location: "Zoom" },
    { title: "Team Standup", calId: aliceWorkId, dayOffset: 2, startHour: 9, durationHours: 0.5, location: "Zoom" },
    { title: "Team Standup", calId: aliceWorkId, dayOffset: 3, startHour: 9, durationHours: 0.5, location: "Zoom" },
    { title: "Team Standup", calId: aliceWorkId, dayOffset: 4, startHour: 9, durationHours: 0.5, location: "Zoom" },
    { title: "Team Standup", calId: aliceWorkId, dayOffset: 5, startHour: 9, durationHours: 0.5, location: "Zoom" },
    { title: "Sprint Planning", calId: aliceWorkId, dayOffset: 1, startHour: 10, durationHours: 2, description: "Q2 sprint planning session", location: "Conf Room A" },
    { title: "1:1 with Manager", calId: aliceWorkId, dayOffset: 3, startHour: 14, durationHours: 1, location: "Zoom" },
    { title: "Code Review", calId: aliceWorkId, dayOffset: 2, startHour: 13, durationHours: 1.5, description: "Review PR #342" },
    { title: "Design Review", calId: aliceWorkId, dayOffset: 4, startHour: 11, durationHours: 1, location: "Conf Room B" },
    { title: "All Hands", calId: aliceWorkId, dayOffset: 5, startHour: 15, durationHours: 1, location: "Auditorium" },

    // Alice Personal
    { title: "Yoga Class", calId: alicePersonalId, dayOffset: 1, startHour: 7, durationHours: 1, location: "Downtown Yoga" },
    { title: "Yoga Class", calId: alicePersonalId, dayOffset: 3, startHour: 7, durationHours: 1, location: "Downtown Yoga" },
    { title: "Dentist", calId: alicePersonalId, dayOffset: 4, startHour: 16, durationHours: 1, location: "Dr. Smith's Office" },
    { title: "Book Club", calId: alicePersonalId, dayOffset: 6, startHour: 14, durationHours: 2, description: "Discussing: Project Hail Mary" },

    // Bob Work
    { title: "Client Call", calId: bobWorkId, dayOffset: 1, startHour: 10, durationHours: 1, location: "Zoom", description: "Acme Corp quarterly review" },
    { title: "Budget Review", calId: bobWorkId, dayOffset: 2, startHour: 10, durationHours: 2, location: "Finance Room" },
    { title: "Team Lunch", calId: bobWorkId, dayOffset: 2, startHour: 12, durationHours: 1, location: "Cafe Blue" },
    { title: "Project Sync", calId: bobWorkId, dayOffset: 3, startHour: 11, durationHours: 1, location: "Zoom" },
    { title: "Strategy Meeting", calId: bobWorkId, dayOffset: 4, startHour: 9, durationHours: 2, description: "H2 planning" },
    { title: "Client Demo", calId: bobWorkId, dayOffset: 5, startHour: 13, durationHours: 1.5, location: "Zoom" },

    // Bob Personal
    { title: "Gym", calId: bobPersonalId, dayOffset: 1, startHour: 6, durationHours: 1.5, location: "FitLife Gym" },
    { title: "Gym", calId: bobPersonalId, dayOffset: 3, startHour: 6, durationHours: 1.5, location: "FitLife Gym" },
    { title: "Gym", calId: bobPersonalId, dayOffset: 5, startHour: 6, durationHours: 1.5, location: "FitLife Gym" },
    { title: "Date Night", calId: bobPersonalId, dayOffset: 6, startHour: 19, durationHours: 3, location: "La Maison" },

    // Carol Work
    { title: "Standup", calId: carolWorkId, dayOffset: 1, startHour: 9, durationHours: 0.25 },
    { title: "Standup", calId: carolWorkId, dayOffset: 2, startHour: 9, durationHours: 0.25 },
    { title: "Standup", calId: carolWorkId, dayOffset: 3, startHour: 9, durationHours: 0.25 },
    { title: "Standup", calId: carolWorkId, dayOffset: 4, startHour: 9, durationHours: 0.25 },
    { title: "Standup", calId: carolWorkId, dayOffset: 5, startHour: 9, durationHours: 0.25 },
    { title: "Product Roadmap", calId: carolWorkId, dayOffset: 1, startHour: 13, durationHours: 2, location: "Conf Room C" },
    { title: "User Research", calId: carolWorkId, dayOffset: 3, startHour: 10, durationHours: 1.5, description: "Usability testing session" },
    { title: "Cross-team Sync", calId: carolWorkId, dayOffset: 4, startHour: 14, durationHours: 1 },

    // Carol Side Project
    { title: "Podcast Recording", calId: carolSideId, dayOffset: 2, startHour: 18, durationHours: 2, location: "Home Studio", description: "Episode 15: Building in public" },
    { title: "Newsletter Writing", calId: carolSideId, dayOffset: 4, startHour: 17, durationHours: 1.5 },
    { title: "Community Call", calId: carolSideId, dayOffset: 6, startHour: 11, durationHours: 1, location: "Discord" },

    // Dave Work
    { title: "Architecture Review", calId: daveWorkId, dayOffset: 1, startHour: 11, durationHours: 1.5, description: "Microservices migration plan" },
    { title: "Interview Panel", calId: daveWorkId, dayOffset: 2, startHour: 14, durationHours: 1, description: "Senior Engineer candidate" },
    { title: "Tech Talk", calId: daveWorkId, dayOffset: 3, startHour: 15, durationHours: 1, location: "Auditorium", description: "Intro to WebAssembly" },
    { title: "Release Planning", calId: daveWorkId, dayOffset: 4, startHour: 10, durationHours: 1.5 },
    { title: "Incident Review", calId: daveWorkId, dayOffset: 5, startHour: 11, durationHours: 1, description: "Post-mortem: April outage" },

    // Dave Personal
    { title: "Guitar Lesson", calId: davePersonalId, dayOffset: 2, startHour: 17, durationHours: 1, location: "Music Academy" },
    { title: "Soccer", calId: davePersonalId, dayOffset: 0, startHour: 10, durationHours: 2, location: "City Park" },
    { title: "Family Dinner", calId: davePersonalId, dayOffset: 0, startHour: 18, durationHours: 2 },
  ];

  // Also add some events for next week
  const nextWeekDefs: EventDef[] = [
    { title: "Quarterly Review", calId: aliceWorkId, dayOffset: 8, startHour: 10, durationHours: 3, location: "Main Conf Room", description: "Q1 review and Q2 goals" },
    { title: "Team Offsite", calId: bobWorkId, dayOffset: 9, startHour: 9, durationHours: 8, location: "Mountain View", allDay: true },
    { title: "Hackathon", calId: carolWorkId, dayOffset: 10, startHour: 9, durationHours: 8, description: "Spring hackathon", allDay: true },
    { title: "Hackathon", calId: carolWorkId, dayOffset: 11, startHour: 9, durationHours: 8, description: "Spring hackathon day 2", allDay: true },
    { title: "Dentist", calId: davePersonalId, dayOffset: 8, startHour: 14, durationHours: 1, location: "Dr. Lee's Office" },
  ];

  const allDefs = [...eventDefs, ...nextWeekDefs];

  for (const def of allDefs) {
    const eventDay = addDays(weekStart, def.dayOffset);
    const startDate = setMinutes(setHours(eventDay, def.startHour), (def.startHour % 1) * 60);
    const endDate = addHours(startDate, def.durationHours);

    const startTimeUTC = fromZonedTime(startDate, PACIFIC_TZ).getTime();
    const endTimeUTC = fromZonedTime(endDate, PACIFIC_TZ).getTime();

    const eventId = id();
    txs.push(
      db.tx.events[eventId]
        .update({
          title: def.title,
          description: def.description ?? "",
          location: def.location ?? "",
          startTime: startTimeUTC,
          endTime: endTimeUTC,
          allDay: def.allDay ?? false,
          createdAt: Date.now(),
        })
        .link({ calendar: def.calId })
    );
  }

  // Batch transact (InstantDB handles batching)
  await db.transact(txs);
}

export async function clearDatabase() {
  const result = await db.queryOnce({
    people: {},
    calendars: {},
    events: {},
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const txs: any[] = [
    ...result.data.events.map((e) => db.tx.events[e.id].delete()),
    ...result.data.calendars.map((c) => db.tx.calendars[c.id].delete()),
    ...result.data.people.map((p) => db.tx.people[p.id].delete()),
  ];

  if (txs.length > 0) {
    await db.transact(txs);
  }
}
