import React, { useState, useCallback, useEffect, useMemo, useReducer } from 'react';
import { KnowledgeGraph } from '@semantikit/core';
import { KnowledgeGraphContext, type GraphState, type GraphActions } from '../context/KnowledgeGraphContext';

export interface KnowledgeGraphProviderProps {
  graph?: KnowledgeGraph;
  maxHistorySize?: number;
  children: React.ReactNode;
}

export function KnowledgeGraphProvider({ graph: initialGraph, maxHistorySize = 50, children }: KnowledgeGraphProviderProps) {
  const [graph] = useState(() => initialGraph || new KnowledgeGraph());
  const [selectedNodes, setSelectedNodesState] = useState<Set<string>>(new Set());
  const [selectedEdges, setSelectedEdgesState] = useState<Set<string>>(new Set());
  const [past, setPast] = useState<KnowledgeGraph[]>([]);
  const [future, setFuture] = useState<KnowledgeGraph[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    const unsubscribe = graph.on((event) => {
      if (['nodeAdded', 'nodeUpdated', 'nodeDeleted', 'edgeAdded', 'edgeUpdated', 'edgeDeleted'].includes(event.type)) {
        setPast((prev) => {
          const newPast = [...prev, graph.clone()];
          if (newPast.length > maxHistorySize) newPast.shift();
          return newPast;
        });
        setFuture([]);
        setIsDirty(true);
      }
      forceUpdate();
    });
    return unsubscribe;
  }, [graph, maxHistorySize]);

  const actions: GraphActions = useMemo(() => ({
    setSelectedNodes: (nodeIds) => setSelectedNodesState(new Set(nodeIds)),
    setSelectedEdges: (edgeIds) => setSelectedEdgesState(new Set(edgeIds)),
    clearSelection: () => { setSelectedNodesState(new Set()); setSelectedEdgesState(new Set()); },
    undo: () => {
      if (past.length === 0) return;
      const previous = past[past.length - 1];
      setFuture((prev) => [...prev, graph.clone()]);
      setPast(past.slice(0, -1));
      graph.clear();
      previous.getNodes().forEach((node) => graph.addNode(node));
      previous.getEdges().forEach((edge) => graph.addEdge(edge));
      forceUpdate();
    },
    redo: () => {
      if (future.length === 0) return;
      const next = future[future.length - 1];
      setPast((prev) => [...prev, graph.clone()]);
      setFuture(future.slice(0, -1));
      graph.clear();
      next.getNodes().forEach((node) => graph.addNode(node));
      next.getEdges().forEach((edge) => graph.addEdge(edge));
      forceUpdate();
    },
    canUndo: () => past.length > 0,
    canRedo: () => future.length > 0,
    setDirty: (dirty) => setIsDirty(dirty),
    forceUpdate,
  }), [past, future, graph]);

  const state: GraphState = useMemo(() => ({
    graph, selectedNodes, selectedEdges,
    history: { past, future },
    isDirty
  }), [graph, selectedNodes, selectedEdges, past, future, isDirty]);

  const value = useMemo(() => ({ state, actions }), [state, actions]);

  return <KnowledgeGraphContext.Provider value={value}>{children}</KnowledgeGraphContext.Provider>;
}
