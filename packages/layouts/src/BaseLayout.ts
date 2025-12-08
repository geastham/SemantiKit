import type {
  ILayoutEngine,
  LayoutInput,
  LayoutOptions,
  LayoutResult,
  LayoutType,
  PositionedNode,
} from './types';
import type { KGNode } from '@semantikit/core';

/**
 * Abstract base class for layout engines
 */
export abstract class BaseLayout implements ILayoutEngine {
  protected stopped: boolean = false;

  /**
   * Calculate layout (to be implemented by subclasses)
   */
  abstract layout(
    input: LayoutInput,
    options?: LayoutOptions
  ): Promise<LayoutResult>;

  /**
   * Get layout type (to be implemented by subclasses)
   */
  abstract getType(): LayoutType;

  /**
   * Stop ongoing layout calculation
   */
  stop(): void {
    this.stopped = true;
  }

  /**
   * Reset stop flag
   */
  protected reset(): void {
    this.stopped = false;
  }

  /**
   * Check if layout should stop
   */
  protected shouldStop(): boolean {
    return this.stopped;
  }

  /**
   * Initialize nodes with positions (or preserve existing)
   */
  protected initializePositions(
    nodes: KGNode[],
    dimensions?: { width: number; height: number }
  ): PositionedNode[] {
    const width = dimensions?.width || 800;
    const height = dimensions?.height || 600;

    return nodes.map((node) => {
      // If node already has a position, use it
      if (node.position) {
        return {
          ...node,
          position: { ...node.position },
        };
      }

      // Otherwise, random initial position
      return {
        ...node,
        position: {
          x: Math.random() * width,
          y: Math.random() * height,
        },
      };
    });
  }

  /**
   * Center layout in the given dimensions
   */
  protected centerLayout(
    nodes: PositionedNode[],
    dimensions?: { width: number; height: number }
  ): PositionedNode[] {
    if (nodes.length === 0) return nodes;

    const width = dimensions?.width || 800;
    const height = dimensions?.height || 600;

    // Calculate current bounds
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    nodes.forEach((node) => {
      minX = Math.min(minX, node.position.x);
      maxX = Math.max(maxX, node.position.x);
      minY = Math.min(minY, node.position.y);
      maxY = Math.max(maxY, node.position.y);
    });

    // Calculate centering offsets
    const currentWidth = maxX - minX;
    const currentHeight = maxY - minY;
    const offsetX = (width - currentWidth) / 2 - minX;
    const offsetY = (height - currentHeight) / 2 - minY;

    // Apply offsets
    return nodes.map((node) => ({
      ...node,
      position: {
        x: node.position.x + offsetX,
        y: node.position.y + offsetY,
      },
    }));
  }

  /**
   * Create a reproducible random number generator
   */
  protected createRNG(seed?: number): () => number {
    let state = seed ?? Date.now();

    return () => {
      // Simple LCG (Linear Congruential Generator)
      state = (state * 1664525 + 1013904223) % 4294967296;
      return state / 4294967296;
    };
  }

  /**
   * Build adjacency map for quick neighbor lookup
   */
  protected buildAdjacencyMap(
    input: LayoutInput
  ): Map<string, Set<string>> {
    const adjacency = new Map<string, Set<string>>();

    // Initialize sets for all nodes
    input.nodes.forEach((node) => {
      adjacency.set(node.id, new Set());
    });

    // Add edges
    input.edges.forEach((edge) => {
      adjacency.get(edge.source)?.add(edge.target);
      // For undirected edges, add reverse
      if (!edge.directed) {
        adjacency.get(edge.target)?.add(edge.source);
      }
    });

    return adjacency;
  }

  /**
   * Find root nodes (nodes with no incoming edges)
   */
  protected findRoots(input: LayoutInput): string[] {
    const hasIncoming = new Set<string>();

    input.edges.forEach((edge) => {
      if (edge.directed) {
        hasIncoming.add(edge.target);
      }
    });

    return input.nodes
      .filter((node) => !hasIncoming.has(node.id))
      .map((node) => node.id);
  }

  /**
   * Calculate layout layers using BFS
   */
  protected calculateLayers(
    input: LayoutInput,
    roots?: string[]
  ): Map<string, number> {
    const layers = new Map<string, number>();
    const rootNodes = roots || this.findRoots(input);
    const adjacency = this.buildAdjacencyMap(input);

    // BFS from roots
    const queue: Array<{ id: string; layer: number }> = rootNodes.map(
      (id) => ({ id, layer: 0 })
    );
    const visited = new Set<string>();

    while (queue.length > 0) {
      const { id, layer } = queue.shift()!;

      if (visited.has(id)) continue;
      visited.add(id);

      layers.set(id, layer);

      const neighbors = adjacency.get(id) || new Set();
      neighbors.forEach((neighborId) => {
        if (!visited.has(neighborId)) {
          queue.push({ id: neighborId, layer: layer + 1 });
        }
      });
    }

    // Handle disconnected nodes
    input.nodes.forEach((node) => {
      if (!layers.has(node.id)) {
        layers.set(node.id, 0);
      }
    });

    return layers;
  }
}

