'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { EmailElement } from '@/types/EditorTypes';

// Update CanvasAction type
type CanvasAction =
  | {
      type: 'ADD_ELEMENT';
      payload: { element: EmailElement<any>; index: number };
    }
  | {
      type: 'REPOSITION_ELEMENT';
      payload: { dragIndex: number; hoverIndex: number };
    }
  | { type: 'DELETE_ELEMENT'; payload: { id: string } }
  | { type: 'UPDATE_ELEMENT'; payload: { element: EmailElement<any> } }
  | { type: 'SELECT_ELEMENT'; payload: { id: string | null } }
  | { type: 'UNDO' }
  | { type: 'REDO' };

// Update CanvasState type
interface CanvasState {
  present: {
    elements: EmailElement<any>[];
    selectedElementId: string | null;
  };
  past: Array<CanvasState['present']>;
  future: Array<CanvasState['present']>;
}

// Update initial state
const initialState: CanvasState = {
  present: { elements: [], selectedElementId: null },
  past: [],
  future: [],
};

// Update reducer function
function canvasReducer(state: CanvasState, action: CanvasAction): CanvasState {
  switch (action.type) {
    case 'ADD_ELEMENT':
    case 'REPOSITION_ELEMENT':
    case 'DELETE_ELEMENT':
    case 'UPDATE_ELEMENT': {
      const newPresent = handleAction(state.present, action);
      return {
        past: [...state.past, state.present],
        present: newPresent,
        future: [],
      };
    }
    case 'SELECT_ELEMENT': {
      // Handle SELECT_ELEMENT without affecting undo/redo history
      const newPresent = handleAction(state.present, action);
      return {
        ...state,
        present: newPresent,
      };
    }
    case 'UNDO':
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, state.past.length - 1);
      return {
        past: newPast,
        present: { ...previous, selectedElementId: null },
        future: [state.present, ...state.future],
      };
    case 'REDO':
      if (state.future.length === 0) return state;
      const next = state.future[0];
      const newFuture = state.future.slice(1);
      return {
        past: [...state.past, state.present],
        present: { ...next, selectedElementId: null },
        future: newFuture,
      };
    default:
      return state;
  }
}

// Helper function to handle actions
function handleAction(
  state: CanvasState['present'],
  action: CanvasAction
): CanvasState['present'] {
  switch (action.type) {
    case 'ADD_ELEMENT':
      const newElements = [...state.elements];
      const newElementWithId = {
        ...action.payload.element,
        id: action.payload.element.id + Date.now(),
      };
      newElements.splice(action.payload.index, 0, newElementWithId);
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
        selectedElementId: null,
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

// Update CanvasContext type
const CanvasContext = createContext<
  | {
      state: CanvasState['present'];
      dispatch: React.Dispatch<CanvasAction>;
      canUndo: boolean;
      canRedo: boolean;
    }
  | undefined
>(undefined);

// Update provider component
export function CanvasProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(canvasReducer, initialState);

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  return (
    <CanvasContext.Provider
      value={{
        state: state.present,
        dispatch,
        canUndo,
        canRedo,
      }}
    >
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
