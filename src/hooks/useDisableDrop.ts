import { useState, useCallback } from 'react';

export function useDisableDrop() {
  const [isDropDisabled, setIsDropDisabled] = useState(false);

  const handleDrop = useCallback((event: React.DragEvent, handler?: (event: React.DragEvent) => void) => {
    if (isDropDisabled) {
      event.preventDefault();
      return;
    }
    handler?.(event);
  }, [isDropDisabled]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    if (isDropDisabled) {
      event.preventDefault();
      return;
    }
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, [isDropDisabled]);

  return {
    isDropDisabled,
    setIsDropDisabled,
    handleDrop,
    handleDragOver
  };
}