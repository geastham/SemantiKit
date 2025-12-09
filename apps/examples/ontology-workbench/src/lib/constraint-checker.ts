/**
 * Constraint checker - validates graph against schema constraints
 * Checks node properties, edge validity, cardinality, and type compatibility
 */

import { 
  GraphNode, 
  GraphEdge, 
  OntologySchema, 
  ValidationResult, 
  ValidationIssue,
  PropertyDefinition,
} from '@/types';
import { resolveNodeType } from './schema-parser';

export function validateGraph(
  nodes: GraphNode[],
  edges: GraphEdge[],
  schema: OntologySchema
): ValidationResult {
  const issues: ValidationIssue[] = [];
  
  // Validate nodes
  for (const node of nodes) {
    validateNode(node, schema, issues);
  }
  
  // Validate edges
  for (const edge of edges) {
    validateEdge(edge, nodes, schema, issues);
  }
  
  // Check cardinality constraints
  validateCardinality(edges, schema, issues);
  
  // Calculate counts
  const errorCount = issues.filter((i) => i.severity === 'error').length;
  const warningCount = issues.filter((i) => i.severity === 'warning').length;
  const infoCount = issues.filter((i) => i.severity === 'info').length;
  
  return {
    valid: errorCount === 0,
    issues,
    errorCount,
    warningCount,
    infoCount,
    timestamp: Date.now(),
  };
}

function validateNode(
  node: GraphNode,
  schema: OntologySchema,
  issues: ValidationIssue[]
): void {
  const { type, properties } = node.data;
  
  // Check if node type exists in schema
  if (!schema.nodeTypes[type]) {
    issues.push({
      id: `node-${node.id}-invalid-type`,
      severity: 'error',
      message: `Node type "${type}" does not exist in schema`,
      elementId: node.id,
      elementType: 'node',
      constraint: 'type-existence',
      suggestedFix: `Available types: ${Object.keys(schema.nodeTypes).join(', ')}`,
    });
    return;
  }
  
  // Check if type is abstract
  const nodeDef = schema.nodeTypes[type];
  if (nodeDef.abstract) {
    issues.push({
      id: `node-${node.id}-abstract-type`,
      severity: 'error',
      message: `Cannot instantiate abstract type "${type}"`,
      elementId: node.id,
      elementType: 'node',
      constraint: 'abstract-type',
    });
  }
  
  // Resolve type with inheritance
  const resolvedType = resolveNodeType(schema, type);
  const propertyDefs = resolvedType.properties || {};
  
  // Validate required properties
  for (const [propName, propDef] of Object.entries(propertyDefs)) {
    const def = propDef as PropertyDefinition;
    if (def.required && !properties[propName]) {
      issues.push({
        id: `node-${node.id}-missing-${propName}`,
        severity: 'error',
        message: `Required property "${propName}" is missing`,
        elementId: node.id,
        elementType: 'node',
        constraint: 'required-property',
        suggestedFix: `Add property "${propName}" with type ${def.type}`,
      });
    }
  }
  
  // Validate property types and constraints
  for (const [propName, propValue] of Object.entries(properties)) {
    const propDef = propertyDefs[propName] as PropertyDefinition;
    
    if (!propDef) {
      issues.push({
        id: `node-${node.id}-unknown-prop-${propName}`,
        severity: 'warning',
        message: `Property "${propName}" is not defined in schema`,
        elementId: node.id,
        elementType: 'node',
        constraint: 'property-definition',
      });
      continue;
    }
    
    // Type checking
    const actualType = typeof propValue;
    const expectedType = propDef.type;
    
    if (expectedType === 'string' && actualType !== 'string') {
      issues.push({
        id: `node-${node.id}-type-${propName}`,
        severity: 'error',
        message: `Property "${propName}" should be string, got ${actualType}`,
        elementId: node.id,
        elementType: 'node',
        constraint: 'property-type',
      });
    }
    
    if (expectedType === 'number' && actualType !== 'number') {
      issues.push({
        id: `node-${node.id}-type-${propName}`,
        severity: 'error',
        message: `Property "${propName}" should be number, got ${actualType}`,
        elementId: node.id,
        elementType: 'node',
        constraint: 'property-type',
      });
    }
    
    // Enum validation
    if (propDef.enum && !propDef.enum.includes(propValue as any)) {
      issues.push({
        id: `node-${node.id}-enum-${propName}`,
        severity: 'error',
        message: `Property "${propName}" must be one of: ${propDef.enum.join(', ')}`,
        elementId: node.id,
        elementType: 'node',
        constraint: 'enum-value',
      });
    }
    
    // Numeric constraints
    if (expectedType === 'number' && typeof propValue === 'number') {
      if (propDef.min !== undefined && propValue < propDef.min) {
        issues.push({
          id: `node-${node.id}-min-${propName}`,
          severity: 'error',
          message: `Property "${propName}" must be >= ${propDef.min}`,
          elementId: node.id,
          elementType: 'node',
          constraint: 'min-value',
        });
      }
      
      if (propDef.max !== undefined && propValue > propDef.max) {
        issues.push({
          id: `node-${node.id}-max-${propName}`,
          severity: 'error',
          message: `Property "${propName}" must be <= ${propDef.max}`,
          elementId: node.id,
          elementType: 'node',
          constraint: 'max-value',
        });
      }
    }
    
    // String length constraints
    if (expectedType === 'string' && typeof propValue === 'string') {
      if (propDef.min !== undefined && propValue.length < propDef.min) {
        issues.push({
          id: `node-${node.id}-minlen-${propName}`,
          severity: 'error',
          message: `Property "${propName}" must be at least ${propDef.min} characters`,
          elementId: node.id,
          elementType: 'node',
          constraint: 'min-length',
        });
      }
      
      if (propDef.max !== undefined && propValue.length > propDef.max) {
        issues.push({
          id: `node-${node.id}-maxlen-${propName}`,
          severity: 'error',
          message: `Property "${propName}" must be at most ${propDef.max} characters`,
          elementId: node.id,
          elementType: 'node',
          constraint: 'max-length',
        });
      }
    }
    
    // Pattern validation
    if (propDef.pattern && typeof propValue === 'string') {
      try {
        const regex = new RegExp(propDef.pattern);
        if (!regex.test(propValue)) {
          issues.push({
            id: `node-${node.id}-pattern-${propName}`,
            severity: 'error',
            message: `Property "${propName}" does not match required pattern`,
            elementId: node.id,
            elementType: 'node',
            constraint: 'pattern',
          });
        }
      } catch (e) {
        // Invalid regex in schema - skip validation
      }
    }
  }
}

function validateEdge(
  edge: GraphEdge,
  nodes: GraphNode[],
  schema: OntologySchema,
  issues: ValidationIssue[]
): void {
  const { type } = edge.data;
  
  // Check if edge type exists
  if (!schema.edgeTypes[type]) {
    issues.push({
      id: `edge-${edge.id}-invalid-type`,
      severity: 'error',
      message: `Edge type "${type}" does not exist in schema`,
      elementId: edge.id,
      elementType: 'edge',
      constraint: 'type-existence',
      suggestedFix: `Available types: ${Object.keys(schema.edgeTypes).join(', ')}`,
    });
    return;
  }
  
  const edgeDef = schema.edgeTypes[type];
  
  // Find source and target nodes
  const sourceNode = nodes.find((n) => n.id === edge.source);
  const targetNode = nodes.find((n) => n.id === edge.target);
  
  if (!sourceNode || !targetNode) {
    issues.push({
      id: `edge-${edge.id}-missing-nodes`,
      severity: 'error',
      message: 'Edge connects to non-existent nodes',
      elementId: edge.id,
      elementType: 'edge',
      constraint: 'node-existence',
    });
    return;
  }
  
  // Validate source type
  const allowedSources = Array.isArray(edgeDef.source) 
    ? edgeDef.source 
    : [edgeDef.source];
    
  if (!allowedSources.includes(sourceNode.data.type)) {
    issues.push({
      id: `edge-${edge.id}-invalid-source`,
      severity: 'error',
      message: `Edge type "${type}" cannot start from "${sourceNode.data.type}"`,
      elementId: edge.id,
      elementType: 'edge',
      constraint: 'source-type',
      suggestedFix: `Allowed sources: ${allowedSources.join(', ')}`,
    });
  }
  
  // Validate target type
  const allowedTargets = Array.isArray(edgeDef.target)
    ? edgeDef.target
    : [edgeDef.target];
    
  if (!allowedTargets.includes(targetNode.data.type)) {
    issues.push({
      id: `edge-${edge.id}-invalid-target`,
      severity: 'error',
      message: `Edge type "${type}" cannot connect to "${targetNode.data.type}"`,
      elementId: edge.id,
      elementType: 'edge',
      constraint: 'target-type',
      suggestedFix: `Allowed targets: ${allowedTargets.join(', ')}`,
    });
  }
}

function validateCardinality(
  edges: GraphEdge[],
  schema: OntologySchema,
  issues: ValidationIssue[]
): void {
  // Group edges by type and node
  const edgesByType = new Map<string, GraphEdge[]>();
  
  for (const edge of edges) {
    const type = edge.data.type;
    if (!edgesByType.has(type)) {
      edgesByType.set(type, []);
    }
    edgesByType.get(type)!.push(edge);
  }
  
  // Check cardinality constraints for each edge type
  for (const [edgeType, edgesOfType] of edgesByType) {
    const edgeDef = schema.edgeTypes[edgeType];
    if (!edgeDef || !edgeDef.cardinality) continue;
    
    const { cardinality } = edgeDef;
    
    // Count edges per source node
    const edgesFromSource = new Map<string, number>();
    for (const edge of edgesOfType) {
      const count = edgesFromSource.get(edge.source) || 0;
      edgesFromSource.set(edge.source, count + 1);
    }
    
    // Validate maxSource
    if (cardinality.maxSource !== undefined) {
      for (const [sourceId, count] of edgesFromSource) {
        if (count > cardinality.maxSource) {
          issues.push({
            id: `cardinality-source-${sourceId}-${edgeType}`,
            severity: 'error',
            message: `Node has ${count} outgoing "${edgeType}" edges, max is ${cardinality.maxSource}`,
            elementId: sourceId,
            elementType: 'node',
            constraint: 'max-cardinality-source',
          });
        }
      }
    }
    
    // Count edges per target node
    const edgesToTarget = new Map<string, number>();
    for (const edge of edgesOfType) {
      const count = edgesToTarget.get(edge.target) || 0;
      edgesToTarget.set(edge.target, count + 1);
    }
    
    // Validate maxTarget
    if (cardinality.maxTarget !== undefined) {
      for (const [targetId, count] of edgesToTarget) {
        if (count > cardinality.maxTarget) {
          issues.push({
            id: `cardinality-target-${targetId}-${edgeType}`,
            severity: 'error',
            message: `Node has ${count} incoming "${edgeType}" edges, max is ${cardinality.maxTarget}`,
            elementId: targetId,
            elementType: 'node',
            constraint: 'max-cardinality-target',
          });
        }
      }
    }
  }
}

