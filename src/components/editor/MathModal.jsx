import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import MathRenderer from '../common/MathRenderer';

export default function MathModal({ isOpen, onClose, onInsert }) {
  const [latex, setLatex] = useState('');
  const [mode, setMode] = useState('latex'); // 'latex' | 'shortcuts'

  useEffect(() => {
    if (isOpen) {
      setLatex('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const shortcuts = [
    { label: 'a/b', latex: '\\frac{a}{b}' },
    { label: 'x²', latex: 'x^{2}' },
    { label: '√x', latex: '\\sqrt{x}' },
    { label: 'π', latex: '\\pi' },
    { label: 'θ', latex: '\\theta' },
    { label: 'α', latex: '\\alpha' },
    { label: 'β', latex: '\\beta' },
    { label: 'Δ', latex: '\\Delta' },
    { label: 'Σ', latex: '\\sum_{i=1}^{n}' },
    { label: '∫', latex: '\\int_{a}^{b}' },
    { label: '→A', latex: '\\vec{A}' },
    { label: 'lim', latex: '\\lim_{x \\to 0}' },
    { label: 'H₂O', latex: 'H_2O' },
    { label: 'CO₂', latex: 'CO_2' },
    { label: 'NaCl', latex: 'NaCl' },
    { label: 'C₆H₁₂O₆', latex: 'C_6H_{12}O_6' },
  ];

  return (
    <div className="fixed inset-0 bg-ink-950/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-ink-200">
        {/* Header */}
        <div className="bg-ink-950 text-white px-5 py-3 flex items-center justify-between">
          <h3 className="font-serif text-lg font-bold tracking-tight">Insert Formula</h3>
          <button onClick={onClose} className="text-ink-300 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          <div className="flex gap-2 mb-4">
            <button 
              onClick={() => setMode('latex')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border-2 transition-all ${mode === 'latex' ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-ink-100 text-ink-500 hover:border-ink-200'}`}
            >
              LaTeX / KaTeX
            </button>
            <button 
              onClick={() => setMode('shortcuts')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border-2 transition-all ${mode === 'shortcuts' ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-ink-100 text-ink-500 hover:border-ink-200'}`}
            >
              Quick Shortcuts
            </button>
          </div>

          {mode === 'latex' ? (
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-ink-500">Enter LaTeX expression</label>
                <input 
                  autoFocus
                  type="text"
                  value={latex}
                  onChange={(e) => setLatex(e.target.value)}
                  placeholder="e.g. \frac{a}{b}, x^2 + y^2, \sqrt{x}"
                  className="w-full px-4 py-3 bg-ink-50 border border-ink-200 rounded-lg font-mono text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-ink-500">Live Preview</label>
                <div className="min-h-[60px] bg-blue-50/30 border border-blue-100 rounded-lg flex items-center justify-center text-xl">
                  {latex ? <MathRenderer formula={latex} /> : <span className="text-ink-300 text-sm italic">Type something...</span>}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {shortcuts.map((s, idx) => (
                <button 
                  key={idx}
                  onClick={() => setLatex(prev => prev + s.latex)}
                  className="px-2 py-3 border border-ink-100 rounded-lg text-sm hover:border-blue-500 hover:bg-blue-50 transition-all text-ink-700"
                >
                  <MathRenderer formula={s.latex} />
                </button>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 justify-end mt-6">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-ink-600 hover:bg-ink-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={() => onInsert(latex)}
              disabled={!latex}
              className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-md shadow-blue-600/20 transition-all"
            >
              Insert Formula
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
