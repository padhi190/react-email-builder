'use client';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { LeftSidebar } from '@/components/LeftSidebar';
import { Canvas } from '@/components/Canvas';
import { CanvasProvider } from '@/contexts/CanvasContext';

export default function Home() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen bg-gray-900">
        {/* <LeftSidebar /> */}
        <main className="flex-grow flex flex-col">
          <header className="bg-gray-800 p-4">
            <h1 className="text-white text-xl font-bold">Canvas Editor</h1>
          </header>
          <div className="flex-grow flex">
            <CanvasProvider>
              <Canvas />
            </CanvasProvider>
          </div>
        </main>
      </div>
    </DndProvider>
  );
}
