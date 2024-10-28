import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import ArrowCanvas from './ArrowCanvas';

interface DropZoneProps {
  children?: React.ReactNode;
  id: string;
  onArrowComplete: (arrow: { start: { x: number; y: number }; end: { x: number; y: number }; slideId: string }) => void;
  isDrawing: boolean;
  setIsDrawing: (isDrawing: boolean) => void;
}

export const DropZone: React.FC<DropZoneProps> = ({ children, id, onArrowComplete, isDrawing, setIsDrawing }) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  
  return (
    <div 
      id={id}
      ref={setNodeRef} 
      className="min-h-[800px] border-2 border-dashed border-border/50 rounded-lg p-4 mb-2 relative"
      style={{
        background: isOver ? 'rgba(var(--primary), 0.05)' : undefined
      }}
    >
      <div className="relative w-full h-full">
        {children || <span className="text-sm text-muted-foreground">Drop chart here</span>}
      </div>
      <ArrowCanvas
        slideId={id.replace('drop-', 'slide-')}
        onArrowComplete={onArrowComplete}
        isDrawing={isDrawing}
        setIsDrawing={setIsDrawing}
      />
    </div>
  );
};