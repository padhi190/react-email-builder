import React from 'react';
import { EmailElement } from '@/types/EditorTypes';
import { useCanvas } from '@/contexts/CanvasContext';

interface ElementRendererProps {
  element: EmailElement<any>;
}

export function ElementRenderer({ element }: ElementRendererProps) {
  const { state } = useCanvas();
  const Component = element.content;
  console.log(state.selectedElementProps);
  const isSelected = state.selectedElement?.id === element.id;
  const properties = isSelected
    ? state.selectedElementProps
    : element.properties;
  if (!Component) {
    console.warn(`Unknown element ${element.type}`);
    return null;
  }
  return <Component {...properties} />;
}
