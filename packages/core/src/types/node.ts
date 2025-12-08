/**
 * Position coordinates for a node in 2D space
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Core properties that all nodes must have
 */
export interface NodeCore {
  /**
   * Unique identifier for the node
   */
  id: string;

  /**
   * Type/category of the node (e.g., "Person", "Organization", "Concept")
   */
  type: string;

  /**
   * Human-readable label for the node
   */
  label: string;
}

/**
 * Additional properties that nodes can have
 */
export interface NodeProperties {
  /**
   * Optional description or notes
   */
  description?: string;

  /**
   * Custom metadata (any additional properties)
   */
  [key: string]: unknown;
}

/**
 * Visual styling properties for a node
 */
export interface NodeStyle {
  /**
   * Position of the node in 2D space
   */
  position?: Position;

  /**
   * Color of the node (hex, rgb, or named color)
   */
  color?: string;

  /**
   * Size of the node (radius or width/height)
   */
  size?: number;

  /**
   * Icon or image URL to display on the node
   */
  icon?: string;

  /**
   * Custom CSS class names
   */
  className?: string;
}

/**
 * Complete knowledge graph node definition
 *
 * @example
 * ```typescript
 * const node: KGNode = {
 *   id: 'node-1',
 *   type: 'Person',
 *   label: 'Alice Johnson',
 *   properties: {
 *     description: 'Software Engineer',
 *     email: 'alice@example.com',
 *     age: 30
 *   },
 *   position: { x: 100, y: 200 },
 *   color: '#3b82f6'
 * };
 * ```
 */
export interface KGNode extends NodeCore, NodeProperties, NodeStyle {}

/**
 * Type definition for a node type in the schema
 */
export interface NodeTypeDefinition {
  /**
   * Unique identifier for this node type
   */
  id: string;

  /**
   * Display name for this node type
   */
  label: string;

  /**
   * Description of what this node type represents
   */
  description?: string;

  /**
   * Default color for nodes of this type
   */
  color?: string;

  /**
   * Default icon for nodes of this type
   */
  icon?: string;

  /**
   * Property definitions for this node type
   */
  properties?: PropertyDefinition[];

  /**
   * Whether nodes of this type can have custom properties
   */
  allowCustomProperties?: boolean;
}

/**
 * Definition of a property that can exist on a node or edge
 */
export interface PropertyDefinition {
  /**
   * Property key/name
   */
  key: string;

  /**
   * Display label for the property
   */
  label: string;

  /**
   * Data type of the property
   */
  type: 'string' | 'number' | 'boolean' | 'date' | 'url' | 'email' | 'text';

  /**
   * Whether this property is required
   */
  required?: boolean;

  /**
   * Default value for the property
   */
  defaultValue?: unknown;

  /**
   * Validation rules for this property
   */
  validation?: PropertyValidation;

  /**
   * Help text or description
   */
  description?: string;
}

/**
 * Validation rules for a property
 */
export interface PropertyValidation {
  /**
   * Minimum value (for numbers)
   */
  min?: number;

  /**
   * Maximum value (for numbers)
   */
  max?: number;

  /**
   * Minimum length (for strings)
   */
  minLength?: number;

  /**
   * Maximum length (for strings)
   */
  maxLength?: number;

  /**
   * Regular expression pattern (for strings)
   */
  pattern?: string;

  /**
   * Allowed values (enum)
   */
  enum?: unknown[];

  /**
   * Custom validation function
   */
  customValidator?: (value: unknown) => boolean | string;
}

