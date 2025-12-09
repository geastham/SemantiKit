/**
 * Zustand store for Ontology Workbench state management
 * Manages schema, graph, validation, and UI state
 */

import { create } from 'zustand';
import { 
  OntologySchema, 
  ParsedSchema, 
  GraphNode, 
  GraphEdge, 
  ValidationResult,
  CreateNodeParams,
  CreateEdgeParams,
} from '@/types';
import { parseSchema } from '@/lib/schema-parser';
import { validateGraph } from '@/lib/constraint-checker';
import { Edge, Node, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange } from 'reactflow';

export interface OntologyStore {
  // Schema state
  schemaText: string;
  parsedSchema: ParsedSchema;
  
  // Graph state
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  
  // Validation state
  validationResult: ValidationResult;
  autoValidate: boolean;
  
  // UI state
  activeTemplate: string | null;
  isDirty: boolean;
  
  // Schema actions
  setSchemaText: (text: string) => void;
  loadTemplate: (templateName: string, templateContent: string) => void;
  
  // Graph actions
  addNode: (params: CreateNodeParams) => void;
  updateNode: (id: string, updates: Partial<GraphNode['data']>) => void;
  deleteNode: (id: string) => void;
  
  addEdge: (params: CreateEdgeParams) => void;
  updateEdge: (id: string, updates: Partial<GraphEdge['data']>) => void;
  deleteEdge: (id: string) => void;
  
  setSelectedNode: (id: string | null) => void;
  setSelectedEdge: (id: string | null) => void;
  
  // React Flow integration
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  
  // Validation actions
  runValidation: () => void;
  setAutoValidate: (auto: boolean) => void;
  
  // Import/Export
  importGraph: (data: { nodes: GraphNode[]; edges: GraphEdge[] }) => void;
  exportGraph: () => { nodes: GraphNode[]; edges: GraphEdge[]; schema: OntologySchema | null };
  clearAll: () => void;
  
  // Utility actions
  markDirty: () => void;
  markClean: () => void;
}

const initialState = {
  schemaText: '',
  parsedSchema: { schema: null, errors: [], valid: false },
  nodes: [],
  edges: [],
  selectedNodeId: null,
  selectedEdgeId: null,
  validationResult: {
    valid: true,
    issues: [],
    errorCount: 0,
    warningCount: 0,
    infoCount: 0,
    timestamp: Date.now(),
  },
  autoValidate: true,
  activeTemplate: null,
  isDirty: false,
};

export const useOntologyStore = create<OntologyStore>((set, get) => ({
  ...initialState,
  
  // Schema actions
  setSchemaText: (text: string) => {
    const parsed = parseSchema(text);
    set({ 
      schemaText: text, 
      parsedSchema: parsed,
      isDirty: true,
    });
    
    // Auto-validate if enabled and schema is valid
    if (get().autoValidate && parsed.valid && parsed.schema) {
      get().runValidation();
    }
  },
  
  loadTemplate: (templateName: string, templateContent: string) => {
    const parsed = parseSchema(templateContent);
    set({
      schemaText: templateContent,
      parsedSchema: parsed,
      activeTemplate: templateName,
      nodes: [],
      edges: [],
      selectedNodeId: null,
      selectedEdgeId: null,
      isDirty: false,
    });
    
    if (get().autoValidate && parsed.valid) {
      get().runValidation();
    }
  },
  
  // Graph actions
  addNode: ({ type, label, position, properties = {} }: CreateNodeParams) => {
    const id = `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newNode: GraphNode = {
      id,
      type: 'custom',
      position,
      data: {
        type,
        label,
        properties,
        validationErrors: [],
      },
    };
    
    set((state) => ({
      nodes: [...state.nodes, newNode],
      isDirty: true,
    }));
    
    if (get().autoValidate) {
      get().runValidation();
    }
  },
  
  updateNode: (id: string, updates: Partial<GraphNode['data']>) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, ...updates } }
          : node
      ),
      isDirty: true,
    }));
    
    if (get().autoValidate) {
      get().runValidation();
    }
  },
  
  deleteNode: (id: string) => {
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== id),
      edges: state.edges.filter((edge) => edge.source !== id && edge.target !== id),
      selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
      isDirty: true,
    }));
    
    if (get().autoValidate) {
      get().runValidation();
    }
  },
  
  addEdge: ({ type, source, target, label, properties = {} }: CreateEdgeParams) => {
    const id = `edge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newEdge: GraphEdge = {
      id,
      source,
      target,
      type: 'default',
      data: {
        type,
        label,
        properties,
        validationErrors: [],
      },
    };
    
    set((state) => ({
      edges: [...state.edges, newEdge],
      isDirty: true,
    }));
    
    if (get().autoValidate) {
      get().runValidation();
    }
  },
  
  updateEdge: (id: string, updates: Partial<GraphEdge['data']>) => {
    set((state) => ({
      edges: state.edges.map((edge) =>
        edge.id === id
          ? { ...edge, data: { ...edge.data, ...updates } }
          : edge
      ),
      isDirty: true,
    }));
    
    if (get().autoValidate) {
      get().runValidation();
    }
  },
  
  deleteEdge: (id: string) => {
    set((state) => ({
      edges: state.edges.filter((edge) => edge.id !== id),
      selectedEdgeId: state.selectedEdgeId === id ? null : state.selectedEdgeId,
      isDirty: true,
    }));
    
    if (get().autoValidate) {
      get().runValidation();
    }
  },
  
  setSelectedNode: (id: string | null) => {
    set({ selectedNodeId: id, selectedEdgeId: null });
  },
  
  setSelectedEdge: (id: string | null) => {
    set({ selectedEdgeId: id, selectedNodeId: null });
  },
  
  // React Flow integration
  onNodesChange: (changes: NodeChange[]) => {
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes as Node[]) as GraphNode[],
      isDirty: true,
    }));
  },
  
  onEdgesChange: (changes: EdgeChange[]) => {
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges as Edge[]) as GraphEdge[],
      isDirty: true,
    }));
  },
  
  // Validation actions
  runValidation: () => {
    const { parsedSchema, nodes, edges } = get();
    
    if (!parsedSchema.valid || !parsedSchema.schema) {
      set({
        validationResult: {
          valid: false,
          issues: [{
            id: 'schema-invalid',
            severity: 'error',
            message: 'Schema must be valid before validating graph',
            elementType: 'schema',
          }],
          errorCount: 1,
          warningCount: 0,
          infoCount: 0,
          timestamp: Date.now(),
        },
      });
      return;
    }
    
    const result = validateGraph(nodes, edges, parsedSchema.schema);
    
    // Update nodes and edges with validation errors
    const nodeErrorMap = new Map<string, string[]>();
    const edgeErrorMap = new Map<string, string[]>();
    
    result.issues.forEach((issue) => {
      if (issue.elementId) {
        if (issue.elementType === 'node') {
          const errors = nodeErrorMap.get(issue.elementId) || [];
          errors.push(issue.message);
          nodeErrorMap.set(issue.elementId, errors);
        } else if (issue.elementType === 'edge') {
          const errors = edgeErrorMap.get(issue.elementId) || [];
          errors.push(issue.message);
          edgeErrorMap.set(issue.elementId, errors);
        }
      }
    });
    
    set((state) => ({
      validationResult: result,
      nodes: state.nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          validationErrors: nodeErrorMap.get(node.id) || [],
        },
      })),
      edges: state.edges.map((edge) => ({
        ...edge,
        data: {
          ...edge.data,
          validationErrors: edgeErrorMap.get(edge.id) || [],
        },
      })),
    }));
  },
  
  setAutoValidate: (auto: boolean) => {
    set({ autoValidate: auto });
    if (auto) {
      get().runValidation();
    }
  },
  
  // Import/Export
  importGraph: (data: { nodes: GraphNode[]; edges: GraphEdge[] }) => {
    set({
      nodes: data.nodes,
      edges: data.edges,
      selectedNodeId: null,
      selectedEdgeId: null,
      isDirty: true,
    });
    
    if (get().autoValidate) {
      get().runValidation();
    }
  },
  
  exportGraph: () => {
    const { nodes, edges, parsedSchema } = get();
    return {
      nodes,
      edges,
      schema: parsedSchema.schema,
    };
  },
  
  clearAll: () => {
    set({
      nodes: [],
      edges: [],
      selectedNodeId: null,
      selectedEdgeId: null,
      isDirty: false,
    });
    
    if (get().autoValidate) {
      get().runValidation();
    }
  },
  
  // Utility actions
  markDirty: () => set({ isDirty: true }),
  markClean: () => set({ isDirty: false }),
}));

