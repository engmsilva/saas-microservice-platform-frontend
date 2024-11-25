import React from 'react';
import { Handle, Position } from 'reactflow';
import { Code } from 'lucide-react';

export function FunctionNode({ data }: { data: any }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 border-2 border-green-500">
      <div className="flex items-center mb-2">
        <Code className="w-5 h-5 mr-2 text-green-500" />
        <div className="font-semibold">Function</div>
      </div>
      <div className="text-sm">
        <div>Language: {data.language || 'JavaScript'}</div>
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}