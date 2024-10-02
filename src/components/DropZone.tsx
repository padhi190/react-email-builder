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
    accept: ['element'],
    drop: onDrop,
    hover: () => setDropTarget({ index, position }),
  });

  const dropRef = useRef<HTMLDivElement>(null);
  drop(dropRef);

  return (
    <div
      ref={dropRef}
      className={`h-2 transition-all ${isActive ? 'bg-blue-500' : ''}`}
      onMouseLeave={() => setDropTarget(null)}
    />
  );
}
