"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

// 1. Queries
const GET_DASHBOARD_DATA = gql`
  query GetDashboardData {
    stats {
      totalVisits
      visitsByCategory {
        category
        count
      }
    }
    visits {
      id
      path
      category
      createdAt
    }
  }
`;

// 2. TypeScript Interfaces
interface CategoryCount {
  category: string;
  count: number;
}

interface VisitStats {
  totalVisits: number;
  visitsByCategory: CategoryCount[];
}

interface Visit {
  id: string;
  path: string;
  category: string;
  createdAt: string;
}

interface DashboardQueryData {
  stats: VisitStats;
  visits: Visit[];
}

// 3. Helper for date formatting
function formatTime(dateString: string) {
  const date = new Date(Number(dateString) || dateString);
  return isNaN(date.getTime()) ? dateString : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export default function DashboardPage() {
  const { data, loading, error } = useQuery<DashboardQueryData>(GET_DASHBOARD_DATA, {
    pollInterval: 5000, // Keeps the metrics live as new visits stream in
  });

  // Take the 10 most recent visits (sorted latest first)
  const recentVisits = data?.visits
    ? [...data.visits]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10)
    : [];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Pulse Board
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Live website traffic overview and analytics
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-medium text-slate-600">Auto-refreshing (5s)</span>
          </div>
        </header>

        {/* Error State */}
        {error && (
          <div className="rounded-lg bg-red-50 p-4 border border-red-200 text-sm text-red-700">
            Failed to fetch analytics: {error.message}
          </div>
        )}

        {/* Metric Cards Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Total Visits Metric Card (Requirement) */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">
              Total Visits
            </span>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold tracking-tight text-slate-900">
                {loading && !data ? "..." : (data?.stats?.totalVisits ?? 0)}
              </span>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                All time
              </span>
            </div>
          </div>

          {/* Optional Category Quick Stats */}
          {data?.stats?.visitsByCategory?.slice(0, 2).map((item) => (
            <div key={item.category} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <span className="text-sm font-medium text-slate-500 uppercase tracking-wider capitalize">
                {item.category.replace("_", " ")}
              </span>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold tracking-tight text-slate-900">
                  {item.count}
                </span>
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  Events
                </span>
              </div>
            </div>
          ))}
        </section>

        {/* Recent Visits Table / List (Requirement) */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Recent Visits</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Showing the 10 most recent visitor events
              </p>
            </div>
            <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
              Top 10
            </span>
          </div>

          {/* Responsive Table Wrapper */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase text-xs tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6 font-semibold">Path</th>
                  <th className="py-3.5 px-4 sm:px-6 font-semibold">Category</th>
                  <th className="py-3.5 px-4 sm:px-6 font-semibold text-right">Time</th>
                </tr>
              </thead>
              <tbody>
                {loading && !data && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-slate-400">
                      Loading recent visits...
                    </td>
                  </tr>
                )}

                {!loading && recentVisits.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-slate-400">
                      No visits recorded yet.
                    </td>
                  </tr>
                )}

                {recentVisits.map((visit) => (
                  <tr key={visit.id} className="hover:bg-slate-50/75 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6 font-mono text-xs sm:text-sm font-medium text-slate-900 break-all">
                      {visit.path}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 capitalize">
                        {visit.category.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-right font-mono text-xs text-slate-500 whitespace-nowrap">
                      {formatTime(visit.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </main>
  );
}
