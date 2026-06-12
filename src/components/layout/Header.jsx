import React, { useState, useEffect } from 'react';
import { usePaper, usePaperDispatch } from '../../context/PaperContext';
import { ACTIONS } from '../../reducers/paperReducer';
import { saveToJson, exportToPdf } from '../../utils/exporter';
import { FileDown, FileJson, RotateCcw, CheckCircle2, Loader2 } from 'lucide-react';

export function Header() {
  const { present } = usePaper();
  const dispatch = usePaperDispatch();
  const [isSaving, setIsSaving] = useState(false);

  // Autosave indicator logic
  useEffect(() => {
    setIsSaving(true);
    const timer = setTimeout(() => setIsSaving(false), 800);
    return () => clearTimeout(timer);
  }, [present]);

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset the entire paper? All unsaved changes will be lost.")) {
      dispatch({ type: ACTIONS.RESET_PAPER });
    }
  };

  const handleSaveJson = () => {
    saveToJson(present, `paper-${present.header.subject || 'draft'}.json`);
  };

  const handleExportPdf = () => {
    const previewEl = document.getElementById('paper-preview-content');
    if (previewEl) {
      exportToPdf(previewEl, `${present.header.examName || 'question-paper'}.pdf`);
    }
  };

  return (
    <header className="flex items-center justify-between px-6 h-14 bg-ink-950 border-b-2 border-crimson-500 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect width="28" height="28" rx="6" fill="#c0392b"/>
          <path d="M7 8h14M7 14h10M7 20h12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="21" cy="20" r="3" fill="#f0c040"/>
        </svg>
        <span className="font-serif text-xl font-bold text-white tracking-tight">PaperCraft</span>
        <span className="text-xs text-ink-300 tracking-widest uppercase border-l border-ink-700 pl-3 ml-1">Question Paper Editor</span>
        
        {/* Autosave Indicator */}
        <div className="ml-4 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider">
          {isSaving ? (
            <>
              <Loader2 size={12} className="text-gold-400 animate-spin" />
              <span className="text-ink-400">Saving...</span>
            </>
          ) : (
            <>
              <CheckCircle2 size={12} className="text-green-500" />
              <span className="text-ink-500">Autosaved</span>
            </>
          )}
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <button 
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-medium border border-ink-700 text-ink-200 hover:border-crimson-500 hover:text-crimson-500 hover:bg-crimson-500/5 transition-all"
        >
          <RotateCcw size={14} />
          Reset
        </button>
        <button 
          onClick={handleSaveJson}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-medium border border-ink-700 text-ink-200 hover:border-ink-300 hover:text-white hover:bg-white/5 transition-all"
        >
          <FileJson size={14} />
          Save JSON
        </button>
        <button 
          onClick={handleExportPdf}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-medium border border-crimson-500 bg-crimson-500 text-white hover:bg-crimson-600 hover:border-crimson-600 transition-all shadow-sm"
        >
          <FileDown size={14} />
          Export PDF
        </button>
      </div>
    </header>
  );
}
