'use client';

import { useDocumentStore } from '@/lib/document-store';
import { EntityType, ENTITY_TYPE_COLORS } from '@/types';
import { Search, X, Sliders } from 'lucide-react';
import { cn } from '@/lib/utils';

export function EntityFilters() {
  const { 
    entityFilters, 
    setEntityFilter, 
    resetFilters 
  } = useDocumentStore();

  const hasActiveFilters = 
    entityFilters.search ||
    entityFilters.types.length > 0 ||
    entityFilters.confidenceMin > 0;

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search entities..."
          value={entityFilters.search}
          onChange={(e) => setEntityFilter('search', e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Entity Types */}
      <div>
        <label className="text-sm font-medium mb-2 block">Entity Types</label>
        <div className="flex flex-wrap gap-2">
          {Object.values(EntityType).filter(t => t !== EntityType.Unknown).map((type) => {
            const isActive = entityFilters.types.includes(type);
            const color = ENTITY_TYPE_COLORS[type];
            return (
              <button
                key={type}
                onClick={() => {
                  const newTypes = isActive
                    ? entityFilters.types.filter((t) => t !== type)
                    : [...entityFilters.types, type];
                  setEntityFilter('types', newTypes);
                }}
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-medium transition-all',
                  isActive
                    ? 'ring-2 ring-offset-1'
                    : 'opacity-60 hover:opacity-100'
                )}
                style={{
                  backgroundColor: `${color}15`,
                  color: color,
                  ringColor: isActive ? color : undefined,
                }}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Confidence Threshold */}
      <div>
        <label className="text-sm font-medium mb-2 flex items-center justify-between">
          <span>Minimum Confidence</span>
          <span className="text-primary">{Math.round(entityFilters.confidenceMin * 100)}%</span>
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={entityFilters.confidenceMin}
          onChange={(e) => setEntityFilter('confidenceMin', parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Status Toggles */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={entityFilters.showApproved}
            onChange={(e) => setEntityFilter('showApproved', e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Show Approved</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={entityFilters.showRejected}
            onChange={(e) => setEntityFilter('showRejected', e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Show Rejected</span>
        </label>
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

