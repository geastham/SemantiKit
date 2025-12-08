import { useState, useCallback } from 'react';
import { useKnowledgeGraph } from '../useKnowledgeGraph';
import type { AIHookState, AIConfig, AIAnalysis } from './types';

export function useGraphAI(config: AIConfig = {}) {
  const graph = useKnowledgeGraph();
  const [state, setState] = useState<AIHookState<AIAnalysis>>({ data: null, loading: false, error: null });

  const analyze = useCallback(async (prompt: string): Promise<AIAnalysis | null> => {
    setState({ data: null, loading: true, error: null });
    try {
      const stats = graph.getStatistics();
      const mockAnalysis: AIAnalysis = {
        summary: `Graph contains ${stats.nodeCount} nodes and ${stats.edgeCount} edges`,
        insights: ['This is a mock implementation'],
        suggestions: ['Integrate with real OpenAI API for production use']
      };
      setState({ data: mockAnalysis, loading: false, error: null });
      return mockAnalysis;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      setState({ data: null, loading: false, error: err });
      return null;
    }
  }, [graph]);

  return { ...state, analyze };
}
