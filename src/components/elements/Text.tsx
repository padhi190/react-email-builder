'use client';

import { ElementType, EmailElement } from '@/types/EditorTypes';
import { Text as ReactEmailText } from '@react-email/components';
import { Text } from 'lucide-react';

const type: ElementType = 'text';

const properties: EmailElement['properties'] = {
  text: 'Text Placeholder',
  color: 'white',
};

export const TextEmailElement: EmailElement = {
  id: 'Text',
  type,
  content: ({ color, text }: typeof properties) => (
    <ReactEmailText style={{ color: color || properties.color }}>
      {text || properties.text}
    </ReactEmailText>
  ),
  icon: Text,
  propertiesContent: ({ text, color, onChange }) => {
    return (
      <>
        <input
          defaultValue={text}
          onChange={(e) => {
            console.log('test');
            onChange({ text: e.target.value });
          }}
        />
        <input
          defaultValue={color}
          type="color"
          onChange={(e) => onChange({ color: e.target.value })}
        />
      </>
    );
  },
  properties,
};
