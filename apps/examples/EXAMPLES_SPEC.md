# SemantiKit Example Applications - Comprehensive Specification

**Version:** 1.0  
**Last Updated:** December 8, 2024  
**Status:** Implementation Phase

## Overview

This document defines the specifications for **four production-quality example applications** that demonstrate SemantiKit's capabilities. Each application showcases different aspects of the library while being useful, deployable tools.

---

## 1. RAG Admin UI: Domain Model Editor

**Purpose:** A knowledge management interface for building and maintaining domain models used in RAG (Retrieval-Augmented Generation) systems.

### Key Features

1. **Visual Domain Model Editor**
   - Node-based interface for creating entities and relationships
   - Drag-and-drop canvas with zoom/pan controls
   - Real-time graph visualization using React Flow
   - Property inspector for editing node/edge attributes

2. **Document Upload & Processing**
   - Multi-file upload (PDF, DOCX, TXT, MD)
   - AI-powered entity extraction
   - Automatic relationship detection
   - Batch processing with progress tracking

3. **Schema Management**
   - Define entity types and relationship types
   - Property templates with validation rules
   - Schema versioning and migration
   - Import/export schema definitions (JSON)

4. **Search & Query**
   - Full-text search across nodes
   - Filter by entity type and properties
   - Relationship path finder
   - Saved queries and filters

5. **Collaboration Features**
   - Export knowledge graph (JSON, GraphML, CSV)
   - Import from external sources
   - Version history and change tracking
   - Comment and annotation system

### Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript
- **Graph Visualization:** React Flow + SemantiKit
- **UI Components:** Tailwind CSS, Radix UI, Lucide Icons
- **State Management:** Zustand
- **AI Integration:** OpenAI API (optional, configurable)
- **File Processing:** pdf-parse, mammoth (DOCX)
- **Deployment:** Vercel

### User Interface

```
┌─────────────────────────────────────────────────────────────┐
│ [RAG Admin] [File] [Edit] [View] [Tools]       [@User] [⚙] │
├─────────────┬───────────────────────────────────────────────┤
│             │                                               │
│  Schema     │              Graph Canvas                     │
│  --------   │    ┌──────┐        ┌──────┐                 │
│  □ Person   │    │Person│───────▶│Project│                │
│  □ Project  │    │ Alice│  works  │  MVP  │                │
│  □ Document │    └──────┘   on    └──────┘                │
│  □ Concept  │                                              │
│             │    [+ Add Node] [Auto Layout] [Fit View]    │
│  Filters    │                                              │
│  -------    │                                              │
│  Type: All  │                                              │
│  Search: __ │                                              │
│             │                                              │
└─────────────┴───────────────────────────────────────────────┘
│ Properties: Selected Node "Alice"                          │
│ Name: Alice | Type: Person | Role: Engineer                │
└─────────────────────────────────────────────────────────────┘
```

### File Structure

```
apps/examples/rag-admin/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Main editor page
│   │   ├── layout.tsx               # App layout
│   │   └── api/
│   │       ├── extract/route.ts     # AI extraction endpoint
│   │       └── process/route.ts     # Document processing
│   ├── components/
│   │   ├── GraphCanvas.tsx          # Main graph editor
│   │   ├── SchemaPanel.tsx          # Schema management
│   │   ├── PropertyInspector.tsx    # Node/edge properties
│   │   ├── DocumentUpload.tsx       # File upload UI
│   │   ├── SearchPanel.tsx          # Search and filters
│   │   └── ExportDialog.tsx         # Export options
│   ├── lib/
│   │   ├── graph-store.ts           # Zustand store
│   │   ├── ai-extractor.ts          # AI entity extraction
│   │   ├── document-parser.ts       # File parsing
│   │   └── export-utils.ts          # Export formats
│   └── types/
│       └── index.ts                 # TypeScript types
├── public/
│   └── examples/                    # Sample data
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
└── README.md
```

### Implementation Milestones

**Week 19-20:**
- [ ] Project setup (Next.js, dependencies)
- [ ] Basic graph canvas with React Flow
- [ ] Schema panel with CRUD operations
- [ ] Property inspector
- [ ] Sample data and mock entities

**Week 21:**
- [ ] Document upload UI
- [ ] AI entity extraction (optional)
- [ ] Search and filter functionality

**Week 22:**
- [ ] Export/import features
- [ ] Polish and responsive design
- [ ] Deploy to Vercel

---

## 2. Ontology Workbench: Schema-Driven Graph Editor

**Purpose:** A professional tool for creating, validating, and managing ontologies (formal specifications of domain knowledge).

### Key Features

1. **Split-Pane Interface**
   - **Left:** Schema definition editor (YAML/JSON)
   - **Center:** Visual graph representation
   - **Right:** Validation dashboard

2. **Schema Editor**
   - Syntax-highlighted code editor (Monaco)
   - Auto-completion for schema properties
   - Real-time validation feedback
   - Templates for common ontologies (FOAF, Dublin Core, etc.)

3. **Visual Graph Editor**
   - Create nodes conforming to defined types
   - Enforce relationship constraints
   - Visual indicators for validation errors
   - Hierarchical and class-instance views

4. **Validation Dashboard**
   - Real-time constraint checking
   - Cardinality validation
   - Type compatibility checks
   - Error highlighting with fix suggestions

5. **Import/Export**
   - OWL (Web Ontology Language) import/export
   - RDF/XML format support
   - JSON-LD output
   - GraphML for visualization tools

### Tech Stack

- **Frontend:** Vite, React 18, TypeScript
- **Editor:** Monaco Editor (VS Code's editor)
- **Graph Visualization:** React Flow + SemantiKit
- **UI Components:** Mantine UI, Tabler Icons
- **Schema Validation:** Ajv (JSON Schema)
- **RDF/OWL:** rdflib.js
- **Deployment:** Netlify

### User Interface

```
┌──────────────────────────────────────────────────────────────┐
│ [Ontology Workbench] [File] [Edit] [Validate]    [@User] [⚙]│
├────────────────┬─────────────────────┬──────────────────────┤
│ Schema Editor  │   Visual Graph      │  Validation Panel    │
│ ════════════   │                     │  ════════════        │
│ nodeTypes:     │     ┌────────┐      │  ✓ All constraints   │
│   Person:      │     │ Person │      │    satisfied         │
│     props:     │     ├────────┤      │                      │
│       name: *  │     │  name  │      │  ⚠ Warnings: 2       │
│       email:   │     │  email │      │  • Missing optional  │
│   Organization │     └────────┘      │    property: phone   │
│     props:     │          │          │                      │
│       name: *  │    works for        │  ✗ Errors: 0         │
│                │          │          │                      │
│ edgeTypes:     │          ▼          │  [Run Full Check]    │
│   WorksFor:    │  ┌────────────┐     │                      │
│     source:    │  │Organization│     │                      │
│       Person   │  └────────────┘     │                      │
│     target:    │                     │                      │
│       Org      │                     │                      │
└────────────────┴─────────────────────┴──────────────────────┘
```

### File Structure

```
apps/examples/ontology-workbench/
├── src/
│   ├── App.tsx                      # Main application
│   ├── components/
│   │   ├── SchemaEditor.tsx         # Monaco editor
│   │   ├── GraphView.tsx            # Visual graph
│   │   ├── ValidationPanel.tsx      # Validation results
│   │   ├── Toolbar.tsx              # Top toolbar
│   │   └── TemplateSelector.tsx     # Schema templates
│   ├── lib/
│   │   ├── schema-validator.ts      # Schema validation
│   │   ├── ontology-parser.ts       # OWL/RDF parsing
│   │   ├── constraint-checker.ts    # Graph constraints
│   │   └── export-formats.ts        # Format converters
│   ├── hooks/
│   │   ├── useSchemaSync.ts         # Sync schema ↔ graph
│   │   └── useValidation.ts         # Validation state
│   ├── templates/
│   │   ├── foaf.yaml                # Friend-of-a-Friend
│   │   ├── dublin-core.yaml         # Dublin Core
│   │   └── custom.yaml              # Custom template
│   └── types/
│       └── index.ts
├── public/
│   └── examples/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### Implementation Milestones

**Week 21:**
- [ ] Project setup (Vite, dependencies)
- [ ] Three-pane layout
- [ ] Monaco editor integration
- [ ] Basic graph visualization

**Week 22:**
- [ ] Real-time schema ↔ graph sync
- [ ] Validation dashboard
- [ ] OWL/RDF import/export
- [ ] Schema templates

**Week 23:**
- [ ] Polish and error handling
- [ ] Responsive design
- [ ] Deploy to Netlify

---

## 3. Document Curator: AI-Assisted Knowledge Extraction

**Purpose:** An intelligent document management system that extracts knowledge from documents and builds a semantic graph.

### Key Features

1. **Document Library**
   - Grid/list view of uploaded documents
   - Preview pane with highlighting
   - Tag and categorize documents
   - Full-text search

2. **AI Extraction Workflow**
   - Upload document → Auto-extract entities
   - Review and approve/reject suggestions
   - Link extracted concepts to existing nodes
   - Confidence scores for each extraction

3. **Entity Linking**
   - Suggest links between document entities
   - Merge duplicate entities
   - Coreference resolution
   - Entity disambiguation

4. **Knowledge Graph View**
   - Document-centric graph visualization
   - Show which documents contributed to each node
   - Trace entity mentions back to source
   - Highlight confidence/provenance

5. **Export & Integration**
   - Export curated knowledge graph
   - Generate entity index
   - Create RAG-ready embeddings (optional)
   - API for programmatic access

### Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript
- **Document Viewer:** react-pdf, ProseMirror
- **Graph Visualization:** React Flow + SemantiKit
- **UI Components:** Shadcn/ui, Lucide Icons
- **AI Integration:** OpenAI API, Anthropic Claude
- **Vector DB (optional):** Pinecone, Weaviate
- **Deployment:** Vercel

### User Interface

```
┌──────────────────────────────────────────────────────────────┐
│ [Document Curator] [Library] [Extract] [Review]  [@User] [⚙]│
├──────────────────┬───────────────────────────────────────────┤
│  Document List   │   Document Preview + Extraction           │
│  ═════════════   │                                           │
│  [📄] Report Q3  │   The Paris Agreement was signed in...    │
│  [📄] Meeting... │         ^^^^^^^^^^^^ (Entity: Treaty)     │
│  [📑] Proposal   │                                           │
│  [📄] Research   │   Extracted Entities (5):                 │
│                  │   ┌────────────────────────────────┐      │
│  [+ Upload]      │   │ • Paris Agreement (Treaty) ✓   │      │
│                  │   │ • Climate Change (Concept) ✓   │      │
│  Filters:        │   │ • United Nations (Org) ⚠       │      │
│  □ Not Reviewed  │   │ • 2015 (Date) ✓                │      │
│  □ Needs Action  │   │ • Carbon Emissions (Metric) ⚠  │      │
│  □ Completed     │   └────────────────────────────────┘      │
│                  │                                           │
│                  │   [Approve All] [Review One by One]       │
└──────────────────┴───────────────────────────────────────────┘
│  Knowledge Graph (12 nodes, 18 edges) [View Full Graph →]   │
└──────────────────────────────────────────────────────────────┘
```

### File Structure

```
apps/examples/document-curator/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Main curator page
│   │   ├── graph/page.tsx           # Full graph view
│   │   ├── layout.tsx
│   │   └── api/
│   │       ├── extract/route.ts     # AI extraction
│   │       ├── link/route.ts        # Entity linking
│   │       └── embed/route.ts       # Generate embeddings
│   ├── components/
│   │   ├── DocumentList.tsx         # Document library
│   │   ├── DocumentViewer.tsx       # PDF/text viewer
│   │   ├── ExtractionPanel.tsx      # Entity extraction UI
│   │   ├── EntityReview.tsx         # Review suggestions
│   │   ├── GraphView.tsx            # Knowledge graph
│   │   └── LinkingSuggestions.tsx   # Link suggestions
│   ├── lib/
│   │   ├── document-store.ts        # Document state
│   │   ├── entity-extractor.ts      # AI extraction
│   │   ├── entity-linker.ts         # Link detection
│   │   ├── confidence-scorer.ts     # Confidence scoring
│   │   └── embedding-generator.ts   # Vector embeddings
│   └── types/
│       └── index.ts
├── public/
│   └── samples/                     # Sample documents
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
└── README.md
```

### Implementation Milestones

**Week 23:**
- [ ] Project setup (Next.js, dependencies)
- [ ] Document library UI
- [ ] Document viewer with highlighting
- [ ] AI entity extraction

**Week 24:**
- [ ] Entity review workflow
- [ ] Knowledge graph visualization
- [ ] Entity linking and merging
- [ ] Export features

**Post-launch:**
- [ ] Deploy to Vercel
- [ ] Add embedding generation
- [ ] Polish and documentation

---

## 4. Debugging Viewer: Visualize RAG Retrieval Paths (Stretch)

**Purpose:** A debugging tool for RAG systems that visualizes the retrieval process and shows how documents and chunks are selected.

### Key Features

1. **Retrieval Trace Visualization**
   - Show query → retrieval → ranking → selection flow
   - Display vector similarity scores
   - Visualize re-ranking steps
   - Show final context window

2. **Document Chunk Explorer**
   - View all chunks for a document
   - See embedding metadata
   - Display chunk relationships
   - Filter by similarity threshold

3. **Query Analysis**
   - Show query embedding
   - Display nearest neighbors
   - Compare different retrieval strategies
   - A/B test different parameters

4. **Performance Metrics**
   - Latency breakdown (embedding, search, ranking)
   - Retrieval quality scores
   - Coverage analysis
   - Cost tracking (API calls)

5. **Interactive Playground**
   - Test queries in real-time
   - Adjust retrieval parameters
   - Compare retrieval methods
   - Export debug reports

### Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript
- **Graph Visualization:** React Flow + SemantiKit, D3.js
- **UI Components:** Tailwind CSS, Headless UI
- **Data Viz:** Recharts, Visx
- **State Management:** React Query
- **Deployment:** Vercel

### User Interface

```
┌──────────────────────────────────────────────────────────────┐
│ [RAG Debugger] [Trace] [Compare] [Metrics]      [@User] [⚙] │
├──────────────────────────────────────────────────────────────┤
│  Query: "What is the Paris Agreement?"                       │
│  [🔍 Analyze]  Strategy: Hybrid  Top-K: 5  [⚙ Settings]     │
├──────────────────────────────────────────────────────────────┤
│                    Retrieval Trace                           │
│                                                              │
│   [Query]──▶[Embed]──▶[Vector Search]──▶[Re-rank]──▶[LLM]  │
│    200ms      50ms        100ms          30ms       1.2s     │
│                                                              │
│   Retrieved Chunks (5):                                      │
│   ┌─────────────────────────────────────────────────┐       │
│   │ 1. doc_15_chunk_3  Score: 0.89  Rank: 1         │       │
│   │    "The Paris Agreement... signed in 2015..."   │       │
│   │                                                  │       │
│   │ 2. doc_22_chunk_7  Score: 0.84  Rank: 3 → 2     │       │
│   │    "Climate treaty frameworks include..."       │       │
│   └─────────────────────────────────────────────────┘       │
│                                                              │
│   [View Graph] [Compare Strategies] [Export Trace]          │
└──────────────────────────────────────────────────────────────┘
```

### File Structure

```
apps/examples/debugging-viewer/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Main debugger
│   │   ├── compare/page.tsx         # Strategy comparison
│   │   ├── metrics/page.tsx         # Performance dashboard
│   │   ├── layout.tsx
│   │   └── api/
│   │       ├── trace/route.ts       # Trace generation
│   │       └── analyze/route.ts     # Query analysis
│   ├── components/
│   │   ├── TraceVisualization.tsx   # Flow diagram
│   │   ├── ChunkExplorer.tsx        # Chunk viewer
│   │   ├── QueryAnalyzer.tsx        # Query analysis
│   │   ├── MetricsDashboard.tsx     # Performance metrics
│   │   └── ComparisonView.tsx       # Strategy comparison
│   ├── lib/
│   │   ├── trace-recorder.ts        # Record RAG trace
│   │   ├── similarity-calculator.ts # Compute scores
│   │   ├── performance-analyzer.ts  # Analyze metrics
│   │   └── export-trace.ts          # Export debug data
│   └── types/
│       └── index.ts
├── public/
│   └── sample-traces/               # Example traces
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
└── README.md
```

### Implementation Milestones

**Stretch Goal (Post Week 24):**
- [ ] Project setup
- [ ] Basic trace visualization
- [ ] Chunk explorer
- [ ] Query analysis
- [ ] Metrics dashboard
- [ ] Deploy to Vercel

---

## Shared Infrastructure

### Common Dependencies

All examples will share:

```json
{
  "dependencies": {
    "@semantikit/core": "workspace:*",
    "@semantikit/react": "workspace:*",
    "@semantikit/layouts": "workspace:*",
    "@semantikit/validators": "workspace:*",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "reactflow": "^11.10.0",
    "typescript": "^5.3.0"
  }
}
```

### Shared Components

Create a shared components library:

```
apps/examples/shared/
├── components/
│   ├── GraphCanvas.tsx              # Reusable graph canvas
│   ├── PropertyPanel.tsx            # Property inspector
│   ├── SearchBar.tsx                # Search component
│   └── ExportButton.tsx             # Export dialog
├── hooks/
│   ├── useGraphState.ts             # Graph state hook
│   ├── useUndo.ts                   # Undo/redo
│   └── useLayout.ts                 # Layout management
└── utils/
    ├── graph-serialization.ts       # JSON/GraphML export
    ├── sample-data.ts               # Test data
    └── validation.ts                # Shared validation
```

### Deployment Strategy

1. **Individual Deployments:**
   - Each app deployed to its own subdomain
   - `rag-admin.semantikit.dev`
   - `ontology.semantikit.dev`
   - `curator.semantikit.dev`
   - `debugger.semantikit.dev`

2. **Unified Landing Page:**
   - Create `examples.semantikit.dev` with links to all apps
   - Screenshots and descriptions
   - Live demos and GitHub links

3. **Documentation Integration:**
   - Add examples to main docs site
   - Tutorial for each application
   - API usage examples

---

## Success Criteria

### Quality Metrics

Each application must meet:

- ✅ **Functional:** All core features working
- ✅ **Polished:** Professional UI/UX
- ✅ **Documented:** README with setup instructions
- ✅ **Deployed:** Live, publicly accessible
- ✅ **TypeScript:** 100% TypeScript with strict mode
- ✅ **Responsive:** Works on desktop and tablet
- ✅ **Fast:** < 3s initial load time
- ✅ **Accessible:** Basic keyboard navigation

### Documentation Requirements

Each app needs:

1. **README.md** - Setup, features, usage
2. **ARCHITECTURE.md** - Technical details
3. **TUTORIAL.md** - Step-by-step guide
4. **Screenshots** - UI screenshots in `/docs/images/`

### Timeline

- **Week 19-20:** RAG Admin (complete)
- **Week 21-22:** Ontology Workbench (complete)
- **Week 23-24:** Document Curator (complete)
- **Post-launch:** Debugging Viewer (stretch)

---

## Next Steps

1. ✅ Create this specification document
2. ⏳ Begin RAG Admin implementation (Week 19)
3. ⏳ Set up shared component library
4. ⏳ Create example landing page
5. ⏳ Document each application as built

---

**Document Version:** 1.0  
**Author:** Codegen AI  
**Last Updated:** December 8, 2024

