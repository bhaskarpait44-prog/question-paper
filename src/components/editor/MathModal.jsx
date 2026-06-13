import React, { useState, useEffect, useMemo } from 'react';
import { X, Search } from 'lucide-react';
import MathRenderer from '../common/MathRenderer';

export default function MathModal({ isOpen, onClose, onInsert }) {
  const [latex, setLatex] = useState('');
  const [mode, setMode] = useState('latex'); // 'latex' | 'shortcuts'
  const [subjectTab, setSubjectTab] = useState(localStorage.getItem('math_modal_last_tab') || 'Math');
  const [displayMode, setDisplayMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      setLatex('');
    }
  }, [isOpen]);

  useEffect(() => {
    localStorage.setItem('math_modal_last_tab', subjectTab);
  }, [subjectTab]);

  const subjectShortcuts = useMemo(() => ({
    Math: [
      { label: 'a/b', latex: '\\frac{a}{b}' },
      { label: 'a b/c', latex: 'a\\frac{b}{c}' },
      { label: 'x²', latex: 'x^{2}' },
      { label: 'xⁿ', latex: 'x^{n}' },
      { label: '√x', latex: '\\sqrt{x}' },
      { label: 'ⁿ√x', latex: '\\sqrt[n]{x}' },
      { label: 'sin θ', latex: '\\sin\\theta' },
      { label: 'cos θ', latex: '\\cos\\theta' },
      { label: 'tan θ', latex: '\\tan\\theta' },
      { label: 'sin⁻¹x', latex: '\\sin^{-1}x' },
      { label: 'd/dx', latex: '\\frac{d}{dx}' },
      { label: 'dy/dx', latex: '\\frac{dy}{dx}' },
      { label: '∫', latex: '\\int_{a}^{b}' },
      { label: '∬', latex: '\\int\\int' },
      { label: 'lim', latex: '\\lim_{x \\to 0}' },
      { label: '∈', latex: '\\in' },
      { label: '⊂', latex: '\\subset' },
      { label: '∀', latex: '\\forall' },
      { label: '∃', latex: '\\exists' },
      { label: '⇒', latex: '\\Rightarrow' },
      { label: '⇔', latex: '\\Leftrightarrow' },
      { label: 'Matrix', latex: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}' },
      { label: 'Det', latex: '\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}' },
      { label: '≥', latex: '\\geq' },
      { label: '≤', latex: '\\leq' },
      { label: '≠', latex: '\\neq' },
      { label: '≈', latex: '\\approx' },
      { label: '∝', latex: '\\propto' },
    ],
    Physics: [
      { label: 'Vector F', latex: '\\vec{F}' },
      { label: 'î', latex: '\\hat{i}' },
      { label: 'ĵ', latex: '\\hat{j}' },
      { label: 'k̂', latex: '\\hat{k}' },
      { label: '|A|', latex: '|\\vec{A}|' },
      { label: 'm/s', latex: '\\, \\text{m/s}' },
      { label: 'kg', latex: '\\, \\text{kg}' },
      { label: 'N', latex: '\\, \\text{N}' },
      { label: 'J', latex: '\\, \\text{J}' },
      { label: 'W', latex: '\\, \\text{W}' },
      { label: 'Ω', latex: '\\Omega' },
      { label: 'F = ma', latex: 'F = ma' },
      { label: 'v = u + at', latex: 'v = u + at' },
      { label: 'E = mc²', latex: 'E = mc^2' },
      { label: '½mv²', latex: '\\frac{1}{2}mv^2' },
      { label: 'PV = nRT', latex: 'PV = nRT' },
      { label: 'V/R', latex: '\\frac{V}{R}' },
      { label: 'λ', latex: '\\lambda' },
      { label: 'μ', latex: '\\mu' },
      { label: 'ω', latex: '\\omega' },
      { label: 'φ', latex: '\\phi' },
      { label: 'ε₀', latex: '\\epsilon_0' },
      { label: 'Φ', latex: '\\Phi' },
      { label: 'v₀', latex: 'v_{0}' },
      { label: 'aₓ', latex: 'a_{x}' },
      { label: 'F_net', latex: 'F_{net}' },
      { label: 'T_½', latex: 'T_{1/2}' },
      { label: '°', latex: '^\\circ' },
      { label: '°C', latex: '^\\circ C' },
    ],
    Chemistry: [
      { label: 'Reaction', latex: '\\ce{2H2 + O2 -> 2H2O}' },
      { label: 'Heat', latex: '\\ce{CaCO3 ->[\\Delta] CaO + CO2}' },
      { label: 'Equilib.', latex: '\\ce{<=>}' },
      { label: 'Equilib. R', latex: '\\ce{<=>>}' },
      { label: 'SO₄²⁻', latex: '\\ce{SO4^2-}' },
      { label: 'Na⁺', latex: '\\ce{Na+}' },
      { label: 'NH₄⁺', latex: '\\ce{NH4+}' },
      { label: 'Fe³⁺', latex: '\\ce{Fe^{3+}}' },
      { label: '(s)', latex: '\\ce{(s)}' },
      { label: '(l)', latex: '\\ce{(l)}' },
      { label: '(g)', latex: '\\ce{(g)}' },
      { label: '(aq)', latex: '\\ce{(aq)}' },
      { label: 'H₂SO₄', latex: '\\ce{H2SO4}' },
      { label: 'NaOH', latex: '\\ce{NaOH}' },
      { label: 'CH₃COOH', latex: '\\ce{CH3COOH}' },
      { label: 'C₂H₅OH', latex: '\\ce{C2H5OH}' },
      { label: 'KMnO₄', latex: '\\ce{KMnO4}' },
      { label: 'CaCO₃', latex: '\\ce{CaCO3}' },
      { label: 'NH₃', latex: '\\ce{NH3}' },
      { label: 'HCl', latex: '\\ce{HCl}' },
      { label: 'O₂', latex: '\\ce{O2}' },
      { label: 'N₂', latex: '\\ce{N2}' },
    ],
    'Greek/Symbols': [
      { label: 'α', latex: '\\alpha' },
      { label: 'β', latex: '\\beta' },
      { label: 'γ', latex: '\\gamma' },
      { label: 'δ', latex: '\\delta' },
      { label: 'Δ', latex: '\\Delta' },
      { label: 'θ', latex: '\\theta' },
      { label: 'π', latex: '\\pi' },
      { label: 'σ', latex: '\\sigma' },
      { label: 'Σ', latex: '\\sum' },
      { label: 'Ω', latex: '\\Omega' },
      { label: 'ω', latex: '\\omega' },
      { label: 'λ', latex: '\\lambda' },
      { label: 'μ', latex: '\\mu' },
      { label: 'ρ', latex: '\\rho' },
      { label: 'τ', latex: '\\tau' },
      { label: '∞', latex: '\\infty' },
    ]
  }), []);

  const filteredShortcuts = useMemo(() => {
    const list = subjectShortcuts[subjectTab] || [];
    if (!searchQuery) return list;
    return list.filter(s => 
      s.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.latex.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [subjectShortcuts, subjectTab, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-ink-950/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-ink-200">
        {/* Header */}
        <div className="bg-ink-950 text-white px-5 py-3 flex items-center justify-between">
          <h3 className="font-serif text-lg font-bold tracking-tight">Insert Formula</h3>
          <button onClick={onClose} className="text-ink-300 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col h-[500px]">
          <div className="flex gap-2 mb-4 shrink-0">
            <button 
              onClick={() => setMode('latex')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border-2 transition-all ${mode === 'latex' ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-ink-100 text-ink-500 hover:border-ink-200'}`}
            >
              Manual LaTeX
            </button>
            <button 
              onClick={() => setMode('shortcuts')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border-2 transition-all ${mode === 'shortcuts' ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-ink-100 text-ink-500 hover:border-ink-200'}`}
            >
              Quick Shortcuts
            </button>
          </div>

          <div className="flex items-center justify-between mb-4 shrink-0">
            <div className="flex gap-2">
              <button 
                onClick={() => setDisplayMode(false)}
                className={`px-3 py-1 text-[10px] font-bold uppercase rounded border ${!displayMode ? 'bg-ink-900 text-white' : 'bg-white text-ink-500'}`}
              >
                Inline
              </button>
              <button 
                onClick={() => setDisplayMode(true)}
                className={`px-3 py-1 text-[10px] font-bold uppercase rounded border ${displayMode ? 'bg-ink-900 text-white' : 'bg-white text-ink-500'}`}
              >
                Block / New Line
              </button>
            </div>
            {mode === 'shortcuts' && (
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-300" />
                <input 
                  type="text"
                  placeholder="Filter shortcuts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1 text-xs border border-ink-200 rounded-full outline-none focus:border-blue-500 w-40"
                />
              </div>
            )}
          </div>

          <div className="flex-1 overflow-hidden flex flex-col">
            {mode === 'latex' ? (
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-ink-500">Enter LaTeX expression</label>
                  <textarea 
                    autoFocus
                    rows={3}
                    value={latex}
                    onChange={(e) => setLatex(e.target.value)}
                    placeholder="e.g. \frac{a}{b}, x^2 + y^2, \sqrt{x}"
                    className="w-full px-4 py-3 bg-ink-50 border border-ink-200 rounded-lg font-mono text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                <div className="flex gap-1 mb-2 border-b border-ink-100">
                  {Object.keys(subjectShortcuts).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setSubjectTab(tab)}
                      className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-all ${subjectTab === tab ? 'border-blue-500 text-blue-600' : 'border-transparent text-ink-400 hover:text-ink-700'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 overflow-y-auto p-1 custom-scrollbar">
                  {filteredShortcuts.map((s, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setLatex(prev => prev + s.latex)}
                      title={s.latex}
                      className="px-2 py-3 border border-ink-100 rounded-lg text-sm hover:border-blue-500 hover:bg-blue-50 transition-all text-ink-700 flex items-center justify-center min-h-[50px]"
                    >
                      <MathRenderer formula={s.latex} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 shrink-0">
              <label className="text-[10px] font-bold uppercase tracking-widest text-ink-500 block mb-1">Live Preview</label>
              <div className={`min-h-[80px] bg-blue-50/30 border border-blue-100 rounded-lg flex items-center justify-center text-xl overflow-x-auto p-4`}>
                {latex ? <MathRenderer formula={latex} displayMode={displayMode} /> : <span className="text-ink-300 text-sm italic">Expression will appear here...</span>}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end mt-6 shrink-0">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-ink-600 hover:bg-ink-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={() => onInsert(latex, displayMode)}
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
