'use client';

import { useState } from 'react';
import { useDebuggerStore } from '@/lib/store';
import { generateSampleTrace } from '@/lib/sample-data';
import { RetrievalStrategy, StrategyComparison } from '@/types';
import { formatLatency, formatCost, formatScore } from '@/lib/utils';
import { ArrowLeft, GitCompare, Play } from 'lucide-react';
import Link from 'next/link';

export default function ComparePage() {
  const { query, setQuery, addComparison, comparisons } = useDebuggerStore();
  const [isComparing, setIsComparing] = useState(false);

  const strategies: RetrievalStrategy[] = [
    { name: 'Vector Only', method: 'vector', topK: 5 },
    { name: 'Hybrid (α=0.7)', method: 'hybrid', topK: 10, alpha: 0.7 },
    { name: 'Keyword BM25', method: 'keyword', topK: 5 },
  ];

  const handleCompare = async () => {
    if (!query.trim()) return;
    setIsComparing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const comparison: StrategyComparison = {
      query,
      strategies: strategies.map((strategy) => {
        const trace = generateSampleTrace(query);
        return {
          strategy,
          results: trace.chunks,
          metrics: {
            latency: {
              embedding: 45 + Math.random() * 10,
              search: 90 + Math.random() * 20,
              rerank: 25 + Math.random() * 10,
              total: trace.totalLatency + (Math.random() - 0.5) * 200,
            },
            quality: {
              precisionAtK: 0.75 + Math.random() * 0.15,
              recallAtK: 0.6 + Math.random() * 0.15,
              rerankImprovement: 0.1 + Math.random() * 0.1,
              relevanceScore: 0.75 + Math.random() * 0.15,
            },
            cost: {
              embedding: 0.0001,
              search: 0,
              rerank: strategy.method === 'hybrid' ? 0.001 : 0,
              total: trace.totalCost + (Math.random() - 0.5) * 0.01,
            },
            coverage: {
              documentsRetrieved: 40 + Math.floor(Math.random() * 20),
              uniqueDocuments: 10 + Math.floor(Math.random() * 10),
              chunkDistribution: {},
            },
          },
        };
      }),
    };

    addComparison(comparison);
    setIsComparing(false);
  };

  const latestComparison = comparisons[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="rounded-lg p-2 hover:bg-gray-100">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <GitCompare className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Strategy Comparison</h1>
              <p className="text-sm text-gray-600">Compare different retrieval strategies side-by-side</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <label className="mb-2 block text-sm font-medium text-gray-700">Query</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter query to compare strategies..."
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm"
                disabled={isComparing}
              />
              <button
                onClick={handleCompare}
                disabled={!query.trim() || isComparing}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white"
              >
                <Play className="h-4 w-4" />
                {isComparing ? 'Comparing...' : 'Compare'}
              </button>
            </div>
          </div>

          {latestComparison && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Results for "{latestComparison.query}"</h2>
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-700">Strategy</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-700">Latency</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-700">Precision@K</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-700">Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {latestComparison.strategies.map(({ strategy, metrics }, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-semibold text-gray-900">{strategy.name}</td>
                        <td className="px-6 py-4 font-mono text-sm">{formatLatency(metrics.latency.total)}</td>
                        <td className="px-6 py-4 font-mono text-sm">
                          {(metrics.quality.precisionAtK * 100).toFixed(1)}%
                        </td>
                        <td className="px-6 py-4 font-mono text-sm">{formatCost(metrics.cost.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
