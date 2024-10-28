import React, { useState } from 'react';
import { Rnd } from 'react-rnd';

interface TextBoxProps {
  id: string;
  slideId: string; 
  initialText?: string;
  position: { x: number; y: number };
  onTextChange: (slideId: string, id: string, text: string) => void;
  onPositionChange: (slideId: string, id: string, newPosition: { x: number; y: number }) => void;
  onSizeChange?: (slideId: string, id: string, newSize: { width: number; height: number }) => void;
  onDelete: (slideId: string, id: string) => void;
  style?: React.CSSProperties;
}

export const TextBox: React.FC<TextBoxProps> = ({
  id,
  slideId,
  initialText = '',
  position,
  onTextChange,
  onPositionChange,
  onSizeChange,
  onDelete,
  style,
}) => {
  const [text, setText] = useState(initialText);
  const [size, setSize] = useState({ width: 200, height: 100 });

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
    onTextChange(slideId, id, event.target.value);
  };

  return (
    <Rnd
      size={{ width: size.width, height: size.height }}
      position={{ x: position.x, y: position.y }}
      onDragStop={(e, d) => {
        onPositionChange(slideId, id, { x: d.x, y: d.y });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        const newWidth = ref.style.width;
        const newHeight = ref.style.height;
        setSize({ width: parseInt(newWidth), height: parseInt(newHeight) });
        if (onSizeChange) {
          onSizeChange(slideId, id, { width: parseInt(newWidth), height: parseInt(newHeight) });
        }
        onPositionChange(slideId, id, position);
      }}
      style={{ ...style, backgroundColor: '#f0f0f0', borderRadius: '8px', position: 'relative' }}
    >
      {/* Delete Button */}
      <button
        onClick={() => onDelete(slideId, id)}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          backgroundColor: 'grey',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          padding: '2px 6px',
          zIndex: 1,
        }}
      >
        X
      </button>
      <textarea
        value={text}
        onChange={handleChange}
        style={{
          width: '100%',
          height: '100%',
          resize: 'none',
          backgroundColor: 'transparent',
          border: 'none',
          padding: '8px',
          outline: 'none',
        }}
      />
    </Rnd>
  );
};