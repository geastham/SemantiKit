import { create } from 'zustand';
import {
  DebuggerState,
  RAGTrace,
  RetrievedChunk,
  RetrievalStrategy,
  StrategyComparison,
} from '@/types';

const defaultStrategy: RetrievalStrategy = {
  name: 'Hybrid',
  method: 'hybrid',
  topK: 5,
  threshold: 0.7,
  alpha: 0.7,
};

export const useDebuggerStore = create<DebuggerState>((set) => ({
  // Active trace
  currentTrace: null,
  setCurrentTrace: (trace) => set({ currentTrace: trace }),

  // All traces for history
  traces: [],
  addTrace: (trace) =>
    set((state) => ({
      traces: [trace, ...state.traces].slice(0, 50), // Keep last 50 traces
    })),
  clearTraces: () => set({ traces: [], currentTrace: null }),

  // Query input and settings
  query: '',
  setQuery: (query) => set({ query }),

  strategy: defaultStrategy,
  setStrategy: (strategy) => set({ strategy }),

  // Selected chunk for detail view
  selectedChunk: null,
  setSelectedChunk: (chunk) => set({ selectedChunk: chunk }),

  // Comparison mode
  comparisonMode: false,
  setComparisonMode: (mode) => set({ comparisonMode: mode }),

  comparisons: [],
  addComparison: (comparison) =>
    set((state) => ({
      comparisons: [...state.comparisons, comparison],
    })),
  clearComparisons: () => set({ comparisons: [] }),
}));
