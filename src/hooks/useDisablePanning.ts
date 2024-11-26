import { useCallback, useEffect } from 'react';
import { useReactFlow, useStore } from 'reactflow';

export function useDisablePanning() {
  const { getNodes, setNodes, getViewport, setViewport } = useReactFlow();
  const store = useStore();
  
  const disablePanning = useCallback(() => {
    // Disable node dragging
    const nodes = getNodes();
    const updatedNodes = nodes.map(node => ({
      ...node,
      draggable: false
    }));
    setNodes(updatedNodes);

    // Lock viewport
    const viewport = getViewport();
    setViewport({
      ...viewport,
      minZoom: viewport.zoom,
      maxZoom: viewport.zoom
    });
  }, [getNodes, setNodes, getViewport, setViewport]);

  const enablePanning = useCallback(() => {
    // Re-enable node dragging
    const nodes = getNodes();
    const updatedNodes = nodes.map(node => ({
      ...node,
      draggable: true
    }));
    setNodes(updatedNodes);

    // Reset viewport constraints
    const viewport = getViewport();
    setViewport({
      ...viewport,
      minZoom: 0.1,
      maxZoom: 2
    });
  }, [getNodes, setNodes, getViewport, setViewport]);

  useEffect(() => {
    let isEditing = false;
    let currentEditor: HTMLElement | null = null;

    const handleEditorInteraction = (event: Event, shouldDisable: boolean) => {
      const target = event.target as HTMLElement;
      const editorElement = target.closest('.monaco-editor');
      
      if (!editorElement) return;
      
      if (shouldDisable && !isEditing) {
        isEditing = true;
        currentEditor = editorElement;
        disablePanning();

        // Prevent event propagation to stop React Flow from handling the event
        event.stopPropagation();
      }
    };

    const handleEditorExit = (event: Event) => {
      const target = event.target as HTMLElement;
      const relatedTarget = (event as FocusEvent).relatedTarget as HTMLElement;
      
      // Check if we're moving to another editor element
      if (relatedTarget?.closest('.monaco-editor')) return;
      
      // Only enable if we're actually leaving the editor
      if (currentEditor && (currentEditor.contains(target) || currentEditor === target)) {
        isEditing = false;
        currentEditor = null;
        enablePanning();
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

      // Make sure to re-enable panning when the component unmounts
      enablePanning();
    };
  }, [disablePanning, enablePanning]);
}