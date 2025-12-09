'use client';

import { useState, useEffect } from 'react';
import { Trash2, X } from 'lucide-react';
import { useGraphStore } from '@/lib/graph-store';

export default function PropertyInspector() {
  const nodes = useGraphStore((state) => state.nodes);
  const edges = useGraphStore((state) => state.edges);
  const schema = useGraphStore((state) => state.schema);
  const selectedNodeId = useGraphStore((state) => state.selectedNodeId);
  const selectedEdgeId = useGraphStore((state) => state.selectedEdgeId);
  const updateNode = useGraphStore((state) => state.updateNode);
  const updateEdge = useGraphStore((state) => state.updateEdge);
  const deleteNode = useGraphStore((state) => state.deleteNode);
  const deleteEdge = useGraphStore((state) => state.deleteEdge);
  const setSelectedNode = useGraphStore((state) => state.setSelectedNode);
  const setSelectedEdge = useGraphStore((state) => state.setSelectedEdge);

  const [localProperties, setLocalProperties] = useState<Record<string, any>>(
    {}
  );

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const selectedEdge = edges.find((e) => e.id === selectedEdgeId);

  useEffect(() => {
    if (selectedNode) {
      setLocalProperties(selectedNode.data.properties || {});
    } else if (selectedEdge) {
      setLocalProperties(selectedEdge.data?.properties || {});
    } else {
      setLocalProperties({});
    }
  }, [selectedNode, selectedEdge]);

  const handlePropertyChange = (key: string, value: any) => {
    const newProperties = { ...localProperties, [key]: value };
    setLocalProperties(newProperties);

    if (selectedNodeId) {
      updateNode(selectedNodeId, { properties: newProperties });
    } else if (selectedEdgeId) {
      updateEdge(selectedEdgeId, { properties: newProperties });
    }
  };

  const handleLabelChange = (value: string) => {
    if (selectedNodeId) {
      updateNode(selectedNodeId, { label: value });
    }
  };

  const handleDelete = () => {
    if (selectedNodeId) {
      deleteNode(selectedNodeId);
    } else if (selectedEdgeId) {
      deleteEdge(selectedEdgeId);
    }
  };

  const handleClose = () => {
    setSelectedNode(null);
    setSelectedEdge(null);
  };

  if (!selectedNode && !selectedEdge) {
    return (
      <div className="p-4">
        <h2 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
          Properties
        </h2>
        <div className="text-sm text-muted-foreground text-center py-8">
          Select a node or edge to view its properties
        </div>
      </div>
    );
  }

  const nodeType = selectedNode
    ? schema.nodeTypes[selectedNode.data.type]
    : null;
  const edgeType = selectedEdge
    ? schema.edgeTypes[selectedEdge.data?.type || '']
    : null;

  const propertyDefs = nodeType?.properties || edgeType?.properties || {};

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Properties
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDelete}
            className="p-1.5 text-destructive hover:bg-destructive/10 rounded transition"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
          <button
            onClick={handleClose}
            className="p-1.5 hover:bg-accent rounded transition"
            title="Close"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Node/Edge Type Badge */}
        <div>
          <div className="text-xs text-muted-foreground mb-1">Type</div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-full text-sm">
            {selectedNode && nodeType && (
              <>
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: nodeType.color }}
                />
                {nodeType.label}
              </>
            )}
            {selectedEdge && edgeType && <>{edgeType.label}</>}
          </div>
        </div>

        {/* Label Field (for nodes) */}
        {selectedNode && (
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Label
            </label>
            <input
              type="text"
              value={selectedNode.data.label}
              onChange={(e) => handleLabelChange(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-input rounded text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        )}

        {/* Dynamic Properties */}
        <div className="border-t border-border pt-4">
          <div className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">
            Attributes
          </div>

          {Object.entries(propertyDefs).length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-4">
              No properties defined
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(propertyDefs).map(([key, def]) => (
                <div key={key}>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    {key}
                    {def.required && (
                      <span className="text-destructive ml-1">*</span>
                    )}
                  </label>

                  {def.type === 'enum' && def.options ? (
                    <select
                      value={localProperties[key] || def.default || ''}
                      onChange={(e) =>
                        handlePropertyChange(key, e.target.value)
                      }
                      className="w-full px-3 py-2 bg-background border border-input rounded text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Select...</option>
                      {def.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : def.type === 'boolean' ? (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localProperties[key] || false}
                        onChange={(e) =>
                          handlePropertyChange(key, e.target.checked)
                        }
                        className="w-4 h-4 rounded border-input"
                      />
                      <span className="text-sm">
                        {localProperties[key] ? 'Yes' : 'No'}
                      </span>
                    </label>
                  ) : def.type === 'number' ? (
                    <input
                      type="number"
                      value={localProperties[key] || ''}
                      onChange={(e) =>
                        handlePropertyChange(key, parseFloat(e.target.value))
                      }
                      placeholder={def.description}
                      className="w-full px-3 py-2 bg-background border border-input rounded text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  ) : def.type === 'date' ? (
                    <input
                      type="date"
                      value={localProperties[key] || ''}
                      onChange={(e) =>
                        handlePropertyChange(key, e.target.value)
                      }
                      className="w-full px-3 py-2 bg-background border border-input rounded text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  ) : (
                    <input
                      type="text"
                      value={localProperties[key] || ''}
                      onChange={(e) =>
                        handlePropertyChange(key, e.target.value)
                      }
                      placeholder={def.description}
                      className="w-full px-3 py-2 bg-background border border-input rounded text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  )}

                  {def.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {def.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

