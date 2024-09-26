import { EmailElement } from '@/types/EditorTypes';

export function Heading({ element }: { element: EmailElement }) {
  return (
    <h2 className="text-white text-lg font-semibold mb-2">{element.content}</h2>
  );
}
