import { HTMLElement } from '@/types/EditorTypes';

export function Paragraph({ element }: { element: HTMLElement }) {
  return <p className="text-gray-300">{element.content}</p>;
}
