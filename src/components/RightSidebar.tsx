import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { EmailElement, emailElements } from '@/types/EditorTypes';
import { ElementEditor } from '@/components/elements/ElementEditor';
import { Heading1Icon, TentIcon, TextIcon } from 'lucide-react';

// const elementTypes: EmailElement[] = [
//   { id: 'heading', type: 'heading', content: 'Heading', icon: Heading1Icon },
//   { id: 'paragraph', type: 'text', content: 'Paragraph', icon: TextIcon },
//   // Add more element types as needed
// ];

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

function DraggableElementType({ element }: { element: EmailElement }) {
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
