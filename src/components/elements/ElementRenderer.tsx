import React from 'react';
import { EmailElement } from '@/types/EditorTypes';
// Import other element components as needed

// const elementMap: Record<
//   string,
//   React.ComponentType<{ element: EmailElement }>
// > = {
//   heading: Heading,
//   text: Text,
//   // Add other element types here
// };

export function ElementRenderer({ element }: { element: EmailElement }) {
  const Component = element.content;

  if (!Component) {
    console.warn(`Unknown element type: ${element.type}`);
    return null;
  }

  return <Component {...element.properties} />;
}
