import { KnowledgeGraph } from '../KnowledgeGraph';
import type { KGNode, KGEdge, SchemaDefinition } from '../../types';

describe('KnowledgeGraph', () => {
  let graph: KnowledgeGraph;

  beforeEach(() => {
    graph = new KnowledgeGraph();
  });

  describe('Node Operations', () => {
    describe('addNode', () => {
      it('should add a node successfully', () => {
        const node: KGNode = {
          id: '1',
          type: 'Person',
          label: 'Alice',
          position: { x: 0, y: 0 },
        };

        graph.addNode(node);

        expect(graph.hasNode('1')).toBe(true);
        expect(graph.nodeCount).toBe(1);
        expect(graph.getNode('1')).toEqual(node);
      });

      it('should throw error when adding duplicate node', () => {
        const node: KGNode = {
          id: '1',
          type: 'Person',
          label: 'Alice',
          position: { x: 0, y: 0 },
        };

        graph.addNode(node);

        expect(() => graph.addNode(node)).toThrow(
          'Node with id "1" already exists'
        );
      });

      it('should emit nodeAdded event', (done) => {
        const node: KGNode = {
          id: '1',
          type: 'Person',
          label: 'Alice',
          position: { x: 0, y: 0 },
        };

        graph.on((event) => {
          expect(event.type).toBe('nodeAdded');
          expect(event.data.node).toEqual(node);
          done();
        });

        graph.addNode(node);
      });

      it('should update nodesByType index', () => {
        graph.addNode({ id: '1', type: 'Person', label: 'Alice' });
        graph.addNode({ id: '2', type: 'Person', label: 'Bob' });
        graph.addNode({ id: '3', type: 'Company', label: 'Acme' });

        const people = graph.queryNodes({ types: ['Person'] });
        expect(people).toHaveLength(2);
        expect(people.map((n) => n.id)).toEqual(expect.arrayContaining(['1', '2']));
      });
    });

    describe('updateNode', () => {
      it('should update node properties', () => {
        graph.addNode({ id: '1', type: 'Person', label: 'Alice' });

        graph.updateNode('1', { label: 'Alice Smith' });

        const updated = graph.getNode('1');
        expect(updated?.label).toBe('Alice Smith');
      });

      it('should prevent ID changes', () => {
        graph.addNode({ id: '1', type: 'Person', label: 'Alice' });

        graph.updateNode('1', { id: '999' } as any);

        expect(graph.hasNode('1')).toBe(true);
        expect(graph.hasNode('999')).toBe(false);
      });

      it('should throw error when updating non-existent node', () => {
        expect(() => graph.updateNode('999', { label: 'Test' })).toThrow(
          'Node with id "999" not found'
        );
      });

      it('should update nodesByType index when type changes', () => {
        graph.addNode({ id: '1', type: 'Person', label: 'Alice' });

        graph.updateNode('1', { type: 'Company' });

        const people = graph.queryNodes({ types: ['Person'] });
        const companies = graph.queryNodes({ types: ['Company'] });

        expect(people).toHaveLength(0);
        expect(companies).toHaveLength(1);
        expect(companies[0].id).toBe('1');
      });

      it('should emit nodeUpdated event', (done) => {
        graph.addNode({ id: '1', type: 'Person', label: 'Alice' });

        graph.on((event) => {
          if (event.type === 'nodeUpdated') {
            expect(event.data.node?.label).toBe('Alice Smith');
            done();
          }
        });

        graph.updateNode('1', { label: 'Alice Smith' });
      });
    });

    describe('deleteNode', () => {
      it('should delete a node', () => {
        graph.addNode({ id: '1', type: 'Person', label: 'Alice' });

        graph.deleteNode('1');

        expect(graph.hasNode('1')).toBe(false);
        expect(graph.nodeCount).toBe(0);
      });

      it('should throw error when deleting non-existent node', () => {
        expect(() => graph.deleteNode('999')).toThrow(
          'Node with id "999" not found'
        );
      });

      it('should delete connected edges', () => {
        graph.addNode({ id: '1', type: 'Person', label: 'Alice' });
        graph.addNode({ id: '2', type: 'Person', label: 'Bob' });
        graph.addEdge({
          id: 'e1',
          type: 'knows',
          source: '1',
          target: '2',
          directed: true,
        });

        graph.deleteNode('1');

        expect(graph.hasEdge('e1')).toBe(false);
        expect(graph.edgeCount).toBe(0);
      });

      it('should emit nodeDeleted event', (done) => {
        graph.addNode({ id: '1', type: 'Person', label: 'Alice' });

        graph.on((event) => {
          if (event.type === 'nodeDeleted') {
            expect(event.data.nodeId).toBe('1');
            done();
          }
        });

        graph.deleteNode('1');
      });
    });

    describe('getNode', () => {
      it('should return a copy of the node', () => {
        const original: KGNode = { id: '1', type: 'Person', label: 'Alice' };
        graph.addNode(original);

        const retrieved = graph.getNode('1')!;
        retrieved.label = 'Modified';

        expect(graph.getNode('1')?.label).toBe('Alice');
      });

      it('should return undefined for non-existent node', () => {
        expect(graph.getNode('999')).toBeUndefined();
      });
    });

    describe('queryNodes', () => {
      beforeEach(() => {
        graph.addNode({ id: '1', type: 'Person', label: 'Alice', age: 30 });
        graph.addNode({ id: '2', type: 'Person', label: 'Bob', age: 25 });
        graph.addNode({ id: '3', type: 'Company', label: 'Acme', age: 50 });
      });

      it('should filter by type', () => {
        const results = graph.queryNodes({ types: ['Person'] });
        expect(results).toHaveLength(2);
      });

      it('should filter by properties', () => {
        const results = graph.queryNodes({ properties: { age: 30 } });
        expect(results).toHaveLength(1);
        expect(results[0].id).toBe('1');
      });

      it('should support multiple filters', () => {
        const results = graph.queryNodes({
          types: ['Person'],
          properties: { age: 30 },
        });
        expect(results).toHaveLength(1);
        expect(results[0].id).toBe('1');
      });

      it('should sort results', () => {
        const results = graph.queryNodes({
          sortBy: 'age',
          sortDirection: 'asc',
        });
        expect(results.map((n) => n.id)).toEqual(['2', '1', '3']);
      });

      it('should support pagination', () => {
        const page1 = graph.queryNodes({ limit: 2 });
        const page2 = graph.queryNodes({ offset: 2, limit: 2 });

        expect(page1).toHaveLength(2);
        expect(page2).toHaveLength(1);
      });
    });
  });

  describe('Edge Operations', () => {
    beforeEach(() => {
      graph.addNode({ id: '1', type: 'Person', label: 'Alice' });
      graph.addNode({ id: '2', type: 'Person', label: 'Bob' });
    });

    describe('addEdge', () => {
      it('should add an edge successfully', () => {
        const edge: KGEdge = {
          id: 'e1',
          type: 'knows',
          source: '1',
          target: '2',
          directed: true,
        };

        graph.addEdge(edge);

        expect(graph.hasEdge('e1')).toBe(true);
        expect(graph.edgeCount).toBe(1);
        expect(graph.getEdge('e1')).toEqual(edge);
      });

      it('should throw error when adding duplicate edge', () => {
        const edge: KGEdge = {
          id: 'e1',
          type: 'knows',
          source: '1',
          target: '2',
          directed: true,
        };

        graph.addEdge(edge);

        expect(() => graph.addEdge(edge)).toThrow(
          'Edge with id "e1" already exists'
        );
      });

      it('should throw error when source node does not exist', () => {
        expect(() =>
          graph.addEdge({
            id: 'e1',
            type: 'knows',
            source: '999',
            target: '2',
            directed: true,
          })
        ).toThrow('Source node "999" not found');
      });

      it('should throw error when target node does not exist', () => {
        expect(() =>
          graph.addEdge({
            id: 'e1',
            type: 'knows',
            source: '1',
            target: '999',
            directed: true,
          })
        ).toThrow('Target node "999" not found');
      });

      it('should emit edgeAdded event', (done) => {
        const edge: KGEdge = {
          id: 'e1',
          type: 'knows',
          source: '1',
          target: '2',
          directed: true,
        };

        graph.on((event) => {
          if (event.type === 'edgeAdded') {
            expect(event.data.edge).toEqual(edge);
            done();
          }
        });

        graph.addEdge(edge);
      });
    });

    describe('updateEdge', () => {
      it('should update edge properties', () => {
        graph.addEdge({
          id: 'e1',
          type: 'knows',
          source: '1',
          target: '2',
          directed: true,
        });

        graph.updateEdge('e1', { weight: 0.8 });

        const updated = graph.getEdge('e1');
        expect(updated?.weight).toBe(0.8);
      });

      it('should prevent source/target changes', () => {
        graph.addNode({ id: '3', type: 'Person', label: 'Charlie' });
        graph.addEdge({
          id: 'e1',
          type: 'knows',
          source: '1',
          target: '2',
          directed: true,
        });

        graph.updateEdge('e1', { source: '3' } as any);

        const edge = graph.getEdge('e1')!;
        expect(edge.source).toBe('1');
      });

      it('should throw error when updating non-existent edge', () => {
        expect(() => graph.updateEdge('e999', { weight: 1 })).toThrow(
          'Edge with id "e999" not found'
        );
      });
    });

    describe('deleteEdge', () => {
      it('should delete an edge', () => {
        graph.addEdge({
          id: 'e1',
          type: 'knows',
          source: '1',
          target: '2',
          directed: true,
        });

        graph.deleteEdge('e1');

        expect(graph.hasEdge('e1')).toBe(false);
        expect(graph.edgeCount).toBe(0);
      });

      it('should throw error when deleting non-existent edge', () => {
        expect(() => graph.deleteEdge('e999')).toThrow(
          'Edge with id "e999" not found'
        );
      });
    });
  });

  describe('Graph Queries', () => {
    beforeEach(() => {
      // Create a small network
      graph.addNode({ id: '1', type: 'Person', label: 'Alice' });
      graph.addNode({ id: '2', type: 'Person', label: 'Bob' });
      graph.addNode({ id: '3', type: 'Person', label: 'Charlie' });
      graph.addNode({ id: '4', type: 'Person', label: 'Dave' });

      graph.addEdge({
        id: 'e1',
        type: 'knows',
        source: '1',
        target: '2',
        directed: true,
      });
      graph.addEdge({
        id: 'e2',
        type: 'knows',
        source: '2',
        target: '3',
        directed: true,
      });
      graph.addEdge({
        id: 'e3',
        type: 'knows',
        source: '1',
        target: '3',
        directed: true,
      });
    });

    describe('getNeighbors', () => {
      it('should get outgoing neighbors', () => {
        const result = graph.getNeighbors('1', { direction: 'outgoing' });

        expect(result.nodes).toHaveLength(2);
        expect(result.nodes.map((n) => n.id)).toEqual(
          expect.arrayContaining(['2', '3'])
        );
      });

      it('should get incoming neighbors', () => {
        const result = graph.getNeighbors('2', { direction: 'incoming' });

        expect(result.nodes).toHaveLength(1);
        expect(result.nodes[0].id).toBe('1');
      });

      it('should get neighbors in both directions', () => {
        const result = graph.getNeighbors('2', { direction: 'both' });

        expect(result.nodes).toHaveLength(2);
        expect(result.nodes.map((n) => n.id)).toEqual(
          expect.arrayContaining(['1', '3'])
        );
      });

      it('should include distances', () => {
        const result = graph.getNeighbors('1', { depth: 2 });

        expect(result.distances).toBeDefined();
        expect(result.distances!['2']).toBe(1);
        expect(result.distances!['3']).toBe(1);
      });

      it('should include edges when requested', () => {
        const result = graph.getNeighbors('1', {
          direction: 'outgoing',
          includeEdges: true,
        });

        expect(result.edges).toBeDefined();
        expect(result.edges).toHaveLength(2);
      });

      it('should filter by edge type', () => {
        graph.addEdge({
          id: 'e4',
          type: 'likes',
          source: '1',
          target: '4',
          directed: true,
        });

        const result = graph.getNeighbors('1', {
          direction: 'outgoing',
          edgeTypes: ['likes'],
        });

        expect(result.nodes).toHaveLength(1);
        expect(result.nodes[0].id).toBe('4');
      });

      it('should support depth traversal', () => {
        const result = graph.getNeighbors('1', { depth: 2 });

        expect(result.nodes).toHaveLength(2);
      });

      it('should throw error for non-existent node', () => {
        expect(() => graph.getNeighbors('999')).toThrow(
          'Node with id "999" not found'
        );
      });
    });

    describe('getSubgraph', () => {
      it('should get subgraph for selected nodes', () => {
        const subgraph = graph.getSubgraph(['1', '2']);

        expect(subgraph.nodes).toHaveLength(2);
        expect(subgraph.edges).toHaveLength(1);
        expect(subgraph.edges[0].id).toBe('e1');
      });

      it('should expand subgraph with depth', () => {
        const subgraph = graph.getSubgraph(['1'], { depth: 1 });

        expect(subgraph.nodes.length).toBeGreaterThan(1);
      });

      it('should limit max nodes', () => {
        const subgraph = graph.getSubgraph(['1'], { depth: 2, maxNodes: 2 });

        expect(subgraph.nodes.length).toBeLessThanOrEqual(2);
      });

      it('should only include edges connecting selected nodes', () => {
        const subgraph = graph.getSubgraph(['1', '3']);

        expect(subgraph.edges).toHaveLength(1);
        expect(subgraph.edges[0].id).toBe('e3');
      });
    });
  });

  describe('Graph Statistics', () => {
    beforeEach(() => {
      graph.addNode({ id: '1', type: 'Person', label: 'Alice' });
      graph.addNode({ id: '2', type: 'Person', label: 'Bob' });
      graph.addNode({ id: '3', type: 'Company', label: 'Acme' });

      graph.addEdge({
        id: 'e1',
        type: 'knows',
        source: '1',
        target: '2',
        directed: true,
      });
      graph.addEdge({
        id: 'e2',
        type: 'worksAt',
        source: '1',
        target: '3',
        directed: true,
      });
    });

    it('should calculate node count', () => {
      const stats = graph.getStatistics();
      expect(stats.nodeCount).toBe(3);
    });

    it('should calculate edge count', () => {
      const stats = graph.getStatistics();
      expect(stats.edgeCount).toBe(2);
    });

    it('should count nodes by type', () => {
      const stats = graph.getStatistics();
      expect(stats.nodesByType['Person']).toBe(2);
      expect(stats.nodesByType['Company']).toBe(1);
    });

    it('should count edges by type', () => {
      const stats = graph.getStatistics();
      expect(stats.edgesByType['knows']).toBe(1);
      expect(stats.edgesByType['worksAt']).toBe(1);
    });

    it('should calculate average degree', () => {
      const stats = graph.getStatistics();
      expect(stats.averageDegree).toBeGreaterThan(0);
    });

    it('should calculate max degree', () => {
      const stats = graph.getStatistics();
      expect(stats.maxDegree).toBeGreaterThanOrEqual(1);
    });

    it('should check connectivity', () => {
      const stats = graph.getStatistics();
      expect(typeof stats.isConnected).toBe('boolean');
    });
  });

  describe('Validation', () => {
    const schema: SchemaDefinition = {
      nodeTypes: [
        {
          id: 'Person',
          label: 'Person',
          properties: [
            { key: 'name', label: 'Name', type: 'string', required: true },
          ],
        },
      ],
      edgeTypes: [
        {
          id: 'knows',
          label: 'Knows',
          sourceTypes: ['Person'],
          targetTypes: ['Person'],
        },
      ],
    };

    it('should validate node type against schema', () => {
      const graphWithSchema = new KnowledgeGraph({ schema });

      expect(() =>
        graphWithSchema.addNode({
          id: '1',
          type: 'InvalidType',
          label: 'Test',
        })
      ).toThrow('Node type "InvalidType" not defined in schema');
    });

    it('should validate required properties', () => {
      const graphWithSchema = new KnowledgeGraph({ schema });

      expect(() =>
        graphWithSchema.addNode({
          id: '1',
          type: 'Person',
          label: 'Alice',
        })
      ).toThrow('Required property "name" missing');
    });

    it('should validate edge type against schema', () => {
      const graphWithSchema = new KnowledgeGraph({ schema });
      graphWithSchema.addNode({
        id: '1',
        type: 'Person',
        label: 'Alice',
        name: 'Alice',
      });
      graphWithSchema.addNode({
        id: '2',
        type: 'Person',
        label: 'Bob',
        name: 'Bob',
      });

      expect(() =>
        graphWithSchema.addEdge({
          id: 'e1',
          type: 'invalidRelation',
          source: '1',
          target: '2',
          directed: true,
        })
      ).toThrow('Edge type "invalidRelation" not defined in schema');
    });
  });

  describe('Utility Methods', () => {
    it('should clear the graph', () => {
      graph.addNode({ id: '1', type: 'Person', label: 'Alice' });
      graph.addNode({ id: '2', type: 'Person', label: 'Bob' });

      graph.clear();

      expect(graph.nodeCount).toBe(0);
      expect(graph.edgeCount).toBe(0);
    });

    it('should clone the graph', () => {
      graph.addNode({ id: '1', type: 'Person', label: 'Alice' });
      graph.addNode({ id: '2', type: 'Person', label: 'Bob' });
      graph.addEdge({
        id: 'e1',
        type: 'knows',
        source: '1',
        target: '2',
        directed: true,
      });

      const cloned = graph.clone();

      expect(cloned.nodeCount).toBe(2);
      expect(cloned.edgeCount).toBe(1);

      // Verify independence
      cloned.addNode({ id: '3', type: 'Person', label: 'Charlie' });
      expect(graph.nodeCount).toBe(2);
      expect(cloned.nodeCount).toBe(3);
    });
  });

  describe('Initialization', () => {
    it('should initialize with nodes and edges', () => {
      const newGraph = new KnowledgeGraph({
        nodes: [
          { id: '1', type: 'Person', label: 'Alice' },
          { id: '2', type: 'Person', label: 'Bob' },
        ],
        edges: [
          { id: 'e1', type: 'knows', source: '1', target: '2', directed: true },
        ],
      });

      expect(newGraph.nodeCount).toBe(2);
      expect(newGraph.edgeCount).toBe(1);
    });

    it('should initialize with schema', () => {
      const schema: SchemaDefinition = {
        nodeTypes: [{ id: 'Person', label: 'Person' }],
        edgeTypes: [{ id: 'knows', label: 'Knows' }],
      };

      const newGraph = new KnowledgeGraph({ schema });

      expect(newGraph.schema).toEqual(schema);
    });

    it('should initialize with metadata', () => {
      const metadata = { name: 'Test Graph', version: '1.0' };
      const newGraph = new KnowledgeGraph({ metadata });

      expect(newGraph.metadata).toEqual(metadata);
    });
  });

  describe('Event System', () => {
    it('should support multiple listeners', () => {
      const events1: string[] = [];
      const events2: string[] = [];

      graph.on((event) => events1.push(event.type));
      graph.on((event) => events2.push(event.type));

      graph.addNode({ id: '1', type: 'Person', label: 'Alice' });

      expect(events1).toContain('nodeAdded');
      expect(events2).toContain('nodeAdded');
    });

    it('should allow unsubscribing', () => {
      const events: string[] = [];
      const unsubscribe = graph.on((event) => events.push(event.type));

      graph.addNode({ id: '1', type: 'Person', label: 'Alice' });
      expect(events).toHaveLength(1);

      unsubscribe();

      graph.addNode({ id: '2', type: 'Person', label: 'Bob' });
      expect(events).toHaveLength(1);
    });

    it('should emit graphCleared event', (done) => {
      graph.addNode({ id: '1', type: 'Person', label: 'Alice' });

      graph.on((event) => {
        if (event.type === 'graphCleared') {
          done();
        }
      });

      graph.clear();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty graph statistics', () => {
      const stats = graph.getStatistics();
      expect(stats.nodeCount).toBe(0);
      expect(stats.edgeCount).toBe(0);
      expect(stats.isConnected).toBe(true);
    });

    it('should handle single node graph connectivity', () => {
      graph.addNode({ id: '1', type: 'Person', label: 'Alice' });
      const stats = graph.getStatistics();
      expect(stats.isConnected).toBe(true);
    });

    it('should handle disconnected graph', () => {
      graph.addNode({ id: '1', type: 'Person', label: 'Alice' });
      graph.addNode({ id: '2', type: 'Person', label: 'Bob' });
      graph.addNode({ id: '3', type: 'Person', label: 'Charlie' });
      
      // Connect only 1 and 2
      graph.addEdge({
        id: 'e1',
        type: 'knows',
        source: '1',
        target: '2',
        directed: true,
      });

      const stats = graph.getStatistics();
      expect(stats.isConnected).toBe(false);
    });

    it('should return empty arrays for nodes with no edges', () => {
      graph.addNode({ id: '1', type: 'Person', label: 'Alice' });
      
      const result = graph.getNeighbors('1');
      expect(result.nodes).toHaveLength(0);
    });

    it('should handle getSubgraph with non-existent nodes', () => {
      graph.addNode({ id: '1', type: 'Person', label: 'Alice' });
      
      const subgraph = graph.getSubgraph(['1', '999']);
      expect(subgraph.nodes).toHaveLength(1);
    });

    it('should handle edge validation with source/target type constraints', () => {
      const schema: SchemaDefinition = {
        nodeTypes: [
          { id: 'Person', label: 'Person' },
          { id: 'Company', label: 'Company' },
        ],
        edgeTypes: [
          {
            id: 'worksAt',
            label: 'Works At',
            sourceTypes: ['Person'],
            targetTypes: ['Company'],
          },
        ],
      };

      const graphWithSchema = new KnowledgeGraph({ schema });
      graphWithSchema.addNode({ id: '1', type: 'Person', label: 'Alice' });
      graphWithSchema.addNode({ id: '2', type: 'Company', label: 'Acme' });

      // This should work
      graphWithSchema.addEdge({
        id: 'e1',
        type: 'worksAt',
        source: '1',
        target: '2',
        directed: true,
      });

      expect(graphWithSchema.hasEdge('e1')).toBe(true);
    });

    it('should throw error for invalid source node type in edge', () => {
      const schema: SchemaDefinition = {
        nodeTypes: [
          { id: 'Person', label: 'Person' },
          { id: 'Company', label: 'Company' },
        ],
        edgeTypes: [
          {
            id: 'worksAt',
            label: 'Works At',
            sourceTypes: ['Person'],
            targetTypes: ['Company'],
          },
        ],
      };

      const graphWithSchema = new KnowledgeGraph({ schema });
      graphWithSchema.addNode({ id: '1', type: 'Company', label: 'Acme' });
      graphWithSchema.addNode({ id: '2', type: 'Company', label: 'Other' });

      expect(() =>
        graphWithSchema.addEdge({
          id: 'e1',
          type: 'worksAt',
          source: '1',
          target: '2',
          directed: true,
        })
      ).toThrow('Source node type "Company" not allowed');
    });

    it('should throw error for invalid target node type in edge', () => {
      const schema: SchemaDefinition = {
        nodeTypes: [
          { id: 'Person', label: 'Person' },
          { id: 'Company', label: 'Company' },
        ],
        edgeTypes: [
          {
            id: 'worksAt',
            label: 'Works At',
            sourceTypes: ['Person'],
            targetTypes: ['Company'],
          },
        ],
      };

      const graphWithSchema = new KnowledgeGraph({ schema });
      graphWithSchema.addNode({ id: '1', type: 'Person', label: 'Alice' });
      graphWithSchema.addNode({ id: '2', type: 'Person', label: 'Bob' });

      expect(() =>
        graphWithSchema.addEdge({
          id: 'e1',
          type: 'worksAt',
          source: '1',
          target: '2',
          directed: true,
        })
      ).toThrow('Target node type "Person" not allowed');
    });

    it('should handle neighbors with depth 0', () => {
      graph.addNode({ id: '1', type: 'Person', label: 'Alice' });
      graph.addNode({ id: '2', type: 'Person', label: 'Bob' });
      
      graph.addEdge({
        id: 'e1',
        type: 'knows',
        source: '1',
        target: '2',
        directed: true,
      });

      const result = graph.getNeighbors('1', { depth: 0 });
      expect(result.nodes).toHaveLength(0);
    });
  });
});
