import type { CalendarEvent } from "../types";

export interface LayoutInfo {
  stackIndex: number;
  stackSize: number;
}

function eventsOverlap(a: CalendarEvent, b: CalendarEvent): boolean {
  return a.startTime < b.endTime && b.startTime < a.endTime;
}

/**
 * Computes card-stack layout for overlapping events.
 * Events in the same overlap cluster get sequential stackIndex values
 * so they can be offset horizontally in the UI.
 */
export function computeCardStackLayout(
  events: CalendarEvent[]
): Map<string, LayoutInfo> {
  const result = new Map<string, LayoutInfo>();
  if (events.length === 0) return result;

  // Sort by start time, then by longer duration first
  const sorted = [...events].sort((a, b) => {
    if (a.startTime !== b.startTime) return a.startTime - b.startTime;
    return (b.endTime - b.startTime) - (a.endTime - a.startTime);
  });

  // Build adjacency list for overlap graph
  const adj = new Map<string, Set<string>>();
  for (const e of sorted) adj.set(e.id, new Set());

  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      if (sorted[j].startTime >= sorted[i].endTime) break;
      if (eventsOverlap(sorted[i], sorted[j])) {
        adj.get(sorted[i].id)!.add(sorted[j].id);
        adj.get(sorted[j].id)!.add(sorted[i].id);
      }
    }
  }

  // Find connected components via BFS
  const visited = new Set<string>();
  const clusters: CalendarEvent[][] = [];

  for (const event of sorted) {
    if (visited.has(event.id)) continue;
    const cluster: CalendarEvent[] = [];
    const queue = [event];
    visited.add(event.id);

    while (queue.length > 0) {
      const current = queue.shift()!;
      cluster.push(current);
      for (const neighborId of adj.get(current.id)!) {
        if (!visited.has(neighborId)) {
          visited.add(neighborId);
          const neighbor = sorted.find((e) => e.id === neighborId)!;
          queue.push(neighbor);
        }
      }
    }

    // Sort cluster by start time, then duration descending
    cluster.sort((a, b) => {
      if (a.startTime !== b.startTime) return a.startTime - b.startTime;
      return (b.endTime - b.startTime) - (a.endTime - a.startTime);
    });

    clusters.push(cluster);
  }

  // Assign stack indices within each cluster
  for (const cluster of clusters) {
    for (let i = 0; i < cluster.length; i++) {
      result.set(cluster[i].id, {
        stackIndex: i,
        stackSize: cluster.length,
      });
    }
  }

  return result;
}
