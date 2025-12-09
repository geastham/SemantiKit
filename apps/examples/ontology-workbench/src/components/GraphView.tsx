/**
 * Graph View component using React Flow
 * Visual graph editor with schema-driven constraints
 */

import { useCallback, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Panel,
  useReactFlow,
  Connection,
  Edge,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useOntologyStore } from '@/stores/ontology-store';
import { CustomNode } from './CustomNode';
import { Button, Menu, Text } from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { getAllowedNodeTypes, getAllowedEdgeTypes } from '@/lib/schema-parser';

const nodeTypes = {
  custom: CustomNode,
};

export function GraphView() {
  const {
    nodes,
    edges,
    parsedSchema,
    selectedNodeId,
    onNodesChange,
    onEdgesChange,
    addNode,
    addEdge: addEdgeToStore,
    setSelectedNode,
    setSelectedEdge,
    deleteNode,
    deleteEdge,
  } = useOntologyStore();
  
  const reactFlow = useReactFlow();
  
  const allowedNodeTypes = useMemo(() => {
    return getAllowedNodeTypes(parsedSchema.schema);
  }, [parsedSchema.schema]);
  
  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
  }, [setSelectedNode, setSelectedEdge]);
  
  const handleNodeClick = useCallback((_event: React.MouseEvent, node: any) => {
    setSelectedNode(node.id);
  }, [setSelectedNode]);
  
  const handleEdgeClick = useCallback((_event: React.MouseEvent, edge: any) => {
    setSelectedEdge(edge.id);
  }, [setSelectedEdge]);
  
  const handleAddNode = useCallback((nodeType: string) => {
    const position = reactFlow.project({ x: 250, y: 200 });
    
    addNode({
      type: nodeType,
      label: `New ${nodeType}`,
      position,
      properties: {},
    });
  }, [addNode, reactFlow]);
  
  const handleConnect = useCallback((connection: Connection) => {
    if (!connection.source || !connection.target) return;
    
    // Find source and target nodes to get their types
    const sourceNode = nodes.find((n) => n.id === connection.source);
    const targetNode = nodes.find((n) => n.id === connection.target);
    
    if (!sourceNode || !targetNode) return;
    
    // Get allowed edge types between these node types
    const allowedEdges = getAllowedEdgeTypes(
      parsedSchema.schema,
      sourceNode.data.type,
      targetNode.data.type
    );
    
    if (allowedEdges.length === 0) {
      alert(`No valid edge types between ${sourceNode.data.type} and ${targetNode.data.type}`);
      return;
    }
    
    // Use the first allowed edge type
    const edgeType = allowedEdges[0];
    const edgeDef = parsedSchema.schema?.edgeTypes[edgeType];
    
    addEdgeToStore({
      type: edgeType,
      source: connection.source,
      target: connection.target,
      label: edgeDef?.label || edgeType,
      properties: {},
    });
  }, [nodes, parsedSchema.schema, addEdgeToStore]);
  
  const handleDeleteSelected = useCallback(() => {
    if (selectedNodeId) {
      deleteNode(selectedNodeId);
    }
  }, [selectedNodeId, deleteNode]);
  
  return (
    <div className="h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
        onPaneClick={handlePaneClick}
        onConnect={handleConnect}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={2}
      >
        <Background />
        <Controls />
        <MiniMap 
          nodeColor={(node: any) => {
            const hasErrors = node.data?.validationErrors?.length > 0;
            return hasErrors ? '#ef4444' : '#3b82f6';
          }}
          pannable
          zoomable
        />
        
        <Panel position="top-left" className="bg-white rounded-lg shadow-lg p-2">
          <div className="flex gap-2">
            <Menu position="bottom-start">
              <Menu.Target>
                <Button
                  size="xs"
                  leftSection={<IconPlus size={16} />}
                  disabled={allowedNodeTypes.length === 0}
                >
                  Add Node
                </Button>
              </Menu.Target>
              
              <Menu.Dropdown>
                {allowedNodeTypes.length === 0 ? (
                  <Menu.Item disabled>
                    <Text size="sm" c="dimmed">Define a schema first</Text>
                  </Menu.Item>
                ) : (
                  allowedNodeTypes.map((nodeType) => (
                    <Menu.Item
                      key={nodeType}
                      onClick={() => handleAddNode(nodeType)}
                    >
                      {nodeType}
                    </Menu.Item>
                  ))
                )}
              </Menu.Dropdown>
            </Menu>
            
            <Button
              size="xs"
              color="red"
              leftSection={<IconTrash size={16} />}
              onClick={handleDeleteSelected}
              disabled={!selectedNodeId}
            >
              Delete
            </Button>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

