export interface EmailElement {
  id: string;
  type: 'heading' | 'paragraph' | 'image' | 'button';
  icon: React.ElementType;
  content: React.ReactNode;
  attributes?: Record<string, string>;
}

export interface CanvasState {
  elements: EmailElement[];
}
