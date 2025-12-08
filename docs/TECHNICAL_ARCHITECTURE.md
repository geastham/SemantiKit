# SemantiKit: Technical Architecture

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Core Abstractions](#core-abstractions)
3. [Package Structure](#package-structure)
4. [Data Model](#data-model)
5. [Schema System](#schema-system)
6. [React Integration](#react-integration)
7. [AI Integration Layer](#ai-integration-layer)
8. [Validation Engine](#validation-engine)
9. [Layout System](#layout-system)
10. [Performance Architecture](#performance-architecture)
11. [Extension Points](#extension-points)
12. [Technology Decisions](#technology-decisions)

---

## Architecture Overview

### Design Principles

SemantiKit follows a **layered architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────┐
│   Host Application (User's React App)       │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│   @semantikit/react                         │
│   - React Components                        │
│   - React Hooks                             │
│   - KnowledgeGraphProvider                  │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│   @semantikit/core                          │
│   - KnowledgeGraph (data model)             │
│   - Operations (CRUD, validation)           │
│   - Serialization (JSON, CSV)               │
│   - No React dependencies                   │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│   @semantikit/layouts                       │
│   - Force-directed                          │
│   - Hierarchical (elkjs)                    │
│   - Radial, Grid                            │
└─────────────────────────────────────────────┘
```

### Key Architectural Patterns

1. **Headless Core**: Pure TypeScript logic with zero UI dependencies
2. **Adapter Pattern**: Backend-agnostic persistence via adapters
3. **Strategy Pattern**: Pluggable layouts, validators, and renderers
4. **Observer Pattern**: Event-driven architecture for graph changes
5. **Provider Pattern**: React Context for graph state management
6. **Command Pattern**: Undo/redo via reversible operations

---

## Core Abstractions

### 1. KnowledgeGraph

The central data structure representing the entire graph state:

```typescript
interface KnowledgeGraph {
  id: string;
  version: string;
  
  nodes: Map<ID, KGNode>;
  edges: Map<ID, KGEdge>;
  
  // Metadata
  metadata: GraphMetadata;
  schema: SchemaDefinition;
  
  // Computed indices for fast lookups
  private nodesByType: Map<string, Set<ID>>;
  private edgesByNode: Map<ID, { incoming: Set<ID>, outgoing: Set<ID> }>;
}

interface GraphMetadata {
  name?: string;
  description?: string;
  created: Date;
  modified: Date;
  author?: string;
  tags?: string[];
}
```

### 2. KGNode (Knowledge Graph Node)

```typescript
interface KGNode {
  id: ID;                              // Unique identifier
  type: string;                        // Node type from schema
  label: string;                       // Display name
  description?: string;                // Optional description
  
  properties: Record<string, unknown>; // Type-specific properties
  position?: { x: number; y: number }; // Canvas position
  
  // External system references
  externalRefs?: ExternalReference[];  
  
  // UI state (optional)
  ui?: {
    color?: string;
    icon?: string;
    collapsed?: boolean;
  };
  
  // Metadata
  metadata: NodeMetadata;
}

interface NodeMetadata {
  created: Date;
  modified: Date;
  createdBy?: string;
  confidence?: number;    // For AI-suggested nodes
  tags?: string[];
}

interface ExternalReference {
  type: 'document' | 'chunk' | 'database' | 'url' | string;
  id: string;
  uri?: string;
  metadata?: Record<string, unknown>;
}
```

### 3. KGEdge (Knowledge Graph Edge)

```typescript
interface KGEdge {
  id: ID;
  type: string;                        // Edge type from schema
  label?: string;                      // Optional override label
  
  from: ID;                            // Source node ID
  to: ID;                              // Target node ID
  directed: boolean;                   // Directionality
  
  properties: Record<string, unknown>; // Type-specific properties
  
  // UI state (optional)
  ui?: {
    color?: string;
    style?: 'solid' | 'dashed' | 'dotted';
    thickness?: number;
  };
  
  // Metadata
  metadata: EdgeMetadata;
}

interface EdgeMetadata {
  created: Date;
  modified: Date;
  createdBy?: string;
  confidence?: number;    // For AI-suggested edges
  weight?: number;        // For algorithms
}
```

### 4. Operations

All graph modifications go through the **OperationsManager**:

```typescript
interface OperationsManager {
  // Node operations
  addNode(node: Partial<KGNode>): KGNode;
  updateNode(id: ID, updates: Partial<KGNode>): KGNode;
  deleteNode(id: ID): void;
  
  // Edge operations
  addEdge(edge: Partial<KGEdge>): KGEdge;
  updateEdge(id: ID, updates: Partial<KGEdge>): KGEdge;
  deleteEdge(id: ID): void;
  
  // Batch operations
  batchUpdate(changeset: ChangeSet): void;
  
  // Undo/redo
  undo(): void;
  redo(): void;
  
  // Queries
  getNode(id: ID): KGNode | undefined;
  getEdge(id: ID): KGEdge | undefined;
  getNeighbors(nodeId: ID, options?: NeighborOptions): KGNode[];
  getSubgraph(nodeIds: ID[], depth?: number): KnowledgeGraph;
}
```

### 5. ChangeSet

All operations produce immutable **ChangeSet** objects for undo/redo:

```typescript
interface ChangeSet {
  id: string;
  timestamp: Date;
  
  operations: Operation[];
}

type Operation = 
  | { type: 'NODE_ADD'; node: KGNode }
  | { type: 'NODE_UPDATE'; nodeId: ID; before: Partial<KGNode>; after: Partial<KGNode> }
  | { type: 'NODE_DELETE'; node: KGNode }
  | { type: 'EDGE_ADD'; edge: KGEdge }
  | { type: 'EDGE_UPDATE'; edgeId: ID; before: Partial<KGEdge>; after: Partial<KGEdge> }
  | { type: 'EDGE_DELETE'; edge: KGEdge };
```

---

## Package Structure

### @semantikit/core

**Purpose**: Headless graph engine with zero dependencies on React or UI libraries.

**Exports**:
```typescript
// Core classes
export { KnowledgeGraph } from './KnowledgeGraph';
export { OperationsManager } from './OperationsManager';
export { SchemaValidator } from './validation/SchemaValidator';

// Data structures
export type { KGNode, KGEdge, ExternalReference } from './types';
export type { SchemaDefinition, NodeTypeDefinition, EdgeTypeDefinition } from './schema';

// Utilities
export { serializers } from './serialization';
export { validators } from './validation';
export { queries } from './queries';
```

**Key Modules**:
- `/graph`: Core graph data structures
- `/operations`: CRUD operations + undo/redo
- `/schema`: Schema definition and validation
- `/serialization`: JSON, CSV import/export
- `/validation`: Built-in validators
- `/queries`: Graph traversal and search
- `/utils`: ID generation, indexing

### @semantikit/react

**Purpose**: React components, hooks, and context providers.

**Exports**:
```typescript
// Provider
export { KnowledgeGraphProvider } from './KnowledgeGraphProvider';

// Components
export { GraphCanvas } from './components/GraphCanvas';
export { NodeInspector } from './components/NodeInspector';
export { EdgeInspector } from './components/EdgeInspector';
export { TypePalette } from './components/TypePalette';
export { Toolbar } from './components/Toolbar';
export { ValidationPanel } from './components/ValidationPanel';
export { AISuggestionsPanel } from './components/AISuggestionsPanel';
export { MiniMap } from './components/MiniMap';

// Hooks
export { useKnowledgeGraph } from './hooks/useKnowledgeGraph';
export { useGraphOperations } from './hooks/useGraphOperations';
export { useGraphSelection } from './hooks/useGraphSelection';
export { useGraphValidation } from './hooks/useGraphValidation';
export { useGraphUndoRedo } from './hooks/useGraphUndoRedo';
export { useAISuggestions } from './hooks/useAISuggestions';
export { useLayout } from './hooks/useLayout';
```

**Key Modules**:
- `/components`: All React components
- `/hooks`: Custom React hooks
- `/context`: React Context providers
- `/adapters`: React Flow integration
- `/styles`: Default CSS and themes

### @semantikit/layouts

**Purpose**: Graph layout algorithms (can be used with or without React).

**Exports**:
```typescript
export { ForceDirectedLayout } from './ForceDirectedLayout';
export { HierarchicalLayout } from './HierarchicalLayout';
export { RadialLayout } from './RadialLayout';
export { GridLayout } from './GridLayout';

export type { LayoutAlgorithm, LayoutSettings, LayoutResult } from './types';
```

### @semantikit/validators

**Purpose**: Built-in and example custom validators.

**Exports**:
```typescript
// Built-in validators
export { DuplicateLabelsValidator } from './DuplicateLabelsValidator';
export { DanglingEdgesValidator } from './DanglingEdgesValidator';
export { SchemaViolationValidator } from './SchemaViolationValidator';
export { RequiredFieldsValidator } from './RequiredFieldsValidator';
export { IsolatedNodesValidator } from './IsolatedNodesValidator';

// Validator utilities
export { createValidator } from './utils';
export type { Validator, ValidationIssue } from './types';
```

---

## Data Model

### Graph State Machine

```
┌─────────┐
│  EMPTY  │  (No nodes or edges)
└────┬────┘
     │ addNode()
     ▼
┌─────────┐
│ EDITING │  (User making changes)
└────┬────┘
     │ validate()
     ▼
┌─────────┐
│VALIDATED│  (Issues detected/resolved)
└────┬────┘
     │ export()
     ▼
┌─────────┐
│EXPORTED │  (Serialized to JSON/CSV/etc.)
└─────────┘
```

### Indices for Performance

The `KnowledgeGraph` maintains several indices for O(1) lookups:

1. **nodesByType**: `Map<string, Set<ID>>` — Fast filtering by type
2. **edgesByNode**: `Map<ID, { incoming: Set<ID>, outgoing: Set<ID> }>` — Fast neighbor queries
3. **labelIndex**: `Map<string, Set<ID>>` — Fast label search (case-insensitive)
4. **externalRefIndex**: `Map<string, Set<ID>>` — Fast lookup by external ID

These indices are automatically updated when nodes/edges change.

---

## Schema System

### SchemaDefinition

```typescript
interface SchemaDefinition {
  version: string;
  nodeTypes: NodeTypeDefinition[];
  edgeTypes: EdgeTypeDefinition[];
  
  // Optional constraints
  constraints?: SchemaConstraints;
}

interface NodeTypeDefinition {
  id: string;
  label: string;
  description?: string;
  
  // Visual defaults
  color?: string;
  icon?: string;
  
  // Properties schema
  properties: PropertyDefinition[];
  
  // Behavioral flags
  allowMultiple?: boolean;      // Allow multiple nodes of this type (default: true)
  requireConnection?: boolean;  // Node must have ≥1 edge (default: false)
}

interface EdgeTypeDefinition {
  id: string;
  label: string;
  description?: string;
  
  // Type constraints
  allowedSources: string[];     // Source node type IDs
  allowedTargets: string[];     // Target node type IDs
  
  // Properties schema
  properties: PropertyDefinition[];
  
  // Behavioral flags
  directed?: boolean;           // Default: true
  allowMultiple?: boolean;      // Allow multiple edges of this type between same nodes
}

interface PropertyDefinition {
  id: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'enum' | 'url' | 'json';
  
  required?: boolean;
  defaultValue?: unknown;
  
  // For enum type
  enumValues?: { value: string; label: string }[];
  
  // Validation
  minLength?: number;           // For strings
  maxLength?: number;
  pattern?: string;             // Regex pattern
  min?: number;                 // For numbers
  max?: number;
}
```

### Schema Evolution

When a schema is updated:

1. **Validation runs automatically** to detect nodes/edges violating new schema
2. **Migration callbacks** allow programmatic updates:

```typescript
interface SchemaMigration {
  fromVersion: string;
  toVersion: string;
  
  migrateNode?: (node: KGNode) => KGNode;
  migrateEdge?: (edge: KGEdge) => KGEdge;
}

// Register migrations
graph.registerMigration({
  fromVersion: '1.0',
  toVersion: '1.1',
  migrateNode: (node) => {
    if (node.type === 'person') {
      return {
        ...node,
        properties: {
          ...node.properties,
          fullName: node.properties.firstName + ' ' + node.properties.lastName
        }
      };
    }
    return node;
  }
});
```

---

## React Integration

### KnowledgeGraphProvider

The main React Context provider:

```typescript
interface KnowledgeGraphProviderProps {
  // Initial state
  schema: SchemaDefinition;
  initialGraph?: KnowledgeGraph;
  
  // AI configuration
  aiConfig?: AIConfig;
  
  // Validation configuration
  validators?: Validator[];
  validationMode?: 'onBlur' | 'onChange' | 'manual';
  
  // Callbacks
  onChange?: (graph: KnowledgeGraph, changeset: ChangeSet) => void;
  onValidation?: (issues: ValidationIssue[]) => void;
  
  // Children
  children: ReactNode;
}

function App() {
  return (
    <KnowledgeGraphProvider
      schema={mySchema}
      aiConfig={myAIConfig}
      onChange={(graph, changeset) => {
        // Persist to backend
        saveGraph(graph);
      }}
    >
      <MyGraphEditor />
    </KnowledgeGraphProvider>
  );
}
```

### Primary Hooks

#### useKnowledgeGraph

```typescript
function useKnowledgeGraph() {
  return {
    graph: KnowledgeGraph,
    schema: SchemaDefinition,
    loading: boolean,
    error: Error | null
  };
}
```

#### useGraphOperations

```typescript
function useGraphOperations() {
  return {
    addNode: (node: Partial<KGNode>) => KGNode,
    updateNode: (id: ID, updates: Partial<KGNode>) => void,
    deleteNode: (id: ID) => void,
    addEdge: (edge: Partial<KGEdge>) => KGEdge,
    updateEdge: (id: ID, updates: Partial<KGEdge>) => void,
    deleteEdge: (id: ID) => void,
    batchUpdate: (changeset: ChangeSet) => void
  };
}
```

#### useGraphSelection

```typescript
function useGraphSelection() {
  return {
    selectedNodeIds: ID[],
    selectedEdgeIds: ID[],
    selectNodes: (ids: ID[]) => void,
    selectEdges: (ids: ID[]) => void,
    clearSelection: () => void,
    selectedNodes: KGNode[],
    selectedEdges: KGEdge[]
  };
}
```

---

## AI Integration Layer

### AIConfig Interface

```typescript
interface AIConfig {
  // Graph extraction from text
  suggestGraphFromText?: (
    params: SuggestGraphFromTextParams
  ) => Promise<SuggestGraphFromTextResult>;
  
  // Graph expansion
  suggestExpansion?: (
    params: SuggestExpansionParams
  ) => Promise<SuggestGraphFromTextResult>;
  
  // Description enhancement
  suggestDescriptions?: (
    params: SuggestDescriptionsParams
  ) => Promise<Record<ID, string>>;
}

// Host app implements this:
const aiConfig: AIConfig = {
  async suggestGraphFromText({ text, existingGraph, schema }) {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'Extract entities and relationships...' },
        { role: 'user', content: text }
      ]
    });
    
    // Parse response into nodes/edges
    return parseAIResponse(response, schema);
  }
};
```

### Suggestion Flow

```
1. User triggers AI action
         ↓
2. Hook calls aiConfig.suggestGraphFromText()
         ↓
3. Host app sends prompt to LLM
         ↓
4. Host app parses response
         ↓
5. Hook receives SuggestedGraph
         ↓
6. <AISuggestionsPanel /> renders suggestions
         ↓
7. User accepts/rejects
         ↓
8. Accepted nodes/edges added to graph
```

---

## Validation Engine

### Validator Pattern

```typescript
type Validator = (
  graph: KnowledgeGraph,
  schema: SchemaDefinition
) => ValidationIssue[];

interface ValidationIssue {
  id: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  ruleId: string;
  
  // Optional pointers to problematic elements
  nodeId?: ID;
  edgeId?: ID;
  
  // Optional fix
  suggestedFix?: {
    description: string;
    apply: () => void;
  };
  
  metadata?: Record<string, unknown>;
}
```

### Built-in Validators

1. **DuplicateLabelsValidator**: Detects nodes of same type with identical labels
2. **DanglingEdgesValidator**: Finds edges referencing non-existent nodes
3. **SchemaViolationValidator**: Checks edge type constraints
4. **RequiredFieldsValidator**: Ensures required properties are set
5. **IsolatedNodesValidator**: Finds nodes with no edges (configurable per type)

### Custom Validator Example

```typescript
// Ensure all Customers have at least one Order
const customerOrderValidator: Validator = (graph, schema) => {
  const issues: ValidationIssue[] = [];
  
  for (const node of graph.nodes.values()) {
    if (node.type === 'customer') {
      const edges = graph.getOutgoingEdges(node.id);
      const hasOrder = edges.some(e => e.type === 'placed_order');
      
      if (!hasOrder) {
        issues.push({
          id: `customer-no-order-${node.id}`,
          severity: 'warning',
          message: `Customer "${node.label}" has no orders`,
          ruleId: 'customer-order-required',
          nodeId: node.id,
          suggestedFix: {
            description: 'Create a placeholder order',
            apply: () => {
              // Add order node and edge
            }
          }
        });
      }
    }
  }
  
  return issues;
};
```

---

## Layout System

### Layout Strategy Pattern

```typescript
interface LayoutAlgorithm {
  name: string;
  
  compute(
    nodes: KGNode[],
    edges: KGEdge[],
    options?: LayoutOptions
  ): Promise<LayoutResult>;
}

interface LayoutResult {
  positions: Map<ID, { x: number; y: number }>;
  
  // Optional metadata
  dimensions?: { width: number; height: number };
  groups?: Map<string, ID[]>;  // For clustered layouts
}
```

### Supported Layouts

#### 1. Force-Directed

```typescript
// Simple physics simulation
{
  algorithm: 'force',
  options: {
    strength: 0.5,        // Attraction strength
    distance: 100,        // Ideal edge length
    iterations: 300,      // Simulation steps
    centerForce: 0.1      // Pull towards center
  }
}
```

#### 2. Hierarchical (elkjs)

```typescript
{
  algorithm: 'layered',
  elkOptions: {
    'elk.algorithm': 'layered',
    'elk.direction': 'DOWN',  // or 'UP', 'LEFT', 'RIGHT'
    'elk.spacing.nodeNode': 50,
    'elk.layered.spacing.nodeNodeBetweenLayers': 100
  }
}
```

#### 3. Radial

```typescript
{
  algorithm: 'radial',
  options: {
    center: nodeId,      // Root node
    radius: 200,         // Base radius
    levelDistance: 100   // Distance between levels
  }
}
```

#### 4. Grid

```typescript
{
  algorithm: 'grid',
  options: {
    columns: 5,
    rowHeight: 100,
    columnWidth: 150
  }
}
```

---

## Performance Architecture

### Optimization Strategies

#### 1. Viewport Rendering

Only render nodes/edges visible in current viewport:

```typescript
// In GraphCanvas
const visibleNodes = useMemo(() => {
  return nodes.filter(node => 
    isInViewport(node.position, viewport)
  );
}, [nodes, viewport]);
```

#### 2. Dynamic Subgraph Mode

For large graphs (>5k nodes):

```typescript
interface DynamicGraphState {
  rootNodeId: ID;
  visibleNodeIds: Set<ID>;
  visibleEdgeIds: Set<ID>;
  expansionDepth: number;
}

// User can expand/collapse neighborhoods
function expandNode(nodeId: ID, depth: number = 1) {
  const neighbors = graph.getNeighbors(nodeId, { depth });
  setVisibleNodeIds(prev => new Set([...prev, ...neighbors.map(n => n.id)]));
}
```

#### 3. Web Worker for Layouts

```typescript
// layouts/worker.ts
self.addEventListener('message', async (e) => {
  const { algorithm, nodes, edges, options } = e.data;
  
  const result = await computeLayout(algorithm, nodes, edges, options);
  
  self.postMessage({ type: 'LAYOUT_COMPLETE', result });
});

// In React component
const layoutWorker = useMemo(() => new Worker('./layout.worker.js'), []);

async function applyLayout(algorithm) {
  setLayouting(true);
  
  layoutWorker.postMessage({ algorithm, nodes, edges, options });
  
  layoutWorker.onmessage = (e) => {
    if (e.data.type === 'LAYOUT_COMPLETE') {
      applyPositions(e.data.result);
      setLayouting(false);
    }
  };
}
```

#### 4. Memoization & Caching

```typescript
// Cache expensive computations
const nodesByType = useMemo(() => {
  return groupBy(nodes, 'type');
}, [nodes]);

const validationIssues = useMemo(() => {
  return validators.flatMap(v => v(graph, schema));
}, [graph.version, validators]); // Only re-run when graph changes
```

---

## Extension Points

### 1. Custom Node Renderers

```typescript
<GraphCanvas
  nodeRenderer={(node) => {
    if (node.type === 'image') {
      return <ImageNode node={node} />;
    }
    return <DefaultNode node={node} />;
  }}
/>
```

### 2. Custom Validators

```typescript
const myValidators = [
  customBusinessRuleValidator,
  dataQualityValidator
];

<KnowledgeGraphProvider validators={myValidators}>
  {/* ... */}
</KnowledgeGraphProvider>
```

### 3. Custom Layouts

```typescript
class MyCustomLayout implements LayoutAlgorithm {
  name = 'my-custom';
  
  async compute(nodes, edges, options) {
    // Your layout logic
    return { positions: new Map() };
  }
}

// Register
registerLayout(new MyCustomLayout());
```

### 4. Persistence Adapters

```typescript
interface PersistenceAdapter {
  save(graph: KnowledgeGraph): Promise<void>;
  load(id: string): Promise<KnowledgeGraph>;
}

// Example: Backend API adapter
class APIAdapter implements PersistenceAdapter {
  async save(graph) {
    await fetch('/api/graphs', {
      method: 'POST',
      body: JSON.stringify(graph)
    });
  }
  
  async load(id) {
    const response = await fetch(`/api/graphs/${id}`);
    return response.json();
  }
}
```

---

## Technology Decisions

### ADR-001: React Flow vs. Cytoscape.js

**Decision**: Use React Flow as the canvas rendering engine.

**Rationale**:
- ✅ Native React integration (no wrapper needed)
- ✅ Excellent performance for 5k+ nodes
- ✅ Active development and community
- ✅ Built-in minimap, controls, and interactions
- ✅ Easy customization via React components
- ❌ Cytoscape.js is more mature but requires React wrapper and has more complex API

### ADR-002: TypeScript Over JavaScript

**Decision**: Implement everything in TypeScript.

**Rationale**:
- ✅ Type safety prevents bugs in complex graph operations
- ✅ Better IDE support (autocomplete, refactoring)
- ✅ Self-documenting via types
- ✅ Easier for contributors to understand codebase
- ❌ Slightly steeper learning curve (mitigated by good docs)

### ADR-003: Context + Hooks vs. Zustand/Redux

**Decision**: Use React Context + useReducer for state management.

**Rationale**:
- ✅ Zero external dependencies
- ✅ Simple mental model for most use cases
- ✅ Sufficient performance with proper memoization
- ✅ Easier for users to understand and customize
- ⚠️ May revisit if performance issues arise at scale

### ADR-004: Monorepo vs. Separate Repos

**Decision**: Use a monorepo (via pnpm workspaces or Turborepo).

**Rationale**:
- ✅ Easier to coordinate changes across packages
- ✅ Shared tooling and dependencies
- ✅ Atomic commits across multiple packages
- ✅ Easier for contributors (one repo to clone)

### ADR-005: MIT License

**Decision**: Publish under MIT license.

**Rationale**:
- ✅ Maximum adoption (commercial-friendly)
- ✅ Community expectation for developer tools
- ✅ Aligns with React and React Flow licenses
- ⚠️ Does not restrict competitors (acceptable trade-off)

---

## Security Considerations

1. **No Backend Calls**: SDK never makes HTTP requests—host app controls all network
2. **Input Sanitization**: All user-provided strings sanitized before rendering
3. **XSS Prevention**: React's built-in escaping + DOMPurify for rich text
4. **CSRF**: Not applicable (no auth or state-changing requests from SDK)
5. **Dependency Scanning**: Automated security audits via GitHub Dependabot

---

## Testing Strategy

1. **Unit Tests**: All core logic (@semantikit/core) with 90%+ coverage
2. **Integration Tests**: React hooks and components with React Testing Library
3. **Visual Regression**: Storybook + Chromatic for UI components
4. **Performance Tests**: Automated benchmarks for 1k, 5k, 10k node graphs
5. **E2E Tests**: Playwright for full user flows (create graph, validate, export)

---

## Future Architecture Considerations

### Real-Time Collaboration (v2.0)

```typescript
// Using Yjs CRDT
import * as Y from 'yjs';

const ydoc = new Y.Doc();
const yGraph = ydoc.getMap('graph');

// Sync changes
yGraph.observe((event) => {
  updateKnowledgeGraph(event);
});
```

### Hosted Backend (Future)

```
┌──────────────┐
│  React App   │
└──────┬───────┘
       │
┌──────▼───────┐
│ SemantiKit   │  (SDK)
│   React      │
└──────┬───────┘
       │
┌──────▼───────┐
│ SemantiKit   │  (Optional cloud backend)
│   Cloud      │
└──────────────┘
  - Auth
  - Storage
  - Real-time sync
  - Team management
```

---

**This architecture provides a solid foundation for a production-ready, embeddable knowledge graph SDK while maintaining flexibility for future enhancements.**

