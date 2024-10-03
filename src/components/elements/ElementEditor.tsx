import React, { useState, useEffect } from 'react';
import { EmailElement } from '@/types/EditorTypes';
import { useCanvas } from '@/contexts/CanvasContext';

interface ElementEditorProps {
  element: EmailElement<any>;
}

export function ElementEditor({ element }: ElementEditorProps) {
  const { dispatch, state } = useCanvas();

  const properties = state.selectedElementProps;

  const handleContentChange = (updatedProp: Record<string, string>) => {
    // setProperties((prevProps: any) => ({ ...prevProps, ...updatedProp }));
    dispatch.updateSelectedElementProps({
      properties: { ...state.selectedElementProps, ...updatedProp },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handle submit', {
      ...element,
      properties,
    });
    dispatch.updateElement({ element: { ...element, properties } });
  };

  const PropertiesComponent = element.propertiesContent;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold">Edit {element.type}</h2>
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
