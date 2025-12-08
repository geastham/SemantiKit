import type { KGNode } from './node';
import type { KGEdge } from './edge';
import type { SchemaDefinition } from './schema';

/**
 * Statistics about a knowledge graph
 */
export interface GraphStatistics {
  /**
   * Total number of nodes
   */
  nodeCount: number;

  /**
   * Total number of edges
   */
  edgeCount: number;

  /**
   * Number of nodes by type
   */
  nodesByType: Record<string, number>;

  /**
   * Number of edges by type
   */
  edgesByType: Record<string, number>;

  /**
   * Average degree (connections per node)
   */
  averageDegree: number;

  /**
   * Maximum degree
   */
  maxDegree: number;

  /**
   * Whether the graph is connected
   */
  isConnected: boolean;
}

/**
 * Metadata about a knowledge graph
 */
export interface GraphMetadata {
  /**
   * Graph name/title
   */
  name?: string;

  /**
   * Graph description
   */
  description?: string;

  /**
   * Creation timestamp
   */
  createdAt?: string;

  /**
   * Last modified timestamp
   */
  updatedAt?: string;

  /**
   * Author/creator
   */
  author?: string;

  /**
   * Graph version
   */
  version?: string;

  /**
   * Tags for categorization
   */
  tags?: string[];

  /**
   * Custom metadata
   */
  [key: string]: unknown;
}

/**
 * Complete knowledge graph data structure
 *
 * Contains nodes, edges, optional schema, and metadata.
 *
 * @example
 * ```typescript
 * const graph: KnowledgeGraph = {
 *   nodes: [
 *     { id: '1', type: 'Person', label: 'Alice', position: { x: 0, y: 0 } },
 *     { id: '2', type: 'Company', label: 'Acme Corp', position: { x: 200, y: 0 } }
 *   ],
 *   edges: [
 *     { id: 'e1', type: 'worksAt', source: '1', target: '2', directed: true }
 *   ],
 *   schema: mySchema,
 *   metadata: {
 *     name: 'Company Relationships',
 *     createdAt: '2024-01-01T00:00:00Z'
 *   }
 * };
 * ```
 */
export interface KnowledgeGraph {
  /**
   * Array of nodes in the graph
   */
  nodes: KGNode[];

  /**
   * Array of edges in the graph
   */
  edges: KGEdge[];

  /**
   * Optional schema definition
   */
  schema?: SchemaDefinition;

  /**
   * Optional metadata
   */
  metadata?: GraphMetadata;
}

/**
 * Options for graph serialization
 */
export interface SerializationOptions {
  /**
   * Include schema in output
   */
  includeSchema?: boolean;

  /**
   * Include metadata in output
   */
  includeMetadata?: boolean;

  /**
   * Pretty-print JSON
   */
  prettyPrint?: boolean;

  /**
   * Include only specified node types
   */
  nodeTypeFilter?: string[];

  /**
   * Include only specified edge types
   */
  edgeTypeFilter?: string[];
}

/**
 * Options for graph deserialization
 */
export interface DeserializationOptions {
  /**
   * Validate against schema (if present)
   */
  validate?: boolean;

  /**
   * Merge with existing graph
   */
  merge?: boolean;

  /**
   * Strategy for handling ID conflicts
   */
  conflictResolution?: 'overwrite' | 'skip' | 'rename';
}

/**
 * Query options for filtering graph elements
 */
export interface QueryOptions {
  /**
   * Filter by node/edge types
   */
  types?: string[];

  /**
   * Property filters (key-value pairs)
   */
  properties?: Record<string, unknown>;

  /**
   * Limit number of results
   */
  limit?: number;

  /**
   * Skip first N results
   */
  offset?: number;

  /**
   * Sort by property
   */
  sortBy?: string;

  /**
   * Sort direction
   */
  sortDirection?: 'asc' | 'desc';
}

/**
 * Options for getting node neighbors
 */
export interface NeighborOptions {
  /**
   * Direction of edges to follow
   */
  direction?: 'incoming' | 'outgoing' | 'both';

  /**
   * Filter by edge types
   */
  edgeTypes?: string[];

  /**
   * Maximum depth to traverse
   */
  depth?: number;

  /**
   * Include the edge information in results
   */
  includeEdges?: boolean;
}

/**
 * Options for getting a subgraph
 */
export interface SubgraphOptions extends NeighborOptions {
  /**
   * Maximum number of nodes to include
   */
  maxNodes?: number;

  /**
   * Whether to include disconnected nodes from the selection
   */
  includeDisconnected?: boolean;
}

/**
 * Result of a neighbor query
 */
export interface NeighborResult {
  /**
   * The neighbor nodes
   */
  nodes: KGNode[];

  /**
   * The connecting edges (if requested)
   */
  edges?: KGEdge[];

  /**
   * Distance/depth from source node
   */
  distances?: Record<string, number>;
}

