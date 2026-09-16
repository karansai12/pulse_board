"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { TimeBucketData } from "@/lib/chartUtils";

interface VisitsChartProps {
  data: TimeBucketData[];
  category: string;
}

export default function VisitsChart({ data, category }: VisitsChartProps) {
  return (
    <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Visits Over Time
          </h2>
          <p className="text-xs text-slate-500">
            Activity bucketed by minute &bull;{" "}
            {category === "all" ? "All categories" : category.replace("_", " ")}
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600">
          Minuite Trend
        </span>
      </div>

      <div className="h-64 w-full">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-400">
            No trend data available yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="visitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f172a" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#0f172a" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#64748b" }}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#64748b" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "12px",
                  border: "none",
                }}
                labelStyle={{ color: "#94a3b8" }}
              />
              <Area
                type="monotone"
                dataKey="visits"
                stroke="#0f172a"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#visitGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}