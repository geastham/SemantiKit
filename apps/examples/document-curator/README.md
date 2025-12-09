# Document Curator - AI-Assisted Knowledge Extraction

An intelligent document management system that extracts knowledge from documents and builds a semantic graph automatically.

## 🎯 Features

### Document Library
- **Grid/list view** of uploaded documents
- **Preview pane** with entity highlighting
- Tag and categorize documents
- Full-text search across all documents

### AI Extraction Workflow
1. Upload document → Auto-extract entities
2. Review and approve/reject AI suggestions
3. Link extracted concepts to existing nodes
4. Confidence scores for each extraction

### Entity Linking
- Suggest links between document entities
- Merge duplicate entities automatically
- Coreference resolution
- Entity disambiguation with context

### Knowledge Graph View
- Document-centric graph visualization
- Show which documents contributed to each node
- Trace entity mentions back to source
- Highlight confidence/provenance information

### Export & Integration
- Export curated knowledge graph (JSON, GraphML)
- Generate entity index for RAG systems
- Create RAG-ready embeddings (optional)
- REST API for programmatic access

## 🚀 Quick Start

```bash
cd apps/examples/document-curator
pnpm install
pnpm dev
```

Visit `http://localhost:3003`

### With AI Extraction

Add your OpenAI API key:

```bash
# .env.local
OPENAI_API_KEY=sk-...
```

## 📖 Usage

### Document Processing Workflow

1. **Upload Documents**
   - Drag and drop PDF, DOCX, TXT, or MD files
   - Or click "Upload" to browse files
   - Batch upload supported

2. **AI Extraction**
   - Documents are automatically processed
   - Entities and relationships extracted
   - Confidence scores assigned

3. **Review Suggestions**
   - Green checkmarks = high confidence (auto-approved)
   - Yellow warnings = medium confidence (review needed)
   - Red X = low confidence (rejected)

4. **Build Knowledge Graph**
   - Approve entities to add to graph
   - Link entities to existing nodes
   - Merge duplicates

5. **Export & Use**
   - Export complete knowledge graph
   - Generate embeddings for RAG
   - API access to your knowledge base

### Supported Document Types

| Format | Extraction | Preview |
|--------|------------|---------|
| PDF    | ✅ Full     | ✅ Yes   |
| DOCX   | ✅ Full     | ✅ Yes   |
| TXT    | ✅ Full     | ✅ Yes   |
| MD     | ✅ Full     | ✅ Yes   |
| HTML   | ⚠️ Partial | ❌ No    |

### Entity Types Detected

- **People** - Names, titles, roles
- **Organizations** - Companies, institutions
- **Locations** - Cities, countries, addresses
- **Dates/Times** - Temporal expressions
- **Concepts** - Domain-specific terms
- **Products** - Product names, SKUs
- **Events** - Named events, meetings

## 🏗️ Architecture

### Tech Stack

- **Framework:** Next.js 14
- **Document Viewer:** react-pdf, ProseMirror
- **Graph:** React Flow + SemantiKit
- **UI:** Shadcn/ui components
- **AI:** OpenAI GPT-4, Anthropic Claude
- **Storage:** Local or cloud (S3, Azure Blob)

### Project Structure

```
document-curator/
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── graph/page.tsx
│   │   └── api/
│   │       ├── extract/route.ts
│   │       ├── link/route.ts
│   │       └── embed/route.ts
│   ├── components/
│   │   ├── DocumentList.tsx
│   │   ├── DocumentViewer.tsx
│   │   ├── ExtractionPanel.tsx
│   │   ├── EntityReview.tsx
│   │   └── GraphView.tsx
│   └── lib/
│       ├── entity-extractor.ts
│       ├── entity-linker.ts
│       └── confidence-scorer.ts
└── package.json
```

## 🤖 AI Configuration

### Custom Extraction

Configure AI extraction behavior:

```typescript
const extractionConfig = {
  model: 'gpt-4',
  entityTypes: ['Person', 'Organization', 'Concept'],
  confidenceThreshold: 0.7,
  maxEntitiesPerDoc: 50
};
```

### Prompt Templates

Customize extraction prompts:

```typescript
const customPrompt = `
Extract entities from this document.
Focus on: ${entityTypes.join(', ')}
Format as JSON with: text, type, confidence
`;
```

## 📦 Deployment

### Vercel

```bash
vercel deploy --prod
```

### Environment Variables

```bash
OPENAI_API_KEY=sk-...
STORAGE_PROVIDER=s3
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```

## 🔌 API Reference

### Extract Entities

```bash
POST /api/extract
Content-Type: application/json

{
  "document": "base64_content",
  "filename": "example.pdf"
}
```

### Get Knowledge Graph

```bash
GET /api/graph
```

### Generate Embeddings

```bash
POST /api/embed
{
  "entities": ["entity1", "entity2"]
}
```

## 🎯 Use Cases

- **Research Management** - Extract concepts from papers
- **Legal Document Analysis** - Identify parties, clauses
- **Customer Support** - Build knowledge base from tickets
- **Content Management** - Tag and organize content
- **Competitive Intelligence** - Analyze market reports

## 🤝 Contributing

See [CONTRIBUTING.md](../../../CONTRIBUTING.md)

## 📝 License

MIT License - Part of SemantiKit

---

**Live Demo:** [curator.semantikit.dev](https://curator.semantikit.dev) (Coming soon)

