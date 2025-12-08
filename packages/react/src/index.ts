/**
 * @semantikit/react - React components and hooks for SemantiKit
 *
 * @packageDocumentation
 */

export const VERSION = '0.1.0-alpha.1';

// Context
export * from './context/KnowledgeGraphContext';

// Provider
export { KnowledgeGraphProvider } from './providers/KnowledgeGraphProvider';
export type { KnowledgeGraphProviderProps } from './providers/KnowledgeGraphProvider';

// Core Hooks
export { useKnowledgeGraph } from './hooks/useKnowledgeGraph';
export { useGraphOperations } from './hooks/useGraphOperations';
export type { GraphOperations } from './hooks/useGraphOperations';
export { useGraphSelection } from './hooks/useGraphSelection';
export type { SelectionOperations } from './hooks/useGraphSelection';
export { useGraphUndoRedo } from './hooks/useGraphUndoRedo';
export type { UndoRedoOperations } from './hooks/useGraphUndoRedo';
export { useLayout } from './hooks/useLayout';
export type { LayoutState } from './hooks/useLayout';

// AI Hooks
export * from './hooks/ai/types';
export { useGraphAI } from './hooks/ai/useGraphAI';
export { useNodeSuggestions } from './hooks/ai/useNodeSuggestions';
export { useValidationFeedback } from './hooks/ai/useValidationFeedback';

