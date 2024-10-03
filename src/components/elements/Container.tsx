'use client';

import { ElementType, EmailElement } from '@/types/EditorTypes';
import { Container } from '@react-email/components';
import { ContainerIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDrop } from 'react-dnd';
import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const type: ElementType = 'container';

const properties = {
  backgroundColor: '#ffffff',
  content: null as EmailElement<any> | null,
};

type ContainerProperties = typeof properties;

// TODO: don't support nested element for now
export const ContainerEmailElement: EmailElement<ContainerProperties> = {
  id: 'Container',
  type,
  content: ({ backgroundColor, content }: ContainerProperties) => {
    const [isActive, setIsActive] = useState(false);
    const [, drop] = useDrop({
      accept: ['element'],
      drop: (item, monitor) => {
        if (monitor.didDrop()) {
          return;
        }
        // Process the drop here
        console.log('Dropped in container');
        // Return a value to indicate that the drop was handled
        return { handled: true };
      },
      hover: () => setIsActive(true),
    });

    const dropRef = useRef<HTMLDivElement>(null);
    drop(dropRef);

    return (
      <div
        ref={dropRef}
        className={cn(
          'h-20 transition-all',
          isActive ? 'bg-blue-500' : 'bg-green-400'
        )}
        onMouseLeave={() => setIsActive(false)}
      />
    );
  },
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
