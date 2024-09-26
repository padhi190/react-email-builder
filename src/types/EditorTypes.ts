export interface EmailElement {
  id: string;
  type: 'heading' | 'paragraph' | 'image' | 'button';
  content: React.ReactNode;
  attributes?: Record<string, string>;
}

export interface CanvasState {
  elements: EmailElement[];
}
