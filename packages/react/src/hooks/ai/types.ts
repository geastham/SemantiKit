export interface AIHookState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export interface AIConfig {
  apiKey?: string;
  model?: string;
  cache?: boolean;
  debounceMs?: number;
}

export interface NodeSuggestion {
  type: string;
  label: string;
  properties?: Record<string, unknown>;
  confidence: number;
  reasoning?: string;
}

export interface AIAnalysis {
  summary: string;
  insights: string[];
  suggestions: string[];
  patterns?: Array<{ type: string; description: string; nodeIds: string[]; }>;
}
