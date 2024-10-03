'use client';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { LeftSidebar } from '@/components/LeftSidebar';
import { Canvas } from '@/components/Canvas';
import { CanvasProvider } from '@/contexts/CanvasContext';
import { Button } from '@/components/ui/button';
import { Undo, Redo } from 'lucide-react';
import { useCanvas } from '@/hooks/useCanvas';

export default function Home() {
  return (
    <CanvasProvider>
      <DndProvider backend={HTML5Backend}>
        <div className="flex h-screen bg-gray-100">
          <main className="flex-grow flex flex-col">
            <CanvasHeader />
            <div className="flex-grow flex">
              <Canvas />
            </div>
          </main>
        </div>
      </DndProvider>
    </CanvasProvider>
  );
}

function CanvasHeader() {
  const { canUndo, canRedo, dispatch } = useCanvas();
  return (
    <header className="bg-background p-4 flex items-center">
      <h1 className="text-xl font-bold mr-4">Email Editor</h1>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="icon"
          disabled={!canUndo}
          onClick={() => dispatch.undo()}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          disabled={!canRedo}
          onClick={() => dispatch.redo()}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
