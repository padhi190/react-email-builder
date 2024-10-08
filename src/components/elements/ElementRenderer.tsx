import React from 'react';
import { elementContentMap, EmailElement } from '@/types/EditorTypes';
import { useCanvas } from '@/contexts/CanvasContext';

interface ElementRendererProps {
  element: EmailElement<any>;
}

export function ElementRenderer({ element }: ElementRendererProps) {
  const { state } = useCanvas();

  const Component = elementContentMap[element.type];

  const isSelected = state.selectedElementId === element.id;
  const properties = isSelected
    ? state.selectedElementProps
    : element.properties;

  if (!Component) {
    console.warn(`Unknown element ${element.type}`);
    return null;
  }
  return <Component {...properties} />;
}
