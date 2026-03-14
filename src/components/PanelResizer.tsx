import React, { useState, useEffect, useCallback } from 'react';

interface PanelResizerProps {
  direction: 'horizontal' | 'vertical';
  onResize: (delta: number) => void;
}

export const PanelResizer: React.FC<PanelResizerProps> = ({ direction, onResize }) => {
  const [isResizing, setIsResizing] = useState(false);

  const startResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      // movementX/Y is supported in all modern browsers and handles relative jumps 
      if (direction === 'horizontal') {
        onResize(e.movementX);
      } else {
        onResize(e.movementY);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    // Disable text selection and cursor change while dragging
    document.body.style.userSelect = 'none';
    document.body.style.cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isResizing, direction, onResize]);

  return (
    <div
      className={`resizer ${direction}`}
      onMouseDown={startResize}
    >
      <div className="resizer-handle" />
    </div>
  );
};
