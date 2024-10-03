import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { EmailElement } from '@/types/EditorTypes';

interface DropZoneProps {
  onDrop: (item: EmailElement<any>) => void;
  isActive: boolean;
  setDropTarget: React.Dispatch<
    React.SetStateAction<{ index: number; position: 'above' | 'below' } | null>
  >;
  index: number;
  position: 'above' | 'below';
}

export function DropZone({
  onDrop,
  isActive,
  setDropTarget,
  index,
  position,
}: DropZoneProps) {
  const [, drop] = useDrop({
    accept: ['element', 'containerElement'],
    // drop: onDrop,
    hover: () => setDropTarget({ index, position }),
  });

  const dropRef = useRef<HTMLDivElement>(null);
  drop(dropRef);

  return (
    <div
      ref={dropRef}
      className={`h-2 transition-all rounded-lg ${
        isActive ? 'bg-gray-100 h-20' : ''
      }`}
      onMouseLeave={() => setDropTarget(null)}
    />
  );
}
