import React from 'react';
import { EmailElement } from '@/types/EditorTypes';
import { Heading } from '@/components/elements/Heading';
import { Paragraph } from '@/components/elements/Paragraph';
// Import other element components as needed

const elementMap: Record<
  string,
  React.ComponentType<{ element: EmailElement }>
> = {
  heading: Heading,
  paragraph: Paragraph,
  // Add other element types here
};

export function ElementRenderer({ element }: { element: EmailElement }) {
  const Component = elementMap[element.type];

  if (!Component) {
    console.warn(`Unknown element type: ${element.type}`);
    return null;
  }

  return <Component element={element} />;
}
