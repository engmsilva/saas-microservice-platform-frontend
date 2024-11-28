import { useEffect, useCallback } from 'react';
import { useReactFlow } from 'reactflow';

export function useDisableDrag() {
  const { getNodes, setNodes } = useReactFlow();

  const disableDrag = useCallback(() => {
    const nodes = getNodes();
    const updatedNodes = nodes.map(node => ({
      ...node,
      draggable: false,
    }));
    setNodes(updatedNodes);
  }, [getNodes, setNodes]);

  const enableDrag = useCallback(() => {
    const nodes = getNodes();
    const updatedNodes = nodes.map(node => ({
      ...node,
      draggable: true,
    }));
    setNodes(updatedNodes);
  }, [getNodes, setNodes]);

  useEffect(() => {
    let isEditing = false;
    let currentEditor: HTMLElement | null = null;

    const handleEditorInteraction = (event: Event, shouldDisable: boolean) => {
      const target = event.target as HTMLElement;
      const editorElement = target.closest('.monaco-editor') as HTMLElement | null;

      if (!editorElement) return;

      if (shouldDisable && !isEditing) {
        isEditing = true;
        currentEditor = editorElement;
        disableDrag();
      }
    };

    const handleEditorExit = (event: Event) => {
      const target = event.target as HTMLElement;
      const relatedTarget = (event as FocusEvent).relatedTarget as HTMLElement | null;

      // Check if we're moving to another editor element
      if (relatedTarget?.closest('.monaco-editor')) return;

      // Only enable if we're actually leaving the editor
      if (currentEditor && (currentEditor.contains(target) || currentEditor === target)) {
        isEditing = false;
        currentEditor = null;
        enableDrag();
      }
    };

    // Mouse events
    const handleMouseDown = (e: MouseEvent) => handleEditorInteraction(e, true);
    const handleMouseUp = (e: MouseEvent) => handleEditorExit(e);

    // Focus events
    const handleFocusIn = (e: FocusEvent) => handleEditorInteraction(e, true);
    const handleFocusOut = (e: FocusEvent) => handleEditorExit(e);

    // Key events
    const handleKeyDown = (e: KeyboardEvent) => handleEditorInteraction(e, true);

    // Add event listeners with capture phase
    document.addEventListener('mousedown', handleMouseDown, true);
    document.addEventListener('mouseup', handleMouseUp, true);
    document.addEventListener('focusin', handleFocusIn, true);
    document.addEventListener('focusout', handleFocusOut, true);
    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      // Clean up event listeners
      document.removeEventListener('mousedown', handleMouseDown, true);
      document.removeEventListener('mouseup', handleMouseUp, true);
      document.removeEventListener('focusin', handleFocusIn, true);
      document.removeEventListener('focusout', handleFocusOut, true);
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [disableDrag, enableDrag]);
}
