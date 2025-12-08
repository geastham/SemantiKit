import ELK, { type ElkNode, type ElkExtendedEdge } from 'elkjs/lib/elk.bundled';
import { BaseLayout } from './BaseLayout';
import type {
  LayoutInput,
  LayoutResult,
  LayoutType,
  HierarchicalLayoutOptions,
  PositionedNode,
} from './types';

/**
 * Hierarchical layout using ELK (Eclipse Layout Kernel)
 */
export class HierarchicalLayout extends BaseLayout {
  private elk: ELK;

  constructor() {
    super();
    this.elk = new ELK();
  }

  getType(): LayoutType {
    return 'hierarchical';
  }

  async layout(
    input: LayoutInput,
    options: HierarchicalLayoutOptions = {}
  ): Promise<LayoutResult> {
    const startTime = Date.now();
    this.reset();

    if (input.nodes.length === 0) {
      return {
        nodes: [],
        duration: Date.now() - startTime,
        metadata: {
          algorithm: 'hierarchical',
        },
      };
    }

    // Default options
    const direction = options.direction ?? 'DOWN';
    const nodeSpacing = options.nodeSpacing ?? 60;
    const layerSpacing = options.layerSpacing ?? 80;

    // Convert to ELK format
    const elkNodes: ElkNode[] = input.nodes.map((node) => ({
      id: node.id,
      width: 60,
      height: 40,
    }));

    const elkEdges: ElkExtendedEdge[] = input.edges.map((edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    }));

    const graph: ElkNode = {
      id: 'root',
      layoutOptions: {
        'elk.algorithm': 'layered',
        'elk.direction': direction,
        'elk.spacing.nodeNode': String(nodeSpacing),
        'elk.layered.spacing.nodeNodeBetweenLayers': String(layerSpacing),
        'elk.padding': '[top=50,left=50,bottom=50,right=50]',
      },
      children: elkNodes,
      edges: elkEdges,
    };

    try {
      // Run ELK layout
      const layouted = await this.elk.layout(graph);

      // Extract positions
      const positionMap = new Map<string, { x: number; y: number }>();
      layouted.children?.forEach((child) => {
        if (child.x !== undefined && child.y !== undefined) {
          positionMap.set(child.id, {
            x: child.x + (child.width || 0) / 2, // Center point
            y: child.y + (child.height || 0) / 2,
          });
        }
      });

      // Apply positions to nodes
      let positionedNodes: PositionedNode[] = input.nodes.map((node) => {
        const pos = positionMap.get(node.id);
        return {
          ...node,
          position: pos || { x: 0, y: 0 },
        };
      });

      // Center the layout
      positionedNodes = this.centerLayout(positionedNodes, input.dimensions);

      const duration = Date.now() - startTime;

      return {
        nodes: positionedNodes,
        duration,
        metadata: {
          algorithm: 'hierarchical-elk',
        },
      };
    } catch (error) {
      // Fallback to simple layer-based layout if ELK fails
      return this.fallbackLayout(input, options, startTime);
    }
  }

  /**
   * Simple fallback hierarchical layout
   */
  private fallbackLayout(
    input: LayoutInput,
    options: HierarchicalLayoutOptions,
    startTime: number
  ): LayoutResult {
    const direction = options.direction ?? 'DOWN';
    const nodeSpacing = options.nodeSpacing ?? 60;
    const layerSpacing = options.layerSpacing ?? 80;

    // Calculate layers
    const layers = this.calculateLayers(input, options.roots);

    // Group nodes by layer
    const layerGroups = new Map<number, string[]>();
    layers.forEach((layer, nodeId) => {
      if (!layerGroups.has(layer)) {
        layerGroups.set(layer, []);
      }
      layerGroups.get(layer)!.push(nodeId);
    });

    // Calculate positions
    const positionMap = new Map<string, { x: number; y: number }>();
    const maxLayer = Math.max(...layers.values());

    layerGroups.forEach((nodeIds, layer) => {
      const layerWidth = (nodeIds.length - 1) * nodeSpacing;
      const startX = -layerWidth / 2;

      nodeIds.forEach((nodeId, idx) => {
        let x: number, y: number;

        if (direction === 'DOWN' || direction === 'UP') {
          x = startX + idx * nodeSpacing;
          y = layer * layerSpacing;
          if (direction === 'UP') {
            y = (maxLayer - layer) * layerSpacing;
          }
        } else {
          // LEFT or RIGHT
          y = startX + idx * nodeSpacing;
          x = layer * layerSpacing;
          if (direction === 'LEFT') {
            x = (maxLayer - layer) * layerSpacing;
          }
        }

        positionMap.set(nodeId, { x, y });
      });
    });

    // Apply positions
    let positionedNodes: PositionedNode[] = input.nodes.map((node) => ({
      ...node,
      position: positionMap.get(node.id) || { x: 0, y: 0 },
    }));

    // Center the layout
    positionedNodes = this.centerLayout(positionedNodes, input.dimensions);

    const duration = Date.now() - startTime;

    return {
      nodes: positionedNodes,
      duration,
      metadata: {
        algorithm: 'hierarchical-fallback',
      },
    };
  }
}

