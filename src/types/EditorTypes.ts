export interface HTMLElement {
  id: string;
  type: 'heading' | 'paragraph' | 'image' | 'button';
  content: string;
  attributes?: Record<string, string>;
}

export interface CanvasState {
  elements: HTMLElement[];
}
