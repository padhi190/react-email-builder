'use client';

import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';

export function CanvasProvider({ children }: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}

// We'll keep this hook for convenience, but it will now use Redux
export { useCanvas } from '@/hooks/useCanvas';
