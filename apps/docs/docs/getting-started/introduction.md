# Introduction

Welcome to **SemantiKit** - a powerful, flexible TypeScript library for building knowledge graph applications!

## What is SemantiKit?

SemantiKit is a comprehensive toolkit that makes it easy to build, visualize, and manage semantic data in your applications. Whether you're building a knowledge management system, a RAG (Retrieval-Augmented Generation) application, or a data visualization tool, SemantiKit provides the building blocks you need.

## Key Features

### 🎯 Headless Core
Framework-agnostic graph engine (`@semantikit/core`) that works with any JavaScript framework or vanilla JS. No lock-in, maximum flexibility.

### ⚛️ React Integration
First-class React support with hooks and components (`@semantikit/react`). Seamless integration with React Flow for graph visualization.

### 🔒 Type-Safe
Built with TypeScript from the ground up. Comprehensive type definitions provide excellent IDE support and catch errors at compile-time.

### ⚡ Performant
Optimized for graphs with 5,000+ nodes and 10,000+ edges. Efficient indexing, virtual rendering, and smart memoization ensure 60 FPS performance.

### ✅ Schema Validation
Define and enforce data schemas with built-in validators. Support for custom validation rules, cardinality constraints, and type checking.

### 🤖 AI-Powered
Optional AI integration for entity extraction, relationship suggestions, and validation feedback. Bring your own LLM or use our defaults.

### 📐 Flexible Layouts
Multiple graph layout algorithms included: force-directed, hierarchical, and circular. Easy to add custom layouts.

### 🔌 Extensible
Plugin architecture for custom behaviors. Add your own validators, layouts, serializers, and integrations.

## Use Cases

SemantiKit is perfect for building:

- **Knowledge Management Systems** - Organize and visualize organizational knowledge
- **RAG Applications** - Build retrieval-augmented generation systems with visual graph interfaces
- **Ontology Editors** - Create and edit domain ontologies with schema validation
- **Document Analysis Tools** - Extract and visualize relationships from documents
- **Data Lineage Trackers** - Visualize data flow and dependencies
- **Mind Mapping Apps** - Create visual thought maps and concept networks
- **Research Tools** - Organize research papers and their relationships

## Architecture

SemantiKit follows a modular architecture:

```
┌─────────────────────────────────────────┐
│     Your Application                    │
└─────────────────┬───────────────────────┘
                  │
     ┌────────────┴───────────┐
     │                        │
┌────▼─────────┐    ┌────────▼─────────┐
│ @semantikit/ │    │  @semantikit/    │
│    react     │    │  validators      │
└────┬─────────┘    └────────┬─────────┘
     │                       │
     │         ┌─────────────┴───────┐
     │         │                     │
┌────▼─────────▼────┐    ┌──────────▼──────┐
│  @semantikit/core  │    │ @semantikit/    │
│  (headless engine) │    │   layouts       │
└────────────────────┘    └─────────────────┘
```

### Package Overview

- **[@semantikit/core](../api/core/introduction)** - Headless knowledge graph engine with no UI dependencies
- **[@semantikit/react](../api/react/introduction)** - React components, hooks, and providers
- **[@semantikit/layouts](../api/layouts/introduction)** - Graph layout algorithms
- **[@semantikit/validators](../api/validators/introduction)** - Schema validation utilities

## Design Principles

1. **Headless First** - Core functionality works without any UI framework
2. **Type Safety** - Comprehensive TypeScript support throughout
3. **Performance** - Optimized for large graphs (5k+ nodes)
4. **Developer Experience** - Great docs, examples, and IDE support
5. **Extensibility** - Easy to customize and extend
6. **Progressive Enhancement** - Start simple, add complexity as needed

## Browser Support

SemantiKit works in all modern browsers:

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

Mobile browsers are supported but not the primary target.

## What's Next?

Ready to get started? Follow these steps:

1. **[Installation](./installation)** - Install SemantiKit packages
2. **[Quick Start](./quick-start)** - Build your first knowledge graph
3. **[Core Concepts](./core-concepts)** - Learn the fundamentals
4. **[Tutorials](../tutorials/basic-usage)** - Dive deeper with hands-on tutorials

## Community & Support

- **[GitHub Discussions](https://github.com/geastham/SemantiKit/discussions)** - Ask questions and share ideas
- **[GitHub Issues](https://github.com/geastham/SemantiKit/issues)** - Report bugs and request features
- **[Examples](../examples/overview)** - Browse example applications
- **[API Reference](../api/core/introduction)** - Detailed API documentation

## License

SemantiKit is open-source software licensed under the [MIT License](https://opensource.org/licenses/MIT).

---

**Ready to build your first knowledge graph? Continue to [Installation →](./installation)**

