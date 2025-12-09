'use client';

import { useState, useCallback, useMemo } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { useGraphStore } from '@/lib/graph-store';
import { useDebounce } from '@/lib/hooks';

export default function SearchPanel() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const nodes = useGraphStore((state) => state.nodes);
  const schema = useGraphStore((state) => state.schema);
  
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Get available node types from schema
  const nodeTypes = useMemo(
    () => Object.keys(schema.nodeTypes),
    [schema.nodeTypes]
  );

  // Filter nodes based on search and type filters
  const filteredNodeIds = useMemo(() => {
    if (!debouncedSearch && selectedTypes.length === 0) {
      return new Set<string>();
    }

    const matchingNodes = nodes.filter((node) => {
      // Type filter
      if (selectedTypes.length > 0 && !selectedTypes.includes(node.data.type)) {
        return false;
      }

      // Search filter
      if (debouncedSearch) {
        const searchLower = debouncedSearch.toLowerCase();
        
        // Search in label
        if (node.data.label?.toLowerCase().includes(searchLower)) {
          return true;
        }

        // Search in type
        if (node.data.type.toLowerCase().includes(searchLower)) {
          return true;
        }

        // Search in properties
        if (node.data.properties) {
          const propertyValues = Object.values(node.data.properties).join(' ').toLowerCase();
          if (propertyValues.includes(searchLower)) {
            return true;
          }
        }

        return false;
      }

      return true;
    });

    return new Set(matchingNodes.map((node) => node.id));
  }, [nodes, debouncedSearch, selectedTypes]);

  const toggleTypeFilter = useCallback((type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedTypes([]);
  }, []);

  const hasActiveFilters = searchQuery || selectedTypes.length > 0;
  const matchCount = filteredNodeIds.size;

  return (
    <div className="border-b border-border bg-card">
      {/* Search Bar */}
      <div className="p-3 flex items-center gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search nodes..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-2 rounded hover:bg-secondary transition ${isExpanded ? 'bg-secondary' : ''}`}
          title="Toggle filters"
        >
          <Filter size={16} />
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="p-2 rounded hover:bg-destructive/10 text-destructive transition"
            title="Clear filters"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {isExpanded && (
        <div className="px-3 pb-3 space-y-3 border-t border-border pt-3">
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground mb-2">
              Filter by Type
            </h3>
            <div className="flex flex-wrap gap-2">
              {nodeTypes.map((type) => {
                const isSelected = selectedTypes.includes(type);
                const typeConfig = schema.nodeTypes[type];
                
                return (
                  <button
                    key={type}
                    onClick={() => toggleTypeFilter(type)}
                    className={`px-3 py-1.5 text-xs rounded border transition ${
                      isSelected
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background border-border hover:border-primary'
                    }`}
                    style={
                      isSelected
                        ? { backgroundColor: typeConfig.color, borderColor: typeConfig.color }
                        : {}
                    }
                  >
                    {typeConfig.label}
                  </button>
                );
              })}
            </div>
          </div>

          {hasActiveFilters && (
            <div className="text-xs text-muted-foreground">
              {matchCount} {matchCount === 1 ? 'node' : 'nodes'} match{matchCount !== 1 ? 'es' : ''}
            </div>
          )}
        </div>
      )}

      {/* Active Filter Chips */}
      {hasActiveFilters && !isExpanded && (
        <div className="px-3 pb-3 flex flex-wrap gap-2">
          {selectedTypes.map((type) => {
            const typeConfig = schema.nodeTypes[type];
            return (
              <span
                key={type}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded border"
                style={{ 
                  backgroundColor: `${typeConfig.color}20`,
                  borderColor: typeConfig.color,
                  color: typeConfig.color
                }}
              >
                {typeConfig.label}
                <button
                  onClick={() => toggleTypeFilter(type)}
                  className="hover:opacity-70"
                >
                  <X size={12} />
                </button>
              </span>
            );
          })}
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded border border-border bg-background">
              Search: "{searchQuery}"
            </span>
          )}
          <span className="text-xs text-muted-foreground self-center">
            {matchCount} result{matchCount !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Apply visual filtering via CSS class on matching nodes */}
      <style jsx global>{`
        ${hasActiveFilters && filteredNodeIds.size > 0
          ? `
          .react-flow__node {
            opacity: 0.3;
            transition: opacity 0.2s;
          }
          ${Array.from(filteredNodeIds)
            .map((id) => `.react-flow__node[data-id="${id}"]`)
            .join(', ')} {
            opacity: 1;
            outline: 2px solid #3b82f6;
            outline-offset: 2px;
          }
          .react-flow__edge {
            opacity: 0.3;
          }
        `
          : ''}
      `}</style>
    </div>
  );
}

