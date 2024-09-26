'use client';

import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { LeftSidebar } from '@/components/LeftSidebar';
import { RightSidebar } from '@/components/RightSidebar';
import { Canvas } from '@/components/Canvas';
import { HTMLElement, CanvasState } from '@/types/EditorTypes';

export default function Home() {
  const [canvasState, setCanvasState] = useState<CanvasState>({ elements: [] });

  const handleDrop = (item: HTMLElement) => {
    setCanvasState((prevState) => ({
      elements: [...prevState.elements, item],
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
            <Canvas elements={canvasState.elements} onDrop={handleDrop} />
          </div>
        </main>
        <RightSidebar />
      </div>
    </DndProvider>
  );
}
