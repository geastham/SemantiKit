Below is a full product + technical spec you can drop into a repo as docs/spec.md or an internal RFC.

⸻

NeuroGraph Knowledge Graph React SDK

(codename: “KG-SDK” — rename as you like)

0. Summary

We will build an open source React/TypeScript SDK that provides:
	•	A headless graph editor core (data model, operations, validation).
	•	Embeddable React components for visual knowledge graph editing (canvas, inspectors, validations, AI suggestions).
	•	A simple AI integration contract so host apps can plug in any LLM / RAG backend.
	•	A backend-agnostic persistence layer (adapters for common graph and RAG backends).

Conceptually, this is: Termboard-like semantic modeling UX packaged as an embeddable React SDK for AI/RAG apps, not a standalone SaaS. Termboard today offers browser-based semantic modeling with visual graph creation, definitions, validations, and dynamic layouts for large graphs.  ￼

Our SDK will deliver those primitives in a form that’s easy to embed in existing products.

⸻

1. Problem & Vision

1.1 Problem

AI and RAG systems need growing, curated knowledge structures (ontologies, entity graphs, concept maps) to:
	•	Give LLMs consistent terminology.
	•	Improve retrieval (semantic relations, synonyms, hierarchy).
	•	Help users debug/understand system behavior.

Teams currently either:
	•	Use generic drawing tools (Miro, diagrams.net) → no semantics, no integration.
	•	Use fully-opinionated knowledge modeling tools like Termboard → hard to embed into existing products.
	•	Build ad-hoc graph UIs from scratch (React Flow / Cytoscape.js) → expensive and repetitive.  ￼

1.2 Vision

Create a composable SDK that:
	•	Makes it trivial for any AI/RAG app to include a first-class knowledge graph editor.
	•	Encodes best-practice UX for semantic modeling and graph curation.
	•	Lets teams bring their own:
	•	LLM / AI provider,
	•	graph/RAG backend,
	•	business logic and schema constraints.

⸻

2. Product Specification

2.1 Target users
	•	AI infra / platform engineers
Embed the graph editor into internal tooling and RAG control planes.
	•	Product teams building AI copilots / RAG apps
Let users curate domain concepts, entities, relations and map them directly to underlying content.
	•	Knowledge engineers / data modelers
Use domain-specific schemas, run validations, and maintain ontologies without leaving the host product.

2.2 Key use cases
	1.	Domain model editor inside an AI copilot
	•	Define entities (Customer, Policy, Ticket), relations (owns, escalates, depends-on).
	•	Link entities to documents/snippets in the RAG index.
	2.	Document → knowledge graph curation
	•	User uploads corpus / connects to existing RAG.
	•	LLM proposes nodes/edges from selected content.
	•	User accepts/edits; graph updates drive better retrieval or routing.
	3.	Ontology / schema workbench
	•	Knowledge engineers define node/edge types.
	•	Run validations over large graphs; fix issues via UI.
	4.	Interactive debugging view
	•	From a given query/answer, show the subgraph the system relied on.
	•	Allow edits to correct mistaken edges or add disambiguating concepts.

2.3 Success metrics (v1)
	•	Time-to-first-embed:
	•	< 2 hours for a React dev to embed <GraphCanvas /> + <NodeInspector /> with their own backend.
	•	Performance:
	•	Smooth interactions for graphs up to 2–5k nodes / 10k edges in view.
	•	Adoption:
	•	Used in at least 2 internal NeuroGraph apps and 1 external open-source integration within 3 months of release.

2.4 Out of scope (v1)
	•	Real-time multi-user collaboration / CRDTs.
	•	Hosted backend or “cloud project” management.
	•	Full-fledged ontology reasoning (DL, OWL reasoners).
	•	Built-in LLM provider bindings (we expose interfaces — host apps implement them).

⸻

3. Functional Requirements

3.1 Graph editing
	1.	Canvas interactions
	•	Pan, zoom, fit-to-view.
	•	Create nodes via click/double-click or palette drag-and-drop.
	•	Create edges by dragging from a node’s handle to another node.
	•	Select single/multi nodes and edges (shift-click, drag-selection).
	•	Context menu on right-click (delete, duplicate, “expand neighborhood”, etc.).
	•	Undo/redo.
	2.	Node editing
	•	Edit label and description inline.
	•	Change node type (subject to schema rules).
	•	Edit structured properties via form (auto-generated from schema).
	•	Attach/remove external references (document IDs, chunk IDs, database IDs).
	3.	Edge editing
	•	Edit relation type (from schema).
	•	Edit optional label and properties.
	•	Toggle directionality (where allowed).
	4.	Bulk operations
	•	Multi-select move / delete.
	•	Batch type change (where valid).
	•	Bulk accept/reject suggestions.

3.2 Schema / ontology support
	1.	Schema definition
	•	Provide a small, TS-friendly schema DSL:
	•	Node types, edge types.
	•	Allowed source/target type combinations for each edge.
	•	Property definitions per type (name, type, required/optional, enum, etc.).
	2.	Schema-aware UI
	•	Type palette derived from schema.
	•	Edge creation restricted by allowed domain/range.
	•	Forms autogenerated from property definitions.
	3.	Schema evolution
	•	Ability to load updated schema.
	•	Validation to detect nodes/edges that violate newer schema.

3.3 AI assistance

The SDK does not call LLMs itself; instead it defines interfaces that host apps implement.
	1.	Graph-from-text
	•	From user-selected text or documents, request a candidate set of nodes/edges.
	•	Display suggested graph overlay; user can accept all, accept per node/edge, or discard.
	2.	Graph expansion
	•	From a selected node or subgraph, ask LLM to propose:
	•	related concepts/entities,
	•	missing relations,
	•	synonyms/aliases.
	3.	Description and naming assistance
	•	Suggest better labels/descriptions for nodes and relations.
	•	Auto-fill descriptions based on node type and external references.
	4.	Suggested validations / repairs (later phase)
	•	AI proposes fixes for validation issues (e.g., merge duplicate nodes, relabel ambiguous relations).

3.4 Validation & quality
	1.	Built-in rules
	•	Duplicate label detection (per node type).
	•	Dangling edges (missing endpoints).
	•	Edges violating schema domain/range.
	•	Required properties missing.
	•	Isolated nodes (no edges) per configurable rule.
	2.	Custom rules
	•	Host app can register additional validators via plugin API.
	3.	Validation UX
	•	Panel listing issues, grouped by severity (error/warning/info).
	•	Clicking an issue focuses the relevant node/edge and offers auto-fix where possible.

Termboard’s documentation emphasises consistency checks and inheritance of relations as key value props; we’re providing an extensible validation mechanism that can support similar semantics over time.  ￼

3.5 Import/export
	1.	JSON
	•	Default serialization format for the internal graph and schema.
	•	Export/import entire graph or selected subgraph.
	2.	CSV
	•	Minimal import for:
	•	Node list with types.
	•	Edge list referencing node IDs.
	•	Useful for bulk ingestion, similar to Termboard’s bulk import.  ￼
	3.	RDF / JSON-LD (v2)
	•	Helper functions to map node/edge model to triples.

3.6 Embeddability & integration
	1.	Controlled vs uncontrolled mode
	•	Uncontrolled: SDK manages internal state and exposes callbacks (onChange).
	•	Controlled: host passes graph and onGraphChange, and owns state.
	2.	Events
	•	Graph changes (with detailed ChangeSet).
	•	Selection changes.
	•	Layout changes.
	•	Validation runs and results.
	•	AI suggestion events (requested, received, applied, rejected).
	3.	Styling & theming
	•	Default theme with CSS variables.
	•	Ability to override styling via:
	•	CSS variables,
	•	className props,
	•	custom React components for node/edge renderers.
	4.	Auth / network
	•	SDK has no built-in network calls; host app is responsible for all HTTP/LLM calls (similar privacy stance to Termboard’s pure-browser approach).  ￼

3.7 Layout & large-graph handling
	1.	Layouts
	•	Default layout options:
	•	Force-directed (good for general exploration).
	•	Layered / hierarchical (via elkjs for DAG-like structures).  ￼
	•	Radial and grid (simple, built-in).
	•	Layout runs can be:
	•	Global (entire graph).
	•	Scoped to selection.
	2.	Dynamic subgraph mode
	•	For large graphs:
	•	Start with a small ego-network around a root node.
	•	Allow expanding neighbors progressively.
	•	Similar in spirit to Termboard’s interactive graph mode that only displays relevant terms/relations for exploration.  ￼
	3.	Performance optimizations
	•	Viewport-based rendering (only draw visible nodes/edges).
	•	Asynchronous layout computations.
	•	Optional Web Worker for elkjs.

React Flow + elkjs is a common stack today for node-based UIs with automatic layouts, and both are actively maintained open-source projects.  ￼

3.8 Accessibility & keyboard navigation
	•	Keyboard shortcuts for:
	•	selection, delete, undo/redo, zoom, pan, node creation.
	•	Focus management for inspectors and panels.
	•	ARIA attributes for panels and controls (canvas itself has limited A11y; we’ll prioritize proper labeling and alternative list views later).

3.9 Internationalization
	•	All user-visible strings externalized (e.g. i18n key map).
	•	Host can pass translation map or function.

3.10 Telemetry hooks (optional)
	•	Non-opinionated event hooks host can use to send analytics:
	•	NodeCreated, EdgeCreated, NodeEdited, AIProposalAccepted, etc.

⸻

4. Non-Functional Requirements

4.1 Performance
	•	Target: 60fps interactions for graphs up to ~2k nodes / 5k edges on a typical dev laptop.
	•	Layout operations may be slower but should not block UI:
	•	Layout should be cancellable.
	•	Use asynchronous computation where feasible.

4.2 Compatibility
	•	React 18+ (and React 19 once stable).
	•	Modern evergreen browsers (Chrome, Edge, Firefox, Safari).
	•	TypeScript 5+ typings with strict mode support.

4.3 Security & privacy
	•	No network calls inside the SDK.
	•	No storage beyond:
	•	in-memory state,
	•	optional host-configured persistence handlers (e.g., host passes a function to save to localStorage).
	•	Depend only on well-maintained libraries with permissive licenses (React Flow, elkjs, etc., all MIT).  ￼

4.4 Reliability
	•	Deterministic graph operations (pure functions for add/update/delete).
	•	Comprehensive unit tests for:
	•	graph operations,
	•	validation rules,
	•	schema enforcement.

4.5 Licensing
	•	SDK released under MIT.
	•	Clearly document third-party dependencies and their licenses.

⸻

5. System Architecture

5.1 High-level layers
	1.	Core (@neurograph/kg-core)
	•	Pure TypeScript library.
	•	Data model (nodes, edges, schema).
	•	Graph operations (CRUD, diff, apply patch).
	•	Validation.
	•	Serialization utilities.
	2.	React bindings (@neurograph/kg-react)
	•	KnowledgeGraphProvider and hooks.
	•	React Flow integration for rendering.  ￼
	•	Default components (canvas, inspectors, panels, toolbar).
	3.	Plugins & adapters (future packages)
	•	@neurograph/kg-layout-elk — optional elkjs-based layout plugin.  ￼
	•	Backend adapters (Neo4j, Postgres, custom RAG APIs).

5.2 Module boundaries
	•	Core does not import React or DOM APIs.
	•	React layer uses:
	•	React,
	•	React Flow (for node-based UI primitives),
	•	internal core library.
	•	Layout and AI integrations plug into extension points (interfaces) rather than hard dependencies.

5.3 Key external dependencies
	•	React & ReactDOM
	•	@xyflow/react (React Flow) for node-based canvas  ￼
	•	elkjs for layered layout (optional)  ￼
	•	Immer (or equivalent) for immutable updates.
	•	Zustand/Jotai or internal reducer for state (TBD).

⸻

6. Data Model

6.1 Identifiers

type ID = string;

IDs are opaque strings; host app can use UUIDs, ULIDs, database IDs, etc.

6.2 Graph model

export type NodeKind =
  | 'entity'
  | 'concept'
  | 'class'
  | 'document'
  | 'chunk'
  | string;

export type EdgeKind =
  | 'is-a'
  | 'part-of'
  | 'relates-to'
  | 'mentions'
  | string;

export interface ExternalRef {
  source: string; // e.g. 'document', 'chunk', 'db'
  refId: string;
  score?: number;
  metadata?: Record<string, unknown>;
}

export interface KGNode {
  id: ID;
  kind: NodeKind;
  label: string;
  description?: string;
  properties?: Record<string, unknown>;
  externalRefs?: ExternalRef[];
  createdAt?: string;
  updatedAt?: string;
}

export interface KGEdge {
  id: ID;
  kind: EdgeKind;
  from: ID;
  to: ID;
  label?: string;
  properties?: Record<string, unknown>;
  direction?: 'directed' | 'undirected';
  createdAt?: string;
  updatedAt?: string;
}

export interface KnowledgeGraph {
  nodes: KGNode[];
  edges: KGEdge[];
  metadata?: {
    name?: string;
    description?: string;
    schemaVersion?: string;
    [key: string]: unknown;
  };
}

6.3 Schema model

export type FieldType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'enum'
  | 'date'
  | 'json';

export interface FieldDefinition {
  type: FieldType;
  required?: boolean;
  enumValues?: string[];
  defaultValue?: unknown;
  description?: string;
}

export interface NodeTypeDefinition {
  id: string;      // e.g. 'Person'
  label: string;   // human-friendly
  description?: string;
  color?: string;
  icon?: string;
  properties?: Record<string, FieldDefinition>;
  // e.g. required properties for validation
}

export interface EdgeTypeDefinition {
  id: string;      // e.g. 'WorksAt'
  label: string;
  description?: string;
  properties?: Record<string, FieldDefinition>;
  allowedSources?: string[]; // node type IDs
  allowedTargets?: string[]; // node type IDs
  direction?: 'directed' | 'undirected';
  minCardinality?: number;   // optional for advanced validation
  maxCardinality?: number;
}

export interface SchemaDefinition {
  nodeTypes: Record<string, NodeTypeDefinition>;
  edgeTypes: Record<string, EdgeTypeDefinition>;
  metadata?: {
    version?: string;
    name?: string;
  };
}

With this, we can generate forms, palettes, and enforce valid relations.

6.4 ChangeSet / diff model

export type NodeChange =
  | { type: 'node.created'; node: KGNode }
  | { type: 'node.updated'; node: KGNode; before: KGNode }
  | { type: 'node.deleted'; nodeId: ID };

export type EdgeChange =
  | { type: 'edge.created'; edge: KGEdge }
  | { type: 'edge.updated'; edge: KGEdge; before: KGEdge }
  | { type: 'edge.deleted'; edgeId: ID };

export type GraphChange = NodeChange | EdgeChange;

export interface GraphChangeSet {
  changes: GraphChange[];
  timestamp: string;
}

Host apps receive GraphChangeSet via callbacks and can persist or replay them.

⸻

7. React SDK API

7.1 Provider

interface KnowledgeGraphProviderProps {
  initialGraph?: KnowledgeGraph;
  graph?: KnowledgeGraph; // for controlled mode
  onGraphChange?: (next: KnowledgeGraph, changeSet: GraphChangeSet) => void;

  schema: SchemaDefinition;

  ai?: AIConfig; // optional AI integration (see section 8)
  validators?: Validator[];

  permissions?: {
    canEditNode?: (node: KGNode, context: PermissionContext) => boolean;
    canEditEdge?: (edge: KGEdge, context: PermissionContext) => boolean;
  };

  settings?: {
    layout?: LayoutSettings;
    selection?: SelectionSettings;
    undoRedoLimit?: number;
    dynamicMode?: boolean;
  };

  theme?: Partial<ThemeConfig>;
  children: React.ReactNode;
}

Usage:

<KnowledgeGraphProvider
  initialGraph={graphFromBackend}
  schema={mySchema}
  ai={myAIConfig}
  onGraphChange={handleGraphChange}
>
  <GraphLayout />
</KnowledgeGraphProvider>

7.2 Core hooks
	•	useKnowledgeGraph()
	•	Returns { graph, setGraph, applyChangeSet }.
	•	useSelection()
	•	Returns { selectedNodes, selectedEdges, selectNodes, selectEdges }.
	•	useGraphUndoRedo()
	•	Returns { undo, redo, canUndo, canRedo }.
	•	useGraphValidation()
	•	Returns { issues, runValidation }.
	•	useLayout()
	•	Returns { layout, applyLayout }.
	•	useAISuggestions()
	•	Returns { suggestGraphFromText, suggestExpansion, suggestDescriptions, status }.

7.3 UI components
	1.	<GraphCanvas />
	•	Props:
	•	readonly?: boolean
	•	nodeRenderer?: (node: KGNode) => ReactNode
	•	edgeRenderer?: (edge: KGEdge) => ReactNode
	•	onNodeDoubleClick?, onEdgeDoubleClick?
	•	Internally built on React Flow.
	2.	<NodeInspector />
	•	Shows properties for selected node (or list and lets user pick among them).
	•	Auto-form from schema, with ability to override form for specific node types.
	3.	<EdgeInspector />
	4.	<TypePalette />
	•	Lists node types, supports drag-and-drop to canvas.
	5.	<Toolbar />
	•	Buttons for:
	•	zoom, fit, undo/redo,
	•	layout selection,
	•	toggle dynamic/whole-graph mode,
	•	trigger AI suggestions.
	6.	<ValidationPanel />
	•	Lists issues, clickable to focus.
	7.	<AISuggestionsPanel />
	•	Shows pending suggestions; user can accept/reject individually or in bulk.
	8.	<MiniMap /> (optional)
	•	Overview mini-map of current graph.

Host apps can use the defaults, or only use hooks and build custom UIs.

7.4 Events & callbacks

Examples:

interface GraphCanvasProps {
  onSelectionChange?: (selection: {
    nodeIds: ID[];
    edgeIds: ID[];
  }) => void;
  onNodeContextMenu?: (node: KGNode, event: MouseEvent) => void;
}

Events bubble up via provider and direct props.

⸻

8. AI Integration Contract

We define an interface that host apps implement:

export interface SuggestGraphFromTextParams {
  text: string;
  existingGraph: KnowledgeGraph;
  schema: SchemaDefinition;
}

export interface SuggestedNode extends KGNode {
  confidence?: number;
  sourceTextSpan?: { start: number; end: number };
}

export interface SuggestedEdge extends KGEdge {
  confidence?: number;
  sourceTextSpan?: { start: number; end: number };
}

export interface SuggestGraphFromTextResult {
  nodes: SuggestedNode[];
  edges: SuggestedEdge[];
}

export interface SuggestExpansionParams {
  selection: { nodeIds: ID[]; edgeIds?: ID[] };
  existingGraph: KnowledgeGraph;
  schema: SchemaDefinition;
}

export interface SuggestDescriptionsParams {
  nodeIds: ID[];
  existingGraph: KnowledgeGraph;
  schema: SchemaDefinition;
}

export interface AIConfig {
  suggestGraphFromText?: (
    params: SuggestGraphFromTextParams
  ) => Promise<SuggestGraphFromTextResult>;

  suggestExpansion?: (
    params: SuggestExpansionParams
  ) => Promise<SuggestGraphFromTextResult>;

  suggestDescriptions?: (
    params: SuggestDescriptionsParams
  ) => Promise<Record<ID, string>>; // nodeId -> description

  // future: suggestRepairs, suggestSynonyms, etc.
}

The SDK:
	•	Provides input context (current graph, schema, selection).
	•	Renders results as suggestions.
	•	Leaves prompt design and LLM calls to host apps.

This matches Termboard’s concept of using prompt templates and LLMs to extract terms and relations from text, but in a backend-agnostic, embeddable way.  ￼

⸻

9. Validation & Quality Rules

9.1 Built-in validators

Each validator is a function:

export interface ValidationIssue {
  id: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  nodeId?: ID;
  edgeId?: ID;
  ruleId: string;
  metadata?: Record<string, unknown>;
}

export type Validator = (
  graph: KnowledgeGraph,
  schema: SchemaDefinition
) => ValidationIssue[];

Default rules:
	1.	DuplicateLabelsPerType
	•	If two nodes of same type share label (case-insensitive), raise warning (or error if configured).
	2.	DanglingEdges
	•	If edge.from or edge.to is not a node in graph.
	3.	InvalidEdgeTypes
	•	If edge’s node types violate allowedSources/allowedTargets.
	4.	MissingRequiredFields
	•	For node/edge properties where required: true.
	5.	IsolatedNodes
	•	Node has 0 edges and kind is configured as “should be connected”.

9.2 Custom validation

Host apps can pass custom validators:

const validators: Validator[] = [
  ensureCustomerHasAccountEdge,
  ensureTicketPrioritySet,
];


⸻

10. Layout & Large Graph Support

10.1 Layout strategies

export type LayoutAlgorithm = 'force' | 'layered' | 'radial' | 'grid';

export interface LayoutSettings {
  algorithm: LayoutAlgorithm;
  elkOptions?: Record<string, unknown>; // if layered
  animate?: boolean;
}

SDK uses:
	•	React Flow for basic layout and rendering (grid, radial, simple force-like).  ￼
	•	elkjs for layered layout; host can pass elk configuration options.  ￼

10.2 Dynamic mode

Dynamic mode behaviour (for large graphs):
	•	Graph state includes:
	•	visibleNodeIds: ID[]
	•	visibleEdgeIds: ID[]
	•	User can:
	•	Start from a root node.
	•	Expand neighbors up to depth N.
	•	Collapse branches.

This mirrors Termboard’s “interactive graph” concept where only the relevant portion of a large knowledge graph is visible at once.  ￼

⸻

11. RAG Integration Patterns

We don’t define a RAG API, but the spec assumes these patterns:
	1.	Node ↔ document mapping
	•	Nodes carry externalRefs linking to:
	•	documents,
	•	chunks,
	•	DB entities.
	•	RAG layer uses these to:
	•	filter results by graph neighborhood,
	•	annotate responses with node IDs.
	2.	Graph-aware retrieval
	•	Host app may implement retrieval strategies using the graph:
	•	restrict retrieval to nodes related to user’s context,
	•	up-weight chunks linked to nodes in query’s ego-network.
	3.	Debugging flow
	•	When user inspects an answer, host app:
	•	collects relevant node IDs from retrieval,
	•	constructs subgraph,
	•	passes to SDK for visualization and editing.

⸻

12. Example User Flows

12.1 Embedding in a RAG administration UI
	1.	Admin opens “Domain Model” tab.
	2.	Host app fetches current graph + schema from backend.
	3.	<KnowledgeGraphProvider> is initialized with data.
	4.	Admin:
	•	adds node types “Customer”, “Order”, “Product” via config UI (outside SDK),
	•	uses <TypePalette /> + <GraphCanvas /> to model relations.
	5.	On each change, onGraphChange sends diffs to backend.

12.2 Curating knowledge from a document
	1.	User opens a document in the host app.
	2.	Highlights a paragraph and clicks “Extract concepts”.
	3.	Host app calls ai.suggestGraphFromText, passes returned suggestions to SDK.
	4.	<AISuggestionsPanel /> shows proposed nodes & edges.
	5.	User accepts some suggestions; accepted items are merged into the graph and persisted.

12.3 Fixing validation issues
	1.	<ValidationPanel /> shows “8 duplicate Customer nodes”.
	2.	User clicks an issue → canvas zooms to problematic nodes.
	3.	User merges them manually or uses a host-defined “merge duplicates” command.
	4.	Validation re-runs; issue count decreases.

⸻

13. Implementation Plan & Roadmap

13.1 Phase 0 – Design & scaffolding (1–2 weeks)
	•	Confirm data model & schema types.
	•	Create monorepo with packages:
	•	@neurograph/kg-core
	•	@neurograph/kg-react
	•	Set up linting, testing, Storybook (or similar) for components.

13.2 Phase 1 – Core + basic React UI (4–6 weeks)
	•	Implement core graph operations, serialization, basic validation.
	•	Implement KnowledgeGraphProvider and base hooks.
	•	Integrate React Flow for <GraphCanvas /> with:
	•	node/edge creation & editing,
	•	selection,
	•	basic layout,
	•	undo/redo.
	•	Build <NodeInspector />, <EdgeInspector />, <TypePalette />.

13.3 Phase 2 – AI hooks, validation panel, layout plugins (4–6 weeks)
	•	Implement AI interfaces and <AISuggestionsPanel />.
	•	Add <ValidationPanel /> with built-in validators.
	•	Implement layout abstraction and optional elkjs-based layered layout.
	•	Implement dynamic subgraph mode for large graphs.

13.4 Phase 3 – Polish, docs, and examples (4 weeks)
	•	Create:
	•	“RAG admin UI” example app.
	•	“Ontology workbench” example app.
	•	Documentation:
	•	Quick start,
	•	API reference,
	•	architecture overview.
	•	Performance profile and optimize hot paths.

⸻

14. Open Questions & Decisions
	1.	State management choice
	•	Internal-only via React context + reducer,
	•	or expose Zustand store for better tooling?
	2.	Minimum React version
	•	Target React 18+; decide whether to specifically support React 19 APIs once stable.
	3.	How opinionated should styles be?
	•	Pure CSS variables vs. Tailwind-friendly default?
	4.	RDF/OWL support level
	•	v1: simple export helpers only.
	•	v2+: richer ontology features (subclass, equivalentClass, etc.) and reasoning hooks.
	5.	Collaboration roadmap
	•	Should we design the state model with CRDT compatibility (Yjs) from the start to ease future real-time 
