# @semantikit/react

React components and hooks for building knowledge graph applications with SemantiKit.

## Features

- **React Context Provider**: Centralized graph state management
- **Core Hooks**: Access and manipulate graphs with ease
- **AI-Powered Hooks**: LLM-based features for validation, suggestions, and analysis
- **Layout Hooks**: Apply graph layouts automatically
- **Selection Management**: Multi-select nodes and edges
- **Undo/Redo**: Built-in history management

## Installation

```bash
npm install @semantikit/react
# or
pnpm add @semantikit/react
```

**Peer Dependencies:**
- `react` >= 18.0.0
- `react-dom` >= 18.0.0

## Quick Start

### Setup Provider

Wrap your app with `KnowledgeGraphProvider`:

```tsx
import { KnowledgeGraphProvider } from '@semantikit/react';
import { KnowledgeGraph } from '@semantikit/core';

function App() {
  const graph = new KnowledgeGraph();

  return (
    <KnowledgeGraphProvider graph={graph}>
      <YourGraphApp />
    </KnowledgeGraphProvider>
  );
}
```

### Access Graph Data

```tsx
import { useKnowledgeGraph } from '@semantikit/react';

function GraphStats() {
  const graph = useKnowledgeGraph();
  const stats = graph.getStatistics();

  return (
    <div>
      <p>Nodes: {stats.nodeCount}</p>
      <p>Edges: {stats.edgeCount}</p>
    </div>
  );
}
```

### Modify Graph

```tsx
import { useGraphOperations } from '@semantikit/react';

function AddNodeButton() {
  const { addNode } = useGraphOperations();

  const handleClick = () => {
    addNode({
      id: `node-${Date.now()}`,
      type: 'Person',
      label: 'New Node',
      position: { x: 100, y: 100 },
    });
  };

  return <button onClick={handleClick}>Add Node</button>;
}
```

## Core Hooks

### useKnowledgeGraph

Access the graph instance directly.

```tsx
const graph = useKnowledgeGraph();
const nodes = graph.getNodes();
const edges = graph.getEdges();
```

### useGraphOperations

CRUD operations for nodes and edges.

```tsx
const {
  addNode,
  updateNode,
  deleteNode,
  addEdge,
  updateEdge,
  deleteEdge,
  clearGraph,
  deleteSelected,
} = useGraphOperations();
```

### useGraphSelection

Manage node and edge selection.

```tsx
const {
  selectedNodes,
  selectedEdges,
  selectNodes,
  selectEdges,
  clearSelection,
  isNodeSelected,
  getSelectedNodes,
  selectAll,
} = useGraphSelection();

// Select a node
selectNodes('node-1');

// Multi-select
selectNodes(['node-1', 'node-2']);

// Additive selection
selectNodes('node-3', true);
```

### useGraphUndoRedo

Undo/redo functionality.

```tsx
const { undo, redo, canUndo, canRedo, undoCount, redoCount } =
  useGraphUndoRedo();

return (
  <div>
    <button onClick={undo} disabled={!canUndo}>
      Undo ({undoCount})
    </button>
    <button onClick={redo} disabled={!canRedo}>
      Redo ({redoCount})
    </button>
  </div>
);
```

### useLayout

Apply graph layouts.

```tsx
const { applyLayout, calculating, result } = useLayout();

// Apply force-directed layout
await applyLayout('force', {
  linkDistance: 100,
  chargeStrength: -300,
});

// Apply hierarchical layout
await applyLayout('hierarchical', {
  direction: 'DOWN',
  nodeSpacing: 60,
});

// Apply circular layout
await applyLayout('circular', {
  radius: 200,
});
```

## AI Hooks

### useGraphAI

General AI-powered graph analysis.

```tsx
import { useGraphAI } from '@semantikit/react';

function GraphAnalyzer() {
  const { analyze, ask, data, loading } = useGraphAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  });

  const handleAnalyze = async () => {
    await analyze('Analyze the structure and patterns in this graph');
  };

  const handleAsk = async () => {
    const answer = await ask('What is the central node?');
    console.log(answer);
  };

  return (
    <div>
      <button onClick={handleAnalyze}>Analyze Graph</button>
      {loading && <p>Analyzing...</p>}
      {data && (
        <div>
          <h3>Analysis</h3>
          <p>{data.summary}</p>
          <h4>Insights:</h4>
          <ul>
            {data.insights.map((insight, idx) => (
              <li key={idx}>{insight}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

### useNodeSuggestions

AI-powered node suggestions.

```tsx
import { useNodeSuggestions } from '@semantikit/react';

function NodeSuggester({ contextNodeId }) {
  const { getSuggestions, data, loading } = useNodeSuggestions({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  });

  useEffect(() => {
    getSuggestions(contextNodeId, 'Suggest related entities');
  }, [contextNodeId]);

  return (
    <div>
      {loading && <p>Getting suggestions...</p>}
      {data?.map((suggestion, idx) => (
        <div key={idx}>
          <strong>{suggestion.label}</strong>
          <span> ({suggestion.confidence.toFixed(2)})</span>
          <p>{suggestion.reasoning}</p>
        </div>
      ))}
    </div>
  );
}
```

### useValidationFeedback

Real-time AI validation.

```tsx
import { useValidationFeedback } from '@semantikit/react';

function NodeValidator({ node }) {
  const { validate, data, loading } = useValidationFeedback({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    debounceMs: 500,
  });

  useEffect(() => {
    if (node) {
      validate(node);
    }
  }, [node]);

  return (
    <div>
      {loading && <p>Validating...</p>}
      {data && !data.valid && (
        <div>
          {data.issues.map((issue, idx) => (
            <div key={idx} className={`issue-${issue.severity}`}>
              {issue.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## Configuration

### Provider Options

```tsx
<KnowledgeGraphProvider
  graph={graph} // Initial graph instance
  maxHistorySize={50} // Max undo/redo history
>
  {children}
</KnowledgeGraphProvider>
```

### AI Config

```typescript
interface AIConfig {
  apiKey?: string; // OpenAI API key
  model?: string; // Model to use
  cache?: boolean; // Enable caching
  debounceMs?: number; // Debounce delay
}
```

## TypeScript

Full TypeScript support with comprehensive type definitions.

```typescript
import type {
  GraphState,
  GraphActions,
  GraphOperations,
  SelectionOperations,
  UndoRedoOperations,
  AIConfig,
  NodeSuggestion,
  AIAnalysis,
} from '@semantikit/react';
```

## Examples

### Complete Example

```tsx
import {
  KnowledgeGraphProvider,
  useKnowledgeGraph,
  useGraphOperations,
  useGraphSelection,
  useLayout,
} from '@semantikit/react';
import { KnowledgeGraph } from '@semantikit/core';

function GraphEditor() {
  const graph = useKnowledgeGraph();
  const { addNode, deleteSelected } = useGraphOperations();
  const { selectedNodes, selectNodes } = useGraphSelection();
  const { applyLayout, calculating } = useLayout();

  return (
    <div>
      <button onClick={() => applyLayout('force')} disabled={calculating}>
        Auto Layout
      </button>
      <button onClick={deleteSelected} disabled={selectedNodes.size === 0}>
        Delete Selected
      </button>
      {/* Render graph here */}
    </div>
  );
}

function App() {
  return (
    <KnowledgeGraphProvider graph={new KnowledgeGraph()}>
      <GraphEditor />
    </KnowledgeGraphProvider>
  );
}
```

## License

MIT

