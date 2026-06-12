import React, { useRef, useEffect } from 'react';
import { usePaperDispatch, usePaper } from '../../context/PaperContext';
import { ACTIONS } from '../../reducers/paperReducer';

export function InstructionsEditor() {
  const { present } = usePaper();
  const dispatch = usePaperDispatch();
  const contentEditableRef = useRef(null);

  // Sync state to DOM if it changes from outside (e.g. Undo/Redo)
  useEffect(() => {
    if (contentEditableRef.current && contentEditableRef.current.innerHTML !== present.instructions) {
      contentEditableRef.current.innerHTML = present.instructions;
    }
  }, [present.instructions]);

  const handleBlur = () => {
    const html = contentEditableRef.current.innerHTML;
    if (html !== present.instructions) {
      dispatch({ type: ACTIONS.UPDATE_INSTRUCTIONS, payload: html });
    }
  };

  return (
    <div className="border border-ink-200 rounded-xl overflow-hidden">
      <div className="bg-ink-100 px-4 py-2 text-xs font-semibold tracking-wider uppercase text-ink-700 flex justify-between items-center">
        General Instructions
      </div>
      <div 
        ref={contentEditableRef}
        contentEditable
        onBlur={handleBlur}
        data-placeholder="Type general instructions here..."
        className="p-4 bg-white text-sm text-ink-900 outline-none min-h-[80px] focus:bg-[#fffbf9] whitespace-pre-wrap empty:before:content-[attr(data-placeholder)] empty:before:text-ink-300"
      />
    </div>
  );
}
