'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { EmailElement } from '@/types/EditorTypes';

// Define action types
type CanvasAction =
  | { type: 'ADD_ELEMENT'; payload: { element: EmailElement; index: number } }
  | {
      type: 'REPOSITION_ELEMENT';
      payload: { dragIndex: number; hoverIndex: number };
    }
  | { type: 'DELETE_ELEMENT'; payload: { id: string } }
  | { type: 'UPDATE_ELEMENT'; payload: { element: EmailElement } }
  | { type: 'SELECT_ELEMENT'; payload: { id: string | null } };

// Update CanvasState type
interface CanvasState {
  elements: EmailElement[];
  selectedElementId: string | null;
}

// Create the initial state
const initialState: CanvasState = { elements: [], selectedElementId: null };

// Create the reducer function
function canvasReducer(state: CanvasState, action: CanvasAction): CanvasState {
  switch (action.type) {
    case 'ADD_ELEMENT':
      const newElements = [...state.elements];
      newElements.splice(action.payload.index, 0, action.payload.element);
      return { ...state, elements: newElements };
    case 'REPOSITION_ELEMENT':
      const reposElements = [...state.elements];
      const [reorderedItem] = reposElements.splice(action.payload.dragIndex, 1);
      reposElements.splice(action.payload.hoverIndex, 0, reorderedItem);
      return { ...state, elements: reposElements };
    case 'DELETE_ELEMENT':
      return {
        ...state,
        elements: state.elements.filter(
          (element) => element.id !== action.payload.id
        ),
      };
    case 'UPDATE_ELEMENT':
      return {
        ...state,
        elements: state.elements.map((element) =>
          element.id === action.payload.element.id
            ? action.payload.element
            : element
        ),
      };
    case 'SELECT_ELEMENT':
      return {
        ...state,
        selectedElementId:
          action.payload.id === state.selectedElementId
            ? null
            : action.payload.id,
      };
    default:
      return state;
  }
}

// Create the context
const CanvasContext = createContext<
  | {
      state: CanvasState;
      dispatch: React.Dispatch<CanvasAction>;
    }
  | undefined
>(undefined);

// Create a provider component
export function CanvasProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(canvasReducer, initialState);

  return (
    <CanvasContext.Provider value={{ state, dispatch }}>
      {children}
    </CanvasContext.Provider>
  );
}

// Create a custom hook to use the context
export function useCanvas() {
  const context = useContext(CanvasContext);
  if (context === undefined) {
    throw new Error('useCanvas must be used within a CanvasProvider');
  }
  return context;
}
