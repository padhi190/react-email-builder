import {
  ContainerEmailContent,
  ContainerEmailElement,
  ContainerEmailProperties,
} from '@/components/elements/Container';
import {
  TextEmailContent,
  TextEmailElement,
  TextEmailProperties,
} from '@/components/elements/Text';

export type ElementType = 'root' | 'text' | 'container';

export interface EmailElement<TProps> {
  id: string;
  type: ElementType;
  icon: React.ElementType;
  // content: React.FC<TProps>;
  // propertiesContent: React.FC<TProps & { onChange: Function }>;
  properties: TProps;
  children?: Array<EmailElement<any>['id']>;
}

export const emailElements: EmailElement<any>[] = [TextEmailElement];

export const containerElements: EmailElement<any>[] = [ContainerEmailElement];

export interface CanvasState {
  elements: EmailElement<any>[];
}

export const elementContentMap: Record<
  ElementType,
  React.ComponentType<any>
> = {
  root: () => null,
  text: TextEmailContent,
  container: ContainerEmailContent,
};

export const elementPropsMap: Record<ElementType, React.ComponentType<any>> = {
  root: () => null,
  text: TextEmailProperties,
  container: ContainerEmailProperties,
};
