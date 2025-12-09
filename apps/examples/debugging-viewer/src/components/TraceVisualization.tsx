'use client';
import { RAGTrace } from '@/types';
import { formatLatency, formatCost } from '@/lib/utils';
import { Zap, Search, Sparkles, MessageSquare } from 'lucide-react';

export default function TraceVisualization({ trace }: { trace: RAGTrace }) {
  const embedStep = trace.steps.find(s => s.name === 'embedding');
  const searchStep = trace.steps.find(s => s.name === 'search');
  const rerankStep = trace.steps.find(s => s.name === 'rerank');
  const llmStep = trace.steps.find(s => s.name === 'llm');

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Trace Flow</h2>
      <div className="flex items-center justify-between gap-4">
        {embedStep && (
          <div className="flex-1 rounded-lg bg-blue-50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-gray-900">Embed</span>
            </div>
            <div className="text-xs text-gray-600">
              {formatLatency(embedStep.latency)} • {formatCost(embedStep.cost)}
            </div>
          </div>
        )}
        {searchStep && (
          <div className="flex-1 rounded-lg bg-green-50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Search className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-gray-900">Search</span>
            </div>
            <div className="text-xs text-gray-600">
              {formatLatency(searchStep.latency)}
            </div>
          </div>
        )}
        {rerankStep && (
          <div className="flex-1 rounded-lg bg-purple-50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <span className="font-semibold text-gray-900">Rerank</span>
            </div>
            <div className="text-xs text-gray-600">
              {formatLatency(rerankStep.latency)} • {formatCost(rerankStep.cost)}
            </div>
          </div>
        )}
        {llmStep && (
          <div className="flex-1 rounded-lg bg-orange-50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-5 w-5 text-orange-600" />
              <span className="font-semibold text-gray-900">LLM</span>
            </div>
            <div className="text-xs text-gray-600">
              {formatLatency(llmStep.latency)} • {formatCost(llmStep.cost)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
