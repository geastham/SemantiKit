# @semantikit/layouts

Graph layout algorithms for SemantiKit knowledge graphs.

## Features

- **Force-Directed Layout**: Physics-based layout using d3-force
- **Hierarchical Layout**: Tree and DAG layouts using ELK
- **Circular Layout**: Nodes arranged in a circle
- **Extensible**: Easy to add custom layouts

## Installation

```bash
npm install @semantikit/layouts
# or
pnpm add @semantikit/layouts
```

## Quick Start

### Force-Directed Layout

```typescript
import { ForceDirectedLayout } from '@semantikit/layouts';

const layout = new ForceDirectedLayout();

const result = await layout.layout(
  {
    nodes: [
      { id: '1', type: 'Person', label: 'Alice' },
      { id: '2', type: 'Person', label: 'Bob' },
    ],
    edges: [{ id: 'e1', type: 'knows', source: '1', target: '2' }],
    dimensions: { width: 800, height: 600 },
  },
  {
    linkDistance: 100,
    chargeStrength: -300,
    iterations: 300,
  }
);

// Apply positions
result.nodes.forEach((node) => {
  console.log(`${node.label}: (${node.position.x}, ${node.position.y})`);
});
```

### Hierarchical Layout

```typescript
import { HierarchicalLayout } from '@semantikit/layouts';

const layout = new HierarchicalLayout();

const result = await layout.layout(
  {
    nodes: graph.getNodes(),
    edges: graph.getEdges(),
  },
  {
    direction: 'DOWN', // 'DOWN', 'UP', 'LEFT', 'RIGHT'
    nodeSpacing: 60,
    layerSpacing: 80,
  }
);
```

### Circular Layout

```typescript
import { CircularLayout } from '@semantikit/layouts';

const layout = new CircularLayout();

const result = await layout.layout(
  {
    nodes: graph.getNodes(),
    edges: graph.getEdges(),
  },
  {
    radius: 200,
    startAngle: 0,
    clockwise: true,
    sortBy: 'label', // Sort nodes by property
  }
);
```

## Layout Types

### Force-Directed

Best for: General-purpose graphs, social networks, clusters

**Options:**
- `linkDistance`: Ideal distance between connected nodes (default: 100)
- `chargeStrength`: Node repulsion strength (default: -300)
- `collisionRadius`: Collision detection radius (default: 30)
- `centerStrength`: Centering force strength (default: 0.1)
- `iterations`: Number of simulation iterations (default: 300)
- `alphaDecay`: Cooling rate (default: 0.02)
- `alphaMin`: Convergence threshold (default: 0.001)

### Hierarchical

Best for: Trees, DAGs, org charts, dependency graphs

**Options:**
- `direction`: Layout direction - 'DOWN', 'UP', 'LEFT', 'RIGHT'
- `nodeSpacing`: Space between nodes in same layer (default: 60)
- `layerSpacing`: Space between layers (default: 80)
- `roots`: Root node IDs (auto-detected if not specified)

### Circular

Best for: Cycles, equal-importance nodes, aesthetic arrangements

**Options:**
- `radius`: Circle radius (default: auto-calculated)
- `startAngle`: Starting angle in radians (default: 0)
- `clockwise`: Clockwise or counter-clockwise (default: true)
- `sortBy`: Node property to sort by

## API Reference

### Layout Input

```typescript
interface LayoutInput {
  nodes: KGNode[];
  edges: KGEdge[];
  dimensions?: { width: number; height: number };
}
```

### Layout Result

```typescript
interface LayoutResult {
  nodes: PositionedNode[]; // Nodes with calculated positions
  duration: number; // Layout calculation time (ms)
  metadata?: {
    iterations?: number;
    converged?: boolean;
    algorithm?: string;
  };
}
```

### Common Options

```typescript
interface LayoutOptions {
  seed?: number; // Random seed for reproducibility
  animate?: boolean; // Enable animation (future)
  animationDuration?: number; // Animation duration (ms)
}
```

## Creating Custom Layouts

```typescript
import { BaseLayout } from '@semantikit/layouts';
import type { LayoutInput, LayoutResult, LayoutType } from '@semantikit/layouts';

class MyCustomLayout extends BaseLayout {
  getType(): LayoutType {
    return 'custom';
  }

  async layout(
    input: LayoutInput,
    options?: any
  ): Promise<LayoutResult> {
    const startTime = Date.now();

    // Initialize positions
    let nodes = this.initializePositions(input.nodes, input.dimensions);

    // Your layout logic here
    nodes = nodes.map((node, idx) => ({
      ...node,
      position: { x: idx * 100, y: 0 },
    }));

    // Center the result
    nodes = this.centerLayout(nodes, input.dimensions);

    return {
      nodes,
      duration: Date.now() - startTime,
      metadata: { algorithm: 'custom' },
    };
  }
}
```

## Performance

Layout performance varies by algorithm and graph size:

| Algorithm      | 100 nodes | 1,000 nodes | 5,000 nodes |
|----------------|-----------|-------------|-------------|
| Force-Directed | ~50ms     | ~500ms      | ~3s         |
| Hierarchical   | ~20ms     | ~200ms      | ~1s         |
| Circular       | ~5ms      | ~30ms       | ~150ms      |

*Benchmarked on MacBook Pro M1, times are approximate*

## License

MIT

