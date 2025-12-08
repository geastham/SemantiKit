import type { NodeTypeDefinition } from './node';
import type { EdgeTypeDefinition } from './edge';

/**
 * Validation rule for graph constraints
 */
export interface ValidationRule {
  /**
   * Unique identifier for the rule
   */
  id: string;

  /**
   * Human-readable name
   */
  name: string;

  /**
   * Description of what the rule enforces
   */
  description?: string;

  /**
   * Rule type
   */
  type: 'cardinality' | 'required-property' | 'unique-property' | 'custom';

  /**
   * Severity level
   */
  severity: 'error' | 'warning' | 'info';

  /**
   * Rule configuration (type-specific)
   */
  config: ValidationRuleConfig;
}

/**
 * Configuration for different validation rule types
 */
export type ValidationRuleConfig =
  | CardinalityRuleConfig
  | RequiredPropertyRuleConfig
  | UniquePropertyRuleConfig
  | CustomRuleConfig;

/**
 * Cardinality constraint (e.g., max outgoing edges)
 */
export interface CardinalityRuleConfig {
  type: 'cardinality';
  nodeType: string;
  edgeType: string;
  min?: number;
  max?: number;
  direction: 'incoming' | 'outgoing' | 'both';
}

/**
 * Required property constraint
 */
export interface RequiredPropertyRuleConfig {
  type: 'required-property';
  nodeType?: string;
  edgeType?: string;
  propertyKey: string;
}

/**
 * Unique property constraint
 */
export interface UniquePropertyRuleConfig {
  type: 'unique-property';
  nodeType?: string;
  edgeType?: string;
  propertyKey: string;
  scope: 'global' | 'per-type';
}

/**
 * Custom validation function
 */
export interface CustomRuleConfig {
  type: 'custom';
  validator: (graph: unknown) => boolean | string;
}

/**
 * Schema definition for a knowledge graph
 *
 * Defines the types of nodes and edges allowed, their properties,
 * and validation rules for the graph structure.
 *
 * @example
 * ```typescript
 * const schema: SchemaDefinition = {
 *   version: '1.0',
 *   nodeTypes: [
 *     {
 *       id: 'Person',
 *       label: 'Person',
 *       color: '#3b82f6',
 *       properties: [
 *         { key: 'name', label: 'Name', type: 'string', required: true },
 *         { key: 'email', label: 'Email', type: 'email' }
 *       ]
 *     }
 *   ],
 *   edgeTypes: [
 *     {
 *       id: 'knows',
 *       label: 'Knows',
 *       directed: false,
 *       sourceTypes: ['Person'],
 *       targetTypes: ['Person']
 *     }
 *   ],
 *   validationRules: [
 *     {
 *       id: 'unique-email',
 *       name: 'Unique Email',
 *       type: 'unique-property',
 *       severity: 'error',
 *       config: {
 *         type: 'unique-property',
 *         nodeType: 'Person',
 *         propertyKey: 'email',
 *         scope: 'global'
 *       }
 *     }
 *   ]
 * };
 * ```
 */
export interface SchemaDefinition {
  /**
   * Schema version (for migration support)
   */
  version: string;

  /**
   * Optional schema name/identifier
   */
  name?: string;

  /**
   * Optional schema description
   */
  description?: string;

  /**
   * Defined node types
   */
  nodeTypes: NodeTypeDefinition[];

  /**
   * Defined edge types
   */
  edgeTypes: EdgeTypeDefinition[];

  /**
   * Validation rules
   */
  validationRules?: ValidationRule[];

  /**
   * Whether to allow undefined node types
   */
  allowUndefinedNodeTypes?: boolean;

  /**
   * Whether to allow undefined edge types
   */
  allowUndefinedEdgeTypes?: boolean;

  /**
   * Metadata about the schema
   */
  metadata?: {
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
     * Custom metadata
     */
    [key: string]: unknown;
  };
}

/**
 * Result of schema validation
 */
export interface ValidationResult {
  /**
   * Whether validation passed
   */
  valid: boolean;

  /**
   * Array of validation errors/warnings
   */
  issues: ValidationIssue[];
}

/**
 * Individual validation issue
 */
export interface ValidationIssue {
  /**
   * Issue severity
   */
  severity: 'error' | 'warning' | 'info';

  /**
   * Rule that was violated
   */
  ruleId: string;

  /**
   * Human-readable message
   */
  message: string;

  /**
   * Path to the problematic element
   */
  path?: string;

  /**
   * ID of the node or edge with the issue
   */
  elementId?: string;

  /**
   * Additional context
   */
  context?: Record<string, unknown>;
}

