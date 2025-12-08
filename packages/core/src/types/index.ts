/**
 * Core type definitions for SemantiKit
 *
 * @packageDocumentation
 */

// Node types
export type {
  Position,
  NodeCore,
  NodeProperties,
  NodeStyle,
  KGNode,
  NodeTypeDefinition,
  PropertyDefinition,
  PropertyValidation,
} from './node';

// Edge types
export type {
  EdgeCore,
  EdgeProperties,
  EdgeStyle,
  KGEdge,
  EdgeTypeDefinition,
} from './edge';

// Schema types
export type {
  SchemaDefinition,
  ValidationRule,
  ValidationRuleConfig,
  CardinalityRuleConfig,
  RequiredPropertyRuleConfig,
  UniquePropertyRuleConfig,
  CustomRuleConfig,
  ValidationResult,
  ValidationIssue,
} from './schema';

// Graph types
export type {
  KnowledgeGraph,
  GraphStatistics,
  GraphMetadata,
  SerializationOptions,
  DeserializationOptions,
  QueryOptions,
  NeighborOptions,
  SubgraphOptions,
  NeighborResult,
} from './graph';

// Operation types
export type {
  OperationType,
  Operation,
  AddNodeOperation,
  UpdateNodeOperation,
  DeleteNodeOperation,
  AddEdgeOperation,
  UpdateEdgeOperation,
  DeleteEdgeOperation,
  BatchOperation,
  GraphOperation,
  UndoRedoOptions,
  UndoRedoState,
  OperationEvent,
  OperationCallback,
} from './operations';

