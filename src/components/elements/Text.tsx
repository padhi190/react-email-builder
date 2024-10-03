'use client';

import { ElementType, EmailElement } from '@/types/EditorTypes';
import { Text as ReactEmailText } from '@react-email/components';
import { Type } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const type: ElementType = 'text';

const properties = {
  text: 'Text Placeholder',
  color: '#000000',
};

type TextProperties = typeof properties;

export const TextEmailElement: EmailElement<TextProperties> = {
  id: 'Text',
  type,
  content: ({ color, text }: TextProperties) => (
    <ReactEmailText style={{ color: color || properties.color }}>
      {text || properties.text}
    </ReactEmailText>
  ),
  icon: Type,
  propertiesContent: ({ text, color, onChange }) => {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="text-content">Text Content</Label>
          <Textarea
            id="text-content"
            value={text}
            onChange={(e) => onChange({ text: e.target.value })}
            placeholder="Enter text content"
            className="min-h-[100px]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="text-color">Text Color</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="text-color"
              value={color}
              type="color"
              className="h-10 w-14 p-1"
              onChange={(e) => onChange({ color: e.target.value })}
            />
          </div>
        </div>
      </div>
    );
  },
  properties,
};
