import React from 'react';
import { usePaper, usePaperDispatch } from '../context/PaperContext';
import { ACTIONS } from '../reducers/paperReducer';
import { Undo2, Redo2, PlusCircle, Sigma, Type, ListTodo } from 'lucide-react';

export default function Toolbar() {
  const { past, future } = usePaper();
  const dispatch = usePaperDispatch();

  return (
    <div className="bg-white border-b border-ink-200 px-4 py-2 flex flex-wrap gap-1 items-center sticky top-14 z-40 shadow-sm">
      <div className="flex items-center gap-1 px-1 border-r border-ink-200">
        <button 
          onClick={() => dispatch({ type: ACTIONS.UNDO })}
          disabled={past.length === 0}
          className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium text-ink-700 hover:bg-ink-100 hover:text-ink-950 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={14} />
          Undo
        </button>
        <button 
          onClick={() => dispatch({ type: ACTIONS.REDO })}
          disabled={future.length === 0}
          className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium text-ink-700 hover:bg-ink-100 hover:text-ink-950 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 size={14} />
          Redo
        </button>
      </div>
      
      <div className="flex items-center gap-1 px-1 border-r border-ink-200">
        <button 
          onClick={() => dispatch({ type: ACTIONS.ADD_SECTION })}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold text-crimson-500 hover:bg-[#fdf2f2] transition-all"
        >
          <PlusCircle size={14} />
          New Section
        </button>
      </div>

      <div className="flex items-center gap-3 px-3 text-ink-400">
        <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest">
          <Type size={12} />
          Formatting: Ctrl+B / Ctrl+I
        </div>
      </div>
    </div>
  );
}
