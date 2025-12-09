/**
 * Schema type definitions for the Ontology Workbench
 * Defines the structure of ontology schemas including node types, edge types, and constraints
 */

export interface PropertyDefinition {
  type: 'string' | 'number' | 'boolean' | 'date' | 'url' | 'email';
  required?: boolean;
  description?: string;
  default?: string | number | boolean;
  enum?: Array<string | number>;
  pattern?: string; // regex pattern for string validation
  min?: number; // min value for numbers, min length for strings
  max?: number; // max value for numbers, max length for strings
}

export interface NodeTypeDefinition {
  label?: string; // Display label (defaults to type name)
  description?: string;
  properties: Record<string, PropertyDefinition>;
  color?: string; // Hex color for visual representation
  icon?: string; // Icon name (from Tabler Icons)
  abstract?: boolean; // If true, cannot be instantiated directly
  extends?: string; // Inherit from another node type
}

export interface EdgeTypeDefinition {
  label?: string; // Display label (defaults to type name)
  description?: string;
  source: string | string[]; // Allowed source node type(s)
  target: string | string[]; // Allowed target node type(s)
  properties?: Record<string, PropertyDefinition>;
  directed?: boolean; // Default: true
  color?: string;
  cardinality?: {
    minSource?: number; // Min edges from source node
    maxSource?: number; // Max edges from source node  
    minTarget?: number; // Min edges to target node
    maxTarget?: number; // Max edges to target node
  };
}

export interface OntologySchema {
  name: string;
  version?: string;
  description?: string;
  namespace?: string; // URI namespace for the ontology
  nodeTypes: Record<string, NodeTypeDefinition>;
  edgeTypes: Record<string, EdgeTypeDefinition>;
  metadata?: {
    author?: string;
    created?: string;
    modified?: string;
    license?: string;
  };
}

export interface SchemaParseError {
  line?: number;
  column?: number;
  message: string;
  severity: 'error' | 'warning';
}

export interface ParsedSchema {
  schema: OntologySchema | null;
  errors: SchemaParseError[];
  valid: boolean;
}

