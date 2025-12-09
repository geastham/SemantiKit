/**
 * Schema parser - converts YAML/JSON text to typed OntologySchema
 * Includes error handling and basic validation
 */

import yaml from 'js-yaml';
import { OntologySchema, ParsedSchema, SchemaParseError } from '@/types';

export function parseSchema(text: string): ParsedSchema {
  const errors: SchemaParseError[] = [];
  
  if (!text || text.trim() === '') {
    return {
      schema: null,
      errors: [{
        message: 'Schema is empty',
        severity: 'warning',
      }],
      valid: false,
    };
  }
  
  try {
    // Try parsing as YAML (which also supports JSON)
    const parsed = yaml.load(text) as any;
    
    // Basic structure validation
    if (!parsed || typeof parsed !== 'object') {
      errors.push({
        message: 'Schema must be a valid object',
        severity: 'error',
      });
      return { schema: null, errors, valid: false };
    }
    
    // Validate required fields
    if (!parsed.name) {
      errors.push({
        message: 'Schema must have a "name" field',
        severity: 'error',
      });
    }
    
    if (!parsed.nodeTypes || typeof parsed.nodeTypes !== 'object') {
      errors.push({
        message: 'Schema must have a "nodeTypes" object',
        severity: 'error',
      });
    }
    
    if (!parsed.edgeTypes || typeof parsed.edgeTypes !== 'object') {
      errors.push({
        message: 'Schema must have an "edgeTypes" object',
        severity: 'error',
      });
    }
    
    // Validate nodeTypes structure
    if (parsed.nodeTypes) {
      for (const [nodeType, definition] of Object.entries(parsed.nodeTypes)) {
        const def = definition as any;
        
        if (!def.properties || typeof def.properties !== 'object') {
          errors.push({
            message: `Node type "${nodeType}" must have a "properties" object`,
            severity: 'error',
          });
        } else {
          // Validate property definitions
          for (const [propName, propDef] of Object.entries(def.properties)) {
            const prop = propDef as any;
            if (!prop.type) {
              errors.push({
                message: `Property "${propName}" in node type "${nodeType}" must have a "type" field`,
                severity: 'error',
              });
            }
          }
        }
        
        // Check for extends reference
        if (def.extends && !parsed.nodeTypes[def.extends]) {
          errors.push({
            message: `Node type "${nodeType}" extends "${def.extends}" which doesn't exist`,
            severity: 'error',
          });
        }
      }
    }
    
    // Validate edgeTypes structure
    if (parsed.edgeTypes) {
      for (const [edgeType, definition] of Object.entries(parsed.edgeTypes)) {
        const def = definition as any;
        
        if (!def.source) {
          errors.push({
            message: `Edge type "${edgeType}" must have a "source" field`,
            severity: 'error',
          });
        } else {
          // Validate source references
          const sources = Array.isArray(def.source) ? def.source : [def.source];
          for (const source of sources) {
            if (!parsed.nodeTypes[source]) {
              errors.push({
                message: `Edge type "${edgeType}" references source "${source}" which doesn't exist`,
                severity: 'error',
              });
            }
          }
        }
        
        if (!def.target) {
          errors.push({
            message: `Edge type "${edgeType}" must have a "target" field`,
            severity: 'error',
          });
        } else {
          // Validate target references
          const targets = Array.isArray(def.target) ? def.target : [def.target];
          for (const target of targets) {
            if (!parsed.nodeTypes[target]) {
              errors.push({
                message: `Edge type "${edgeType}" references target "${target}" which doesn't exist`,
                severity: 'error',
              });
            }
          }
        }
      }
    }
    
    // If we have errors, return invalid
    if (errors.length > 0) {
      return { schema: null, errors, valid: false };
    }
    
    // Convert to typed schema
    const schema: OntologySchema = {
      name: parsed.name,
      version: parsed.version,
      description: parsed.description,
      namespace: parsed.namespace,
      nodeTypes: parsed.nodeTypes || {},
      edgeTypes: parsed.edgeTypes || {},
      metadata: parsed.metadata,
    };
    
    return { schema, errors: [], valid: true };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown parsing error';
    errors.push({
      message: `YAML/JSON parse error: ${errorMessage}`,
      severity: 'error',
    });
    return { schema: null, errors, valid: false };
  }
}

/**
 * Helper to get all allowed node types from schema
 */
export function getAllowedNodeTypes(schema: OntologySchema | null): string[] {
  if (!schema) return [];
  
  return Object.keys(schema.nodeTypes).filter((nodeType) => {
    const def = schema.nodeTypes[nodeType];
    return !def.abstract; // Filter out abstract types
  });
}

/**
 * Helper to get allowed edge types between two node types
 */
export function getAllowedEdgeTypes(
  schema: OntologySchema | null,
  sourceType: string,
  targetType: string
): string[] {
  if (!schema) return [];
  
  const allowed: string[] = [];
  
  for (const [edgeType, definition] of Object.entries(schema.edgeTypes)) {
    const sources = Array.isArray(definition.source) 
      ? definition.source 
      : [definition.source];
    const targets = Array.isArray(definition.target)
      ? definition.target
      : [definition.target];
    
    if (sources.includes(sourceType) && targets.includes(targetType)) {
      allowed.push(edgeType);
    }
    
    // For undirected edges, also check reverse
    if (definition.directed === false && 
        sources.includes(targetType) && 
        targets.includes(sourceType)) {
      allowed.push(edgeType);
    }
  }
  
  return allowed;
}

/**
 * Helper to resolve node type with inheritance
 */
export function resolveNodeType(
  schema: OntologySchema,
  nodeType: string
): Record<string, any> {
  const definition = schema.nodeTypes[nodeType];
  if (!definition) return {};
  
  // If it extends another type, merge properties
  if (definition.extends) {
    const parent = resolveNodeType(schema, definition.extends);
    return {
      ...parent,
      ...definition,
      properties: {
        ...parent.properties,
        ...definition.properties,
      },
    };
  }
  
  return definition;
}

