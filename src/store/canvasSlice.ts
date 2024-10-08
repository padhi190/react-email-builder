import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EmailElement } from '@/types/EditorTypes';
import { File } from 'lucide-react';

/**
 * Canvas State Structure:
 * {
 *   elements: {
 *     root: {
 *       ...,
 *       children: ['id1', 'id2', 'id3']
 *     },
 *     id1: {...},
 *     id2: {...},
 *     id3: {...},
 *   }
 * }
 */

/**
 * Represents the state of the canvas in the email editor.
 */
interface CanvasState {
  elements: Record<string, EmailElement<any>>;
  selectedElementId: EmailElement<any>['id'] | null;
  selectedElementProps?: EmailElement<any>['properties'];
  past: Array<{ elements: CanvasState['elements'] }>;
  future: Array<{ elements: CanvasState['elements'] }>;
}

// Define the root element of the canvas
const rootElement: EmailElement<{ backgroundColor: string }> = {
  id: 'root',
  type: 'root',
  properties: {
    backgroundColor: '#FFFFFF',
  },
  icon: File,
  children: [],
};

// Initial state of the canvas
const initialState: CanvasState = {
  elements: { root: rootElement },
  selectedElementId: null,
  selectedElementProps: undefined,
  past: [],
  future: [],
};

/**
 * Redux slice for managing the canvas state.
 */
const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    /**
     * Adds a new element to the canvas.
     * @param state - Current canvas state
     * @param action - Payload containing the new element and its index
     */
    addElement: (
      state,
      action: PayloadAction<{ element: EmailElement<any>; index: number }>
    ) => {
      const newPastState = {
        elements: JSON.parse(JSON.stringify(state.elements)),
      };
      state.past.push(newPastState);
      state.future = [];

      const newElement: EmailElement<any> = {
        ...action.payload.element,
        id: action.payload.element.id + Date.now(),
      };
      state.elements[newElement.id] = newElement;
      state.elements.root.children?.splice(
        action.payload.index,
        0,
        newElement.id
      );
    },

    /**
     * Repositions an element within the canvas.
     * @param state - Current canvas state
     * @param action - Payload containing the drag and hover indices
     */
    repositionElement: (
      state,
      action: PayloadAction<{ dragIndex: number; hoverIndex: number }>
    ) => {
      const newPastState = {
        elements: JSON.parse(JSON.stringify(state.elements)),
      };
      state.past.push(newPastState);
      state.future = [];

      const { dragIndex, hoverIndex } = action.payload;
      if (state.elements.root.children) {
        const [draggedElement] = state.elements.root.children.splice(
          dragIndex,
          1
        );
        state.elements.root.children.splice(hoverIndex, 0, draggedElement);
      }
    },

    /**
     * Deletes an element from the canvas.
     * @param state - Current canvas state
     * @param action - Payload containing the id of the element to delete
     */
    deleteElement: (state, action: PayloadAction<{ id: string }>) => {
      const newPastState = {
        elements: JSON.parse(JSON.stringify(state.elements)),
      };
      state.past.push(newPastState);
      state.future = [];

      state.elements.root.children = state.elements.root.children?.filter(
        (elementId) => elementId !== action.payload.id
      );
      delete state.elements[action.payload.id];
      state.selectedElementId = null;
    },

    /**
     * Updates an existing element in the canvas.
     * @param state - Current canvas state
     * @param action - Payload containing the updated element
     */
    updateElement: (
      state,
      action: PayloadAction<{ element: EmailElement<any> }>
    ) => {
      const newPastState = {
        elements: JSON.parse(JSON.stringify(state.elements)),
      };
      state.past.push(newPastState);
      state.future = [];

      state.elements[action.payload.element.id] = action.payload.element;
    },

    /**
     * Selects an element in the canvas or deselects if already selected.
     * @param state - Current canvas state
     * @param action - Payload containing the element to select or null to deselect
     */
    selectElement: (
      state,
      action: PayloadAction<{ element: EmailElement<any> | null }>
    ) => {
      if (!action.payload.element) {
        state.selectedElementId = null;
        state.selectedElementProps = null;
        return;
      }

      const isTogglingSelect =
        action.payload.element?.id === state.selectedElementId;
      state.selectedElementId = isTogglingSelect
        ? null
        : action.payload.element.id;
      state.selectedElementProps = isTogglingSelect
        ? undefined
        : action.payload.element?.properties;
    },

    /**
     * Updates the properties of the currently selected element.
     * @param state - Current canvas state
     * @param action - Payload containing the updated properties
     */
    updateSelectedElementProps: (
      state,
      action: PayloadAction<{ properties: EmailElement<any>['properties'] }>
    ) => {
      state.selectedElementProps = action.payload.properties;
    },

    /**
     * Undoes the last action on the canvas.
     * @param state - Current canvas state
     */
    undo: (state) => {
      if (state.past.length === 0) return;
      const previous = state.past[state.past.length - 1];
      const newFutureState = {
        elements: JSON.parse(JSON.stringify(state.elements)),
      };
      state.future.unshift(newFutureState);
      state.elements = JSON.parse(JSON.stringify(previous.elements));
      state.selectedElementId = null;
      state.selectedElementProps = undefined;
      state.past.pop();
    },

    /**
     * Redoes the last undone action on the canvas.
     * @param state - Current canvas state
     */
    redo: (state) => {
      if (state.future.length === 0) return;
      const next = state.future[0];
      const newPastState = {
        elements: JSON.parse(JSON.stringify(state.elements)),
      };
      state.past.push(newPastState);
      state.elements = JSON.parse(JSON.stringify(next.elements));
      state.selectedElementId = null;
      state.selectedElementProps = undefined;
      state.future.shift();
    },
  },
});

// Export action creators
export const {
  addElement,
  repositionElement,
  deleteElement,
  updateElement,
  selectElement,
  updateSelectedElementProps,
  undo,
  redo,
} = canvasSlice.actions;

// Export the reducer
export default canvasSlice.reducer;
