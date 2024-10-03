import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import {
  addElement,
  repositionElement,
  deleteElement,
  updateElement,
  selectElement,
  updateSelectedElementProps,
  undo,
  redo,
} from '@/store/canvasSlice';

export function useCanvas() {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((state: RootState) => state.canvas);

  return {
    state,
    dispatch: {
      addElement: (payload: Parameters<typeof addElement>[0]) =>
        dispatch(addElement(payload)),
      repositionElement: (payload: Parameters<typeof repositionElement>[0]) =>
        dispatch(repositionElement(payload)),
      deleteElement: (payload: Parameters<typeof deleteElement>[0]) =>
        dispatch(deleteElement(payload)),
      updateElement: (payload: Parameters<typeof updateElement>[0]) =>
        dispatch(updateElement(payload)),
      selectElement: (payload: Parameters<typeof selectElement>[0]) =>
        dispatch(selectElement(payload)),
      updateSelectedElementProps: (
        payload: Parameters<typeof updateSelectedElementProps>[0]
      ) => dispatch(updateSelectedElementProps(payload)),
      undo: () => dispatch(undo()),
      redo: () => dispatch(redo()),
    },
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
  };
}
