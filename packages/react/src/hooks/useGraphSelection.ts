import { useCallback } from 'react';
import { useGraphContext } from '../context/KnowledgeGraphContext';
import type { KGNode, KGEdge } from '@semantikit/core';

export interface SelectionOperations {
  selectedNodes: Set<string>;
  selectedEdges: Set<string>;
  selectNodes: (nodeIds: string | string[], additive?: boolean) => void;
  selectEdges: (edgeIds: string | string[], additive?: boolean) => void;
  clearSelection: () => void;
  isNodeSelected: (nodeId: string) => boolean;
  isEdgeSelected: (edgeId: string) => boolean;
  getSelectedNodes: () => KGNode[];
  getSelectedEdges: () => KGEdge[];
  selectAll: () => void;
}

export function useGraphSelection(): SelectionOperations {
  const { state, actions } = useGraphContext();
  const { graph, selectedNodes, selectedEdges } = state;

  return {
    selectedNodes,
    selectedEdges,
    selectNodes: useCallback((nodeIds: string | string[], additive = false) => {
      const ids = Array.isArray(nodeIds) ? nodeIds : [nodeIds];
      actions.setSelectedNodes(additive ? Array.from(new Set([...selectedNodes, ...ids])) : ids);
    }, [selectedNodes, actions]),
    selectEdges: useCallback((edgeIds: string | string[], additive = false) => {
      const ids = Array.isArray(edgeIds) ? edgeIds : [edgeIds];
      actions.setSelectedEdges(additive ? Array.from(new Set([...selectedEdges, ...ids])) : ids);
    }, [selectedEdges, actions]),
    clearSelection: useCallback(() => actions.clearSelection(), [actions]),
    isNodeSelected: useCallback((nodeId: string) => selectedNodes.has(nodeId), [selectedNodes]),
    isEdgeSelected: useCallback((edgeId: string) => selectedEdges.has(edgeId), [selectedEdges]),
    getSelectedNodes: useCallback(() => Array.from(selectedNodes).map(id => graph.getNode(id)).filter((n): n is KGNode => n !== undefined), [graph, selectedNodes]),
    getSelectedEdges: useCallback(() => Array.from(selectedEdges).map(id => graph.getEdge(id)).filter((e): e is KGEdge => e !== undefined), [graph, selectedEdges]),
    selectAll: useCallback(() => actions.setSelectedNodes(graph.getNodes().map(n => n.id)), [graph, actions]),
  };
}
