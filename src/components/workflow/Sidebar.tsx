import React from 'react';
import { Code, Database, Server, MessageSquare } from 'lucide-react';

const nodeTypes = [
  { type: 'apiNode', label: 'API', icon: Server },
  { type: 'functionNode', label: 'Function', icon: Code },
  { type: 'queueNode', label: 'Queue', icon: MessageSquare },
  { type: 'databaseNode', label: 'Database', icon: Database },
];

export function Sidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-4">Components</h2>
      <div className="space-y-2">
        {nodeTypes.map(({ type, label, icon: Icon }) => (
          <div
            key={type}
            className="flex items-center p-3 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100 transition-colors"
            draggable
            onDragStart={(e) => onDragStart(e, type)}
          >
            <Icon className="w-5 h-5 mr-2" />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}