import { EmailElement } from '@/types/EditorTypes';

export function Paragraph({ element }: { element: EmailElement }) {
  return <p className="text-gray-300">{element.content}</p>;
}
