/**
 * toolbar.js — Builds and manages the editor toolbar
 */

import { addSection, addQuestion, getState } from '../utils/state.js';
import { showToast } from '../utils/utils.js';

let _onMathInsert = null;   // callback: (latex) => void
let _activeSection = null;  // currently focused section id

export function setActiveSection(id) { _activeSection = id; }

export function initToolbar(container, { onMathInsert }) {
  _onMathInsert = onMathInsert;

  container.innerHTML = `
    <!-- Text Formatting -->
    <div class="toolbar-group">
      <button class="toolbar-btn" data-cmd="bold" title="Bold (Ctrl+B)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>
        <span>Bold</span>
      </button>
      <button class="toolbar-btn" data-cmd="italic" title="Italic (Ctrl+I)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
        <span>Italic</span>
      </button>
      <button class="toolbar-btn" data-cmd="underline" title="Underline (Ctrl+U)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>
        <span>Underline</span>
      </button>
    </div>

    <!-- Headings -->
    <div class="toolbar-group">
      <button class="toolbar-btn" data-cmd="formatBlock" data-value="H2" title="Heading 1">
        <b style="font-size:0.9rem">H1</b>
      </button>
      <button class="toolbar-btn" data-cmd="formatBlock" data-value="H3" title="Heading 2">
        <b style="font-size:0.8rem">H2</b>
      </button>
      <button class="toolbar-btn" data-cmd="removeFormat" title="Clear Formatting">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 7 7 17M8 7l9 9"/><path d="M4 20h7"/></svg>
        <span>Clear</span>
      </button>
    </div>

    <!-- Lists -->
    <div class="toolbar-group">
      <button class="toolbar-btn" data-cmd="insertUnorderedList" title="Bullet List">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3" cy="6" r="1.5" fill="currentColor" stroke="none"/><circle cx="3" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="3" cy="18" r="1.5" fill="currentColor" stroke="none"/></svg>
        <span>Bullets</span>
      </button>
      <button class="toolbar-btn" data-cmd="insertOrderedList" title="Numbered List">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>
        <span>Numbered</span>
      </button>
    </div>

    <!-- Structure -->
    <div class="toolbar-group">
      <button class="toolbar-btn section-btn" id="btn-add-section" title="Add Section">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="5" rx="1"/><rect x="3" y="11" width="18" height="5" rx="1"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="9" y1="21" x2="15" y2="21"/></svg>
        <span>+ Section</span>
      </button>
      <button class="toolbar-btn question-btn" id="btn-add-question" title="Add Question to active section">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <span>+ Question</span>
      </button>
    </div>

    <!-- Marks -->
    <div class="toolbar-group">
      <button class="toolbar-btn marks-btn" data-marks="1" title="1 Mark">1M</button>
      <button class="toolbar-btn marks-btn" data-marks="2" title="2 Marks">2M</button>
      <button class="toolbar-btn marks-btn" data-marks="3" title="3 Marks">3M</button>
      <button class="toolbar-btn marks-btn" data-marks="5" title="5 Marks">5M</button>
    </div>

    <!-- Math -->
    <div class="toolbar-group">
      <button class="toolbar-btn math-btn" id="btn-insert-formula" title="Insert Math Formula">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 7l4-4M4 7l4 4"/><path d="M9 17c.333-1.333 1.667-4 4-4s3.5 2 2.5 3.5S12 18 14 19.5s3 1.5 4 .5"/></svg>
        <span>∑ Formula</span>
      </button>
      <button class="toolbar-btn math-btn" id="btn-insert-chem" title="Insert Chemistry notation" style="font-style:normal">
        <span>⚗ Chem</span>
      </button>
    </div>
  `;

  _bindEvents(container);
}

function _bindEvents(container) {
  // Format commands (bold, italic etc.)
  container.querySelectorAll('[data-cmd]').forEach(btn => {
    btn.addEventListener('mousedown', e => {
      e.preventDefault(); // don't lose focus
      const cmd = btn.dataset.cmd;
      const val = btn.dataset.value || null;
      document.execCommand(cmd, false, val);
      _updateActiveStates(container);
    });
  });

  // Add Section
  container.querySelector('#btn-add-section').addEventListener('click', () => {
    addSection();
    showToast('Section added', 'success');
  });

  // Add Question to active section
  container.querySelector('#btn-add-question').addEventListener('click', () => {
    const state = getState();
    const targetId = _activeSection || (state.sections[state.sections.length - 1]?.id);
    if (!targetId) {
      showToast('Add a section first', 'error');
      return;
    }
    addQuestion(targetId);
  });

  // Marks buttons — set mark on the focused question
  container.querySelectorAll('[data-marks]').forEach(btn => {
    btn.addEventListener('click', () => {
      const marks = parseInt(btn.dataset.marks);
      const focused = document.querySelector('.question-block:focus-within');
      if (!focused) { showToast('Click a question first', ''); return; }
      const marksSelect = focused.querySelector('.marks-select');
      if (marksSelect) {
        marksSelect.value = marks;
        marksSelect.dispatchEvent(new Event('change'));
      }
    });
  });

  // Formula modal
  container.querySelector('#btn-insert-formula').addEventListener('click', () => {
    if (_onMathInsert) _onMathInsert('math');
  });

  // Chemistry modal (pre-fills common chem shortcuts)
  container.querySelector('#btn-insert-chem').addEventListener('click', () => {
    if (_onMathInsert) _onMathInsert('chem');
  });

  // Track bold/italic/underline active state on selection change
  document.addEventListener('selectionchange', () => _updateActiveStates(container));
}

function _updateActiveStates(container) {
  ['bold', 'italic', 'underline'].forEach(cmd => {
    const btn = container.querySelector(`[data-cmd="${cmd}"]`);
    if (btn) btn.classList.toggle('active', document.queryCommandState(cmd));
  });
}
