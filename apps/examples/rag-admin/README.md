# RAG Admin UI - Domain Model Editor

A production-ready knowledge management interface for building and maintaining domain models used in RAG (Retrieval-Augmented Generation) systems.

## 🎯 Features

### Visual Domain Model Editor
- **Node-based interface** for creating entities and relationships
- **Drag-and-drop canvas** with zoom/pan controls
- **Real-time graph visualization** using React Flow + SemantiKit
- **Property inspector** for editing node/edge attributes

### Document Upload & Processing
- Multi-file upload (PDF, DOCX, TXT, MD)
- AI-powered entity extraction (optional)
- Automatic relationship detection
- Batch processing with progress tracking

### Schema Management
- Define entity types and relationship types
- Property templates with validation rules
- Schema versioning and migration
- Import/export schema definitions (JSON)

### Search & Query
- Full-text search across nodes
- Filter by entity type and properties
- Relationship path finder
- Saved queries and filters

### Collaboration Features
- Export knowledge graph (JSON, GraphML, CSV)
- Import from external sources
- Version history and change tracking
- Comment and annotation system

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+ (or npm/yarn)

### Installation

```bash
# From repository root
cd apps/examples/rag-admin

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The app will be available at `http://localhost:3001`.

### Building for Production

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## 📖 Usage

### Creating Your First Graph

1. **Load Sample Data**
   - Click "Load Sample" in the toolbar to populate with example data
   - Sample includes People, Projects, Documents, and Concepts

2. **Add Nodes**
   - Browse available node types in the left panel
   - Click on a node type to add it to the canvas
   - Or use the "Upload Docs" button to add documents
   - Fill in properties in the property inspector

3. **Create Relationships**
   - Drag from a node's handle to another node
   - Select relationship type from dropdown
   - Add relationship properties if needed

4. **Edit Properties**
   - Click on any node to select it
   - Edit properties in the right panel
   - Changes are saved automatically

5. **Search and Filter**
   - Use the search bar at the top to find nodes
   - Click the filter icon to filter by node type
   - Matching nodes are highlighted, others are dimmed
   - Clear filters with the X button

### Keyboard Shortcuts

The RAG Admin UI supports several keyboard shortcuts for faster editing:

| Shortcut | Action |
|----------|--------|
| `Delete` or `Backspace` | Delete selected node or edge |
| `Ctrl+Z` (or `Cmd+Z` on Mac) | Undo last action |
| `Ctrl+Y` or `Ctrl+Shift+Z` | Redo action |

**Note:** Keyboard shortcuts are disabled when typing in input fields.

### Document Upload

Upload documents to automatically create Document nodes:

1. Click "Upload Docs" in the toolbar
2. Drag and drop files or click to browse
3. Supported formats: PDF, DOCX, TXT, MD (max 10MB each)
4. Files are processed and added as Document nodes with metadata
5. Click "Done" when finished

**Features:**
- Multi-file upload
- Drag-and-drop support
- File validation (type and size)
- Progress tracking
- Automatic node creation

### Schema Management

Define your own entity types and relationships:

```typescript
const customSchema = {
  nodeTypes: {
    CustomEntity: {
      label: 'Custom Entity',
      color: '#ff6b6b',
      properties: {
        name: { type: 'string', required: true },
        category: { 
          type: 'enum', 
          options: ['A', 'B', 'C'],
          required: true 
        }
      }
    }
  },
  edgeTypes: {
    CustomRelation: {
      label: 'Custom Relation',
      sourceTypes: ['CustomEntity'],
      targetTypes: ['CustomEntity']
    }
  }
};
```

### Keyboard Shortcuts

- `Delete` / `Backspace` - Delete selected node/edge
- `Ctrl/Cmd + Z` - Undo
- `Ctrl/Cmd + Y` - Redo
- `Ctrl/Cmd + F` - Focus search
- `Ctrl/Cmd + S` - Save graph

## 🏗️ Architecture

### Tech Stack

- **Framework:** Next.js 14 (App Router)
- **UI:** React 18 + TypeScript
- **Graph Visualization:** React Flow + SemantiKit
- **State Management:** Zustand
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Icons:** Lucide React

### Project Structure

```
rag-admin/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main editor page
│   │   ├── layout.tsx            # App layout
│   │   ├── globals.css           # Global styles
│   │   └── api/                  # API routes (future)
│   ├── components/
│   │   ├── GraphCanvas.tsx       # Main graph editor
│   │   ├── SchemaPanel.tsx       # Schema management
│   │   ├── PropertyInspector.tsx # Node/edge properties
│   │   ├── DocumentUpload.tsx    # File upload UI
│   │   └── SearchPanel.tsx       # Search and filters
│   ├── lib/
│   │   ├── graph-store.ts        # Zustand store
│   │   └── utils.ts              # Utility functions
│   └── types/
│       └── index.ts              # TypeScript types
├── public/
│   └── examples/                 # Sample data
├── package.json
├── tsconfig.json
├── next.config.js
└── tailwind.config.js
```

### State Management

The application uses Zustand for state management with the following store structure:

```typescript
interface GraphStore {
  nodes: GraphNode[];
  edges: GraphEdge[];
  schema: Schema;
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  
  // Actions
  addNode: (node) => void;
  updateNode: (id, data) => void;
  deleteNode: (id) => void;
  // ... more actions
}
```

## 🎨 Customization

### Custom Node Types

Add your own node types to the schema:

```typescript
import { useGraphStore } from '@/lib/graph-store';

const store = useGraphStore();

store.addNodeType('MyType', {
  label: 'My Custom Type',
  color: '#ff6b6b',
  icon: 'Star',
  properties: {
    customProp: { 
      type: 'string', 
      required: true,
      description: 'A custom property'
    }
  }
});
```

### Custom Styling

Modify `src/app/globals.css` to customize the theme:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  /* ... more CSS variables */
}
```

## 🔌 API Integration (Optional)

### AI Entity Extraction

To enable AI-powered entity extraction, add your OpenAI API key:

```bash
# .env.local
OPENAI_API_KEY=your_api_key_here
```

Then the extraction API will be available at `/api/extract`.

### Custom Backends

Integrate with your own backend by modifying the API routes in `src/app/api/`.

## 📦 Deployment

### Vercel (Recommended)

```bash
# Deploy to Vercel
vercel deploy
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm build
EXPOSE 3001
CMD ["pnpm", "start"]
```

### Static Export

```bash
# For static hosting
pnpm build
# Output in .next/out/
```

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This example is part of SemantiKit and is licensed under the MIT License.

## 🔗 Links

- [SemantiKit Documentation](https://geastham.github.io/SemantiKit/)
- [Live Demo](https://rag-admin.semantikit.dev) (Coming soon)
- [Report Issues](https://github.com/geastham/SemantiKit/issues)

## 💡 Tips & Best Practices

### Performance

- Keep graphs under 1,000 nodes for optimal performance
- Use the minimap for navigating large graphs
- Enable virtual rendering for 5,000+ nodes

### Schema Design

- Start with a simple schema and iterate
- Use enums for properties with fixed values
- Add descriptions to properties for clarity

### Data Organization

- Use consistent naming conventions
- Group related entities with colors
- Add descriptions to complex relationships

## 🐛 Troubleshooting

### Common Issues

**Q: Nodes are not appearing**
A: Check that the schema includes the node type you're trying to create.

**Q: Edges won't connect**
A: Verify that the edge type allows the source/target combination in the schema.

**Q: Performance is slow**
A: Reduce the number of animated edges or enable performance mode.

## 📧 Support

For help and questions:
- [GitHub Discussions](https://github.com/geastham/SemantiKit/discussions)
- [Documentation](https://geastham.github.io/SemantiKit/)
- [Examples](https://github.com/geastham/SemantiKit/tree/main/apps/examples)

---

**Built with ❤️ using SemantiKit**
