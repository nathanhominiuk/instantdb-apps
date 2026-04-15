import { id } from "@instantdb/react";
import db from "../db";
import { parseICS } from "./icsParser";
import type { CalendarFeed } from "../contexts/SettingsContext";

export interface FeedSyncResult {
  personId: string;
  calendarId: string;
  eventCount: number;
}

/** Convert webcal:// protocol to https:// for fetching */
function normalizeUrl(url: string): string {
  if (url.startsWith("webcal://")) {
    return url.replace(/^webcal:\/\//, "https://");
  }
  return url;
}

const BATCH_SIZE = 100;

async function fetchICS(feedUrl: string): Promise<string> {
  const normalized = normalizeUrl(feedUrl);
  const proxyUrl = `/api/cors-proxy?url=${encodeURIComponent(normalized)}`;
  const response = await fetch(proxyUrl);

  if (!response.ok) {
    let message = `Failed to fetch feed (HTTP ${response.status})`;
    try {
      const body = await response.json();
      if (body.error) message = body.error;
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }

  const text = await response.text();
  if (!text.includes("BEGIN:VCALENDAR")) {
    throw new Error("Invalid calendar feed: response is not valid ICS data");
  }

  return text;
}

export async function syncFeed(feed: CalendarFeed): Promise<FeedSyncResult> {
  const icsText = await fetchICS(feed.url);
  const parsed = parseICS(icsText, feed.name);

  const personId = feed.personId || id();
  const calendarId = feed.calendarId || id();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const txs: any[] = [];

  // If re-syncing, delete existing events for this calendar first
  if (feed.calendarId) {
    const existing = await db.queryOnce({
      calendars: {
        $: { where: { id: feed.calendarId } },
        events: {},
      },
    });

    if (existing.data.calendars.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const evt of (existing.data.calendars[0] as any).events ?? []) {
        txs.push(db.tx.events[evt.id].delete());
      }
    }
  }

  // Create or update person
  txs.push(
    db.tx.people[personId].update({
      name: parsed.name || feed.name,
      email: `feed-${feed.id}@calendar-feeds.local`,
      color: feed.color,
      createdAt: Date.now(),
    })
  );

  // Create or update calendar linked to person
  txs.push(
    db.tx.calendars[calendarId]
      .update({
        name: parsed.name || feed.name,
        color: feed.color,
        visible: true,
        createdAt: Date.now(),
      })
      .link({ owner: personId })
  );

  // Transact person + calendar first (must exist before events can link)
  await db.transact(txs);

  // Create events linked to calendar in batches to avoid timeouts
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let eventBatch: any[] = [];
  for (const event of parsed.events) {
    const eventId = id();
    eventBatch.push(
      db.tx.events[eventId]
        .update({
          title: event.summary,
          description: event.description,
          location: event.location,
          startTime: event.startTime,
          endTime: event.endTime,
          allDay: event.allDay,
          createdAt: Date.now(),
        })
        .link({ calendar: calendarId })
    );

    if (eventBatch.length >= BATCH_SIZE) {
      await db.transact(eventBatch);
      eventBatch = [];
    }
  }
  if (eventBatch.length > 0) {
    await db.transact(eventBatch);
  }

  return { personId, calendarId, eventCount: parsed.events.length };
}

export async function removeFeedData(feed: CalendarFeed): Promise<void> {
  if (!feed.calendarId || !feed.personId) return;

  const result = await db.queryOnce({
    calendars: {
      $: { where: { id: feed.calendarId } },
      events: {},
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const txs: any[] = [];

  // Delete events first
  if (result.data.calendars.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const evt of (result.data.calendars[0] as any).events ?? []) {
      txs.push(db.tx.events[evt.id].delete());
    }
  }

  // Delete calendar and person
  txs.push(db.tx.calendars[feed.calendarId].delete());
  txs.push(db.tx.people[feed.personId].delete());

  if (txs.length > 0) {
    await db.transact(txs);
  }
}

export async function updateFeedMetadata(
  feed: CalendarFeed,
  updates: { name?: string; color?: string }
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const txs: any[] = [];

  if (feed.calendarId) {
    txs.push(db.tx.calendars[feed.calendarId].update(updates));
  }
  if (feed.personId && updates.color) {
    txs.push(db.tx.people[feed.personId].update({ color: updates.color }));
  }
  if (feed.personId && updates.name) {
    txs.push(db.tx.people[feed.personId].update({ name: updates.name }));
  }

  if (txs.length > 0) {
    await db.transact(txs);
  }
}
