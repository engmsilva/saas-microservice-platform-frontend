import React, { useEffect } from 'react';
import { Copy, Trash2 } from 'lucide-react';

interface NodeContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export const NodeContextMenu: React.FC<NodeContextMenuProps> = ({
  x,
  y,
  onClose,
  onDelete,
  onDuplicate,
}) => {
  useEffect(() => {
    const handleClick = () => onClose();
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [onClose]);

  return (
    <div
      className="fixed bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 min-w-[160px] animate-in fade-in duration-200"
      style={{ left: x, top: y }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="w-full px-4 py-2 text-left hover:bg-gray-100 text-gray-700 text-sm flex items-center gap-2"
        onClick={onDuplicate}
      >
        <Copy className="w-4 h-4" />
        Duplicate
      </button>
      <button
        className="w-full px-4 py-2 text-left hover:bg-gray-100 text-red-600 text-sm flex items-center gap-2"
        onClick={onDelete}
      >
        <Trash2 className="w-4 h-4" />
        Delete
      </button>
    </div>
  );
};