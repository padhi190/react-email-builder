import React from 'react';
import { EmailElement } from '@/types/EditorTypes';

export function ElementRenderer({ element }: { element: EmailElement<any> }) {
  if (typeof element.content === 'function') {
    // If react function component, render it with properties
    const Component = element.content;
    return <Component {...element.properties} />;
  } else if (typeof element.content === 'object' && element.content !== null) {
    // If another EmailElement, recursively render it
    return <ElementRenderer element={element.content as EmailElement<any>} />;
  }

  console.warn(`Unknown element type: ${element.type}`);
  return null;
}
