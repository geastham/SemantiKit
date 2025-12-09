'use client';

import { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Panel,
  useReactFlow,
  Node,
  Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useGraphStore } from '@/lib/graph-store';
import CustomNode from './CustomNode';

const nodeTypes = {
  default: CustomNode,
};

export default function GraphCanvas() {
  const { fitView } = useReactFlow();
  
  const nodes = useGraphStore((state) => state.nodes);
  const edges = useGraphStore((state) => state.edges);
  const schema = useGraphStore((state) => state.schema);
  const onNodesChange = useGraphStore((state) => state.onNodesChange);
  const onEdgesChange = useGraphStore((state) => state.onEdgesChange);
  const onConnect = useGraphStore((state) => state.onConnect);
  const setSelectedNode = useGraphStore((state) => state.setSelectedNode);
  const setSelectedEdge = useGraphStore((state) => state.setSelectedEdge);

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNode(node.id);
    },
    [setSelectedNode]
  );

  const handleEdgeClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      setSelectedEdge(edge.id);
    },
    [setSelectedEdge]
  );

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
  }, [setSelectedNode, setSelectedEdge]);

  const handleFitView = useCallback(() => {
    fitView({ padding: 0.2, duration: 300 });
  }, [fitView]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={handleNodeClick}
      onEdgeClick={handleEdgeClick}
      onPaneClick={handlePaneClick}
      nodeTypes={nodeTypes}
      fitView
      minZoom={0.1}
      maxZoom={4}
      defaultEdgeOptions={{
        type: 'smoothstep',
        animated: true,
      }}
    >
      <Background />
      <Controls />
      <MiniMap
        nodeStrokeWidth={3}
        zoomable
        pannable
      />
      
      <Panel position="top-right" className="bg-card/80 backdrop-blur-sm p-2 rounded-lg border border-border">
        <button
          onClick={handleFitView}
          className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 transition"
        >
          Fit View
        </button>
      </Panel>

      <Panel position="bottom-left" className="bg-card/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-border">
        <div className="text-xs text-muted-foreground">
          <div>Nodes: {nodes.length}</div>
          <div>Edges: {edges.length}</div>
          <div>Types: {Object.keys(schema.nodeTypes).length}</div>
        </div>
      </Panel>
    </ReactFlow>
  );
}

