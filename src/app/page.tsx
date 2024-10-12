'use client';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { LeftSidebar } from '@/components/LeftSidebar';
import { Canvas } from '@/components/Canvas';
import { CanvasProvider } from '@/contexts/CanvasContext';
import { Button } from '@/components/ui/button';
import { Undo, Redo, Edit, Eye, Smartphone, Monitor, Code } from 'lucide-react';
import { useCanvas } from '@/hooks/useCanvas';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  return (
    <CanvasProvider>
      <DndProvider backend={HTML5Backend}>
        <div className="flex h-screen bg-gray-100">
          <main className="flex-grow flex flex-col">
            <CanvasHeader />
            <div className="flex-grow flex ">
              <Canvas />
            </div>
          </main>
        </div>
      </DndProvider>
    </CanvasProvider>
  );
}

function CanvasHeader() {
  const { canUndo, canRedo, dispatch, state } = useCanvas();
  const { mode } = state;
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const urlMode = searchParams.get('mode');
    if (
      urlMode &&
      (urlMode === 'edit' ||
        urlMode === 'desktop_preview' ||
        urlMode === 'mobile_preview' ||
        urlMode === 'react_code' ||
        urlMode === 'html_code') &&
      urlMode !== mode
    ) {
      dispatch.changeMode({ mode: urlMode });
    }
  }, [searchParams, mode, dispatch]);

  const handleModeChange = (newMode: typeof state.mode) => {
    dispatch.changeMode({ mode: newMode });
    router.push(`?mode=${newMode}`, { scroll: false });
  };

  return (
    <header className="bg-background p-4 flex items-center justify-between">
      <div className="flex items-center">
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
      </div>
      <div className="flex space-x-2">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <Button
            variant={mode === 'edit' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleModeChange('edit')}
            className={`rounded-r-none ${mode === 'edit' ? 'z-10' : ''}`}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant={mode === 'edit' ? 'ghost' : 'default'}
            size="sm"
            onClick={() => handleModeChange('desktop_preview')}
            className={`rounded-l-none border-l-0 ${
              mode === 'desktop_preview' ? 'z-10' : ''
            }`}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
        </div>
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <Button
            variant={mode === 'desktop_preview' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => handleModeChange('desktop_preview')}
            className={`rounded-r-none ${
              mode === 'desktop_preview' ? 'z-10' : ''
            }`}
          >
            <Monitor className="h-4 w-4" />
          </Button>
          <Button
            variant={mode === 'mobile_preview' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => handleModeChange('mobile_preview')}
            className={`rounded-none border-l-0 border-r-0 ${
              mode === 'mobile_preview' ? 'z-10' : ''
            }`}
          >
            <Smartphone className="h-4 w-4" />
          </Button>
          <Button
            variant={mode === 'react_code' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => handleModeChange('react_code')}
            className={`rounded-l-none border-l-0 ${
              mode === 'react_code' ? 'z-10' : ''
            }`}
          >
            <Code className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
