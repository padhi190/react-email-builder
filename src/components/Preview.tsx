import { EmailElement } from '@/types/EditorTypes';
import { ElementRenderer } from '@/components/elements/ElementRenderer';

interface PreviewProps {
  elements: Record<string, EmailElement<any>>;
}

export default function Preview({ elements }: PreviewProps) {
  return (
    <div className="border-gray-400 border max-w-md mx-auto">
      {elements.root.children?.map((elementId) => (
        <ElementRenderer key={elementId} element={elements[elementId]} />
      ))}
    </div>
  );
}
