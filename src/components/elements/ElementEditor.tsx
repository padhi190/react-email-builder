import React from 'react';
import { elementPropsMap } from '@/types/EditorTypes';
import { useCanvas } from '@/contexts/CanvasContext';

interface ElementEditorProps {
  // element: React.ComponentType<any>;
}

export function ElementEditor({}: ElementEditorProps) {
  const { dispatch, state } = useCanvas();

  if (!state.selectedElementId) return null;

  const properties = state.selectedElementProps;
  const selectedElement = state.elements[state.selectedElementId];

  const handleContentChange = (updatedProp: Record<string, string>) => {
    dispatch.updateSelectedElementProps({
      properties: { ...state.selectedElementProps, ...updatedProp },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handle submit', {
      properties,
    });
    const newElement = { ...selectedElement, properties };

    dispatch.updateElement({ element: newElement });
  };

  const PropertiesComponent = elementPropsMap[selectedElement.type];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold">
        Edit {selectedElement.type || 'Element'}
      </h2>
      <PropertiesComponent {...properties} onChange={handleContentChange} />
      <button
        type="submit"
        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
      >
        Update Element
      </button>
    </form>
  );
}
