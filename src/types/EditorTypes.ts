import { TextEmailElement } from '@/components/elements/Text';
import { Text } from 'lucide-react';

export type ElementType = 'text';

export type EmailElement<TProps> = {
  id: string;
  type: ElementType;
  icon: React.ElementType;
  content: React.FC<TProps>;
  propertiesContent: React.FC<TProps & { onChange: Function }>;
  properties: TProps;
};

type EmailElementsType = {
  [key in ElementType]: EmailElement<any>;
};

export const emailElements: EmailElementsType = {
  text: TextEmailElement,
};
export interface CanvasState {
  elements: EmailElement<any>[];
}
