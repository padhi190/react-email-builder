import React, { useState, useEffect } from 'react';
import { EmailElement } from '@/types/EditorTypes';

interface ElementEditorProps {
  element: EmailElement;
  onUpdate: (updatedElement: EmailElement) => void;
}

export function ElementEditor({ element, onUpdate }: ElementEditorProps) {
  const [content, setContent] = useState(element.content);

  useEffect(() => {
    setContent(element.content);
  }, [element]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ ...element, content });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-white text-lg font-semibold">Edit {element.type}</h2>
      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-300"
        >
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={handleContentChange}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows={4}
        />
      </div>
      {/* Add more fields for specific attributes based on element type */}
      <button
        type="submit"
        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
      >
        Update Element
      </button>
    </form>
  );
}
