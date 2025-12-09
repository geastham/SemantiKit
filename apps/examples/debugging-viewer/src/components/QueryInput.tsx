'use client';
import { useDebuggerStore } from '@/lib/store';
import { generateSampleTrace } from '@/lib/sample-data';
import { sampleQueries } from '@/lib/sample-data';
import { Play } from 'lucide-react';

export default function QueryInput() {
  const { query, setQuery, strategy, setCurrentTrace, addTrace } = useDebuggerStore();
  
  const handleAnalyze = () => {
    if (!query.trim()) return;
    const trace = generateSampleTrace(query);
    setCurrentTrace(trace);
    addTrace(trace);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <label className="mb-2 block text-sm font-medium text-gray-700">Query</label>
      <div className="flex gap-3">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter query..."
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
        <button
          onClick={handleAnalyze}
          disabled={!query.trim()}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Play className="h-4 w-4" />
          Analyze
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {sampleQueries.map((q, i) => (
          <button
            key={i}
            onClick={() => setQuery(q)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 transition-all hover:bg-gray-50"
          >
            {q}
          </button>
        ))}
      </div>
      <p className="mt-3 text-xs text-gray-500">
        Strategy: {strategy.name} • Top-K: {strategy.topK}
      </p>
    </div>
  );
}
