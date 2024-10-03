import React, { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { EmailElement } from '@/types/EditorTypes';
import { ElementRenderer } from '@/components/elements/ElementRenderer';
import { RightSidebar } from './RightSidebar';
import { cn } from '@/lib/utils';
import { useCanvas } from '@/contexts/CanvasContext';
import { DropZone } from '@/components/DropZone';
import { Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CanvasProps {}

export function Canvas({}: CanvasProps) {
  const { state, dispatch } = useCanvas();
  // console.log(state.elements);

  const [dropTarget, setDropTarget] = useState<{
    index: number;
    position: 'above' | 'below';
  } | null>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const handleDrop = (
    item: EmailElement<any>,
    index: number,
    position: 'above' | 'below'
  ) => {
    const newIndex = position === 'below' ? index + 1 : index;
    //   onDrop(item, newIndex);

    dispatch({
      type: 'ADD_ELEMENT',
      payload: {
        index: newIndex,
        element: item,
      },
    });
    setDropTarget(null);
  };

  // console.log('drop target', dropTarget);
  const [, drop] = useDrop({
    accept: ['element', 'canvasElement', 'containerElement'],
    hover: (item: EmailElement<any> & { index?: number }, monitor) => {
      if (
        monitor.isOver({ shallow: false }) &&
        (monitor.getItemType() === 'element' ||
          monitor.getItemType() === 'containerElement') &&
        dropTarget === null
      ) {
        // console.log('hovring');
        setDropTarget({ index: state.elements.length, position: 'below' });
      }
    },
    drop: (item: EmailElement<any> & { index?: number }, monitor) => {
      if (dropTarget) {
        handleDrop(item, dropTarget.index, dropTarget.position);
      }
    },
  });

  drop(dropRef);

  const handleCanvasClick = (e: React.MouseEvent) => {
    // e.target is the element that triggered the event (clicked element)
    // e.currentTarget is the element that the event listener is attached to
    // This check ensures we're only handling clicks directly on the canvas, not its children
    if (e.target === e.currentTarget) {
      dispatch({ type: 'SELECT_ELEMENT', payload: { element: null } });
    }
  };

  const handleDelete = (id: string) => {
    // onDelete(id);
    dispatch({ type: 'DELETE_ELEMENT', payload: { id } });
    // dispatch({ type: 'SELECT_ELEMENT', payload: { id: null } });
  };

  const selectedElement = state.selectedElement;

  const handleElementSelect = (element: EmailElement<any>) => {
    // setSelectedElementId((prevId) => (prevId === id ? null : id));
    dispatch({ type: 'SELECT_ELEMENT', payload: { element } });
  };

  return (
    <div className="flex flex-grow h-[calc(100vh-64px)]">
      <div ref={dropRef} className="flex-grow bg-gray-100 p-4 overflow-hidden">
        <div
          className="bg-background rounded-lg p-4 h-full overflow-y-auto"
          onClick={handleCanvasClick}
        >
          {state.elements.length === 0 ? (
            <div>Drop elements here</div>
          ) : (
            state.elements.map((element, index) => (
              <React.Fragment key={element.id}>
                {index === 0 && (
                  <DropZone
                    onDrop={(item) => handleDrop(item, index, 'above')}
                    isActive={
                      dropTarget?.index === index &&
                      dropTarget.position === 'above'
                    }
                    setDropTarget={setDropTarget}
                    index={index}
                    position="above"
                  />
                )}
                <DraggableElement
                  element={element}
                  index={index}
                  onDelete={handleDelete}
                  //   isSelected={selectedElementId === element.id}
                  isSelected={state.selectedElement?.id === element.id}
                  onSelect={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    handleElementSelect(element);
                  }}
                />
                {index < state.elements.length - 1 && (
                  <DropZone
                    onDrop={(item) => handleDrop(item, index, 'below')}
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
            ))
          )}
          <div
            className={cn(
              'w-full bg-gray-200 opacity-0 transition-opacity rounded-lg',
              {
                'opacity-80 h-20': dropTarget?.index === state.elements.length,
              }
            )}
          />
        </div>
      </div>
      <RightSidebar selectedElement={selectedElement} />
    </div>
  );
}

function DraggableElement({
  element,
  index,
  onDelete,
  isSelected,
  onSelect,
}: {
  element: EmailElement<any>;
  index: number;
  onDelete: (id: string) => void;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { dispatch } = useCanvas();

  const [{ isDragging }, drag] = useDrag({
    type: 'canvasElement',
    item: () => ({ type: element.type, index, id: element.id }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'canvasElement',
    hover: (item: { type: string; index: number; id: string }, monitor) => {
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

      // Reposition the element while hovering
      dispatch({
        type: 'REPOSITION_ELEMENT',
        payload: {
          dragIndex: dragIndex,
          hoverIndex: hoverIndex,
        },
      });

      // Update the item's index for correct future hover handling
      item.index = hoverIndex;
    },
    // Remove the drop callback
  });

  drag(drop(ref));

  return (
    <AnimatePresence>
      <motion.div
        ref={ref}
        className={`relative group ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
        style={{ cursor: 'move' }}
        onClick={onSelect}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
          opacity: { duration: 0.2 },
        }}
      >
        <div className={`${isDragging ? 'opacity-50' : ''}`}>
          <ElementRenderer element={element} />
        </div>
        {isSelected && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(element.id);
            }}
            className="absolute top-0 right-0 bg-destructive text-white p-1 rounded flex gap-2 items-center justify-center"
          >
            <Trash2 className="w-4 h-4" /> <p className="text-sm">Remove</p>
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
