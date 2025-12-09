// RAG Trace Types
export interface TraceStep {
  id: string;
  name: string;
  startTime: number;
  endTime: number;
  latency: number;
  metadata?: Record<string, any>;
}

export interface EmbeddingStep extends TraceStep {
  name: 'embedding';
  model: string;
  dimensions: number;
  cost: number;
}

export interface SearchStep extends TraceStep {
  name: 'search';
  engine: string;
  candidatesRetrieved: number;
  queryVector: number[];
}

export interface RerankStep extends TraceStep {
  name: 'rerank';
  model: string;
  inputCount: number;
  outputCount: number;
  cost: number;
}

export interface LLMStep extends TraceStep {
  name: 'llm';
  model: string;
  tokensUsed: number;
  cost: number;
}

export interface RAGTrace {
  id: string;
  query: string;
  timestamp: number;
  steps: (EmbeddingStep | SearchStep | RerankStep | LLMStep)[];
  totalLatency: number;
  totalCost: number;
  chunks: RetrievedChunk[];
}

// Document Chunk Types
export interface RetrievedChunk {
  id: string;
  documentId: string;
  documentName: string;
  chunkIndex: number;
  content: string;
  score: number;
  rank: number;
  originalRank?: number;
  metadata: {
    embedding?: number[];
    length: number;
    overlap?: number;
    timestamp?: string;
  };
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  index: number;
  content: string;
  embedding: number[];
  metadata: {
    length: number;
    startIndex: number;
    endIndex: number;
  };
}

// Query Analysis Types
export interface QueryAnalysis {
  query: string;
  embedding: number[];
  nearestNeighbors: RetrievedChunk[];
  clusterInfo?: {
    centroid: number[];
    radius: number;
    density: number;
  };
}

export interface RetrievalStrategy {
  name: string;
  method: 'vector' | 'keyword' | 'hybrid';
  topK: number;
  threshold?: number;
  alpha?: number; // For hybrid
  metadata?: Record<string, any>;
}

export interface StrategyComparison {
  query: string;
  strategies: {
    strategy: RetrievalStrategy;
    results: RetrievedChunk[];
    metrics: PerformanceMetrics;
  }[];
}

// Performance Metrics Types
export interface PerformanceMetrics {
  latency: {
    embedding: number;
    search: number;
    rerank?: number;
    total: number;
  };
  quality: {
    precisionAtK: number;
    recallAtK: number;
    rerankImprovement?: number;
    relevanceScore: number;
  };
  cost: {
    embedding: number;
    search: number;
    rerank?: number;
    llm?: number;
    total: number;
  };
  coverage: {
    documentsRetrieved: number;
    uniqueDocuments: number;
    chunkDistribution: Record<string, number>;
  };
}

// Store State Types
export interface DebuggerState {
  // Active trace
  currentTrace: RAGTrace | null;
  setCurrentTrace: (trace: RAGTrace | null) => void;
  
  // All traces for history
  traces: RAGTrace[];
  addTrace: (trace: RAGTrace) => void;
  clearTraces: () => void;
  
  // Query input and settings
  query: string;
  setQuery: (query: string) => void;
  
  strategy: RetrievalStrategy;
  setStrategy: (strategy: RetrievalStrategy) => void;
  
  // Selected chunk for detail view
  selectedChunk: RetrievedChunk | null;
  setSelectedChunk: (chunk: RetrievedChunk | null) => void;
  
  // Comparison mode
  comparisonMode: boolean;
  setComparisonMode: (mode: boolean) => void;
  
  comparisons: StrategyComparison[];
  addComparison: (comparison: StrategyComparison) => void;
  clearComparisons: () => void;
}

// API Response Types
export interface TraceResponse {
  success: boolean;
  trace: RAGTrace;
  error?: string;
}

export interface AnalysisResponse {
  success: boolean;
  analysis: QueryAnalysis;
  error?: string;
}

