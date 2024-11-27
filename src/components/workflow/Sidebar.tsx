import React from 'react';
import { Code, Database, Server, MessageSquare } from 'lucide-react';

const nodeTypes = [
  { 
    type: 'apiNode', 
    label: 'API', 
    icon: Server,
    iconColor: 'text-blue-500' // API nodes use blue
  },
  { 
    type: 'functionNode', 
    label: 'Function', 
    icon: Code,
    iconColor: 'text-green-500' // Function nodes use green
  },
  { 
    type: 'queueNode', 
    label: 'Queue', 
    icon: MessageSquare,
    iconColor: 'text-purple-500' // Queue nodes use purple
  },
  { 
    type: 'databaseNode', 
    label: 'Database', 
    icon: Database,
    iconColor: 'text-orange-500' // Database nodes use orange
  },
];

export function Sidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Components</h2>
      <div className="space-y-2">
        {nodeTypes.map(({ type, label, icon: Icon, iconColor }) => (
          <div
            key={type}
            className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-move hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            draggable
            onDragStart={(e) => onDragStart(e, type)}
          >
            <Icon className={`w-5 h-5 mr-2 ${iconColor}`} />
            <span className="text-gray-700 dark:text-gray-300">{label}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}