export interface TimeBucketData {
    time: string; 
    timestamp: number;
    visits: number;
  }
  
  export function aggregateVisitsByHour(
    visits: Array<{ createdAt: string }>
  ): TimeBucketData[] {
    if (!visits || visits.length === 0) return [];
  
    const map = new Map<string, { timestamp: number; count: number }>();
  
    visits.forEach((visit) => {
      const rawTime = Number(visit.createdAt) || visit.createdAt;
      const date = new Date(rawTime);
      if (isNaN(date.getTime())) return;
  
      // Zero out seconds and ms to bucket per minute
      date.setSeconds(0, 0);
      const timeKey = date.toLocaleTimeString([], {
        hour: "numeric",
        hour12: true,
      });
  
      const existing = map.get(timeKey);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(timeKey, { timestamp: date.getTime(), count: 1 });
      }
    });
 
    return Array.from(map.entries())
      .map(([time, val]) => ({
        time,
        timestamp: val.timestamp,
        visits: val.count,
      }))
      .sort((a, b) => a.timestamp - b.timestamp)
  }