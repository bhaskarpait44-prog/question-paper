import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { paperReducer, INITIAL_STATE, ACTIONS } from '../reducers/paperReducer';

const PaperContext = createContext(null);
const PaperDispatchContext = createContext(null);

const STORAGE_KEY = 'papercraft_data';

export function PaperProvider({ children }) {
  // Try loading from localStorage
  const loadInitialState = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return {
          past: [],
          present: JSON.parse(saved),
          future: []
        };
      }
    } catch (e) {
      console.error("Failed to load paper state:", e);
    }
    return {
      past: [],
      present: INITIAL_STATE,
      future: []
    };
  };

  const [state, dispatch] = useReducer(paperReducer, null, loadInitialState);

  // Auto-save debounced
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.present));
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [state.present]);

  // Keyboard shortcuts for Undo/Redo
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          dispatch({ type: ACTIONS.REDO });
        } else {
          dispatch({ type: ACTIONS.UNDO });
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        dispatch({ type: ACTIONS.REDO });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <PaperContext.Provider value={state}>
      <PaperDispatchContext.Provider value={dispatch}>
        {children}
      </PaperDispatchContext.Provider>
    </PaperContext.Provider>
  );
}

export function usePaper() {
  const state = useContext(PaperContext);
  if (state === null) throw new Error('usePaper must be used within a PaperProvider');
  return state;
}

export function usePaperDispatch() {
  const dispatch = useContext(PaperDispatchContext);
  if (dispatch === null) throw new Error('usePaperDispatch must be used within a PaperProvider');
  return dispatch;
}
