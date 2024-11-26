import React from 'react';
import { Handle, Position } from 'reactflow';
import { Database } from 'lucide-react';

export function DatabaseNode({ data }: { data: any }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border-2 border-orange-500">
      <div className="flex items-center mb-2">
        <Database className="w-5 h-5 mr-2 text-orange-500" />
        <div className="font-semibold text-gray-900 dark:text-white">Database</div>
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-300">
        <div>Operation: {data.operation || 'Read'}</div>
        <div className="truncate">Table: {data.table || 'users'}</div>
      </div>
      <Handle 
        type="target" 
        position={Position.Left}
        className="!border-2 !border-white dark:!border-gray-800"
      />
      <Handle 
        type="source" 
        position={Position.Right}
        className="!border-2 !border-white dark:!border-gray-800"
      />
    </div>
  );
}