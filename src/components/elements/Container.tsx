'use client';

import { ElementType, EmailElement } from '@/types/EditorTypes';
import { Container } from '@react-email/components';
import { ContainerIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const type: ElementType = 'container';

const properties = {
  backgroundColor: '#ffffff',
};

type ContainerProperties = typeof properties;

export const ContainerEmailElement: EmailElement<ContainerProperties> = {
  id: 'Container',
  type,
  content: ({ backgroundColor }: ContainerProperties) => (
    <Container
      style={{ backgroundColor: backgroundColor || properties.backgroundColor }}
    ></Container>
  ),
  icon: ContainerIcon,
  propertiesContent: ({ backgroundColor, onChange }) => {
    return (
      <div className="space-y-4 text-white">
        <div className="space-y-2">
          <Label htmlFor="text-color">Container Color</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="bg-color"
              value={backgroundColor}
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
