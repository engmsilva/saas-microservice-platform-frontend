import React from 'react';
import { Handle, Position } from 'reactflow';
import { Database } from 'lucide-react';

export function DatabaseNode({ data }: { data: any }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 border-2 border-orange-500">
      <div className="flex items-center mb-2">
        <Database className="w-5 h-5 mr-2 text-orange-500" />
        <div className="font-semibold">Database</div>
      </div>
      <div className="text-sm">
        <div>Operation: {data.operation || 'Read'}</div>
        <div className="truncate">Table: {data.table || 'users'}</div>
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}