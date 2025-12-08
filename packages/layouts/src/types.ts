/**
 * Core types for layout algorithms
 */

import type { KGNode, KGEdge } from '@semantikit/core';

/**
 * Position in 2D space
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Node with calculated position
 */
export interface PositionedNode extends KGNode {
  position: Position;
}

/**
 * Layout input data
 */
export interface LayoutInput {
  /** Nodes to layout */
  nodes: KGNode[];
  /** Edges connecting the nodes */
  edges: KGEdge[];
  /** Optional dimensions of the layout area */
  dimensions?: {
    width: number;
    height: number;
  };
}

/**
 * Result of a layout operation
 */
export interface LayoutResult {
  /** Nodes with calculated positions */
  nodes: PositionedNode[];
  /** Duration of layout calculation in ms */
  duration: number;
  /** Additional metadata */
  metadata?: {
    iterations?: number;
    converged?: boolean;
    algorithm?: string;
  };
}

/**
 * Common layout options
 */
export interface LayoutOptions {
  /** Random seed for reproducibility */
  seed?: number;
  /** Whether to animate the layout */
  animate?: boolean;
  /** Animation duration in ms */
  animationDuration?: number;
}

/**
 * Force-directed layout options
 */
export interface ForceLayoutOptions extends LayoutOptions {
  /** Ideal link distance */
  linkDistance?: number;
  /** Charge strength (negative = repulsion) */
  chargeStrength?: number;
  /** Collision radius for nodes */
  collisionRadius?: number;
  /** Center force strength */
  centerStrength?: number;
  /** Number of iterations */
  iterations?: number;
  /** Alpha (cooling) decay rate */
  alphaDecay?: number;
  /** Alpha minimum threshold */
  alphaMin?: number;
}

/**
 * Hierarchical layout direction
 */
export type HierarchicalDirection = 'DOWN' | 'UP' | 'LEFT' | 'RIGHT';

/**
 * Hierarchical layout options
 */
export interface HierarchicalLayoutOptions extends LayoutOptions {
  /** Direction of the hierarchy */
  direction?: HierarchicalDirection;
  /** Spacing between nodes in the same layer */
  nodeSpacing?: number;
  /** Spacing between layers */
  layerSpacing?: number;
  /** Root node IDs (if not specified, auto-detect) */
  roots?: string[];
}

/**
 * Circular layout options
 */
export interface CircularLayoutOptions extends LayoutOptions {
  /** Radius of the circle */
  radius?: number;
  /** Starting angle in radians */
  startAngle?: number;
  /** Direction: clockwise or counter-clockwise */
  clockwise?: boolean;
  /** Sort nodes by a property */
  sortBy?: string;
}

/**
 * Grid layout options
 */
export interface GridLayoutOptions extends LayoutOptions {
  /** Number of columns (if not specified, auto-calculate) */
  columns?: number;
  /** Cell width */
  cellWidth?: number;
  /** Cell height */
  cellHeight?: number;
  /** Padding between cells */
  padding?: number;
}

/**
 * Layout algorithm type
 */
export type LayoutType =
  | 'force'
  | 'hierarchical'
  | 'circular'
  | 'grid'
  | 'custom';

/**
 * Base interface for layout engines
 */
export interface ILayoutEngine {
  /**
   * Calculate layout for given nodes and edges
   */
  layout(input: LayoutInput, options?: LayoutOptions): Promise<LayoutResult>;

  /**
   * Get the type of layout
   */
  getType(): LayoutType;

  /**
   * Stop ongoing layout calculation (if animated)
   */
  stop?(): void;
}

