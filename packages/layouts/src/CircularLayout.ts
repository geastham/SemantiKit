import { BaseLayout } from './BaseLayout';
import type {
  LayoutInput,
  LayoutResult,
  LayoutType,
  CircularLayoutOptions,
  PositionedNode,
} from './types';

/**
 * Circular layout that arranges nodes in a circle
 */
export class CircularLayout extends BaseLayout {
  getType(): LayoutType {
    return 'circular';
  }

  async layout(
    input: LayoutInput,
    options: CircularLayoutOptions = {}
  ): Promise<LayoutResult> {
    const startTime = Date.now();
    this.reset();

    if (input.nodes.length === 0) {
      return {
        nodes: [],
        duration: Date.now() - startTime,
        metadata: {
          algorithm: 'circular',
        },
      };
    }

    // Default options
    const width = input.dimensions?.width || 800;
    const height = input.dimensions?.height || 600;
    const defaultRadius = Math.min(width, height) * 0.35; // 35% of smaller dimension

    const radius = options.radius ?? defaultRadius;
    const startAngle = options.startAngle ?? 0;
    const clockwise = options.clockwise ?? true;
    const sortBy = options.sortBy;

    // Sort nodes if requested
    let orderedNodes = [...input.nodes];
    if (sortBy) {
      orderedNodes.sort((a, b) => {
        const aVal = (a as any)[sortBy];
        const bVal = (b as any)[sortBy];
        if (aVal < bVal) return -1;
        if (aVal > bVal) return 1;
        return 0;
      });
    }

    // Calculate center
    const centerX = width / 2;
    const centerY = height / 2;

    // Calculate positions
    const angleStep =
      (2 * Math.PI) / orderedNodes.length * (clockwise ? 1 : -1);

    const positionedNodes: PositionedNode[] = orderedNodes.map((node, idx) => {
      const angle = startAngle + idx * angleStep;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      return {
        ...node,
        position: { x, y },
      };
    });

    const duration = Date.now() - startTime;

    return {
      nodes: positionedNodes,
      duration,
      metadata: {
        algorithm: 'circular',
      },
    };
  }
}

