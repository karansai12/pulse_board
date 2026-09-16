"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import { setSelectedCategory } from "@/lib/store/filterSlice";
import { useMemo } from "react";
import { aggregateVisitsByHour } from "@/lib/chartUtils";
import VisitsChart from "@/components/visitChart";

const GET_DASHBOARD_DATA = gql`
  query GetDashBoardData($category: String) {
    stats(category: $category) {
      totalVisits
      visitsByCategory {
        category
        count
      }
    }
    visits(category: $category) {
      id
      path
      category
      createdAt
    }
  }
`;

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

interface DashboardQueryVars {
  category?: string | null;
}

function formatTime(dateString: string) {
  const date = new Date(Number(dateString) || dateString);
  return isNaN(date.getTime())
    ? dateString
    : date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
}

export default function Home() {
  const dispatch = useAppDispatch()
  const selectedCategory  = useAppSelector((state)=>state.filters.selectedCategory)

  const { data, loading, error } = useQuery<DashboardQueryData, DashboardQueryVars>(
    GET_DASHBOARD_DATA,
    {
      variables: {
        category: selectedCategory === "all" ? undefined : selectedCategory,
      },
      pollInterval: 5000,
      notifyOnNetworkStatusChange: false,
      fetchPolicy: "cache-and-network",
    }
  );

  const categoryOptions = useMemo(() => {
    const defaultOption = [{ label: "All", value: "all" }];

    if (!data?.visits || data.visits.length === 0) {
      return defaultOption;
    }

    const uniqueCategories = Array.from(
      new Set(data.visits.map((v) => v.category).filter(Boolean))
    );

    const dynamicOptions = uniqueCategories.map((category) => ({
      label: category
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase()),
      value: category,
    }));

    return [...defaultOption, ...dynamicOptions];
  }, [data?.visits]);

  const chartData = useMemo(()=>{
    return aggregateVisitsByHour(data?.visits || [])
  },[data?.visits])

  const recentVisits = data?.visits
    ? [...data.visits]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10)
    : [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
      {/* Header */}
      <header className="flex flex-col justify-between sm:flex-row gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold ">Pulse Board</h1>
          <h3 className="text-xs">Live website traffic overview and analytics</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-medium ">Auto refreshing (5s)</span>
        </div>
      </header>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 border border-red-200 text-sm text-red-700">
          Failed to fetch analytics: {error.message}
        </div>
      )}

      {/* category dropdown */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs w-fit">
        <label
          htmlFor="category-select"
          className="text-xs font-semibold text-slate-600 uppercase tracking-wider"
        >
          Category:
        </label>
        <select
          id="category-select"
          value={selectedCategory}
          onChange={(e) => dispatch(setSelectedCategory(e.target.value))}
          className="border border-slate-200 rounded px-3 py-1.5 bg-white text-slate-900"
        >
          {categoryOptions.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white text-slate-900">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Total Visits Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">
            {selectedCategory === "all" ? "Total Visits" : `${selectedCategory.replace("_", " ")} Visits`}
          </span>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight text-slate-900">
              {data?.stats?.totalVisits ?? 0}
            </span>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {selectedCategory === "all" ? "All Categories" : "Filtered"}
            </span>
          </div>
        </div>
      </div>
      {/* 5. Visits Over Time Chart (New) */}
      <VisitsChart data={chartData} category={selectedCategory} />

      {/* Unified Table Card */}
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

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase text-xs tracking-wider">
                <th className="py-3.5 px-4 sm:px-6 font-semibold">Path</th>
                <th className="py-3.5 px-4 sm:px-6 font-semibold">Category</th>
                <th className="py-3.5 px-4 sm:px-6 font-semibold text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
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
  );
}