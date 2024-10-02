import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { EmailElement, emailElements } from '@/types/EditorTypes';
import { ElementEditor } from '@/components/elements/ElementEditor';

interface RightSidebarProps {
  selectedElement: EmailElement<any> | null;
}

export function RightSidebar({ selectedElement }: RightSidebarProps) {
  return (
    <div className="w-64 bg-gray-800 p-4">
      {selectedElement ? (
        <ElementEditor element={selectedElement} />
      ) : (
        <>
          <h2 className="text-white text-lg font-semibold mb-4">Elements</h2>
          <div className="grid grid-cols-2 gap-2">
            <DraggableElementType
              key={emailElements.text.id}
              element={emailElements.text}
            />
          </div>
        </>
      )}
    </div>
  );
}

function DraggableElementType({ element }: { element: EmailElement<any> }) {
  const dragRef = useRef<HTMLDivElement>(null);
  const [, drag] = useDrag(() => ({
    type: 'element',
    item: { ...element, id: `${element.type}-${Date.now()}` },
  }));

  // Connect the drag ref to the div ref
  drag(dragRef);

  const Icon = element.icon;

  return (
    <div
      ref={dragRef}
      className="bg-gray-700 text-white p-2 rounded cursor-move flex flex-col justify-center items-center gap-4 h-[100px] w-[100px] capitalize"
    >
      <Icon size={24} />
      {element.type}
    </div>
  );
}
