import { useGraphContext } from '../context/KnowledgeGraphContext';
import type { KnowledgeGraph } from '@semantikit/core';

export function useKnowledgeGraph(): KnowledgeGraph {
  const { state } = useGraphContext();
  return state.graph;
}
