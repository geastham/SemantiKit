/**
 * Core properties that all edges must have
 */
export interface EdgeCore {
  /**
   * Unique identifier for the edge
   */
  id: string;

  /**
   * Type/category of the edge (e.g., "knows", "worksAt", "relatedTo")
   */
  type: string;

  /**
   * Source node ID
   */
  source: string;

  /**
   * Target node ID
   */
  target: string;

  /**
   * Optional human-readable label for the edge
   */
  label?: string;
}

/**
 * Additional properties that edges can have
 */
export interface EdgeProperties {
  /**
   * Optional description or notes
   */
  description?: string;

  /**
   * Weight or strength of the relationship (0-1)
   */
  weight?: number;

  /**
   * Direction of the relationship
   */
  directed?: boolean;

  /**
   * Custom metadata (any additional properties)
   */
  [key: string]: unknown;
}

/**
 * Visual styling properties for an edge
 */
export interface EdgeStyle {
  /**
   * Color of the edge (hex, rgb, or named color)
   */
  color?: string;

  /**
   * Width/thickness of the edge
   */
  width?: number;

  /**
   * Line style (solid, dashed, dotted)
   */
  lineStyle?: 'solid' | 'dashed' | 'dotted';

  /**
   * Whether to show arrow markers
   */
  showArrow?: boolean;

  /**
   * Custom CSS class names
   */
  className?: string;

  /**
   * Whether the edge is animated
   */
  animated?: boolean;
}

/**
 * Complete knowledge graph edge definition
 *
 * @example
 * ```typescript
 * const edge: KGEdge = {
 *   id: 'edge-1',
 *   type: 'worksAt',
 *   source: 'node-1',
 *   target: 'node-2',
 *   label: 'works at',
 *   properties: {
 *     since: '2020-01-01',
 *     role: 'Senior Engineer'
 *   },
 *   weight: 0.9,
 *   directed: true,
 *   color: '#10b981'
 * };
 * ```
 */
export interface KGEdge extends EdgeCore, EdgeProperties, EdgeStyle {}

/**
 * Type definition for an edge type in the schema
 */
export interface EdgeTypeDefinition {
  /**
   * Unique identifier for this edge type
   */
  id: string;

  /**
   * Display name for this edge type
   */
  label: string;

  /**
   * Description of what this edge type represents
   */
  description?: string;

  /**
   * Default color for edges of this type
   */
  color?: string;

  /**
   * Whether edges of this type are directed by default
   */
  directed?: boolean;

  /**
   * Allowed source node types (empty = any)
   */
  sourceTypes?: string[];

  /**
   * Allowed target node types (empty = any)
   */
  targetTypes?: string[];

  /**
   * Property definitions for this edge type
   */
  properties?: import('./node').PropertyDefinition[];

  /**
   * Whether edges of this type can have custom properties
   */
  allowCustomProperties?: boolean;
}

