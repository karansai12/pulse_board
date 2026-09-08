"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useEffect } from "react";

const GET_VISITS = gql`
    query GetVisits {
    visits {
    id
    path
    category
    createdAt
    }
    }
`

interface Visit {
    id: string;
    path: string;
    category: string;
    createdAt: string;
}

interface VisitsQueryData {
    visits : Visit[]
}

export default function TestVisitPage() {
    const {data,loading,error} = useQuery<VisitsQueryData>(GET_VISITS,{
        pollInterval: 5000,
    });
    useEffect(() => {
        if(data?.visits) {
            console.log("✅ [Apollo Client] Fetched visits successfully:", data.visits)
        }
    }, [data])
return(
    <div>
        <h1>Visit Query Test</h1>
        {loading && <p className="text-slate-600 animate-pulse">Loading visits...</p>}
        {error && (
          <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded">
            Error: {error.message}
          </div>
        )}
        {data?.visits && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Live Visits ({data.visits.length})</h2>
            <ul className="divide-y divide-slate-100 border border-slate-100 rounded-md">
              {data.visits.map((visit) => (
                <li key={visit.id} className="p-3 flex justify-between items-center text-sm">
                  <span className="font-mono font-medium text-slate-800">{visit.path}</span>
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-semibold">
                    {visit.category}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
    </div>
)
}


