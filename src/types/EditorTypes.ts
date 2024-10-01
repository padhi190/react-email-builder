import { TextEmailElement } from '@/components/elements/Text';
import { Text } from 'lucide-react';

export type ElementType = 'text';

type ElementProperties = EmailElement['properties'];

export type EmailElement = {
  id: string;
  type: ElementType;
  icon: React.ElementType;
  content: React.FC;
  propertiesContent: React.FC<any>;
  properties?: Record<string, string>;
};

type EmailElementsType = {
  [key in ElementType]: EmailElement;
};

export const emailElements: EmailElementsType = {
  text: TextEmailElement,
};
export interface CanvasState {
  elements: EmailElement[];
}
