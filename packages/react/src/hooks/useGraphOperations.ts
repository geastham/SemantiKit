import { useCallback } from 'react';
import type { KGNode, KGEdge } from '@semantikit/core';
import { useGraphContext } from '../context/KnowledgeGraphContext';

export interface GraphOperations {
  addNode: (node: KGNode) => void;
  updateNode: (id: string, updates: Partial<KGNode>) => void;
  deleteNode: (id: string) => void;
  addEdge: (edge: KGEdge) => void;
  updateEdge: (id: string, updates: Partial<KGEdge>) => void;
  deleteEdge: (id: string) => void;
  clearGraph: () => void;
  deleteSelected: () => void;
}

export function useGraphOperations(): GraphOperations {
  const { state, actions } = useGraphContext();
  const { graph, selectedNodes, selectedEdges } = state;

  return {
    addNode: useCallback((node: KGNode) => graph.addNode(node), [graph]),
    updateNode: useCallback((id: string, updates: Partial<KGNode>) => graph.updateNode(id, updates), [graph]),
    deleteNode: useCallback((id: string) => graph.deleteNode(id), [graph]),
    addEdge: useCallback((edge: KGEdge) => graph.addEdge(edge), [graph]),
    updateEdge: useCallback((id: string, updates: Partial<KGEdge>) => graph.updateEdge(id, updates), [graph]),
    deleteEdge: useCallback((id: string) => graph.deleteEdge(id), [graph]),
    clearGraph: useCallback(() => { graph.clear(); actions.clearSelection(); }, [graph, actions]),
    deleteSelected: useCallback(() => {
      selectedEdges.forEach((id) => graph.deleteEdge(id));
      selectedNodes.forEach((id) => graph.deleteNode(id));
      actions.clearSelection();
    }, [graph, selectedNodes, selectedEdges, actions]),
  };
}
