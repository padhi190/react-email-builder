import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EmailElement } from '@/types/EditorTypes';

interface CanvasState {
  elements: EmailElement<any>[];
  selectedElement: EmailElement<any> | null;
  selectedElementProps?: EmailElement<any>['properties'];
  past: Array<{
    elements: EmailElement<any>[];
    selectedElement: EmailElement<any> | null;
    selectedElementProps?: EmailElement<any>['properties'];
  }>;
  future: Array<{
    elements: EmailElement<any>[];
    selectedElement: EmailElement<any> | null;
    selectedElementProps?: EmailElement<any>['properties'];
  }>;
}

const initialState: CanvasState = {
  elements: [],
  selectedElement: null,
  selectedElementProps: undefined,
  past: [],
  future: [],
};

const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    addElement: (
      state,
      action: PayloadAction<{ element: EmailElement<any>; index: number }>
    ) => {
      const newElement = {
        ...action.payload.element,
        id: action.payload.element.id + Date.now(),
      };
      state.elements.splice(action.payload.index, 0, newElement);
      state.past.push({
        elements: [...state.elements],
        selectedElement: state.selectedElement,
        selectedElementProps: state.selectedElementProps,
      });
      state.future = [];
    },
    repositionElement: (
      state,
      action: PayloadAction<{ dragIndex: number; hoverIndex: number }>
    ) => {
      const { dragIndex, hoverIndex } = action.payload;
      const draggedElement = state.elements[dragIndex];
      state.elements.splice(dragIndex, 1);
      state.elements.splice(hoverIndex, 0, draggedElement);
      state.past.push({
        elements: [...state.elements],
        selectedElement: state.selectedElement,
        selectedElementProps: state.selectedElementProps,
      });
      state.future = [];
    },
    deleteElement: (state, action: PayloadAction<{ id: string }>) => {
      state.elements = state.elements.filter(
        (element) => element.id !== action.payload.id
      );
      state.selectedElement = null;
      state.past.push({
        elements: [...state.elements],
        selectedElement: state.selectedElement,
        selectedElementProps: state.selectedElementProps,
      });
      state.future = [];
    },
    updateElement: (
      state,
      action: PayloadAction<{ element: EmailElement<any> }>
    ) => {
      state.elements = state.elements.map((element) =>
        element.id === action.payload.element.id
          ? action.payload.element
          : element
      );
      state.past.push({
        elements: [...state.elements],
        selectedElement: state.selectedElement,
        selectedElementProps: state.selectedElementProps,
      });
      state.future = [];
    },
    selectElement: (
      state,
      action: PayloadAction<{ element: EmailElement<any> | null }>
    ) => {
      const isTogglingSelect =
        action.payload.element?.id === state.selectedElement?.id;
      state.selectedElement = isTogglingSelect ? null : action.payload.element;
      state.selectedElementProps = isTogglingSelect
        ? undefined
        : action.payload.element?.properties;
    },
    updateSelectedElementProps: (
      state,
      action: PayloadAction<{ properties: EmailElement<any>['properties'] }>
    ) => {
      state.selectedElementProps = action.payload.properties;
    },
    undo: (state) => {
      if (state.past.length === 0) return;
      const previous = state.past[state.past.length - 1];
      state.future.unshift({
        elements: state.elements,
        selectedElement: state.selectedElement,
        selectedElementProps: state.selectedElementProps,
      });
      state.elements = previous.elements;
      state.selectedElement = null;
      state.selectedElementProps = undefined;
      state.past.pop();
    },
    redo: (state) => {
      if (state.future.length === 0) return;
      const next = state.future[0];
      state.past.push({
        elements: state.elements,
        selectedElement: state.selectedElement,
        selectedElementProps: state.selectedElementProps,
      });
      state.elements = next.elements;
      state.selectedElement = null;
      state.selectedElementProps = undefined;
      state.future.shift();
    },
  },
});

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

export default canvasSlice.reducer;
