'use client';

import { useDebuggerStore } from '@/lib/store';
import { generateSampleMetrics } from '@/lib/sample-data';
import QueryInput from '@/components/QueryInput';
import TraceVisualization from '@/components/TraceVisualization';
import ChunkExplorer from '@/components/ChunkExplorer';
import MetricsDashboard from '@/components/MetricsDashboard';
import { Activity, GitBranch, History } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { currentTrace, traces } = useDebuggerStore();
  const metrics = generateSampleMetrics();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">RAG Debugger</h1>
                <p className="text-sm text-gray-600">Visualize retrieval paths and optimize performance</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <History className="h-4 w-4" />
                <span>{traces.length} trace{traces.length !== 1 ? 's' : ''}</span>
              </div>
              <Link
                href="/compare"
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50"
              >
                <GitBranch className="h-4 w-4" />
                Compare
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <QueryInput />
          {currentTrace ? (
            <>
              <TraceVisualization trace={currentTrace} />
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <ChunkExplorer chunks={currentTrace.chunks} />
                <MetricsDashboard metrics={metrics} />
              </div>
            </>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center">
              <Activity className="mx-auto mb-4 h-16 w-16 text-gray-400" />
              <h3 className="mb-2 text-xl font-semibold text-gray-900">No trace data yet</h3>
              <p className="text-gray-600">Enter a query above to start debugging your RAG pipeline.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
