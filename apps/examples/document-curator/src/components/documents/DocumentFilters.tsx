'use client';

import { useDocumentStore } from '@/lib/document-store';
import { DocumentStatus, DocumentFormat } from '@/types';
import { Search, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DocumentFilters() {
  const { 
    documentFilters, 
    setDocumentFilter, 
    resetFilters 
  } = useDocumentStore();

  const hasActiveFilters = 
    documentFilters.search ||
    documentFilters.status.length > 0 ||
    documentFilters.format.length > 0 ||
    documentFilters.tags.length > 0;

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search documents..."
          value={documentFilters.search}
          onChange={(e) => setDocumentFilter('search', e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Status Filter */}
      <div>
        <label className="text-sm font-medium mb-2 block">Status</label>
        <div className="flex flex-wrap gap-2">
          {Object.values(DocumentStatus).map((status) => {
            const isActive = documentFilters.status.includes(status);
            return (
              <button
                key={status}
                onClick={() => {
                  const newStatuses = isActive
                    ? documentFilters.status.filter((s) => s !== status)
                    : [...documentFilters.status, status];
                  setDocumentFilter('status', newStatuses);
                }}
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                {status}
              </button>
            );
          })}
        </div>
      </div>

      {/* Format Filter */}
      <div>
        <label className="text-sm font-medium mb-2 block">Format</label>
        <div className="flex flex-wrap gap-2">
          {Object.values(DocumentFormat).filter(f => f !== DocumentFormat.Unknown).map((format) => {
            const isActive = documentFilters.format.includes(format);
            return (
              <button
                key={format}
                onClick={() => {
                  const newFormats = isActive
                    ? documentFilters.format.filter((f) => f !== format)
                    : [...documentFilters.format, format];
                  setDocumentFilter('format', newFormats);
                }}
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-medium uppercase transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                {format}
              </button>
            );
          })}
        </div>
      </div>

      {/* Reset Button */}
      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
          Clear all filters
        </button>
      )}
    </div>
  );
}

