import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  type SimulationNodeDatum,
  type SimulationLinkDatum,
} from 'd3-force';
import { BaseLayout } from './BaseLayout';
import type {
  LayoutInput,
  LayoutResult,
  LayoutType,
  ForceLayoutOptions,
  PositionedNode,
} from './types';

/**
 * Force-directed layout using d3-force
 */
export class ForceDirectedLayout extends BaseLayout {
  getType(): LayoutType {
    return 'force';
  }

  async layout(
    input: LayoutInput,
    options: ForceLayoutOptions = {}
  ): Promise<LayoutResult> {
    const startTime = Date.now();
    this.reset();

    if (input.nodes.length === 0) {
      return {
        nodes: [],
        duration: Date.now() - startTime,
        metadata: {
          algorithm: 'force-directed',
          iterations: 0,
          converged: true,
        },
      };
    }

    // Default options
    const linkDistance = options.linkDistance ?? 100;
    const chargeStrength = options.chargeStrength ?? -300;
    const collisionRadius = options.collisionRadius ?? 30;
    const centerStrength = options.centerStrength ?? 0.1;
    const iterations = options.iterations ?? 300;
    const alphaDecay = options.alphaDecay ?? 0.02;
    const alphaMin = options.alphaMin ?? 0.001;

    // Initialize positions
    let positionedNodes = this.initializePositions(
      input.nodes,
      input.dimensions
    );

    // Create simulation nodes (d3-force format)
    const simNodes: Array<SimulationNodeDatum & { id: string }> =
      positionedNodes.map((node) => ({
        id: node.id,
        x: node.position.x,
        y: node.position.y,
      }));

    // Create simulation links
    const simLinks: Array<
      SimulationLinkDatum<SimulationNodeDatum & { id: string }>
    > = input.edges.map((edge) => ({
      source: edge.source,
      target: edge.target,
    }));

    // Create force simulation
    const centerX = (input.dimensions?.width || 800) / 2;
    const centerY = (input.dimensions?.height || 600) / 2;

    const simulation = forceSimulation(simNodes)
      .force(
        'link',
        forceLink(simLinks)
          .id((d: any) => d.id)
          .distance(linkDistance)
      )
      .force('charge', forceManyBody().strength(chargeStrength))
      .force('center', forceCenter(centerX, centerY).strength(centerStrength))
      .force('collide', forceCollide(collisionRadius))
      .alphaDecay(alphaDecay)
      .alphaMin(alphaMin)
      .stop();

    // Run simulation synchronously
    let iterationCount = 0;
    for (let i = 0; i < iterations; i++) {
      if (this.shouldStop()) {
        break;
      }

      simulation.tick();
      iterationCount++;

      // Check for convergence
      if (simulation.alpha() < alphaMin) {
        break;
      }
    }

    // Extract positions from simulation
    positionedNodes = positionedNodes.map((node, idx) => ({
      ...node,
      position: {
        x: simNodes[idx].x ?? node.position.x,
        y: simNodes[idx].y ?? node.position.y,
      },
    }));

    // Center the layout
    positionedNodes = this.centerLayout(positionedNodes, input.dimensions);

    const duration = Date.now() - startTime;

    return {
      nodes: positionedNodes,
      duration,
      metadata: {
        algorithm: 'force-directed',
        iterations: iterationCount,
        converged: simulation.alpha() < alphaMin,
      },
    };
  }
}

