import { Node as FlowNode, Edge as FlowEdge } from 'reactflow';

export interface GraphNode extends FlowNode {
  data: {
    label: string;
    type: string;
    properties: Record<string, any>;
    description?: string;
  };
}

export interface GraphEdge extends FlowEdge {
  data?: {
    label?: string;
    type: string;
    properties?: Record<string, any>;
  };
}

export interface Schema {
  nodeTypes: Record<string, NodeTypeDefinition>;
  edgeTypes: Record<string, EdgeTypeDefinition>;
}

export interface NodeTypeDefinition {
  label: string;
  color: string;
  icon?: string;
  properties: Record<string, PropertyDefinition>;
}

export interface EdgeTypeDefinition {
  label: string;
  sourceTypes: string[];
  targetTypes: string[];
  properties?: Record<string, PropertyDefinition>;
}

export interface PropertyDefinition {
  type: 'string' | 'number' | 'boolean' | 'date' | 'enum';
  required?: boolean;
  default?: any;
  options?: string[];
  description?: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
  processedAt?: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  extractedEntities?: ExtractedEntity[];
}

export interface ExtractedEntity {
  text: string;
  type: string;
  confidence: number;
  startOffset: number;
  endOffset: number;
  properties?: Record<string, any>;
}

export interface GraphState {
  nodes: GraphNode[];
  edges: GraphEdge[];
  schema: Schema;
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
}

export interface FilterState {
  searchQuery: string;
  nodeTypes: string[];
  showOnlyConnected: boolean;
}

