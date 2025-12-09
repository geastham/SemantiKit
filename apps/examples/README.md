# SemantiKit Example Applications

Production-ready example applications demonstrating SemantiKit's capabilities for building knowledge graph applications.

## 🎯 Overview

These four example applications showcase different use cases and features of SemantiKit:

| Application | Purpose | Status | Tech Stack |
|-------------|---------|--------|------------|
| **[RAG Admin UI](#1-rag-admin-ui)** | Domain model editor for RAG systems | 🚧 In Progress | Next.js, React Flow |
| **[Ontology Workbench](#2-ontology-workbench)** | Schema-driven graph editor | 📋 Planned | Vite, Monaco Editor |
| **[Document Curator](#3-document-curator)** | AI-assisted knowledge extraction | 📋 Planned | Next.js, AI APIs |
| **[Debugging Viewer](#4-debugging-viewer)** | RAG retrieval visualization | 🎯 Stretch Goal | Next.js, D3.js |

## 1. RAG Admin UI

**Domain Model Editor for Knowledge Management**

A visual interface for building and maintaining domain models used in RAG (Retrieval-Augmented Generation) systems.

### Key Features
- Visual graph editor with drag-and-drop
- Document upload & AI-powered entity extraction
- Schema management with validation
- Search & query capabilities
- Export to multiple formats (JSON, GraphML, CSV)

### Quick Start
```bash
cd rag-admin
pnpm install
pnpm dev
# Visit http://localhost:3001
```

### Use Cases
- Build knowledge bases for RAG systems
- Manage organizational knowledge graphs
- Create domain models for AI applications
- Visualize entity relationships

📖 **[Full Documentation](./rag-admin/README.md)**

---

## 2. Ontology Workbench

**Schema-Driven Graph Editor for Ontologies**

A professional tool for creating, validating, and managing formal ontologies with real-time validation.

### Key Features
- Split-pane interface (schema | graph | validation)
- Monaco Editor with syntax highlighting
- Real-time constraint checking
- OWL/RDF import/export
- Pre-built templates (FOAF, Dublin Core, Schema.org)

### Quick Start
```bash
cd ontology-workbench
pnpm install
pnpm dev
# Visit http://localhost:3002
```

### Use Cases
- Create domain ontologies
- Validate ontology constraints
- Convert between RDF formats
- Build semantic web applications

📖 **[Full Documentation](./ontology-workbench/README.md)**

---

## 3. Document Curator

**AI-Assisted Knowledge Extraction from Documents**

An intelligent system that extracts entities and relationships from documents to build semantic graphs automatically.

### Key Features
- Document library with preview
- AI-powered entity extraction
- Review & approval workflow
- Entity linking & merging
- Knowledge graph visualization
- RAG-ready embedding generation

### Quick Start
```bash
cd document-curator
pnpm install
# Add OPENAI_API_KEY to .env.local
pnpm dev
# Visit http://localhost:3003
```

### Use Cases
- Extract knowledge from research papers
- Build knowledge bases from documentation
- Analyze legal documents
- Create content taxonomies

📖 **[Full Documentation](./document-curator/README.md)**

---

## 4. RAG Debugging Viewer

**Visualize RAG Retrieval Paths** (Stretch Goal)

A debugging tool for RAG systems that visualizes retrieval traces and performance metrics.

### Key Features
- Retrieval trace visualization
- Document chunk explorer
- Query analysis tools
- Performance metrics dashboard
- Strategy comparison

### Quick Start
```bash
cd debugging-viewer
pnpm install
pnpm dev
# Visit http://localhost:3004
```

### Use Cases
- Debug RAG performance issues
- Optimize retrieval strategies
- Track API costs
- A/B test different approaches

📖 **[Full Documentation](./debugging-viewer/README.md)**

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+ (or npm/yarn)
- (Optional) OpenAI API key for AI features

### Installation

From the repository root:

```bash
# Install all dependencies
pnpm install

# Or install for specific example
cd apps/examples/rag-admin
pnpm install
```

### Running Examples

Each example runs on a different port:

```bash
# RAG Admin UI - port 3001
cd rag-admin && pnpm dev

# Ontology Workbench - port 3002
cd ontology-workbench && pnpm dev

# Document Curator - port 3003
cd document-curator && pnpm dev

# Debugging Viewer - port 3004
cd debugging-viewer && pnpm dev
```

### Building for Production

```bash
# Build specific example
cd rag-admin
pnpm build

# Build all examples (from root)
pnpm build:examples
```

## 📁 Project Structure

```
apps/examples/
├── rag-admin/              # Domain model editor
│   ├── src/
│   │   ├── app/           # Next.js pages
│   │   ├── components/    # React components
│   │   ├── lib/          # Business logic
│   │   └── types/        # TypeScript types
│   └── package.json
├── ontology-workbench/     # Schema-driven editor
│   └── ...
├── document-curator/       # AI extraction tool
│   └── ...
├── debugging-viewer/       # RAG debugger
│   └── ...
├── shared/                # Shared components (planned)
│   ├── components/
│   ├── hooks/
│   └── utils/
├── EXAMPLES_SPEC.md       # Detailed specifications
└── README.md             # This file
```

## 🏗️ Architecture

### Shared Dependencies

All examples use:

```json
{
  "dependencies": {
    "@semantikit/core": "workspace:*",
    "@semantikit/react": "workspace:*",
    "@semantikit/layouts": "workspace:*",
    "@semantikit/validators": "workspace:*",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "reactflow": "^11.10.0"
  }
}
```

### Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework (RAG Admin, Document Curator, Debugger) |
| **Vite** | Build tool (Ontology Workbench) |
| **React Flow** | Graph visualization |
| **SemantiKit** | Knowledge graph management |
| **Tailwind CSS** | Styling |
| **TypeScript** | Type safety |
| **Zustand** | State management |
| **Radix UI / Mantine** | UI components |

## 📊 Implementation Status

### Phase 3 Timeline

- **Week 19-20:** RAG Admin UI (Core features)
- **Week 21-22:** Ontology Workbench (Complete)
- **Week 23-24:** Document Curator (Complete)
- **Post-launch:** Debugging Viewer (Stretch goal)

### Current Progress

| Feature | RAG Admin | Ontology | Curator | Debugger |
|---------|-----------|----------|---------|----------|
| Project Setup | ✅ | 📋 | 📋 | 📋 |
| Core UI | 🚧 | ⬜ | ⬜ | ⬜ |
| Graph Editor | 🚧 | ⬜ | ⬜ | ⬜ |
| Schema Management | 🚧 | ⬜ | ⬜ | N/A |
| AI Integration | ⬜ | N/A | ⬜ | ⬜ |
| Export/Import | ⬜ | ⬜ | ⬜ | ⬜ |
| Documentation | ✅ | ✅ | ✅ | ✅ |
| Deployment | ⬜ | ⬜ | ⬜ | ⬜ |

Legend: ✅ Complete | 🚧 In Progress | 📋 Planned | ⬜ Not Started

## 📦 Deployment

### Individual Deployments

Each app will be deployed to its own subdomain:

- `rag-admin.semantikit.dev`
- `ontology.semantikit.dev`
- `curator.semantikit.dev`
- `debugger.semantikit.dev`

### Deployment Commands

```bash
# RAG Admin UI (Vercel)
cd rag-admin && vercel deploy --prod

# Ontology Workbench (Netlify)
cd ontology-workbench && netlify deploy --prod

# Document Curator (Vercel)
cd document-curator && vercel deploy --prod

# Debugging Viewer (Vercel)
cd debugging-viewer && vercel deploy --prod
```

## 🤝 Contributing

We welcome contributions to the example applications!

### Guidelines

1. **Code Quality**
   - Use TypeScript with strict mode
   - Follow existing code style
   - Add tests for new features
   - Document public APIs

2. **UI/UX**
   - Ensure responsive design
   - Test on multiple browsers
   - Follow accessibility guidelines (WCAG 2.1 AA)
   - Use semantic HTML

3. **Performance**
   - Keep bundle size under 500KB
   - Optimize images and assets
   - Test with large datasets (5k+ nodes)
   - Profile and optimize renders

4. **Documentation**
   - Update README when adding features
   - Add inline code comments
   - Include usage examples
   - Document environment variables

### Development Workflow

```bash
# 1. Create feature branch
git checkout -b feature/add-export-feature

# 2. Make changes
# ...

# 3. Test locally
pnpm dev
pnpm build
pnpm lint
pnpm typecheck

# 4. Commit and push
git add .
git commit -m "feat: add CSV export feature"
git push origin feature/add-export-feature

# 5. Create pull request
```

## 📚 Resources

### Documentation
- [SemantiKit Docs](https://geastham.github.io/SemantiKit/)
- [API Reference](https://geastham.github.io/SemantiKit/docs/api/core/introduction)
- [Examples Specification](./EXAMPLES_SPEC.md)

### Tutorials
- [Building a Knowledge Graph](https://geastham.github.io/SemantiKit/docs/tutorials/basic-usage)
- [AI Integration Guide](https://geastham.github.io/SemantiKit/docs/tutorials/ai-integration)
- [Custom Layouts](https://geastham.github.io/SemantiKit/docs/tutorials/custom-layouts)

### Community
- [GitHub Discussions](https://github.com/geastham/SemantiKit/discussions)
- [Issue Tracker](https://github.com/geastham/SemantiKit/issues)
- [Discord Server](https://discord.gg/semantikit) (Coming soon)

## ❓ FAQ

### Q: Can I use these examples in my own project?

**A:** Yes! All examples are MIT licensed. Feel free to use them as starting points for your own applications.

### Q: Do I need an API key for AI features?

**A:** AI features (entity extraction, embeddings) are optional. The examples work without them, but having an OpenAI API key enhances functionality.

### Q: How do I contribute a new example?

**A:** Great question! Please open an issue first to discuss your idea, then follow the contributing guidelines above.

### Q: Which example should I start with?

**A:** Start with **RAG Admin UI** for a general-purpose graph editor, or **Document Curator** if you're working with documents and AI.

### Q: Can I deploy these to my own domain?

**A:** Absolutely! Each example is a standard Next.js or Vite app and can be deployed anywhere.

## 📧 Support

Need help?

- 📚 [Documentation](https://geastham.github.io/SemantiKit/)
- 💬 [GitHub Discussions](https://github.com/geastham/SemantiKit/discussions)
- 🐛 [Report Bug](https://github.com/geastham/SemantiKit/issues/new?template=bug_report.md)
- ✨ [Request Feature](https://github.com/geastham/SemantiKit/issues/new?template=feature_request.md)

## 📄 License

MIT License - See [LICENSE](../../LICENSE) for details.

---

**Built with ❤️ using SemantiKit**

**Ready to get started?** Pick an example above and dive in! 🚀

