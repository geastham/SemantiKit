'use client';

import { useState } from 'react';
import { Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { useGraphStore } from '@/lib/graph-store';

export default function SchemaPanel() {
  const schema = useGraphStore((state) => state.schema);
  const addNode = useGraphStore((state) => state.addNode);
  const [expandedNodeTypes, setExpandedNodeTypes] = useState(true);
  const [expandedEdgeTypes, setExpandedEdgeTypes] = useState(true);

  const handleAddNode = (type: string) => {
    const nodeType = schema.nodeTypes[type];
    addNode({
      type: 'default',
      position: { x: 0, y: 0 },
      data: {
        label: `New ${nodeType.label}`,
        type,
        properties: {},
      },
    });
  };

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
          Schema
        </h2>

        {/* Node Types Section */}
        <div className="mb-4">
          <button
            onClick={() => setExpandedNodeTypes(!expandedNodeTypes)}
            className="flex items-center gap-1 text-sm font-medium mb-2 hover:text-primary transition"
          >
            {expandedNodeTypes ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
            Node Types ({Object.keys(schema.nodeTypes).length})
          </button>

          {expandedNodeTypes && (
            <div className="space-y-1 ml-5">
              {Object.entries(schema.nodeTypes).map(([typeId, nodeType]) => (
                <div
                  key={typeId}
                  className="group flex items-center justify-between p-2 rounded hover:bg-accent transition cursor-pointer"
                  onClick={() => handleAddNode(typeId)}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: nodeType.color }}
                    />
                    <span className="text-sm">{nodeType.label}</span>
                  </div>
                  <Plus
                    size={14}
                    className="opacity-0 group-hover:opacity-100 transition"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Edge Types Section */}
        <div>
          <button
            onClick={() => setExpandedEdgeTypes(!expandedEdgeTypes)}
            className="flex items-center gap-1 text-sm font-medium mb-2 hover:text-primary transition"
          >
            {expandedEdgeTypes ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
            Edge Types ({Object.keys(schema.edgeTypes).length})
          </button>

          {expandedEdgeTypes && (
            <div className="space-y-1 ml-5">
              {Object.entries(schema.edgeTypes).map(([typeId, edgeType]) => (
                <div
                  key={typeId}
                  className="p-2 rounded text-sm text-muted-foreground"
                >
                  <div className="font-medium text-foreground">
                    {edgeType.label}
                  </div>
                  <div className="text-xs mt-1">
                    {edgeType.sourceTypes.join(', ')} →{' '}
                    {edgeType.targetTypes.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <div className="text-xs text-muted-foreground">
          <p>Click on a node type to add it to the canvas.</p>
          <p className="mt-2">
            Drag from a node&apos;s handle to create relationships.
          </p>
        </div>
      </div>
    </div>
  );
}

