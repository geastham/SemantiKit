import { useCallback } from 'react';
import { useGraphContext } from '../context/KnowledgeGraphContext';

export interface UndoRedoOperations {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  undoCount: number;
  redoCount: number;
}

export function useGraphUndoRedo(): UndoRedoOperations {
  const { state, actions } = useGraphContext();
  return {
    undo: useCallback(() => actions.undo(), [actions]),
    redo: useCallback(() => actions.redo(), [actions]),
    canUndo: actions.canUndo(),
    canRedo: actions.canRedo(),
    undoCount: state.history.past.length,
    redoCount: state.history.future.length,
  };
}
