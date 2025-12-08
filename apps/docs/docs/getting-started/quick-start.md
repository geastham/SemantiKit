# Quick Start

Build your first knowledge graph with SemantiKit in just 5 minutes! This guide walks you through creating a simple knowledge graph application.

## What We'll Build

We'll create a small knowledge graph representing a team and their projects:

- **Nodes**: People and Projects
- **Edges**: Relationships between them (e.g., "works on", "manages")

## Step 1: Installation

First, install the required packages:

```bash
npm install @semantikit/core @semantikit/react
```

## Step 2: Create a Knowledge Graph (Vanilla JS)

Let's start with the headless core:

```typescript
import { KnowledgeGraph } from '@semantikit/core';

// Create a new knowledge graph
const graph = new KnowledgeGraph();

// Add some people
graph.addNode({
  id: 'person-1',
  type: 'Person',
  properties: {
    name: 'Alice',
    role: 'Senior Engineer',
    email: 'alice@example.com'
  }
});

graph.addNode({
  id: 'person-2',
  type: 'Person',
  properties: {
    name: 'Bob',
    role: 'Product Manager',
    email: 'bob@example.com'
  }
});

// Add a project
graph.addNode({
  id: 'project-1',
  type: 'Project',
  properties: {
    name: 'SemantiKit',
    status: 'Active',
    startDate: '2024-01-01'
  }
});

// Add relationships
graph.addEdge({
  id: 'edge-1',
  source: 'person-1',
  target: 'project-1',
  type: 'WorksOn',
  properties: {
    role: 'Developer',
    since: '2024-01-01'
  }
});

graph.addEdge({
  id: 'edge-2',
  source: 'person-2',
  target: 'project-1',
  type: 'Manages',
  properties: {
    since: '2024-01-01'
  }
});

// Query the graph
console.log('Nodes:', graph.nodeCount); // 3
console.log('Edges:', graph.edgeCount); // 2

// Get a specific node
const alice = graph.getNode('person-1');
console.log('Alice:', alice?.properties.name);

// Get neighbors
const projectMembers = graph.getNeighbors('project-1', {
  direction: 'incoming'
});
console.log('Project members:', projectMembers);

// Export to JSON
const json = graph.toJSON();
console.log('Graph JSON:', json);
```

## Step 3: Use with React

Now let's integrate with React:

```tsx
import React from 'react';
import { KnowledgeGraph } from '@semantikit/core';
import { 
  KnowledgeGraphProvider, 
  useKnowledgeGraph,
  useGraphOperations 
} from '@semantikit/react';

// Initialize the graph
const initialGraph = new KnowledgeGraph();

function App() {
  return (
    <KnowledgeGraphProvider initialGraph={initialGraph}>
      <GraphViewer />
      <GraphControls />
    </KnowledgeGraphProvider>
  );
}

function GraphViewer() {
  const { graph } = useKnowledgeGraph();
  
  return (
    <div>
      <h2>Knowledge Graph</h2>
      <p>Nodes: {graph.nodeCount}</p>
      <p>Edges: {graph.edgeCount}</p>
      
      <h3>Nodes:</h3>
      <ul>
        {graph.nodes.map(node => (
          <li key={node.id}>
            {node.properties.name} ({node.type})
          </li>
        ))}
      </ul>
    </div>
  );
}

function GraphControls() {
  const { operations } = useGraphOperations();
  
  const addPerson = () => {
    operations.addNode({
      id: `person-${Date.now()}`,
      type: 'Person',
      properties: {
        name: 'Charlie',
        role: 'Designer'
      }
    });
  };
  
  const undo = () => {
    operations.undo();
  };
  
  const redo = () => {
    operations.redo();
  };
  
  return (
    <div>
      <button onClick={addPerson}>Add Person</button>
      <button onClick={undo}>Undo</button>
      <button onClick={redo}>Redo</button>
    </div>
  );
}

export default App;
```

## Step 4: Add Schema Validation

Define a schema to enforce data structure:

```typescript
import { SchemaDefinition } from '@semantikit/core';

const schema: SchemaDefinition = {
  nodeTypes: {
    Person: {
      properties: {
        name: { type: 'string', required: true },
        role: { type: 'string', required: true },
        email: { type: 'string', required: false }
      }
    },
    Project: {
      properties: {
        name: { type: 'string', required: true },
        status: { 
          type: 'string', 
          required: true,
          enum: ['Active', 'Completed', 'On Hold']
        },
        startDate: { type: 'string', required: true }
      }
    }
  },
  edgeTypes: {
    WorksOn: {
      sourceTypes: ['Person'],
      targetTypes: ['Project'],
      properties: {
        role: { type: 'string', required: true },
        since: { type: 'string', required: true }
      }
    },
    Manages: {
      sourceTypes: ['Person'],
      targetTypes: ['Project'],
      properties: {
        since: { type: 'string', required: true }
      }
    }
  }
};

// Create graph with schema
const graph = new KnowledgeGraph({ schema });

// This will now validate against the schema
try {
  graph.addNode({
    id: 'invalid',
    type: 'Person',
    properties: {
      // Missing required 'name' and 'role' properties
    }
  });
} catch (error) {
  console.error('Validation error:', error);
}
```

## Step 5: Add a Layout

Use the layouts package to position nodes:

```typescript
import { ForceDirectedLayout } from '@semantikit/layouts';

const layout = new ForceDirectedLayout({
  iterations: 50,
  nodeStrength: -300,
  linkStrength: 0.5
});

// Calculate positions
const positions = layout.layout(graph);

// Apply positions to nodes
positions.forEach(({ nodeId, x, y }) => {
  graph.updateNode(nodeId, {
    position: { x, y }
  });
});
```

## Step 6: Use with React Hooks

Leverage the full power of React hooks:

```tsx
import { 
  useKnowledgeGraph,
  useGraphOperations,
  useGraphSelection,
  useGraphUndoRedo,
  useLayout
} from '@semantikit/react';
import { ForceDirectedLayout } from '@semantikit/layouts';

function AdvancedGraphComponent() {
  const { graph } = useKnowledgeGraph();
  const { operations } = useGraphOperations();
  const { selectedNodes, selectNode, clearSelection } = useGraphSelection();
  const { canUndo, canRedo, undo, redo } = useGraphUndoRedo();
  const { applyLayout, isLayouting } = useLayout();
  
  const handleApplyLayout = async () => {
    const layout = new ForceDirectedLayout();
    await applyLayout(layout);
  };
  
  return (
    <div>
      <div>
        <button onClick={() => operations.addNode({ 
          id: `node-${Date.now()}`,
          type: 'Person',
          properties: { name: 'New Person', role: 'Developer' }
        })}>
          Add Node
        </button>
        <button onClick={handleApplyLayout} disabled={isLayouting}>
          {isLayouting ? 'Laying out...' : 'Apply Layout'}
        </button>
        <button onClick={undo} disabled={!canUndo}>Undo</button>
        <button onClick={redo} disabled={!canRedo}>Redo</button>
        <button onClick={clearSelection}>Clear Selection</button>
      </div>
      
      <div>
        <p>Selected: {selectedNodes.length} nodes</p>
        <p>Total: {graph.nodeCount} nodes, {graph.edgeCount} edges</p>
      </div>
    </div>
  );
}
```

## Step 7: Export and Import

Save and load your graph:

```typescript
// Export to JSON
const json = graph.toJSON();
localStorage.setItem('my-graph', JSON.stringify(json));

// Import from JSON
const loadedJson = JSON.parse(localStorage.getItem('my-graph')!);
const loadedGraph = KnowledgeGraph.fromJSON(loadedJson);

// Export to CSV
const nodes = graph.nodes.map(node => ({
  id: node.id,
  type: node.type,
  ...node.properties
}));

// Create CSV string
const csv = [
  Object.keys(nodes[0]).join(','),
  ...nodes.map(node => Object.values(node).join(','))
].join('\n');

console.log('CSV:', csv);
```

## Complete Example

Here's a complete working example combining everything:

```tsx
import React, { useEffect } from 'react';
import { KnowledgeGraph, SchemaDefinition } from '@semantikit/core';
import { 
  KnowledgeGraphProvider, 
  useKnowledgeGraph,
  useGraphOperations 
} from '@semantikit/react';

// Define schema
const schema: SchemaDefinition = {
  nodeTypes: {
    Person: {
      properties: {
        name: { type: 'string', required: true },
        role: { type: 'string', required: true }
      }
    },
    Project: {
      properties: {
        name: { type: 'string', required: true },
        status: { type: 'string', required: true }
      }
    }
  },
  edgeTypes: {
    WorksOn: {
      sourceTypes: ['Person'],
      targetTypes: ['Project']
    }
  }
};

// Initialize graph
const initialGraph = new KnowledgeGraph({ schema });

// Add initial data
initialGraph.addNode({
  id: '1',
  type: 'Person',
  properties: { name: 'Alice', role: 'Engineer' }
});

initialGraph.addNode({
  id: '2',
  type: 'Project',
  properties: { name: 'SemantiKit', status: 'Active' }
});

initialGraph.addEdge({
  id: 'e1',
  source: '1',
  target: '2',
  type: 'WorksOn'
});

function App() {
  return (
    <KnowledgeGraphProvider initialGraph={initialGraph}>
      <div style={{ padding: '2rem' }}>
        <h1>My Knowledge Graph</h1>
        <GraphStats />
        <GraphControls />
        <NodeList />
      </div>
    </KnowledgeGraphProvider>
  );
}

function GraphStats() {
  const { graph } = useKnowledgeGraph();
  
  return (
    <div style={{ marginBottom: '1rem' }}>
      <strong>Stats:</strong> {graph.nodeCount} nodes, {graph.edgeCount} edges
    </div>
  );
}

function GraphControls() {
  const { operations } = useGraphOperations();
  
  const addPerson = () => {
    const id = `person-${Date.now()}`;
    operations.addNode({
      id,
      type: 'Person',
      properties: {
        name: `Person ${Math.floor(Math.random() * 100)}`,
        role: 'Developer'
      }
    });
  };
  
  return (
    <div style={{ marginBottom: '1rem' }}>
      <button onClick={addPerson}>Add Random Person</button>
      <button onClick={operations.undo}>Undo</button>
      <button onClick={operations.redo}>Redo</button>
    </div>
  );
}

function NodeList() {
  const { graph } = useKnowledgeGraph();
  const { operations } = useGraphOperations();
  
  return (
    <div>
      <h2>Nodes</h2>
      <ul>
        {graph.nodes.map(node => (
          <li key={node.id}>
            <strong>{node.properties.name}</strong> ({node.type})
            <button 
              onClick={() => operations.deleteNode(node.id)}
              style={{ marginLeft: '1rem' }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

## What's Next?

Congratulations! You've built your first knowledge graph with SemantiKit. 🎉

### Continue Learning

- **[Core Concepts](./core-concepts)** - Understand nodes, edges, and schemas in depth
- **[Tutorials](../tutorials/basic-usage)** - Follow detailed tutorials
- **[API Reference](../api/core/introduction)** - Explore the full API
- **[Examples](../examples/overview)** - See complete example applications

### Advanced Topics

- **[Layouts](../guides/layouts)** - Advanced graph layout techniques
- **[AI Integration](../guides/ai-integration)** - Add AI-powered features
- **[Performance](../guides/performance)** - Optimize for large graphs
- **[Custom Validators](../tutorials/custom-validators)** - Build custom validation rules

## Getting Help

- 💬 [GitHub Discussions](https://github.com/geastham/SemantiKit/discussions)
- 🐛 [Report Issues](https://github.com/geastham/SemantiKit/issues)
- 📚 [Full Documentation](https://geastham.github.io/SemantiKit/)

Happy graphing! 🚀

