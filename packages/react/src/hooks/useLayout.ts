import { useState, useCallback } from 'react';
import { useKnowledgeGraph } from './useKnowledgeGraph';
import { useGraphOperations } from './useGraphOperations';
import { ForceDirectedLayout, HierarchicalLayout, CircularLayout, type LayoutType, type LayoutOptions, type LayoutResult } from '@semantikit/layouts';

export interface LayoutState {
  activeLayout: LayoutType | null;
  calculating: boolean;
  result: LayoutResult | null;
  error: Error | null;
}

export function useLayout() {
  const graph = useKnowledgeGraph();
  const { updateNode } = useGraphOperations();
  const [state, setState] = useState<LayoutState>({ activeLayout: null, calculating: false, result: null, error: null });

  const applyLayout = useCallback(async (layoutType: LayoutType, options?: LayoutOptions, dimensions?: { width: number; height: number }) => {
    setState(prev => ({ ...prev, calculating: true, activeLayout: layoutType, error: null }));
    try {
      let layoutEngine;
      switch (layoutType) {
        case 'force': layoutEngine = new ForceDirectedLayout(); break;
        case 'hierarchical': layoutEngine = new HierarchicalLayout(); break;
        case 'circular': layoutEngine = new CircularLayout(); break;
        default: throw new Error(`Unknown layout type: ${layoutType}`);
      }
      const result = await layoutEngine.layout({ nodes: graph.getNodes(), edges: graph.getEdges(), dimensions }, options);
      result.nodes.forEach(node => updateNode(node.id, { position: node.position }));
      setState({ activeLayout: layoutType, calculating: false, result, error: null });
      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      setState(prev => ({ ...prev, calculating: false, error: err }));
      return null;
    }
  }, [graph, updateNode]);

  return { ...state, applyLayout };
}
