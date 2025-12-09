'use client';

import { Plus, Upload, Download, Trash2, RefreshCw } from 'lucide-react';
import { useGraphStore } from '@/lib/graph-store';

export default function Toolbar() {
  const clearGraph = useGraphStore((state) => state.clearGraph);
  const loadSampleData = useGraphStore((state) => state.loadSampleData);
  const nodes = useGraphStore((state) => state.nodes);
  const edges = useGraphStore((state) => state.edges);

  const handleExport = () => {
    const data = {
      nodes,
      edges,
      exportedAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `knowledge-graph-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            if (data.nodes && data.edges) {
              useGraphStore.setState({
                nodes: data.nodes,
                edges: data.edges,
              });
            }
          } catch (error) {
            alert('Invalid JSON file');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold">RAG Admin UI</h1>
        <span className="text-xs text-muted-foreground">
          SemantiKit Example
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={loadSampleData}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition"
        >
          <RefreshCw size={14} />
          Load Sample
        </button>

        <button
          onClick={handleImport}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition"
        >
          <Upload size={14} />
          Import
        </button>

        <button
          onClick={handleExport}
          disabled={nodes.length === 0}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={14} />
          Export
        </button>

        <div className="w-px h-6 bg-border mx-1" />

        <button
          onClick={clearGraph}
          disabled={nodes.length === 0}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 size={14} />
          Clear
        </button>
      </div>
    </header>
  );
}

