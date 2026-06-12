/**
 * mathModal.js — Handles the KaTeX formula insertion modal
 */

import katex from 'katex';

let _onInsert = null;  // callback(latex: string)
let _mode = 'math';   // 'math' or 'chem'
let _selectedShortcut = null;

const CHEM_SHORTCUTS = [
  { label: 'H₂O',       latex: 'H_2O' },
  { label: 'CO₂',       latex: 'CO_2' },
  { label: 'NaCl',      latex: 'NaCl' },
  { label: 'H₂SO₄',    latex: 'H_2SO_4' },
  { label: 'HNO₃',     latex: 'HNO_3' },
  { label: 'CaCO₃',    latex: 'CaCO_3' },
  { label: 'NH₃',      latex: 'NH_3' },
  { label: 'C₆H₁₂O₆', latex: 'C_6H_{12}O_6' },
  { label: 'Fe₂O₃',   latex: 'Fe_2O_3' },
  { label: 'CH₄',      latex: 'CH_4' },
  { label: 'O₂',       latex: 'O_2' },
  { label: 'N₂',       latex: 'N_2' },
];

export function initMathModal({ onInsert }) {
  _onInsert = onInsert;

  const modal      = document.getElementById('math-modal');
  const input      = document.getElementById('math-input');
  const preview    = document.getElementById('math-preview');
  const insertBtn  = document.getElementById('math-insert');
  const cancelBtn  = document.getElementById('math-cancel');
  const closeBtn   = document.getElementById('math-modal-close');
  const tabs       = document.querySelectorAll('.formula-tab');
  const latexPanel = document.getElementById('formula-latex-panel');
  const shortPanel = document.getElementById('formula-shortcuts-panel');
  const grid       = document.querySelector('.shortcuts-grid');

  // Tab switching
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const m = tab.dataset.mode;
      latexPanel.classList.toggle('hidden', m !== 'latex');
      shortPanel.classList.toggle('hidden', m !== 'shortcuts');
    });
  });

  // Live KaTeX preview while typing
  input.addEventListener('input', () => _renderPreview(input.value, preview));

  // Shortcut buttons (math)
  grid.querySelectorAll('.shortcut-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const latex = btn.dataset.latex;
      input.value = latex;
      _selectedShortcut = latex;
      grid.querySelectorAll('.shortcut-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      _renderPreview(latex, preview);
      // switch to latex tab so user sees preview
      tabs[0].click();
    });
  });

  // Insert
  insertBtn.addEventListener('click', () => {
    const latex = input.value.trim();
    if (!latex) return;
    if (_onInsert) _onInsert(latex);
    _closeModal(modal, input, preview);
  });

  // Cancel / close
  [cancelBtn, closeBtn].forEach(b => b.addEventListener('click', () => _closeModal(modal, input, preview)));
  modal.addEventListener('click', e => { if (e.target === modal) _closeModal(modal, input, preview); });

  // Keyboard shortcut
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      _closeModal(modal, input, preview);
    }
  });

  return {
    open: (mode = 'math') => _openModal(modal, input, preview, grid, mode)
  };
}

function _openModal(modal, input, preview, grid, mode) {
  _mode = mode;
  _selectedShortcut = null;
  input.value = '';
  preview.innerHTML = '';

  // Rebuild shortcut grid for chem mode
  if (mode === 'chem') {
    grid.innerHTML = CHEM_SHORTCUTS.map(s =>
      `<button class="shortcut-btn" data-latex="${s.latex}">${s.label}</button>`
    ).join('');
    grid.querySelectorAll('.shortcut-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const latex = btn.dataset.latex;
        input.value = latex;
        grid.querySelectorAll('.shortcut-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        _renderPreview(latex, preview);
        document.querySelectorAll('.formula-tab')[0].click();
      });
    });
    // Switch to shortcuts tab for chem
    document.querySelectorAll('.formula-tab')[1].click();
  } else {
    // restore math shortcuts
    grid.innerHTML = _mathShortcutsHTML();
    grid.querySelectorAll('.shortcut-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const latex = btn.dataset.latex;
        input.value = latex;
        grid.querySelectorAll('.shortcut-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        _renderPreview(latex, preview);
        document.querySelectorAll('.formula-tab')[0].click();
      });
    });
    document.querySelectorAll('.formula-tab')[0].click();
  }

  modal.classList.remove('hidden');
  setTimeout(() => input.focus(), 100);
}

function _closeModal(modal, input, preview) {
  modal.classList.add('hidden');
  input.value = '';
  preview.innerHTML = '';
}

function _renderPreview(latex, previewEl) {
  if (!latex.trim()) { previewEl.innerHTML = ''; return; }
  try {
    previewEl.innerHTML = katex.renderToString(latex, {
      throwOnError: false,
      displayMode: true,
    });
  } catch {
    previewEl.innerHTML = `<span style="color:#c0392b;font-size:0.8rem">Invalid formula</span>`;
  }
}

function _mathShortcutsHTML() {
  const shortcuts = [
    { label: 'a/b',    latex: '\\frac{a}{b}' },
    { label: 'x²',    latex: 'x^{2}' },
    { label: '√x',    latex: '\\sqrt{x}' },
    { label: 'π',     latex: '\\pi' },
    { label: 'θ',     latex: '\\theta' },
    { label: 'α',     latex: '\\alpha' },
    { label: 'β',     latex: '\\beta' },
    { label: 'Δ',     latex: '\\Delta' },
    { label: 'Σ',     latex: '\\sum_{i=1}^{n}' },
    { label: '∫',     latex: '\\int_{a}^{b}' },
    { label: '→A',    latex: '\\vec{A}' },
    { label: 'lim',   latex: '\\lim_{x \\to 0}' },
    { label: 'H₂O',   latex: 'H_2O' },
    { label: 'CO₂',   latex: 'CO_2' },
    { label: 'NaCl',  latex: 'NaCl' },
    { label: 'C₆H₁₂O₆', latex: 'C_6H_{12}O_6' },
  ];
  return shortcuts.map(s =>
    `<button class="shortcut-btn" data-latex="${s.latex}">${s.label}</button>`
  ).join('');
}
