import { createContext, useContext } from 'react';
import type { KnowledgeGraph } from '@semantikit/core';

export interface GraphState {
  graph: KnowledgeGraph;
  selectedNodes: Set<string>;
  selectedEdges: Set<string>;
  history: {
    past: KnowledgeGraph[];
    future: KnowledgeGraph[];
  };
  isDirty: boolean;
}

export interface GraphActions {
  setSelectedNodes: (nodeIds: string[]) => void;
  setSelectedEdges: (edgeIds: string[]) => void;
  clearSelection: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  setDirty: (dirty: boolean) => void;
  forceUpdate: () => void;
}

export interface KnowledgeGraphContextValue {
  state: GraphState;
  actions: GraphActions;
}

export const KnowledgeGraphContext =
  createContext<KnowledgeGraphContextValue | null>(null);

export function useGraphContext(): KnowledgeGraphContextValue {
  const context = useContext(KnowledgeGraphContext);
  if (!context) {
    throw new Error('useGraphContext must be used within a KnowledgeGraphProvider');
  }
  return context;
}
