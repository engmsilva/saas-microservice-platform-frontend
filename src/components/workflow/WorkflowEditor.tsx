import React, { useCallback } from 'react';
import ReactFlow, { 
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Connection,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
  Panel,
  useViewport,
  EdgeMouseHandler,
  DefaultEdgeOptions,
  NodeMouseHandler
} from 'reactflow';
import 'reactflow/dist/style.css';

import { ApiNode } from './nodes/ApiNode';
import { FunctionNode } from './nodes/FunctionNode';
import { QueueNode } from './nodes/QueueNode';
import { DatabaseNode } from './nodes/DatabaseNode';
import { Sidebar } from './Sidebar';
import { NodeContextMenu } from './NodeContextMenu';

const nodeTypes = {
  apiNode: ApiNode,
  functionNode: FunctionNode,
  queueNode: QueueNode,
  databaseNode: DatabaseNode,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  type: 'smoothstep',
  animated: true,
};

const initialViewport = { x: 0, y: 0, zoom: 1 };

interface EdgeContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onDelete: () => void;
}

const EdgeContextMenu: React.FC<EdgeContextMenuProps> = ({ x, y, onClose, onDelete }) => {
  React.useEffect(() => {
    const handleClick = () => onClose();
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [onClose]);

  return (
    <div
      className="fixed bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
      style={{ left: x, top: y }}
    >
      <button
        className="w-full px-4 py-2 text-left hover:bg-gray-100 text-red-600 text-sm"
        onClick={onDelete}
      >
        Delete
      </button>
    </div>
  );
};

function WorkflowEditorContent() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [edgeContextMenu, setEdgeContextMenu] = React.useState<{ id: string; x: number; y: number } | null>(null);
  const [nodeContextMenu, setNodeContextMenu] = React.useState<{ id: string; type: string; data: any; x: number; y: number } | null>(null);
  const reactFlowInstance = useReactFlow();
  const { zoom } = useViewport();

  React.useEffect(() => {
    setTimeout(() => {
      reactFlowInstance.setViewport(initialViewport);
    }, 0);
  }, [reactFlowInstance]);

  const onConnect = useCallback(
    (params: Connection) => {
      const sourceNode = nodes.find(node => node.id === params.source);
      const targetNode = nodes.find(node => node.id === params.target);

      if (!sourceNode || !targetNode) return;

      if (sourceNode.type === 'apiNode' && targetNode.type !== 'functionNode') {
        console.warn('API nodes can only connect to Function nodes');
        return;
      }

      if (sourceNode.type === 'functionNode') {
        setEdges((eds) => addEdge(params, eds));
        return;
      }

      if (sourceNode.type === 'queueNode' && targetNode.type !== 'functionNode') {
        console.warn('Queue nodes can only connect to Function nodes');
        return;
      }

      if (sourceNode.type === 'databaseNode' && targetNode.type !== 'functionNode') {
        console.warn('Database nodes can only connect to Function nodes');
        return;
      }

      setEdges((eds) => addEdge(params, eds));
    },
    [nodes]
  );

  const onEdgeContextMenu: EdgeMouseHandler = useCallback(
    (event, edge) => {
      event.preventDefault();
      setEdgeContextMenu({ id: edge.id, x: event.clientX, y: event.clientY });
    },
    []
  );

  const onNodeContextMenu: NodeMouseHandler = useCallback(
    (event, node) => {
      event.preventDefault();
      setNodeContextMenu({
        id: node.id,
        type: node.type || '',
        data: node.data,
        x: event.clientX,
        y: event.clientY,
      });
    },
    []
  );

  const onDeleteEdge = useCallback(() => {
    if (edgeContextMenu) {
      setEdges((edges) => edges.filter((edge) => edge.id !== edgeContextMenu.id));
      setEdgeContextMenu(null);
    }
  }, [edgeContextMenu, setEdges]);

  const onDeleteNode = useCallback(() => {
    if (nodeContextMenu) {
      setNodes((nodes) => nodes.filter((node) => node.id !== nodeContextMenu.id));
      setEdges((edges) => edges.filter(
        (edge) => edge.source !== nodeContextMenu.id && edge.target !== nodeContextMenu.id
      ));
      setNodeContextMenu(null);
    }
  }, [nodeContextMenu, setNodes, setEdges]);

  const onDuplicateNode = useCallback(() => {
    if (nodeContextMenu) {
      const originalNode = nodes.find((node) => node.id === nodeContextMenu.id);
      if (originalNode) {
        const newNode: Node = {
          ...originalNode,
          id: `${originalNode.type}-${Date.now()}`,
          position: {
            x: originalNode.position.x + 20,
            y: originalNode.position.y + 20,
          },
          data: { ...originalNode.data },
          selected: false,
        };
        setNodes((nodes) => nodes.concat(newNode));
      }
      setNodeContextMenu(null);
    }
  }, [nodeContextMenu, nodes, setNodes]);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { 
          label: `${type} node`,
          method: 'GET',
          url: '',
          description: '',
          params: [],
          headers: [],
          body: {
            type: 'none',
            content: ''
          },
          auth: {
            type: 'none',
            token: ''
          }
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div className="h-screen flex">
      <Sidebar />
      <div className="flex-grow relative" onDrop={onDrop} onDragOver={onDragOver}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgeContextMenu={onEdgeContextMenu}
          onNodeContextMenu={onNodeContextMenu}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          defaultViewport={initialViewport}
          minZoom={0.1}
          maxZoom={2}
          fitView={false}
        >
          <Background />
          <Controls />
          <MiniMap />
          <Panel position="bottom-right">
            <div className="bg-white rounded-md shadow-md px-3 py-2 text-sm">
              Zoom: {Math.round(zoom * 100)}%
            </div>
          </Panel>
        </ReactFlow>

        {edgeContextMenu && (
          <EdgeContextMenu
            x={edgeContextMenu.x}
            y={edgeContextMenu.y}
            onClose={() => setEdgeContextMenu(null)}
            onDelete={onDeleteEdge}
          />
        )}

        {nodeContextMenu && (
          <NodeContextMenu
            x={nodeContextMenu.x}
            y={nodeContextMenu.y}
            onClose={() => setNodeContextMenu(null)}
            onDelete={onDeleteNode}
            onDuplicate={onDuplicateNode}
          />
        )}
      </div>
    </div>
  );
}

export function WorkflowEditor() {
  return (
    <ReactFlowProvider>
      <WorkflowEditorContent />
    </ReactFlowProvider>
  );
}