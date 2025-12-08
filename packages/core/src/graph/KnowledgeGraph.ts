import type { KGNode } from '../types/node';
import type { KGEdge } from '../types/edge';
import type { SchemaDefinition } from '../types/schema';
import type {
  GraphMetadata,
  GraphStatistics,
  QueryOptions,
  NeighborOptions,
  NeighborResult,
  SubgraphOptions,
} from '../types/graph';

/**
 * Event types emitted by KnowledgeGraph
 */
export type GraphEventType =
  | 'nodeAdded'
  | 'nodeUpdated'
  | 'nodeDeleted'
  | 'edgeAdded'
  | 'edgeUpdated'
  | 'edgeDeleted'
  | 'graphCleared';

/**
 * Event data for graph changes
 */
export interface GraphEvent {
  type: GraphEventType;
  data: {
    node?: KGNode;
    edge?: KGEdge;
    nodeId?: string;
    edgeId?: string;
  };
  timestamp: number;
}

/**
 * Event listener function type
 */
export type GraphEventListener = (event: GraphEvent) => void;

/**
 * Main knowledge graph class providing CRUD operations, indices, and queries
 *
 * @example
 * ```typescript
 * const graph = new KnowledgeGraph();
 *
 * // Add nodes
 * graph.addNode({
 *   id: '1',
 *   type: 'Person',
 *   label: 'Alice',
 *   position: { x: 0, y: 0 }
 * });
 *
 * // Add edges
 * graph.addEdge({
 *   id: 'e1',
 *   type: 'knows',
 *   source: '1',
 *   target: '2',
 *   directed: true
 * });
 *
 * // Query
 * const neighbors = graph.getNeighbors('1');
 * ```
 */
export class KnowledgeGraph {
  private nodes: Map<string, KGNode>;
  private edges: Map<string, KGEdge>;
  private nodesByType: Map<string, Set<string>>;
  private edgesByNode: Map<string, Set<string>>;
  private edgesByType: Map<string, Set<string>>;
  private incomingEdges: Map<string, Set<string>>;
  private outgoingEdges: Map<string, Set<string>>;
  private listeners: Set<GraphEventListener>;

  public schema?: SchemaDefinition;
  public metadata: GraphMetadata;

  constructor(
    initialData?: {
      nodes?: KGNode[];
      edges?: KGEdge[];
      schema?: SchemaDefinition;
      metadata?: GraphMetadata;
    }
  ) {
    this.nodes = new Map();
    this.edges = new Map();
    this.nodesByType = new Map();
    this.edgesByNode = new Map();
    this.edgesByType = new Map();
    this.incomingEdges = new Map();
    this.outgoingEdges = new Map();
    this.listeners = new Set();

    this.schema = initialData?.schema;
    this.metadata = initialData?.metadata || {};

    // Initialize with provided data
    if (initialData?.nodes) {
      initialData.nodes.forEach((node) => this.addNode(node, true));
    }
    if (initialData?.edges) {
      initialData.edges.forEach((edge) => this.addEdge(edge, true));
    }
  }

  // ============================================================================
  // Event Management
  // ============================================================================

  /**
   * Subscribe to graph change events
   */
  public on(listener: GraphEventListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Emit a graph event
   */
  private emit(type: GraphEventType, data: GraphEvent['data']): void {
    const event: GraphEvent = {
      type,
      data,
      timestamp: Date.now(),
    };
    this.listeners.forEach((listener) => listener(event));
  }

  // ============================================================================
  // Node Operations
  // ============================================================================

  /**
   * Add a node to the graph
   * @throws {Error} If node with same ID already exists
   */
  public addNode(node: KGNode, silent = false): void {
    if (this.nodes.has(node.id)) {
      throw new Error(`Node with id "${node.id}" already exists`);
    }

    // Validate against schema if present
    if (this.schema) {
      this.validateNode(node);
    }

    this.nodes.set(node.id, { ...node });

    // Update indices
    if (!this.nodesByType.has(node.type)) {
      this.nodesByType.set(node.type, new Set());
    }
    this.nodesByType.get(node.type)!.add(node.id);

    this.edgesByNode.set(node.id, new Set());
    this.incomingEdges.set(node.id, new Set());
    this.outgoingEdges.set(node.id, new Set());

    if (!silent) {
      this.emit('nodeAdded', { node });
    }
  }

  /**
   * Update an existing node
   * @throws {Error} If node doesn't exist
   */
  public updateNode(id: string, updates: Partial<KGNode>): void {
    const existing = this.nodes.get(id);
    if (!existing) {
      throw new Error(`Node with id "${id}" not found`);
    }

    const updated = { ...existing, ...updates, id }; // Prevent ID changes

    // If type changed, update indices
    if (updates.type && updates.type !== existing.type) {
      const oldTypeSet = this.nodesByType.get(existing.type);
      if (oldTypeSet) {
        oldTypeSet.delete(id);
        if (oldTypeSet.size === 0) {
          this.nodesByType.delete(existing.type);
        }
      }

      if (!this.nodesByType.has(updates.type)) {
        this.nodesByType.set(updates.type, new Set());
      }
      this.nodesByType.get(updates.type)!.add(id);
    }

    // Validate against schema if present
    if (this.schema) {
      this.validateNode(updated);
    }

    this.nodes.set(id, updated);
    this.emit('nodeUpdated', { node: updated });
  }

  /**
   * Delete a node and all connected edges
   * @throws {Error} If node doesn't exist
   */
  public deleteNode(id: string): void {
    const node = this.nodes.get(id);
    if (!node) {
      throw new Error(`Node with id "${id}" not found`);
    }

    // Delete all connected edges
    const connectedEdges = this.edgesByNode.get(id) || new Set();
    connectedEdges.forEach((edgeId) => {
      this.deleteEdge(edgeId);
    });

    // Update indices
    const typeSet = this.nodesByType.get(node.type);
    if (typeSet) {
      typeSet.delete(id);
      if (typeSet.size === 0) {
        this.nodesByType.delete(node.type);
      }
    }

    this.nodes.delete(id);
    this.edgesByNode.delete(id);
    this.incomingEdges.delete(id);
    this.outgoingEdges.delete(id);

    this.emit('nodeDeleted', { nodeId: id });
  }

  /**
   * Get a node by ID
   */
  public getNode(id: string): KGNode | undefined {
    const node = this.nodes.get(id);
    return node ? { ...node } : undefined;
  }

  /**
   * Check if a node exists
   */
  public hasNode(id: string): boolean {
    return this.nodes.has(id);
  }

  /**
   * Get all nodes
   */
  public getNodes(): KGNode[] {
    return Array.from(this.nodes.values()).map((node) => ({ ...node }));
  }

  /**
   * Query nodes with filters
   */
  public queryNodes(options: QueryOptions = {}): KGNode[] {
    let results = Array.from(this.nodes.values());

    // Filter by type
    if (options.types && options.types.length > 0) {
      results = results.filter((node) => options.types!.includes(node.type));
    }

    // Filter by properties
    if (options.properties) {
      results = results.filter((node) => {
        return Object.entries(options.properties!).every(
          ([key, value]) => node[key] === value
        );
      });
    }

    // Sort
    if (options.sortBy) {
      results.sort((a, b) => {
        const aVal = a[options.sortBy!] as any;
        const bVal = b[options.sortBy!] as any;
        const order = options.sortDirection === 'desc' ? -1 : 1;

        if (aVal < bVal) return -1 * order;
        if (aVal > bVal) return 1 * order;
        return 0;
      });
    }

    // Pagination
    if (options.offset) {
      results = results.slice(options.offset);
    }
    if (options.limit) {
      results = results.slice(0, options.limit);
    }

    return results.map((node) => ({ ...node }));
  }

  // ============================================================================
  // Edge Operations
  // ============================================================================

  /**
   * Add an edge to the graph
   * @throws {Error} If edge with same ID already exists or nodes don't exist
   */
  public addEdge(edge: KGEdge, silent = false): void {
    if (this.edges.has(edge.id)) {
      throw new Error(`Edge with id "${edge.id}" already exists`);
    }

    if (!this.nodes.has(edge.source)) {
      throw new Error(`Source node "${edge.source}" not found`);
    }

    if (!this.nodes.has(edge.target)) {
      throw new Error(`Target node "${edge.target}" not found`);
    }

    // Validate against schema if present
    if (this.schema) {
      this.validateEdge(edge);
    }

    this.edges.set(edge.id, { ...edge });

    // Update indices
    if (!this.edgesByType.has(edge.type)) {
      this.edgesByType.set(edge.type, new Set());
    }
    this.edgesByType.get(edge.type)!.add(edge.id);

    this.edgesByNode.get(edge.source)!.add(edge.id);
    this.edgesByNode.get(edge.target)!.add(edge.id);

    this.outgoingEdges.get(edge.source)!.add(edge.id);
    this.incomingEdges.get(edge.target)!.add(edge.id);

    if (!silent) {
      this.emit('edgeAdded', { edge });
    }
  }

  /**
   * Update an existing edge
   * @throws {Error} If edge doesn't exist
   */
  public updateEdge(id: string, updates: Partial<KGEdge>): void {
    const existing = this.edges.get(id);
    if (!existing) {
      throw new Error(`Edge with id "${id}" not found`);
    }

    // Prevent source/target changes (would require re-indexing)
    const updated = {
      ...existing,
      ...updates,
      id,
      source: existing.source,
      target: existing.target,
    };

    // If type changed, update indices
    if (updates.type && updates.type !== existing.type) {
      const oldTypeSet = this.edgesByType.get(existing.type);
      if (oldTypeSet) {
        oldTypeSet.delete(id);
        if (oldTypeSet.size === 0) {
          this.edgesByType.delete(existing.type);
        }
      }

      if (!this.edgesByType.has(updates.type)) {
        this.edgesByType.set(updates.type, new Set());
      }
      this.edgesByType.get(updates.type)!.add(id);
    }

    // Validate against schema if present
    if (this.schema) {
      this.validateEdge(updated);
    }

    this.edges.set(id, updated);
    this.emit('edgeUpdated', { edge: updated });
  }

  /**
   * Delete an edge
   * @throws {Error} If edge doesn't exist
   */
  public deleteEdge(id: string): void {
    const edge = this.edges.get(id);
    if (!edge) {
      throw new Error(`Edge with id "${id}" not found`);
    }

    // Update indices
    const typeSet = this.edgesByType.get(edge.type);
    if (typeSet) {
      typeSet.delete(id);
      if (typeSet.size === 0) {
        this.edgesByType.delete(edge.type);
      }
    }

    this.edgesByNode.get(edge.source)?.delete(id);
    this.edgesByNode.get(edge.target)?.delete(id);
    this.outgoingEdges.get(edge.source)?.delete(id);
    this.incomingEdges.get(edge.target)?.delete(id);

    this.edges.delete(id);
    this.emit('edgeDeleted', { edgeId: id });
  }

  /**
   * Get an edge by ID
   */
  public getEdge(id: string): KGEdge | undefined {
    const edge = this.edges.get(id);
    return edge ? { ...edge } : undefined;
  }

  /**
   * Check if an edge exists
   */
  public hasEdge(id: string): boolean {
    return this.edges.has(id);
  }

  /**
   * Get all edges
   */
  public getEdges(): KGEdge[] {
    return Array.from(this.edges.values()).map((edge) => ({ ...edge }));
  }

  /**
   * Query edges with filters
   */
  public queryEdges(options: QueryOptions = {}): KGEdge[] {
    let results = Array.from(this.edges.values());

    // Filter by type
    if (options.types && options.types.length > 0) {
      results = results.filter((edge) => options.types!.includes(edge.type));
    }

    // Filter by properties
    if (options.properties) {
      results = results.filter((edge) => {
        return Object.entries(options.properties!).every(
          ([key, value]) => edge[key] === value
        );
      });
    }

    return results.map((edge) => ({ ...edge }));
  }

  // ============================================================================
  // Graph Queries
  // ============================================================================

  /**
   * Get neighbors of a node
   */
  public getNeighbors(
    nodeId: string,
    options: NeighborOptions = {}
  ): NeighborResult {
    if (!this.nodes.has(nodeId)) {
      throw new Error(`Node with id "${nodeId}" not found`);
    }

    const {
      direction = 'both',
      edgeTypes,
      depth = 1,
      includeEdges = false,
    } = options;

    const visitedNodes = new Set<string>();
    const visitedEdges = new Set<string>();
    const distances: Record<string, number> = {};
    const queue: Array<{ id: string; depth: number }> = [
      { id: nodeId, depth: 0 },
    ];

    visitedNodes.add(nodeId);
    distances[nodeId] = 0;

    while (queue.length > 0) {
      const current = queue.shift()!;

      if (current.depth >= depth) continue;

      let edgeIds: Set<string> = new Set();

      if (direction === 'outgoing' || direction === 'both') {
        const outgoing = this.outgoingEdges.get(current.id) || new Set();
        outgoing.forEach((id) => edgeIds.add(id));
      }

      if (direction === 'incoming' || direction === 'both') {
        const incoming = this.incomingEdges.get(current.id) || new Set();
        incoming.forEach((id) => edgeIds.add(id));
      }

      edgeIds.forEach((edgeId) => {
        const edge = this.edges.get(edgeId)!;

        // Filter by edge type if specified
        if (edgeTypes && !edgeTypes.includes(edge.type)) {
          return;
        }

        visitedEdges.add(edgeId);

        const neighborId =
          edge.source === current.id ? edge.target : edge.source;

        if (!visitedNodes.has(neighborId)) {
          visitedNodes.add(neighborId);
          distances[neighborId] = current.depth + 1;
          queue.push({ id: neighborId, depth: current.depth + 1 });
        }
      });
    }

    // Remove the starting node from results
    visitedNodes.delete(nodeId);
    delete distances[nodeId];

    const nodes = Array.from(visitedNodes)
      .map((id) => this.nodes.get(id)!)
      .map((node) => ({ ...node }));

    const result: NeighborResult = { nodes, distances };

    if (includeEdges) {
      result.edges = Array.from(visitedEdges)
        .map((id) => this.edges.get(id)!)
        .map((edge) => ({ ...edge }));
    }

    return result;
  }

  /**
   * Get a subgraph containing specified nodes and their connections
   */
  public getSubgraph(
    nodeIds: string[],
    options: SubgraphOptions = {}
  ): { nodes: KGNode[]; edges: KGEdge[] } {
    const { maxNodes } = options;

    // Start with provided nodes
    const selectedNodes = new Set(nodeIds);

    // If we want neighbors, expand the selection
    if (options.depth && options.depth > 0) {
      nodeIds.forEach((nodeId) => {
        const neighbors = this.getNeighbors(nodeId, options);
        neighbors.nodes.forEach((node) => {
          if (!maxNodes || selectedNodes.size < maxNodes) {
            selectedNodes.add(node.id);
          }
        });
      });
    }

    // Get all nodes
    const nodes = Array.from(selectedNodes)
      .map((id) => this.nodes.get(id))
      .filter((node): node is KGNode => node !== undefined)
      .map((node) => ({ ...node }));

    // Get edges connecting these nodes
    const edges: KGEdge[] = [];
    selectedNodes.forEach((nodeId) => {
      const nodeEdges = this.edgesByNode.get(nodeId) || new Set();
      nodeEdges.forEach((edgeId) => {
        const edge = this.edges.get(edgeId)!;
        if (selectedNodes.has(edge.source) && selectedNodes.has(edge.target)) {
          edges.push({ ...edge });
        }
      });
    });

    // Remove duplicate edges
    const uniqueEdges = Array.from(
      new Map(edges.map((edge) => [edge.id, edge])).values()
    );

    return { nodes, edges: uniqueEdges };
  }

  // ============================================================================
  // Graph Statistics
  // ============================================================================

  /**
   * Get graph statistics
   */
  public getStatistics(): GraphStatistics {
    const nodesByType: Record<string, number> = {};
    this.nodesByType.forEach((nodeIds, type) => {
      nodesByType[type] = nodeIds.size;
    });

    const edgesByType: Record<string, number> = {};
    this.edgesByType.forEach((edgeIds, type) => {
      edgesByType[type] = edgeIds.size;
    });

    const degrees = Array.from(this.nodes.keys()).map(
      (id) => (this.edgesByNode.get(id) || new Set()).size
    );

    const averageDegree =
      degrees.length > 0
        ? degrees.reduce((sum, d) => sum + d, 0) / degrees.length
        : 0;

    const maxDegree = degrees.length > 0 ? Math.max(...degrees) : 0;

    // Simple connectivity check (BFS from first node)
    const isConnected = this.checkConnectivity();

    return {
      nodeCount: this.nodes.size,
      edgeCount: this.edges.size,
      nodesByType,
      edgesByType,
      averageDegree,
      maxDegree,
      isConnected,
    };
  }

  /**
   * Check if graph is connected
   */
  private checkConnectivity(): boolean {
    if (this.nodes.size === 0) return true;
    if (this.nodes.size === 1) return true;

    const firstNode = Array.from(this.nodes.keys())[0];
    const visited = new Set<string>();
    const queue = [firstNode];

    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      if (visited.has(nodeId)) continue;

      visited.add(nodeId);

      const edges = this.edgesByNode.get(nodeId) || new Set();
      edges.forEach((edgeId) => {
        const edge = this.edges.get(edgeId)!;
        const neighbor = edge.source === nodeId ? edge.target : edge.source;
        if (!visited.has(neighbor)) {
          queue.push(neighbor);
        }
      });
    }

    return visited.size === this.nodes.size;
  }

  // ============================================================================
  // Validation
  // ============================================================================

  /**
   * Validate a node against the schema
   */
  private validateNode(node: KGNode): void {
    if (!this.schema) return;

    const nodeType = this.schema.nodeTypes.find((nt) => nt.id === node.type);
    if (!nodeType) {
      throw new Error(`Node type "${node.type}" not defined in schema`);
    }

    // Validate required properties
    if (nodeType.properties) {
      nodeType.properties.forEach((prop) => {
        if (prop.required && node[prop.key] === undefined) {
          throw new Error(
            `Required property "${prop.key}" missing on node "${node.id}"`
          );
        }
      });
    }
  }

  /**
   * Validate an edge against the schema
   */
  private validateEdge(edge: KGEdge): void {
    if (!this.schema) return;

    const edgeType = this.schema.edgeTypes.find((et) => et.id === edge.type);
    if (!edgeType) {
      throw new Error(`Edge type "${edge.type}" not defined in schema`);
    }

    // Validate source/target node types if constrained
    if (edgeType.sourceTypes || edgeType.targetTypes) {
      const sourceNode = this.nodes.get(edge.source);
      const targetNode = this.nodes.get(edge.target);

      if (
        edgeType.sourceTypes &&
        sourceNode &&
        !edgeType.sourceTypes.includes(sourceNode.type)
      ) {
        throw new Error(
          `Source node type "${sourceNode.type}" not allowed for edge type "${edge.type}"`
        );
      }

      if (
        edgeType.targetTypes &&
        targetNode &&
        !edgeType.targetTypes.includes(targetNode.type)
      ) {
        throw new Error(
          `Target node type "${targetNode.type}" not allowed for edge type "${edge.type}"`
        );
      }
    }
  }

  // ============================================================================
  // Utility Methods
  // ============================================================================

  /**
   * Clear all nodes and edges
   */
  public clear(): void {
    this.nodes.clear();
    this.edges.clear();
    this.nodesByType.clear();
    this.edgesByNode.clear();
    this.edgesByType.clear();
    this.incomingEdges.clear();
    this.outgoingEdges.clear();

    this.emit('graphCleared', {});
  }

  /**
   * Get node count
   */
  public get nodeCount(): number {
    return this.nodes.size;
  }

  /**
   * Get edge count
   */
  public get edgeCount(): number {
    return this.edges.size;
  }

  /**
   * Clone the graph
   */
  public clone(): KnowledgeGraph {
    return new KnowledgeGraph({
      nodes: this.getNodes(),
      edges: this.getEdges(),
      schema: this.schema,
      metadata: { ...this.metadata },
    });
  }
}
