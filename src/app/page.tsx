'use client';

import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { LeftSidebar } from '@/components/LeftSidebar';
import { Canvas } from '@/components/Canvas';
import { HTMLElement, CanvasState } from '@/types/EditorTypes';

export default function Home() {
  const [canvasState, setCanvasState] = useState<CanvasState>({ elements: [] });

  console.log(canvasState.elements);

  const handleDrop = (item: HTMLElement) => {
    setCanvasState((prevState) => ({
      elements: [
        ...prevState.elements,
        {
          ...item,
          id: `${item.type}-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 11)}`,
        },
      ],
    }));
  };

  const handleReposition = (dragIndex: number, hoverIndex: number) => {
    setCanvasState((prevState) => {
      const newElements = [...prevState.elements];
      const [reorderedItem] = newElements.splice(dragIndex, 1);
      newElements.splice(hoverIndex, 0, reorderedItem);
      return { elements: newElements };
    });
  };

  const handleDelete = (id: string) => {
    setCanvasState((prevState) => ({
      elements: prevState.elements.filter((element) => element.id !== id),
    }));
  };

  const handleUpdateElement = (updatedElement: HTMLElement) => {
    setCanvasState((prevState) => ({
      elements: prevState.elements.map((element) =>
        element.id === updatedElement.id ? updatedElement : element
      ),
    }));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen bg-gray-900">
        <LeftSidebar />
        <main className="flex-grow flex flex-col">
          <header className="bg-gray-800 p-4">
            <h1 className="text-white text-xl font-bold">Canvas Editor</h1>
          </header>
          <div className="flex-grow flex">
            <Canvas
              elements={canvasState.elements}
              onDrop={handleDrop}
              onReposition={handleReposition}
              onDelete={handleDelete}
              onUpdateElement={handleUpdateElement}
            />
          </div>
        </main>
      </div>
    </DndProvider>
  );
}
