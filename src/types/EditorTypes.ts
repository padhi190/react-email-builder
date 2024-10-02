import { ContainerEmailElement } from '@/components/elements/Container';
import { TextEmailElement } from '@/components/elements/Text';

export type ElementType = 'text' | 'container';

export type EmailElement<TProps> = {
  id: string;
  type: ElementType;
  icon: React.ElementType;
  content: React.FC<TProps> | EmailElement<any>;
  propertiesContent: React.FC<TProps & { onChange: Function }>;
  properties: TProps;
};

type EmailElementsType = {
  [key in ElementType]: EmailElement<any>;
};

export const emailElements: EmailElementsType = {
  text: TextEmailElement,
  container: ContainerEmailElement,
};
export interface CanvasState {
  elements: EmailElement<any>[];
}
