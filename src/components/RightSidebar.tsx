import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { EmailElement } from '@/types/EditorTypes';
import { ElementEditor } from '@/components/elements/ElementEditor';

const elementTypes: EmailElement[] = [
  { id: 'heading', type: 'heading', content: 'Heading' },
  { id: 'paragraph', type: 'paragraph', content: 'Paragraph' },
  // Add more element types as needed
];

interface RightSidebarProps {
  selectedElement: EmailElement | null;
  onUpdateElement: (updatedElement: EmailElement) => void;
}

export function RightSidebar({
  selectedElement,
  onUpdateElement,
}: RightSidebarProps) {
  return (
    <div className="w-64 bg-gray-800 p-4">
      {selectedElement ? (
        <ElementEditor element={selectedElement} onUpdate={onUpdateElement} />
      ) : (
        <>
          <h2 className="text-white text-lg font-semibold mb-4">Elements</h2>
          {elementTypes.map((element) => (
            <DraggableElementType key={element.id} element={element} />
          ))}
        </>
      )}
    </div>
  );
}

function DraggableElementType({ element }: { element: EmailElement }) {
  const dragRef = useRef<HTMLDivElement>(null);
  const [, drag] = useDrag(() => ({
    type: 'element',
    item: { ...element, id: `${element.type}-${Date.now()}` },
  }));

  // Connect the drag ref to the div ref
  drag(dragRef);

  return (
    <div
      ref={dragRef}
      className="bg-gray-700 text-white p-2 mb-2 rounded cursor-move"
    >
      {element.type}
    </div>
  );
}
