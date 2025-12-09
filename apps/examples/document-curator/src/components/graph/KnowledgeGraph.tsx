'use client';

import { useCallback, useEffect, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MiniMap,
  ConnectionMode,
  Panel,
  NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useDocumentStore } from '@/lib/document-store';
import { Entity, EntityType, ENTITY_TYPE_COLORS } from '@/types';
import { EntityNode } from './EntityNode';
import { ZoomIn, ZoomOut, Maximize2, Filter } from 'lucide-react';

const nodeTypes: NodeTypes = {
  entity: EntityNode,
};

// Layout algorithm - force-directed layout simulation
function calculateNodePositions(
  entities: Entity[],
  links: Array<{ sourceEntityId: string; targetEntityId: string }>
): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>();
  const nodeCount = entities.length;

  // Initialize positions in a circle
  entities.forEach((entity, index) => {
    const angle = (index / nodeCount) * 2 * Math.PI;
    const radius = Math.max(300, nodeCount * 20);
    positions.set(entity.id, {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    });
  });

  // Simple force-directed layout
  const iterations = 50;
  const repulsionStrength = 10000;
  const attractionStrength = 0.01;
  const damping = 0.8;

  for (let iter = 0; iter < iterations; iter++) {
    const forces = new Map<string, { x: number; y: number }>();

    // Initialize forces
    entities.forEach((entity) => {
      forces.set(entity.id, { x: 0, y: 0 });
    });

    // Repulsion between all nodes
    for (let i = 0; i < entities.length; i++) {
      for (let j = i + 1; j < entities.length; j++) {
        const e1 = entities[i];
        const e2 = entities[j];
        const pos1 = positions.get(e1.id)!;
        const pos2 = positions.get(e2.id)!;

        const dx = pos2.x - pos1.x;
        const dy = pos2.y - pos1.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;

        const force = repulsionStrength / (distance * distance);
        const fx = (dx / distance) * force;
        const fy = (dy / distance) * force;

        const f1 = forces.get(e1.id)!;
        const f2 = forces.get(e2.id)!;
        f1.x -= fx;
        f1.y -= fy;
        f2.x += fx;
        f2.y += fy;
      }
    }

    // Attraction along edges
    links.forEach((link) => {
      const pos1 = positions.get(link.sourceEntityId);
      const pos2 = positions.get(link.targetEntityId);

      if (pos1 && pos2) {
        const dx = pos2.x - pos1.x;
        const dy = pos2.y - pos1.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;

        const force = distance * attractionStrength;
        const fx = (dx / distance) * force;
        const fy = (dy / distance) * force;

        const f1 = forces.get(link.sourceEntityId);
        const f2 = forces.get(link.targetEntityId);
        if (f1 && f2) {
          f1.x += fx;
          f1.y += fy;
          f2.x -= fx;
          f2.y -= fy;
        }
      }
    });

    // Apply forces with damping
    entities.forEach((entity) => {
      const pos = positions.get(entity.id)!;
      const force = forces.get(entity.id)!;
      pos.x += force.x * damping;
      pos.y += force.y * damping;
    });
  }

  return positions;
}

interface KnowledgeGraphProps {
  filterByDocumentId?: string;
  filterByType?: EntityType;
}

export function KnowledgeGraph({ filterByDocumentId, filterByType }: KnowledgeGraphProps) {
  const { entities, links } = useDocumentStore();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Filter entities
  const filteredEntities = useMemo(() => {
    let filtered = entities;

    if (filterByDocumentId) {
      filtered = filtered.filter((e) => e.documentId === filterByDocumentId);
    }

    if (filterByType) {
      filtered = filtered.filter((e) => e.type === filterByType);
    }

    return filtered;
  }, [entities, filterByDocumentId, filterByType]);

  // Filter links (only show links between filtered entities)
  const filteredLinks = useMemo(() => {
    const entityIds = new Set(filteredEntities.map((e) => e.id));
    return links.filter(
      (link) =>
        entityIds.has(link.sourceEntityId) && entityIds.has(link.targetEntityId)
    );
  }, [filteredEntities, links]);

  // Update graph when data changes
  useEffect(() => {
    if (filteredEntities.length === 0) {
      setNodes([]);
      setEdges([]);
      return;
    }

    // Calculate positions
    const positions = calculateNodePositions(
      filteredEntities,
      filteredLinks.map((link) => ({
        sourceEntityId: link.sourceEntityId,
        targetEntityId: link.targetEntityId,
      }))
    );

    // Create nodes
    const newNodes: Node[] = filteredEntities.map((entity) => {
      const pos = positions.get(entity.id) || { x: 0, y: 0 };
      return {
        id: entity.id,
        type: 'entity',
        position: pos,
        data: {
          entity,
          color: ENTITY_TYPE_COLORS[entity.type],
        },
      };
    });

    // Create edges
    const newEdges: Edge[] = filteredLinks.map((link) => ({
      id: link.id,
      source: link.sourceEntityId,
      target: link.targetEntityId,
      type: 'smoothstep',
      animated: link.type === 'similar',
      label: link.type,
      labelStyle: { fontSize: 10, fill: '#666' },
      style: {
        stroke: link.confidence > 0.8 ? '#10b981' : link.confidence > 0.6 ? '#3b82f6' : '#9ca3af',
        strokeWidth: link.confidence * 3 + 1,
      },
    }));

    setNodes(newNodes);
    setEdges(newEdges);
  }, [filteredEntities, filteredLinks, setNodes, setEdges]);

  const onNodeClick = useCallback((_event: any, node: Node) => {
    console.log('Node clicked:', node.data.entity);
  }, []);

  // Statistics
  const stats = useMemo(() => {
    const typeCounts = new Map<EntityType, number>();
    filteredEntities.forEach((entity) => {
      typeCounts.set(entity.type, (typeCounts.get(entity.type) || 0) + 1);
    });

    return {
      totalNodes: filteredEntities.length,
      totalEdges: filteredLinks.length,
      typeCounts,
      avgConfidence:
        filteredEntities.reduce((sum, e) => sum + e.confidence, 0) /
        filteredEntities.length || 0,
    };
  }, [filteredEntities, filteredLinks]);

  if (filteredEntities.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No entities to visualize</h3>
          <p className="text-sm text-muted-foreground">
            Extract entities from documents to build your knowledge graph
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={2}
      >
        <Background />
        <Controls />
        <MiniMap
          nodeColor={(node) => node.data.color}
          maskColor="rgba(0, 0, 0, 0.1)"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
          }}
        />
        <Panel position="top-left" className="bg-background/95 backdrop-blur rounded-lg p-3 border shadow-lg">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Graph Statistics</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-muted-foreground">Nodes:</span>
                <span className="font-semibold ml-1">{stats.totalNodes}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Edges:</span>
                <span className="font-semibold ml-1">{stats.totalEdges}</span>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Avg Confidence:</span>
                <span className="font-semibold ml-1">
                  {Math.round(stats.avgConfidence * 100)}%
                </span>
              </div>
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

