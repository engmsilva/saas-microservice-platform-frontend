import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Database, ChevronDown, ChevronUp } from 'lucide-react';

interface DatabaseNodeData {
  operation: string;
  table: string;
}

export function DatabaseNode({ data }: { data: DatabaseNodeData }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [operation, setOperation] = useState(data.operation || 'read');
  const [table, setTable] = useState(data.table || 'users');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-orange-500 min-w-[250px]">
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-orange-500" />
            <span className="font-medium text-gray-900 dark:text-white">Database</span>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>
        {!isExpanded && (
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            <div>Operation: {operation}</div>
            <div className="truncate">Table: {table}</div>
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Operation
              </label>
              <select
                value={operation}
                onChange={(e) => setOperation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="read">Read</option>
                <option value="write">Write</option>
                <option value="update">Update</option>
                <option value="delete">Delete</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Table
              </label>
              <input
                type="text"
                value={table}
                onChange={(e) => setTable(e.target.value)}
                placeholder="Enter table name"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      )}

      <Handle
        type="target"
        position={Position.Left}
        className="!w-4 !h-4 !bg-orange-500 !border-2 !border-white dark:!border-gray-800 hover:!bg-orange-600 transition-colors !rounded !left-[-8px]"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-4 !h-4 !bg-orange-500 !border-2 !border-white dark:!border-gray-800 hover:!bg-orange-600 transition-colors !rounded !right-[-8px]"
      />
    </div>
  );
}