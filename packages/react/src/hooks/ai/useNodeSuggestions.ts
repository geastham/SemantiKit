import { useState, useCallback } from 'react';
import { useKnowledgeGraph } from '../useKnowledgeGraph';
import type { AIHookState, AIConfig, NodeSuggestion } from './types';

export function useNodeSuggestions(config: AIConfig = {}) {
  const graph = useKnowledgeGraph();
  const [state, setState] = useState<AIHookState<NodeSuggestion[]>>({ data: null, loading: false, error: null });

  const getSuggestions = useCallback(async (contextNodeId?: string, hint?: string): Promise<NodeSuggestion[] | null> => {
    setState({ data: null, loading: true, error: null });
    try {
      const suggestions: NodeSuggestion[] = [
        { type: 'Person', label: 'Suggested Node', confidence: 0.8, reasoning: 'Mock suggestion' }
      ];
      setState({ data: suggestions, loading: false, error: null });
      return suggestions;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      setState({ data: null, loading: false, error: err });
      return null;
    }
  }, [graph]);

  return { ...state, getSuggestions };
}
