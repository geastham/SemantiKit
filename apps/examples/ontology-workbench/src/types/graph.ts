/**
 * Graph type definitions for nodes and edges
 * Compatible with React Flow but extended for ontology semantics
 */

import { Node as FlowNode, Edge as FlowEdge } from 'reactflow';

export interface NodeData {
  type: string; // Reference to NodeTypeDefinition key
  label: string;
  properties: Record<string, unknown>;
  validationErrors?: string[];
}

export interface EdgeData {
  type: string; // Reference to EdgeTypeDefinition key
  label?: string;
  properties?: Record<string, unknown>;
  validationErrors?: string[];
}

export type GraphNode = FlowNode<NodeData>;
export type GraphEdge = FlowEdge<EdgeData>;

export interface GraphState {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface NodePosition {
  x: number;
  y: number;
}

// Utility type for creating new nodes
export interface CreateNodeParams {
  type: string;
  label: string;
  position: NodePosition;
  properties?: Record<string, unknown>;
}

// Utility type for creating new edges
export interface CreateEdgeParams {
  type: string;
  source: string;
  target: string;
  label?: string;
  properties?: Record<string, unknown>;
}

