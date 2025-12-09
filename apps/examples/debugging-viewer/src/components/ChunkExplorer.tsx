'use client';
import { RetrievedChunk } from '@/types';
import { formatScore } from '@/lib/utils';
import { FileText } from 'lucide-react';

export default function ChunkExplorer({ chunks }: { chunks: RetrievedChunk[] }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Retrieved Chunks</h2>
      <div className="space-y-3">
        {chunks.map((chunk) => (
          <div key={chunk.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-semibold text-gray-900">{chunk.documentName}</span>
              </div>
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-mono font-semibold text-blue-700">
                {formatScore(chunk.score)}
              </span>
            </div>
            <p className="text-sm text-gray-700">{chunk.content.substring(0, 120)}...</p>
            <div className="mt-2 text-xs text-gray-500">
              Rank: {chunk.rank} {chunk.originalRank && `(was ${chunk.originalRank})`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
