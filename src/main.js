/**
 * main.js — Application entry point
 *
 * Wires together: toolbar, editor, preview, math modal, export
 */

import './styles/main.css';

import { initToolbar }  from './toolbar/toolbar.js';
import { initEditor, insertFormulaIntoQuestion, render as renderEditor } from './editor/editor.js';
import { initPreview, render as renderPreview } from './preview/preview.js';
import { initMathModal } from './editor/mathModal.js';
import { exportToPDF, saveJSON, loadJSON } from './utils/exporter.js';
import { getState, subscribe, addSection, addQuestion } from './utils/state.js';
import { showToast } from './utils/utils.js';

/* ── 1. Math Modal ─────────────────────────────────────────── */
const mathModal = initMathModal({
  onInsert: (latex) => {
    insertFormulaIntoQuestion(latex);
  }
});

/* ── 2. Toolbar ─────────────────────────────────────────────── */
initToolbar(document.getElementById('toolbar-container'), {
  onMathInsert: (mode) => mathModal.open(mode)
});

/* ── 3. Editor ──────────────────────────────────────────────── */
initEditor(document.getElementById('editor-container'), {
  mathModal
});

/* ── 4. Preview ─────────────────────────────────────────────── */
initPreview(document.getElementById('preview-container'));

// Initial render of preview with default state
renderPreview(getState());

/* ── 5. Header action buttons ───────────────────────────────── */
document.getElementById('btn-export-pdf').addEventListener('click', exportToPDF);
document.getElementById('btn-save').addEventListener('click', saveJSON);
document.getElementById('btn-load').addEventListener('click', loadJSON);

/* ── 6. Panel resizer (drag divider) ────────────────────────── */
initResizer();

/* ── 7. Keyboard shortcuts ──────────────────────────────────── */
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    saveJSON();
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
    e.preventDefault();
    exportToPDF();
  }
});

/* ── 8. Show welcome toast ──────────────────────────────────── */
setTimeout(() => showToast('Welcome to PaperCraft! Add a section to begin.', '', 3500), 600);

/* ─── Panel Resizer ─────────────────────────────────────────── */
function initResizer() {
  const divider      = document.getElementById('panel-divider');
  const layout       = document.getElementById('main-layout');
  const editorPanel  = document.getElementById('editor-panel');
  const previewPanel = document.getElementById('preview-panel');

  let dragging = false;
  let startX   = 0;
  let startEdW = 0;

  divider.addEventListener('mousedown', (e) => {
    dragging = true;
    startX   = e.clientX;
    startEdW = editorPanel.getBoundingClientRect().width;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const totalW = layout.getBoundingClientRect().width - 10; // subtract divider
    const delta  = e.clientX - startX;
    let newEdW   = startEdW + delta;
    // clamp: editor min 30%, max 70%
    newEdW = Math.max(totalW * 0.3, Math.min(totalW * 0.7, newEdW));
    const ratio  = newEdW / totalW;
    editorPanel.style.flex  = `0 0 ${ratio * 100}%`;
    previewPanel.style.flex = `0 0 ${(1 - ratio) * 100}%`;
  });

  document.addEventListener('mouseup', () => {
    if (dragging) {
      dragging = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  });
}
