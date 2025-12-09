<div align="center">

# 🧠 SemantiKit

### *Build Knowledge Graphs That Actually Work*

[![CI](https://github.com/geastham/SemantiKit/actions/workflows/ci.yml/badge.svg)](https://github.com/geastham/SemantiKit/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev/)

**A powerful, flexible TypeScript SDK for building production-ready knowledge graph applications**

[Get Started](#-quick-start) • [Live Examples](#-live-examples) • [Documentation](#-documentation) • [API Reference](#-packages)

</div>

---

## 🎯 What is SemantiKit?

SemantiKit is the **missing toolkit for building knowledge graph UIs**. Whether you're building an AI copilot, RAG system, or semantic search engine, SemantiKit gives you production-ready React components and a headless core engine to visualize, edit, and manage semantic data.

**Think:** *React Flow meets Knowledge Graphs* — but purpose-built for AI/RAG applications.

### ✨ Why SemantiKit?

🎨 **Beautiful by Default** — Drop-in React components with professional UI/UX  
⚡ **Lightning Fast** — Handles 5,000+ nodes without breaking a sweat  
🔧 **Fully Customizable** — Headless core + composable components  
🤖 **AI-First** — Built-in hooks for LLM integration and semantic search  
📦 **Framework Agnostic** — Use with Next.js, Vite, Remix, or vanilla React  
🔒 **Type-Safe** — End-to-end TypeScript with full IntelliSense support  

---

## 🚀 Quick Start

### Install

```bash
# Using npm
npm install @semantikit/core @semantikit/react

# Using pnpm
pnpm add @semantikit/core @semantikit/react

# Using yarn
yarn add @semantikit/core @semantikit/react
```

### Basic Usage

```tsx
import { GraphCanvas, useGraph } from '@semantikit/react';
import { ForceDirectedLayout } from '@semantikit/layouts';

function MyKnowledgeGraph() {
  const { nodes, edges, addNode, addEdge } = useGraph({
    layout: new ForceDirectedLayout(),
  });

  return (
    <GraphCanvas
      nodes={nodes}
      edges={edges}
      onNodeClick={(node) => console.log('Clicked:', node)}
      onEdgeCreate={(from, to) => addEdge(from, to)}
    />
  );
}
```

**That's it!** You now have a fully interactive knowledge graph with:
- ✅ Drag-and-drop node editing
- ✅ Pan, zoom, and fit-to-view
- ✅ Schema validation
- ✅ Undo/redo support
- ✅ Export to JSON/RDF

---

## 🎬 Live Examples

See SemantiKit in action with our **four production-ready example applications**:

### 1. 🎯 RAG Admin UI — *Domain Model Editor*
> **Status:** ✅ **Production Ready** | [View Demo](#) | [Source Code](./apps/examples/rag-admin)

A complete admin interface for managing domain models in RAG systems. Define entities, relationships, and schemas with an intuitive visual editor.

**Features:**
- Visual graph editing with React Flow
- Schema-based validation
- Document upload and entity linking
- Undo/redo with keyboard shortcuts
- JSON import/export

**Tech:** Next.js 14 • Zustand • React Flow • Tailwind CSS  
**Lines of Code:** ~2,200

---

### 2. 🔬 Ontology Workbench — *Schema-Driven Editor*
> **Status:** 🚧 **In Development** | [Source Code](./apps/examples/ontology-workbench)

A professional ontology editor with Monaco-powered schema editing and real-time validation.

**Features:**
- Monaco Editor for OWL/RDF schemas
- Pre-built templates (FOAF, Schema.org, Dublin Core)
- Real-time constraint validation
- Visual graph synchronization
- Export to OWL, JSON-LD, Turtle

**Tech:** Vite • Monaco Editor • React Flow • Mantine UI  
**Target:** ~2,000 LOC

---

### 3. 📄 Document Curator — *AI-Assisted Extraction*
> **Status:** 📋 **Planned** | [Source Code](./apps/examples/document-curator)

Transform documents into knowledge graphs using AI-powered entity extraction.

**Features:**
- PDF/DOCX document viewing
- LLM-based entity extraction
- Interactive entity review workflow
- Confidence scoring and suggestions
- Automatic entity linking

**Tech:** Next.js 14 • react-pdf • ProseMirror • OpenAI API  
**Target:** ~2,500 LOC

---

### 4. 🐛 Debugging Viewer — *RAG Trace Visualizer*
> **Status:** ✅ **90% Complete** | [View Demo](#) | [Source Code](./apps/examples/debugging-viewer)

Visualize and debug RAG system traces with detailed performance metrics.

**Features:**
- Visual trace flow diagrams
- Latency breakdown analysis
- Chunk ranking and scoring
- Strategy comparison view
- Performance metrics dashboard

**Tech:** Next.js 14 • D3.js • Recharts • React Flow  
**Lines of Code:** ~2,100

---

## 📦 Packages

SemantiKit is a **monorepo** with modular packages — use what you need:

| Package | Description | Size | Status |
|---------|-------------|------|--------|
| [`@semantikit/core`](./packages/core) | 🧠 Headless graph engine with CRUD ops | ![npm bundle size](https://img.shields.io/bundlephobia/minzip/@semantikit/core?label=%20) | ✅ Alpha |
| [`@semantikit/react`](./packages/react) | ⚛️ React components & hooks | ![npm bundle size](https://img.shields.io/bundlephobia/minzip/@semantikit/react?label=%20) | ✅ Alpha |
| [`@semantikit/layouts`](./packages/layouts) | 📐 Graph layout algorithms (force, hierarchical, circular) | ![npm bundle size](https://img.shields.io/bundlephobia/minzip/@semantikit/layouts?label=%20) | ✅ Alpha |
| [`@semantikit/validators`](./packages/validators) | ✅ Schema validation & constraints | ![npm bundle size](https://img.shields.io/bundlephobia/minzip/@semantikit/validators?label=%20) | ✅ Alpha |

### Core Features by Package

#### `@semantikit/core`
- Graph CRUD operations
- Schema management
- History tracking (undo/redo)
- Serialization (JSON, RDF)
- Event system for reactivity

#### `@semantikit/react`
- `<GraphCanvas />` — Interactive graph viewer
- `<NodeInspector />` — Property editing panel
- `<SchemaEditor />` — Schema definition UI
- `useGraph()` — Graph state management hook
- `useSelection()` — Node/edge selection hook

#### `@semantikit/layouts`
- Force-directed layout
- Hierarchical layout
- Circular layout
- Grid layout
- Custom layout API

#### `@semantikit/validators`
- JSON Schema validation
- OWL constraint checking
- Custom validation rules
- Type inference

---

## 🎨 Key Features

### 🎯 Production-Ready Components

```tsx
import { GraphCanvas, NodeInspector, Toolbar } from '@semantikit/react';

<div className="graph-editor">
  <Toolbar
    onUndo={handleUndo}
    onRedo={handleRedo}
    onExport={handleExport}
  />
  <GraphCanvas
    nodes={nodes}
    edges={edges}
    onNodeCreate={handleCreate}
  />
  <NodeInspector
    selectedNode={selectedNode}
    onPropertyChange={handleChange}
  />
</div>
```

### 🔌 Backend Agnostic

Bring your own backend — SemantiKit works with any data source:

```tsx
const graph = useGraph({
  // Load from your API
  loader: async () => fetchFromAPI('/graph'),
  // Save to your backend
  persister: async (data) => saveToAPI('/graph', data),
});
```

### 🤖 AI Integration Ready

Built-in patterns for LLM integration:

```tsx
const { suggestEntities } = useAISuggestions({
  onExtract: async (text) => {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: `Extract entities from: ${text}` }],
    });
    return parseEntities(response);
  },
});
```

### ⚡ Performance Optimized

- **Virtualized rendering** for 5,000+ nodes
- **Incremental layout** for smooth interactions
- **Web Workers** for heavy computations
- **Lazy loading** for large graphs

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│          Your Application               │
│   (Next.js, Vite, Remix, etc.)         │
└─────────────────┬───────────────────────┘
                  │
         ┌────────┴────────┐
         │  @semantikit/   │
         │     react       │  ← React Components & Hooks
         └────────┬────────┘
                  │
         ┌────────┴────────┐
         │  @semantikit/   │
         │      core       │  ← Headless Graph Engine
         └────────┬────────┘
                  │
    ┌─────────────┴─────────────┐
    │                           │
┌───┴──────┐           ┌────────┴────────┐
│ layouts  │           │   validators    │
└──────────┘           └─────────────────┘
```

**Headless Core** — Framework-agnostic TypeScript engine  
**React Layer** — Pre-built components with full customization  
**Layout Engine** — Pluggable algorithms for graph positioning  
**Validation Layer** — Schema enforcement and type checking  

---

## 📚 Documentation

### 📖 Getting Started
- [Installation Guide](./docs/getting-started.md) — Set up in 5 minutes
- [Core Concepts](./docs/core-concepts.md) — Understand the architecture
- [API Reference](./apps/docs) — Complete API documentation

### 🎓 Tutorials
- [Build a Domain Model Editor](./apps/examples/rag-admin) — 30-minute tutorial
- [Add AI Entity Extraction](./apps/examples/document-curator) — LLM integration
- [Debug RAG Systems](./apps/examples/debugging-viewer) — Trace visualization

### 🏛️ Architecture Docs
- [Technical Architecture](./docs/TECHNICAL_ARCHITECTURE.md) — System design
- [ADRs](./docs/adrs/) — Architecture decision records
- [Phase 3 Progress](./docs/PHASE_3_PROGRESS.md) — Development roadmap

---

## 🛠️ Development

### Prerequisites

- **Node.js** 18.0.0+
- **pnpm** 8.0.0+

### Setup

```bash
# Clone the repo
git clone https://github.com/geastham/SemantiKit.git
cd SemantiKit

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run all tests
pnpm test

# Start development mode (watch mode)
pnpm dev
```

### Project Structure

```
SemantiKit/
├── packages/
│   ├── core/              # @semantikit/core
│   ├── react/             # @semantikit/react
│   ├── layouts/           # @semantikit/layouts
│   └── validators/        # @semantikit/validators
├── apps/
│   ├── examples/          # 4 production example apps
│   │   ├── rag-admin/         # ✅ Complete
│   │   ├── ontology-workbench/ # 🚧 In Progress
│   │   ├── document-curator/   # 📋 Planned
│   │   └── debugging-viewer/   # ✅ 90% Complete
│   └── docs/              # Documentation site
└── docs/                  # Architecture & ADRs
```

### Available Scripts

```bash
pnpm build           # Build all packages
pnpm dev             # Watch mode for all packages
pnpm test            # Run all tests
pnpm test:coverage   # Generate coverage reports
pnpm lint            # Lint all packages
pnpm format          # Format with Prettier
pnpm typecheck       # TypeScript type checking
```

---

## 🎯 Use Cases

### 🤖 AI/RAG Applications
Build semantic layers for AI systems:
- Define domain models for LLM context
- Visualize entity relationships
- Debug retrieval strategies

### 📊 Knowledge Management
Create internal knowledge bases:
- Company wikis with semantic links
- Research databases
- Documentation systems

### 🔍 Semantic Search
Power advanced search experiences:
- Visual query builders
- Faceted navigation
- Relationship exploration

### 🎓 Education & Research
Teach semantic web concepts:
- Interactive ontology editors
- Graph algorithm visualization
- Schema validation tools

---

## 🤝 Contributing

We welcome contributions! SemantiKit is an open-source project built for the community.

### How to Contribute

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

See our [Contributing Guide](./CONTRIBUTING.md) for detailed guidelines.

### Development Workflow

- We use **Conventional Commits** for commit messages
- **All PRs** require passing tests and linting
- **Type safety** is enforced — no `any` types!
- **Documentation** is required for new features

---

## 🗺️ Roadmap

### ✅ Phase 0 — Foundation (Complete)
- ✅ Monorepo structure with Turborepo
- ✅ TypeScript configuration
- ✅ Testing infrastructure
- ✅ CI/CD pipelines

### 🚀 Phase 1 — Core SDK (Current)
- ✅ Headless graph engine (`@semantikit/core`)
- 🚧 React components (`@semantikit/react`)
- 🚧 Layout algorithms (`@semantikit/layouts`)
- 🚧 Schema validation (`@semantikit/validators`)

### 🎨 Phase 2 — Example Apps (In Progress)
- ✅ RAG Admin UI (100% complete)
- ✅ Debugging Viewer (90% complete)
- 🚧 Ontology Workbench (15% complete)
- 📋 Document Curator (planned)

### 🌟 Phase 3 — Polish & Release
- 📋 Performance optimization
- 📋 Accessibility compliance (WCAG 2.1 AA)
- 📋 Documentation site (Docusaurus)
- 📋 NPM package publishing
- 📋 v1.0.0 stable release

---

## 📊 Project Status

**Current Version:** `0.1.0-alpha.1`  
**Status:** Alpha — Under Active Development  
**Lines of Code:** ~7,650 (SDK + Examples + Docs)  
**Test Coverage:** Target 80%+  
**Performance:** 5,000+ nodes @ 60fps

**⚠️ Alpha Notice:** The API is subject to change. Production use is not recommended at this time.

---

## 🏆 Inspiration

SemantiKit draws inspiration from amazing projects:

- [React Flow](https://reactflow.dev/) — For interactive graph UIs
- [Cytoscape.js](https://js.cytoscape.org/) — For graph algorithms
- [Termboard](https://termboard.com/) — For semantic modeling UX
- [Obsidian](https://obsidian.md/) — For knowledge management patterns

---

## 📄 License

MIT © Garrett Eastham

---

## 🔗 Links

- 📚 [Documentation](https://geastham.github.io/SemantiKit)
- 📦 [NPM Packages](https://www.npmjs.com/org/semantikit)
- 🐛 [Issue Tracker](https://github.com/geastham/SemantiKit/issues)
- 💬 [Discussions](https://github.com/geastham/SemantiKit/discussions)
- 🐦 [Twitter/X](#) — Coming soon
- 💼 [LinkedIn](#) — Coming soon

---

<div align="center">

**Built with ❤️ by the SemantiKit Team**

*Making knowledge graphs accessible to everyone*

[⭐ Star us on GitHub](https://github.com/geastham/SemantiKit) • [🚀 Get Started](#-quick-start) • [📖 Read the Docs](#-documentation)

</div>

