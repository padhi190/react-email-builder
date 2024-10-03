import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
import {
  containerElements,
  EmailElement,
  emailElements,
} from '@/types/EditorTypes';
import { ElementEditor } from '@/components/elements/ElementEditor';
import { cn } from '@/lib/utils';
import { Card } from './ui/card';

interface RightSidebarProps {
  selectedElement: EmailElement<any> | null;
}

export function RightSidebar({ selectedElement }: RightSidebarProps) {
  return (
    <div className="w-64 bg-background p-4 text-foreground">
      {selectedElement ? (
        <ElementEditor element={selectedElement} />
      ) : (
        <>
          <h2 className="text-lg font-semibold mb-4">Elements</h2>
          <div className="grid grid-cols-2 gap-2">
            {emailElements.map((element) => (
              <DraggableElementType
                key={element.id}
                element={element}
                type="element"
              />
            ))}
          </div>
          <h2 className="text-lg font-semibold my-4">Containers</h2>
          <div className="grid grid-cols-2 gap-2">
            {containerElements.map((element) => (
              <DraggableElementType
                key={element.id}
                element={element}
                type="containerElement"
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function DraggableElementType({
  element,
  type,
}: {
  element: EmailElement<any>;
  type: string;
}) {
  const dragRef = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag({
    type,
    item: { ...element, id: `${element.type}-${Date.now()}` },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  // Connect the drag ref to the div ref
  drag(dragRef);

  const Icon = element.icon;

  return (
    <Card
      ref={dragRef}
      className={cn(
        'bg-background p-2 rounded cursor-move flex flex-col justify-center items-center gap-4 h-[100px] w-[100px] capitalize',
        isDragging && 'opacity-50'
      )}
    >
      <Icon size={24} />
      {element.type}
    </Card>
  );
}
