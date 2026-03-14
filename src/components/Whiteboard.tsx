import React, { useRef, useState, useEffect } from 'react';
import { Trash2, Pen, Eraser, Undo } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

export const Whiteboard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#8b5cf6'); // Accent primary
  const [brushSize, setBrushSize] = useState(2);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [history, setHistory] = useState<ImageData[]>([]);

  // Initialize canvas size and context
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Set actual canvas size to container dimensions
    const resizeCanvas = () => {
      // Save current drawing
      const ctx = canvas.getContext('2d');
      let imgData: ImageData | null = null;
      if (ctx && canvas.width > 0 && canvas.height > 0) {
        imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      }

      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      // Restore drawing
      if (ctx && imgData) {
        ctx.putImageData(imgData, 0, 0);
      } else if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    };

    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(container);
    
    // Initial size
    resizeCanvas();
    
    // Save blank canvas to history
    saveState();

    return () => resizeObserver.disconnect();
  }, []);

  const saveState = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory(prev => {
      const newHistory = [...prev, imgData];
      if (newHistory.length > 20) newHistory.shift(); // Keep last 20 steps
      return newHistory;
    });
  };

  const undo = () => {
    if (history.length <= 1) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const newHistory = [...history];
    newHistory.pop(); // Remove current state
    const previousState = newHistory[newHistory.length - 1];
    
    ctx.putImageData(previousState, 0, 0);
    setHistory(newHistory);
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return {
      x: (e as React.MouseEvent).clientX - rect.left,
      y: (e as React.MouseEvent).clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const pos = getCoordinates(e);
    if (!pos) return;

    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    
    // Setup brush
    ctx.strokeStyle = tool === 'eraser' ? '#1c1c21' : color;
    ctx.lineWidth = tool === 'eraser' ? brushSize * 4 : brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    
    const pos = getCoordinates(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (!pos || !ctx) return;

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveState();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveState();
  };

  const colors = ['#ffffff', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Toolbar */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        padding: '10px 16px', 
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        gap: '16px',
        background: 'rgba(0,0,0,0.1)'
      }}>
        {/* Tools */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setTool('pen')}
            title="Pen"
            style={{
              padding: '6px',
              borderRadius: '6px',
              background: tool === 'pen' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
              color: tool === 'pen' ? 'var(--accent-primary)' : 'var(--text-muted)',
              border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center'
            }}
          >
            <Pen size={16} />
          </button>
          <button
            onClick={() => setTool('eraser')}
            title="Eraser"
            style={{
              padding: '6px',
              borderRadius: '6px',
              background: tool === 'eraser' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              color: tool === 'eraser' ? '#fff' : 'var(--text-muted)',
              border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center'
            }}
          >
            <Eraser size={16} />
          </button>
        </div>

        <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }} />

        {/* Colors */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {colors.map(c => (
            <button
              key={c}
              onClick={() => { setColor(c); setTool('pen'); }}
              style={{
                width: '20px', height: '20px', borderRadius: '50%',
                background: c, border: `2px solid ${color === c && tool === 'pen' ? '#fff' : 'transparent'}`,
                cursor: 'pointer', padding: 0
              }}
            />
          ))}
        </div>

        <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)', marginLeft: '4px' }} />

        {/* Brush Size */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>SIZE</span>
          <input
            type="range"
            min="1"
            max="10"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            style={{
              width: '60px',
              height: '4px',
              appearance: 'none',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '2px',
              outline: 'none',
              cursor: 'pointer'
            }}
          />
        </div>

        <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)', marginLeft: '4px' }} />

        {/* Actions */}
        <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
          <button
            onClick={undo}
            disabled={history.length <= 1}
            title="Undo"
            style={{
              padding: '6px', borderRadius: '6px',
              background: 'transparent', color: history.length <= 1 ? 'rgba(255,255,255,0.1)' : 'var(--text-primary)',
              border: 'none', cursor: history.length <= 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center'
            }}
          >
            <Undo size={16} />
          </button>
          <button
            onClick={clearCanvas}
            title="Clear Canvas"
            style={{
              padding: '6px', borderRadius: '6px',
              background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)',
              border: '1px solid rgba(239, 68, 68, 0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center'
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div 
        ref={containerRef}
        style={{ flex: 1, position: 'relative', cursor: tool === 'eraser' ? 'cell' : 'crosshair' }}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          style={{ width: '100%', height: '100%', display: 'block' }}
        />
      </div>
    </div>
  );
};
