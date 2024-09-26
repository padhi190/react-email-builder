import React from 'react';
import { HTMLElement } from '@/types/EditorTypes';
import { Heading } from '@/components/elements/Heading';
import { Paragraph } from '@/components/elements/Paragraph';
// Import other element components as needed

const elementMap: Record<
  string,
  React.ComponentType<{ element: HTMLElement }>
> = {
  heading: Heading,
  paragraph: Paragraph,
  // Add other element types here
};

export function ElementRenderer({ element }: { element: HTMLElement }) {
  const Component = elementMap[element.type];

  if (!Component) {
    console.warn(`Unknown element type: ${element.type}`);
    return null;
  }

  return <Component element={element} />;
}
