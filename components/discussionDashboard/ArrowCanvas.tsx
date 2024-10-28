import React, { useState, useRef, useEffect, useCallback } from 'react';

interface Point {
  x: number;
  y: number;
}

interface Arrow {
  id: string;
  start: Point;
  end: Point;
  slideId: string;
}

interface ArrowCanvasProps {
  slideId: string;
  onArrowComplete: (arrow: Arrow) => void;
  isDrawing: boolean;
  setIsDrawing: (isDrawing: boolean) => void;
}

const ArrowCanvas: React.FC<ArrowCanvasProps> = ({ slideId, onArrowComplete, isDrawing, setIsDrawing }) => {
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [endPoint, setEndPoint] = useState<Point | null>(null);
  const [arrows, setArrows] = useState<Arrow[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const drawArrow = useCallback((start: Point, end: Point, ctx: CanvasRenderingContext2D) => {
    if (!start || !end || !ctx) return;
    const headLength = 10;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const angle = Math.atan2(dy, dx);
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(end.x, end.y);
    ctx.lineTo(end.x - headLength * Math.cos(angle - Math.PI / 6), end.y - headLength * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(end.x - headLength * Math.cos(angle + Math.PI / 6), end.y - headLength * Math.sin(angle + Math.PI / 6));
    ctx.lineTo(end.x, end.y);
    ctx.fillStyle = '#000';
    ctx.fill();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        arrows.forEach(arrow => drawArrow(arrow.start, arrow.end, ctx));
      }
    }
  }, [arrows, drawArrow]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setStartPoint({ x, y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPoint) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setEndPoint({ x, y });
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        arrows.forEach(arrow => drawArrow(arrow.start, arrow.end, ctx));
        drawArrow(startPoint, { x, y }, ctx);
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPoint || !endPoint) return;
    const newArrow: Arrow = {
      id: `arrow-${Date.now()}`,
      start: startPoint,
      end: endPoint,
      slideId: slideId
    };
    setArrows(prev => [...prev, newArrow]);
    setStartPoint(null);
    setEndPoint(null);
    setIsDrawing(false);
    e.stopPropagation(); 
  };

  return (
    <canvas
      ref={canvasRef}
      className={`absolute top-0 left-0 w-full h-full ${isDrawing ? 'cursor-crosshair' : 'cursor-default'}`}
      style={{ zIndex: isDrawing ? 1000 : -1, pointerEvents: 'all' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
  );
};

export default ArrowCanvas;