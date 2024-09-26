import React, { useRef, useState, useCallback } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { HTMLElement } from '@/types/EditorTypes';
import { ElementRenderer } from '@/components/elements/ElementRenderer';
import { RightSidebar } from './RightSidebar';

interface CanvasProps {
  elements: HTMLElement[];
  onDrop: (item: HTMLElement, index: number) => void;
  onReposition: (dragIndex: number, hoverIndex: number) => void;
  onDelete: (id: string) => void;
  onUpdateElement: (updatedElement: HTMLElement) => void;
}

export function Canvas({
  elements,
  onDrop,
  onReposition,
  onDelete,
  onUpdateElement,
}: CanvasProps) {
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null
  );
  const [dropTarget, setDropTarget] = useState<{
    index: number;
    position: 'above' | 'below';
  } | null>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const [, drop] = useDrop({
    accept: ['element', 'canvasElement'],
    hover: (item: HTMLElement & { index?: number }, monitor) => {
      if (monitor.getItemType() === 'element' && dropTarget === null) {
        setDropTarget({ index: elements.length, position: 'below' });
      }
    },
    drop: (item: HTMLElement & { index?: number }, monitor) => {
      if (monitor.getItemType() === 'element' && dropTarget) {
        const newIndex =
          dropTarget.position === 'below'
            ? dropTarget.index + 1
            : dropTarget.index;
        onDrop(item, newIndex);
        setDropTarget(null);
      }
    },
  });

  drop(dropRef);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedElementId(null);
    }
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    setSelectedElementId(null);
  };

  const selectedElement =
    elements.find((el) => el.id === selectedElementId) || null;

  const handleElementSelect = (id: string) => {
    setSelectedElementId((prevId) => (prevId === id ? null : id));
  };

  const handleDrop = useCallback(
    (index: number, position: 'above' | 'below') => {
      return (item: HTMLElement) => {
        const newIndex = position === 'below' ? index + 1 : index;
        onDrop(item, newIndex);
        setDropTarget(null);
      };
    },
    [onDrop]
  );

  return (
    <div className="flex flex-grow">
      <div
        ref={dropRef}
        className="flex-grow bg-gray-700 p-4"
        onClick={handleCanvasClick}
      >
        <div className="bg-gray-800 rounded-lg p-4 h-full">
          {elements.map((element, index) => (
            <React.Fragment key={element.id}>
              <DropZone
                onDrop={handleDrop(index, 'above')}
                isActive={
                  dropTarget?.index === index && dropTarget.position === 'above'
                }
                setDropTarget={setDropTarget}
                index={index}
                position="above"
              />
              <DraggableElement
                element={element}
                index={index}
                onReposition={onReposition}
                onDelete={handleDelete}
                isSelected={selectedElementId === element.id}
                onSelect={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  handleElementSelect(element.id);
                }}
              />
              {index === elements.length - 1 && (
                <DropZone
                  onDrop={handleDrop(index, 'below')}
                  isActive={
                    dropTarget?.index === index &&
                    dropTarget.position === 'below'
                  }
                  setDropTarget={setDropTarget}
                  index={index}
                  position="below"
                />
              )}
            </React.Fragment>
          ))}
          {elements.length === 0 && (
            <DropZone
              onDrop={handleDrop(0, 'above')}
              isActive={
                dropTarget?.index === 0 && dropTarget.position === 'above'
              }
              setDropTarget={setDropTarget}
              index={0}
              position="above"
            />
          )}
        </div>
      </div>
      <RightSidebar
        selectedElement={selectedElement}
        onUpdateElement={onUpdateElement}
      />
    </div>
  );
}

function DraggableElement({
  element,
  index,
  onReposition,
  onDelete,
  isSelected,
  onSelect,
}: {
  element: HTMLElement;
  index: number;
  onReposition: (dragIndex: number, hoverIndex: number) => void;
  onDelete: (id: string) => void;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'canvasElement',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'canvasElement',
    hover: (item: { index: number }, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      onReposition(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`relative group ${isDragging ? 'opacity-50' : ''} ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      style={{ cursor: 'move' }}
      onClick={onSelect}
    >
      <ElementRenderer element={element} />
      <div className="absolute inset-0 bg-blue-500 bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Add drag handle or other controls here */}
      </div>
      {isSelected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(element.id);
          }}
          className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded"
        >
          Delete
        </button>
      )}
    </div>
  );
}

interface DropZoneProps {
  onDrop: (item: HTMLElement) => void;
  isActive: boolean;
  setDropTarget: React.Dispatch<
    React.SetStateAction<{ index: number; position: 'above' | 'below' } | null>
  >;
  index: number;
  position: 'above' | 'below';
}

function DropZone({
  onDrop,
  isActive,
  setDropTarget,
  index,
  position,
}: DropZoneProps) {
  const [, drop] = useDrop({
    accept: ['element', 'canvasElement'],
    drop: (item: HTMLElement) => onDrop(item),
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
