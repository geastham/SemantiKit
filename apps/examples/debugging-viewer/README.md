# RAG Debugging Viewer - Visualize Retrieval Paths

A debugging tool for RAG (Retrieval-Augmented Generation) systems that visualizes the retrieval process and shows how documents and chunks are selected.

## 🎯 Features

### Retrieval Trace Visualization
- Show query → retrieval → ranking → selection flow
- Display vector similarity scores at each step
- Visualize re-ranking steps with explanations
- Show final context window sent to LLM

### Document Chunk Explorer
- View all chunks for a document
- See embedding metadata and dimensions
- Display chunk relationships and overlap
- Filter by similarity threshold

### Query Analysis
- Show query embedding visualization
- Display nearest neighbors in vector space
- Compare different retrieval strategies side-by-side
- A/B test different parameters (top-k, threshold, etc.)

### Performance Metrics
- Latency breakdown (embedding, search, ranking)
- Retrieval quality scores (precision, recall)
- Coverage analysis (% of documents used)
- Cost tracking (API calls, tokens)

### Interactive Playground
- Test queries in real-time
- Adjust retrieval parameters dynamically
- Compare retrieval methods (vector, keyword, hybrid)
- Export debug reports for sharing

## 🚀 Quick Start

```bash
cd apps/examples/debugging-viewer
pnpm install
pnpm dev
```

Visit `http://localhost:3004`

## 📖 Usage

### Debugging a RAG Query

1. **Enter Query**
```
"What is the Paris Agreement?"
```

2. **View Retrieval Trace**
```
[Query] → [Embed] → [Vector Search] → [Re-rank] → [LLM]
  200ms     50ms       100ms           30ms      1.2s
```

3. **Inspect Retrieved Chunks**
```
1. doc_15_chunk_3  Score: 0.89  Rank: 1
   "The Paris Agreement... signed in 2015..."
   
2. doc_22_chunk_7  Score: 0.84  Rank: 3 → 2
   "Climate treaty frameworks include..."
```

4. **Analyze Performance**
- Total latency: 1.58s
- Chunks retrieved: 50
- Chunks selected: 5
- Cost: $0.002

### Comparing Strategies

Test different retrieval approaches:

```typescript
const strategies = [
  { name: 'Vector Only', method: 'vector', topK: 5 },
  { name: 'Hybrid', method: 'hybrid', topK: 10, alpha: 0.7 },
  { name: 'Keyword', method: 'keyword', topK: 5 }
];
```

### Performance Profiling

```typescript
const profile = {
  embedding: {
    provider: 'OpenAI',
    model: 'text-embedding-3-small',
    latency: 50,
    cost: 0.0001
  },
  search: {
    engine: 'Pinecone',
    latency: 100,
    candidates: 50
  },
  reranking: {
    model: 'cohere-rerank-v3',
    latency: 30,
    cost: 0.001
  }
};
```

## 🏗️ Architecture

### Tech Stack

- **Framework:** Next.js 14
- **Graph Viz:** React Flow + SemantiKit, D3.js
- **Charts:** Recharts, Visx
- **UI:** Tailwind CSS, Headless UI
- **State:** React Query

### Project Structure

```
debugging-viewer/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main debugger
│   │   ├── compare/page.tsx      # Strategy comparison
│   │   ├── metrics/page.tsx      # Performance dashboard
│   │   └── api/
│   │       ├── trace/route.ts
│   │       └── analyze/route.ts
│   ├── components/
│   │   ├── TraceVisualization.tsx
│   │   ├── ChunkExplorer.tsx
│   │   ├── QueryAnalyzer.tsx
│   │   ├── MetricsDashboard.tsx
│   │   └── ComparisonView.tsx
│   └── lib/
│       ├── trace-recorder.ts
│       ├── similarity-calculator.ts
│       └── performance-analyzer.ts
└── package.json
```

## 🔌 Integration

### Record Traces

Instrument your RAG pipeline:

```typescript
import { traceRecorder } from '@/lib/trace-recorder';

const trace = traceRecorder.start();

// Your RAG pipeline
const embedding = await embed(query);
trace.record('embedding', { latency, cost });

const results = await vectorSearch(embedding);
trace.record('search', { results, latency });

const reranked = await rerank(results);
trace.record('rerank', { reranked, latency });

trace.finish();
```

### Export Traces

```bash
# Export as JSON
GET /api/trace/export?format=json

# Export as CSV
GET /api/trace/export?format=csv
```

## 📊 Metrics Tracked

### Latency Metrics
- Query embedding time
- Vector search time
- Re-ranking time
- Total end-to-end latency

### Quality Metrics
- Retrieval precision@k
- Retrieval recall@k
- Re-ranking improvement
- Context relevance score

### Cost Metrics
- Embedding API costs
- Vector DB query costs
- Re-ranking costs
- Total cost per query

### Coverage Metrics
- Documents retrieved (%)
- Unique documents used
- Chunk distribution
- Temporal coverage

## 🎯 Use Cases

- **Debug RAG Performance** - Identify bottlenecks
- **Optimize Retrieval** - Test different strategies
- **Quality Assurance** - Validate retrieval accuracy
- **Cost Analysis** - Track and reduce API costs
- **A/B Testing** - Compare retrieval methods

## 🔧 Configuration

### Vector Database

Connect to your vector DB:

```typescript
const config = {
  provider: 'pinecone', // or 'weaviate', 'qdrant', 'milvus'
  apiKey: process.env.PINECONE_API_KEY,
  index: 'my-index',
  namespace: 'default'
};
```

### Embedding Models

Configure embedding provider:

```typescript
const embedding = {
  provider: 'openai', // or 'cohere', 'huggingface'
  model: 'text-embedding-3-small',
  dimensions: 1536
};
```

## 📦 Deployment

Deploy to Vercel:

```bash
vercel deploy --prod
```

### Environment Variables

```bash
OPENAI_API_KEY=sk-...
PINECONE_API_KEY=...
COHERE_API_KEY=...
```

## 🤝 Contributing

See [CONTRIBUTING.md](../../../CONTRIBUTING.md)

## 📝 License

MIT License - Part of SemantiKit

## 🔗 Links

- [RAG Best Practices](https://docs.semantikit.dev/advanced/rag)
- [Performance Optimization](https://docs.semantikit.dev/advanced/performance)
- [Vector DB Comparison](https://docs.semantikit.dev/guides/vector-dbs)

---

**Live Demo:** [debugger.semantikit.dev](https://debugger.semantikit.dev) (Coming soon)

**Status:** 🎯 Stretch Goal (Post v1.0.0 release)

