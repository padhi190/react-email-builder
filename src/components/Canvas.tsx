import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { HTMLElement } from '@/types/EditorTypes';
import { ElementRenderer } from '@/components/elements/ElementRenderer';

interface CanvasProps {
  elements: HTMLElement[];
  onDrop: (item: HTMLElement) => void;
}

export function Canvas({ elements, onDrop }: CanvasProps) {
  const dropRef = useRef<HTMLDivElement>(null);
  const [, drop] = useDrop(() => ({
    accept: 'element',
    drop: (item: HTMLElement) => onDrop(item),
  }));

  // Connect the drop ref to the div ref
  drop(dropRef);

  return (
    <div ref={dropRef} className="flex-grow bg-gray-700 p-4">
      <div className="bg-gray-800 rounded-lg p-4 h-full">
        {elements.map((element) => (
          <DraggableElement key={element.id} element={element} />
        ))}
      </div>
    </div>
  );
}

function DraggableElement({ element }: { element: HTMLElement }) {
  return (
    <div className="relative group">
      <ElementRenderer element={element} />
      <div className="absolute inset-0 bg-blue-500 bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Add drag handle or other controls here */}
      </div>
    </div>
  );
}
