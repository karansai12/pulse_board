export interface TimeBucketData {
    time: string; // e.g. "10:14 AM"
    visits: number;
  }
  
  export function aggregateVisitsByMinute(
    visits: Array<{ createdAt: string }>
  ): TimeBucketData[] {
    if (!visits || visits.length === 0) return [];
  
    // 1. Group count by "HH:MM" (minute-level bucket)
    const map = new Map<string, { timestamp: number; count: number }>();
  
    visits.forEach((visit) => {
      const rawTime = Number(visit.createdAt) || visit.createdAt;
      const date = new Date(rawTime);
      if (isNaN(date.getTime())) return;
  
      // Zero out seconds and ms to bucket per minute
      date.setSeconds(0, 0);
      const timeKey = date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
  
      const existing = map.get(timeKey);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(timeKey, { timestamp: date.getTime(), count: 1 });
      }
    });
  
    // 2. Sort chronologically (oldest to newest for the X-axis)
    return Array.from(map.entries())
      .map(([time, val]) => ({
        time,
        timestamp: val.timestamp,
        visits: val.count,
      }))
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(-10) // Display the last 10 active minute buckets
      .map(({ time, visits }) => ({ time, visits }));
  }