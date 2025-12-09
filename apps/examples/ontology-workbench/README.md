# Ontology Workbench - Schema-Driven Graph Editor

A professional tool for creating, validating, and managing ontologies (formal specifications of domain knowledge).

## 🎯 Features

### Split-Pane Interface
- **Left:** Schema definition editor (YAML/JSON) with Monaco Editor
- **Center:** Visual graph representation with React Flow
- **Right:** Real-time validation dashboard

### Schema Editor
- Syntax-highlighted code editor (VS Code's Monaco Editor)
- Auto-completion for schema properties
- Real-time validation feedback
- Templates for common ontologies (FOAF, Dublin Core, Schema.org)

### Visual Graph Editor
- Create nodes conforming to defined types
- Enforce relationship constraints automatically
- Visual indicators for validation errors
- Hierarchical and class-instance views

### Validation Dashboard
- Real-time constraint checking
- Cardinality validation
- Type compatibility checks
- Error highlighting with actionable fix suggestions

### Import/Export
- OWL (Web Ontology Language) import/export
- RDF/XML format support
- JSON-LD output
- GraphML for visualization tools
- Turtle (TTL) format

## 🚀 Quick Start

```bash
cd apps/examples/ontology-workbench
pnpm install
pnpm dev
```

Visit `http://localhost:3002`

## 📖 Usage

### Creating an Ontology

1. **Define Schema (Left Panel)**
```yaml
nodeTypes:
  Person:
    properties:
      name:
        type: string
        required: true
      email:
        type: string
        
edgeTypes:
  knows:
    source: Person
    target: Person
```

2. **Create Visual Graph (Center)**
- Add nodes that conform to your schema
- Connect nodes with defined relationships
- Real-time validation as you build

3. **Monitor Validation (Right Panel)**
- See constraint violations
- Get fix suggestions
- Track schema coverage

### Templates

Start with a template:

- **FOAF (Friend-of-a-Friend)** - Social network ontology
- **Dublin Core** - Metadata for digital resources
- **Schema.org** - Web semantic markup
- **Custom** - Build from scratch

### Keyboard Shortcuts

- `Ctrl/Cmd + S` - Save ontology
- `Ctrl/Cmd + E` - Export OWL
- `Ctrl/Cmd + I` - Import RDF
- `Ctrl/Cmd + V` - Validate all
- `F2` - Rename selected node

## 🏗️ Architecture

### Tech Stack

- **Framework:** Vite + React 18
- **Editor:** Monaco Editor
- **Graph:** React Flow + SemantiKit
- **UI:** Mantine UI
- **Validation:** Ajv (JSON Schema)
- **RDF/OWL:** rdflib.js

### Project Structure

```
ontology-workbench/
├── src/
│   ├── App.tsx
│   ├── components/
│   │   ├── SchemaEditor.tsx
│   │   ├── GraphView.tsx
│   │   ├── ValidationPanel.tsx
│   │   └── TemplateSelector.tsx
│   ├── lib/
│   │   ├── schema-validator.ts
│   │   ├── ontology-parser.ts
│   │   └── constraint-checker.ts
│   └── templates/
│       ├── foaf.yaml
│       ├── dublin-core.yaml
│       └── schema-org.yaml
└── package.json
```

## 🔌 OWL/RDF Integration

### Export to OWL

```typescript
import { exportToOWL } from '@/lib/ontology-parser';

const owl = exportToOWL(graph, schema);
// Produces valid OWL/RDF XML
```

### Import from RDF

```typescript
import { importFromRDF } from '@/lib/ontology-parser';

const { graph, schema } = importFromRDF(rdfContent);
```

## 📦 Deployment

Deploy to Netlify:

```bash
pnpm build
netlify deploy --prod
```

## 🤝 Contributing

See [CONTRIBUTING.md](../../../CONTRIBUTING.md)

## 📝 License

MIT License - Part of SemantiKit

---

**Live Demo:** [ontology.semantikit.dev](https://ontology.semantikit.dev) (Coming soon)

