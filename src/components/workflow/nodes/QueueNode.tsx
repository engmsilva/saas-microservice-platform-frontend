import React from 'react';
import { Handle, Position } from 'reactflow';
import { MessageSquare } from 'lucide-react';

export function QueueNode({ data }: { data: any }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 border-2 border-purple-500">
      <div className="flex items-center mb-2">
        <MessageSquare className="w-5 h-5 mr-2 text-purple-500" />
        <div className="font-semibold">Queue</div>
      </div>
      <div className="text-sm">
        <div>Type: {data.queueType || 'Topic'}</div>
        <div className="truncate">Name: {data.queueName || 'my-queue'}</div>
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}