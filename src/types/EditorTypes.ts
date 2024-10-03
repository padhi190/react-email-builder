import { ContainerEmailElement } from '@/components/elements/Container';
import { TextEmailElement } from '@/components/elements/Text';

export type ElementType = 'text' | 'container';

export interface EmailElement<TProps> {
  id: string;
  type: ElementType;
  icon: React.ElementType;
  content: React.FC<TProps>;
  propertiesContent: React.FC<TProps & { onChange: Function }>;
  properties: TProps;
}

export const emailElements: EmailElement<any>[] = [TextEmailElement];

export const containerElements: EmailElement<any>[] = [ContainerEmailElement];

export interface CanvasState {
  elements: EmailElement<any>[];
}
