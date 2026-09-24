import { useState, useCallback, useEffect, useRef } from 'react';

export interface HistoryItem<T> {
  id: string;
  state: T;
  label: string;
  timestamp: string;
}

export interface UseUndoRedoReturn<T> {
  state: T;
  setState: (newState: T | ((prev: T) => T), label?: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  history: HistoryItem<T>[];
  currentIndex: number;
  jumpTo: (index: number) => void;
  clearHistory: () => void;
}

export function useUndoRedo<T>(
  initialState: T,
  initialLabel: string = 'Initial State',
  maxHistory: number = 30
): UseUndoRedoReturn<T> {
  const [past, setPast] = useState<HistoryItem<T>[]>([]);
  const [present, setPresent] = useState<T>(initialState);
  const [presentLabel, setPresentLabel] = useState<string>(initialLabel);
  const [presentId] = useState<string>(() => `step-${Date.now()}`);
  const [future, setFuture] = useState<HistoryItem<T>[]>([]);

  // Keep refs for event listeners so they don't capture stale closures
  const pastRef = useRef(past);
  const presentRef = useRef(present);
  const futureRef = useRef(future);

  useEffect(() => {
    pastRef.current = past;
    presentRef.current = present;
    futureRef.current = future;
  }, [past, present, future]);

  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  const undo = useCallback(() => {
    if (pastRef.current.length === 0) return;

    const previous = pastRef.current[pastRef.current.length - 1];
    const newPast = pastRef.current.slice(0, pastRef.current.length - 1);

    const currentItem: HistoryItem<T> = {
      id: `step-${Date.now()}`,
      state: presentRef.current,
      label: presentLabel,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    setFuture(prev => [currentItem, ...prev]);
    setPresent(previous.state);
    setPresentLabel(previous.label);
    setPast(newPast);
  }, [presentLabel]);

  const redo = useCallback(() => {
    if (futureRef.current.length === 0) return;

    const next = futureRef.current[0];
    const newFuture = futureRef.current.slice(1);

    const currentItem: HistoryItem<T> = {
      id: `step-${Date.now()}`,
      state: presentRef.current,
      label: presentLabel,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    setPast(prev => [...prev, currentItem]);
    setPresent(next.state);
    setPresentLabel(next.label);
    setFuture(newFuture);
  }, [presentLabel]);

  const setState = useCallback(
    (newStateOrFn: T | ((prev: T) => T), label: string = 'Update') => {
      const resolved = typeof newStateOrFn === 'function'
        ? (newStateOrFn as (prev: T) => T)(presentRef.current)
        : newStateOrFn;

      const currentItem: HistoryItem<T> = {
        id: `step-${Date.now()}`,
        state: presentRef.current,
        label: presentLabel,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };

      setPast(prev => {
        const updated = [...prev, currentItem];
        if (updated.length > maxHistory) {
          return updated.slice(updated.length - maxHistory);
        }
        return updated;
      });
      setPresent(resolved);
      setPresentLabel(label);
      setFuture([]); // Clear future upon new branch
    },
    [presentLabel, maxHistory]
  );

  const jumpTo = useCallback((targetIndex: number) => {
    const fullHistory = [
      ...pastRef.current,
      {
        id: presentId,
        state: presentRef.current,
        label: presentLabel,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      },
      ...futureRef.current
    ];

    if (targetIndex < 0 || targetIndex >= fullHistory.length) return;

    const targetItem = fullHistory[targetIndex];
    const newPast = fullHistory.slice(0, targetIndex);
    const newFuture = fullHistory.slice(targetIndex + 1);

    setPast(newPast);
    setPresent(targetItem.state);
    setPresentLabel(targetItem.label);
    setFuture(newFuture);
  }, [presentId, presentLabel]);

  const clearHistory = useCallback(() => {
    setPast([]);
    setFuture([]);
  }, []);

  // Global Keyboard Shortcuts (Ctrl+Z for Undo, Ctrl+Y or Ctrl+Shift+Z for Redo)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (cmdOrCtrl && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undo();
      } else if (
        (cmdOrCtrl && e.key.toLowerCase() === 'y') ||
        (cmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 'z')
      ) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  // Combined timeline of all steps with current index
  const fullTimeline: HistoryItem<T>[] = [
    ...past,
    {
      id: presentId,
      state: present,
      label: presentLabel,
      timestamp: 'Current'
    },
    ...future
  ];

  const currentIndex = past.length;

  return {
    state: present,
    setState,
    undo,
    redo,
    canUndo,
    canRedo,
    history: fullTimeline,
    currentIndex,
    jumpTo,
    clearHistory
  };
}
