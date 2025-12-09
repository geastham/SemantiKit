import { create } from 'zustand';
import { GraphNode, GraphEdge, Schema } from '@/types';
import { addEdge, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange } from 'reactflow';

interface HistoryState {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

interface GraphStore {
  // State
  nodes: GraphNode[];
  edges: GraphEdge[];
  schema: Schema;
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  
  // History state
  past: HistoryState[];
  future: HistoryState[];
  
  // Actions
  setNodes: (nodes: GraphNode[]) => void;
  setEdges: (edges: GraphEdge[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: any) => void;
  
  addNode: (node: Omit<GraphNode, 'id'>) => void;
  updateNode: (id: string, data: Partial<GraphNode['data']>) => void;
  deleteNode: (id: string) => void;
  
  addEdge: (edge: Omit<GraphEdge, 'id'>) => void;
  updateEdge: (id: string, data: Partial<GraphEdge['data']>) => void;
  deleteEdge: (id: string) => void;
  
  setSelectedNode: (id: string | null) => void;
  setSelectedEdge: (id: string | null) => void;
  
  setSchema: (schema: Schema) => void;
  addNodeType: (typeId: string, definition: Schema['nodeTypes'][string]) => void;
  addEdgeType: (typeId: string, definition: Schema['edgeTypes'][string]) => void;
  
  clearGraph: () => void;
  loadSampleData: () => void;
  
  // History actions
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

const defaultSchema: Schema = {
  nodeTypes: {
    Person: {
      label: 'Person',
      color: '#3b82f6',
      icon: 'User',
      properties: {
        name: { type: 'string', required: true },
        email: { type: 'string', required: false },
        role: { type: 'string', required: false },
      },
    },
    Project: {
      label: 'Project',
      color: '#10b981',
      icon: 'Folder',
      properties: {
        name: { type: 'string', required: true },
        status: {
          type: 'enum',
          required: true,
          options: ['Active', 'Completed', 'On Hold'],
          default: 'Active',
        },
        startDate: { type: 'date', required: false },
      },
    },
    Document: {
      label: 'Document',
      color: '#f59e0b',
      icon: 'FileText',
      properties: {
        title: { type: 'string', required: true },
        type: {
          type: 'enum',
          options: ['PDF', 'DOCX', 'TXT', 'MD'],
          required: true,
        },
        url: { type: 'string', required: false },
      },
    },
    Concept: {
      label: 'Concept',
      color: '#8b5cf6',
      icon: 'Lightbulb',
      properties: {
        name: { type: 'string', required: true },
        description: { type: 'string', required: false },
      },
    },
  },
  edgeTypes: {
    WorksOn: {
      label: 'Works On',
      sourceTypes: ['Person'],
      targetTypes: ['Project'],
      properties: {
        role: { type: 'string', required: false },
        since: { type: 'date', required: false },
      },
    },
    Manages: {
      label: 'Manages',
      sourceTypes: ['Person'],
      targetTypes: ['Project', 'Person'],
    },
    References: {
      label: 'References',
      sourceTypes: ['Document'],
      targetTypes: ['Person', 'Project', 'Concept'],
    },
    RelatedTo: {
      label: 'Related To',
      sourceTypes: ['Concept'],
      targetTypes: ['Concept', 'Project', 'Document'],
    },
  },
};

const MAX_HISTORY_SIZE = 50;

// Helper function to save current state to history
const saveToHistory = (get: () => GraphStore, set: (state: Partial<GraphStore>) => void) => {
  const { nodes, edges, past } = get();
  const newPast = [...past, { nodes, edges }];
  
  // Limit history size
  if (newPast.length > MAX_HISTORY_SIZE) {
    newPast.shift();
  }
  
  set({ past: newPast, future: [] });
};

export const useGraphStore = create<GraphStore>((set, get) => ({
  // Initial state
  nodes: [],
  edges: [],
  schema: defaultSchema,
  selectedNodeId: null,
  selectedEdgeId: null,
  past: [],
  future: [],

  // Setters
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  // React Flow handlers
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection) => {
    set({
      edges: addEdge({ ...connection, type: 'smoothstep' }, get().edges),
    });
  },

  // Node operations
  addNode: (node) => {
    saveToHistory(get, set);
    const id = `node-${Date.now()}`;
    const newNode: GraphNode = {
      ...node,
      id,
      position: node.position || { x: Math.random() * 500, y: Math.random() * 500 },
      data: {
        ...node.data,
        label: node.data.label || `${node.data.type} ${get().nodes.length + 1}`,
      },
    };
    set({ nodes: [...get().nodes, newNode] });
  },

  updateNode: (id, data) => {
    saveToHistory(get, set);
    set({
      nodes: get().nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, ...data } }
          : node
      ),
    });
  },

  deleteNode: (id) => {
    saveToHistory(get, set);
    set({
      nodes: get().nodes.filter((node) => node.id !== id),
      edges: get().edges.filter((edge) => edge.source !== id && edge.target !== id),
      selectedNodeId: get().selectedNodeId === id ? null : get().selectedNodeId,
    });
  },

  // Edge operations
  addEdge: (edge) => {
    saveToHistory(get, set);
    const id = `edge-${Date.now()}`;
    const newEdge: GraphEdge = {
      ...edge,
      id,
      type: 'smoothstep',
      animated: true,
    };
    set({ edges: [...get().edges, newEdge] });
  },

  updateEdge: (id, data) => {
    saveToHistory(get, set);
    set({
      edges: get().edges.map((edge) =>
        edge.id === id
          ? { ...edge, data: { ...edge.data, ...data } }
          : edge
      ),
    });
  },

  deleteEdge: (id) => {
    saveToHistory(get, set);
    set({
      edges: get().edges.filter((edge) => edge.id !== id),
      selectedEdgeId: get().selectedEdgeId === id ? null : get().selectedEdgeId,
    });
  },

  // Selection
  setSelectedNode: (id) => set({ selectedNodeId: id, selectedEdgeId: null }),
  setSelectedEdge: (id) => set({ selectedEdgeId: id, selectedNodeId: null }),

  // Schema operations
  setSchema: (schema) => set({ schema }),
  
  addNodeType: (typeId, definition) => {
    set({
      schema: {
        ...get().schema,
        nodeTypes: {
          ...get().schema.nodeTypes,
          [typeId]: definition,
        },
      },
    });
  },

  addEdgeType: (typeId, definition) => {
    set({
      schema: {
        ...get().schema,
        edgeTypes: {
          ...get().schema.edgeTypes,
          [typeId]: definition,
        },
      },
    });
  },

  // Utility
  clearGraph: () => {
    set({
      nodes: [],
      edges: [],
      selectedNodeId: null,
      selectedEdgeId: null,
    });
  },

  loadSampleData: () => {
    const sampleNodes: GraphNode[] = [
      {
        id: 'person-1',
        type: 'default',
        position: { x: 100, y: 100 },
        data: {
          label: 'Alice Johnson',
          type: 'Person',
          properties: {
            name: 'Alice Johnson',
            email: 'alice@example.com',
            role: 'Senior Engineer',
          },
        },
      },
      {
        id: 'person-2',
        type: 'default',
        position: { x: 100, y: 300 },
        data: {
          label: 'Bob Smith',
          type: 'Person',
          properties: {
            name: 'Bob Smith',
            email: 'bob@example.com',
            role: 'Product Manager',
          },
        },
      },
      {
        id: 'project-1',
        type: 'default',
        position: { x: 400, y: 200 },
        data: {
          label: 'SemantiKit MVP',
          type: 'Project',
          properties: {
            name: 'SemantiKit MVP',
            status: 'Active',
            startDate: '2024-01-01',
          },
        },
      },
      {
        id: 'doc-1',
        type: 'default',
        position: { x: 700, y: 100 },
        data: {
          label: 'Requirements Doc',
          type: 'Document',
          properties: {
            title: 'Requirements Document',
            type: 'PDF',
          },
        },
      },
      {
        id: 'concept-1',
        type: 'default',
        position: { x: 700, y: 300 },
        data: {
          label: 'Knowledge Graphs',
          type: 'Concept',
          properties: {
            name: 'Knowledge Graphs',
            description: 'Semantic representation of entities and relationships',
          },
        },
      },
    ];

    const sampleEdges: GraphEdge[] = [
      {
        id: 'edge-1',
        source: 'person-1',
        target: 'project-1',
        type: 'smoothstep',
        animated: true,
        data: {
          type: 'WorksOn',
          label: 'Works On',
          properties: {
            role: 'Lead Developer',
            since: '2024-01-01',
          },
        },
      },
      {
        id: 'edge-2',
        source: 'person-2',
        target: 'project-1',
        type: 'smoothstep',
        animated: true,
        data: {
          type: 'Manages',
          label: 'Manages',
        },
      },
      {
        id: 'edge-3',
        source: 'doc-1',
        target: 'project-1',
        type: 'smoothstep',
        data: {
          type: 'References',
          label: 'References',
        },
      },
      {
        id: 'edge-4',
        source: 'doc-1',
        target: 'concept-1',
        type: 'smoothstep',
        data: {
          type: 'References',
          label: 'References',
        },
      },
      {
        id: 'edge-5',
        source: 'concept-1',
        target: 'project-1',
        type: 'smoothstep',
        data: {
          type: 'RelatedTo',
          label: 'Related To',
        },
      },
    ];

    set({
      nodes: sampleNodes,
      edges: sampleEdges,
    });
  },

  // History actions
  undo: () => {
    const { past, nodes, edges } = get();
    if (past.length === 0) return;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    set({
      past: newPast,
      future: [{ nodes, edges }, ...get().future],
      nodes: previous.nodes,
      edges: previous.edges,
    });
  },

  redo: () => {
    const { future, nodes, edges } = get();
    if (future.length === 0) return;

    const next = future[0];
    const newFuture = future.slice(1);

    set({
      past: [...get().past, { nodes, edges }],
      future: newFuture,
      nodes: next.nodes,
      edges: next.edges,
    });
  },

  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,
}));
