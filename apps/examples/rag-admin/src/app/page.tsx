'use client';

import { useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import GraphCanvas from '@/components/GraphCanvas';
import SchemaPanel from '@/components/SchemaPanel';
import PropertyInspector from '@/components/PropertyInspector';
import Toolbar from '@/components/Toolbar';
import { useGraphStore } from '@/lib/graph-store';

export default function Home() {
  const loadSampleData = useGraphStore((state) => state.loadSampleData);

  useEffect(() => {
    // Load sample data on mount
    loadSampleData();
  }, [loadSampleData]);

  return (
    <ReactFlowProvider>
      <div className="flex flex-col h-screen bg-background">
        {/* Toolbar */}
        <Toolbar />

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Schema Panel */}
          <aside className="w-64 border-r border-border bg-card overflow-y-auto">
            <SchemaPanel />
          </aside>

          {/* Center - Graph Canvas */}
          <main className="flex-1 relative">
            <GraphCanvas />
          </main>

          {/* Right Sidebar - Property Inspector */}
          <aside className="w-80 border-l border-border bg-card overflow-y-auto">
            <PropertyInspector />
          </aside>
        </div>
      </div>
    </ReactFlowProvider>
  );
}

