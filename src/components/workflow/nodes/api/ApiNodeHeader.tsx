import React from 'react';
import { Server, ChevronDown, ChevronUp, Lock, Unlock } from 'lucide-react';

interface ApiNodeHeaderProps {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  authType: string;
  method: string;
  url: string;
  description?: string;
}

export function ApiNodeHeader({
  isExpanded,
  setIsExpanded,
  authType,
  method,
  url,
  description
}: ApiNodeHeaderProps) {
  return (
    <div className="p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Server className="w-5 h-5 text-blue-500" />
          <span className="font-medium text-gray-900 dark:text-white">API</span>
        </div>
        <div className="flex items-center gap-2">
          {authType === 'none' ? (
            <Unlock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          ) : (
            <Lock className="w-4 h-4 text-blue-500" />
          )}
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
      </div>
      {!isExpanded && (
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          <div>{method} {url}</div>
          {description && <div className="text-xs mt-1">{description}</div>}
        </div>
      )}
    </div>
  );
}