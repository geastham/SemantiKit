'use client';
import { PerformanceMetrics } from '@/types';
import { formatLatency, formatCost } from '@/lib/utils';
import { BarChart3 } from 'lucide-react';

export default function MetricsDashboard({ metrics }: { metrics: PerformanceMetrics }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-gray-700" />
        <h2 className="text-lg font-semibold text-gray-900">Performance Metrics</h2>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-blue-50 p-4">
          <div className="text-xs text-gray-600">Total Latency</div>
          <div className="text-2xl font-bold text-blue-700">{formatLatency(metrics.latency.total)}</div>
        </div>
        <div className="rounded-lg bg-green-50 p-4">
          <div className="text-xs text-gray-600">Total Cost</div>
          <div className="text-2xl font-bold text-green-700">{formatCost(metrics.cost.total)}</div>
        </div>
        <div className="rounded-lg bg-purple-50 p-4">
          <div className="text-xs text-gray-600">Precision@K</div>
          <div className="text-2xl font-bold text-purple-700">
            {(metrics.quality.precisionAtK * 100).toFixed(0)}%
          </div>
        </div>
        <div className="rounded-lg bg-orange-50 p-4">
          <div className="text-xs text-gray-600">Documents</div>
          <div className="text-2xl font-bold text-orange-700">{metrics.coverage.uniqueDocuments}</div>
        </div>
      </div>
    </div>
  );
}
