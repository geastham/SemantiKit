import type { KGNode } from './node';
import type { KGEdge } from './edge';

/**
 * Operation type identifiers
 */
export type OperationType =
  | 'add-node'
  | 'update-node'
  | 'delete-node'
  | 'add-edge'
  | 'update-edge'
  | 'delete-edge'
  | 'batch';

/**
 * Base operation interface
 */
export interface Operation {
  /**
   * Unique operation ID
   */
  id: string;

  /**
   * Type of operation
   */
  type: OperationType;

  /**
   * Timestamp when operation was created
   */
  timestamp: number;

  /**
   * Optional user/source identifier
   */
  userId?: string;

  /**
   * Optional operation metadata
   */
  metadata?: Record<string, unknown>;
}

/**
 * Add node operation
 */
export interface AddNodeOperation extends Operation {
  type: 'add-node';
  /**
   * The node to add
   */
  node: KGNode;
}

/**
 * Update node operation
 */
export interface UpdateNodeOperation extends Operation {
  type: 'update-node';
  /**
   * ID of the node to update
   */
  nodeId: string;
  /**
   * Previous state (for undo)
   */
  previousState: KGNode;
  /**
   * New state
   */
  newState: KGNode;
}

/**
 * Delete node operation
 */
export interface DeleteNodeOperation extends Operation {
  type: 'delete-node';
  /**
   * The node that was deleted (for undo)
   */
  node: KGNode;
  /**
   * Edges that were also deleted (for undo)
   */
  deletedEdges: KGEdge[];
}

/**
 * Add edge operation
 */
export interface AddEdgeOperation extends Operation {
  type: 'add-edge';
  /**
   * The edge to add
   */
  edge: KGEdge;
}

/**
 * Update edge operation
 */
export interface UpdateEdgeOperation extends Operation {
  type: 'update-edge';
  /**
   * ID of the edge to update
   */
  edgeId: string;
  /**
   * Previous state (for undo)
   */
  previousState: KGEdge;
  /**
   * New state
   */
  newState: KGEdge;
}

/**
 * Delete edge operation
 */
export interface DeleteEdgeOperation extends Operation {
  type: 'delete-edge';
  /**
   * The edge that was deleted (for undo)
   */
  edge: KGEdge;
}

/**
 * Batch operation containing multiple operations
 */
export interface BatchOperation extends Operation {
  type: 'batch';
  /**
   * Child operations
   */
  operations: GraphOperation[];
  /**
   * Optional batch description
   */
  description?: string;
}

/**
 * Union type of all operation types
 */
export type GraphOperation =
  | AddNodeOperation
  | UpdateNodeOperation
  | DeleteNodeOperation
  | AddEdgeOperation
  | UpdateEdgeOperation
  | DeleteEdgeOperation
  | BatchOperation;

/**
 * Options for undo/redo operations
 */
export interface UndoRedoOptions {
  /**
   * Maximum number of operations to keep in history
   */
  maxHistorySize?: number;

  /**
   * Whether to group rapid operations into batches
   */
  enableBatching?: boolean;

  /**
   * Time window (ms) for batching operations
   */
  batchWindow?: number;
}

/**
 * State of the undo/redo system
 */
export interface UndoRedoState {
  /**
   * Whether undo is available
   */
  canUndo: boolean;

  /**
   * Whether redo is available
   */
  canRedo: boolean;

  /**
   * Number of operations in undo stack
   */
  undoStackSize: number;

  /**
   * Number of operations in redo stack
   */
  redoStackSize: number;

  /**
   * Description of next undo operation
   */
  nextUndoDescription?: string;

  /**
   * Description of next redo operation
   */
  nextRedoDescription?: string;
}

/**
 * Event emitted when an operation is performed
 */
export interface OperationEvent {
  /**
   * The operation that was performed
   */
  operation: GraphOperation;

  /**
   * Whether this was an undo operation
   */
  isUndo?: boolean;

  /**
   * Whether this was a redo operation
   */
  isRedo?: boolean;
}

/**
 * Callback function for operation events
 */
export type OperationCallback = (event: OperationEvent) => void;

