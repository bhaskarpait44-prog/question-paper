/**
 * editor.js — Renders the structured question paper editor
 *             Syncs DOM changes back to state
 */

import katex from 'katex';
import {
  getState,
  updateHeader,
  updateInstructions,
  updateSection,
  deleteSection,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  addFormula,
  getGlobalNumbers,
  subscribe
} from '../utils/state.js';
import { debounce, sanitize } from '../utils/utils.js';
import { setActiveSection } from '../toolbar/toolbar.js';

let _container   = null;
let _mathModal   = null;   // { open: (mode) => void }
let _pendingFormulaTarget = null; // { sectionId, questionId }

export function initEditor(container, { mathModal }) {
  _container = container;
  _mathModal  = mathModal;

  // Subscribe to state changes and re-render
  subscribe(debounce(() => render(), 80));

  render();
}

/** Called by mathModal when user confirms a formula */
export function insertFormulaIntoQuestion(latex) {
  if (!_pendingFormulaTarget) return;
  const { sectionId, questionId } = _pendingFormulaTarget;
  const placeholder = addFormula(sectionId, questionId, latex);

  // Append placeholder text to the question text in state
  const state = getState();
  const sec = state.sections.find(s => s.id === sectionId);
  const q   = sec?.questions.find(q => q.id === questionId);
  if (q) {
    q.text = (q.text || '') + ' ' + placeholder;
    // state is already mutated; trigger re-render via subscribe
    import('../utils/state.js').then(m => m.subscribe && render());
    render();
  }
  _pendingFormulaTarget = null;
}

export function render() {
  if (!_container) return;
  const state   = getState();
  const numbers = getGlobalNumbers();

  _container.innerHTML = '';

  // 1 — Paper Header Fields
  _container.appendChild(_buildHeaderEditor(state.header));

  // 2 — Instructions
  _container.appendChild(_buildInstructionsBlock(state.instructions));

  // 3 — Sections
  for (const section of state.sections) {
    _container.appendChild(_buildSectionBlock(section, numbers));
  }

  // 4 — Empty-state hint
  if (state.sections.length === 0) {
    const hint = document.createElement('div');
    hint.className = 'text-center py-12 text-ink-300';
    hint.innerHTML = `
      <div style="font-size:3rem;margin-bottom:0.75rem">📄</div>
      <p style="font-size:0.875rem;font-weight:500">Your paper is empty</p>
      <p style="font-size:0.78rem;margin-top:0.25rem">Click <strong>+ Section</strong> in the toolbar to start building</p>
    `;
    _container.appendChild(hint);
  }
}

/* ─── Header Fields ─── */
function _buildHeaderEditor(header) {
  const wrap = document.createElement('div');
  wrap.className = 'paper-header-editor';
  wrap.innerHTML = `
    <h3>📋 Paper Header</h3>
    <div class="header-fields">
      <div class="field-group full">
        <label class="field-label">School / Institution Name</label>
        <input class="field-input" data-key="schoolName" value="${_esc(header.schoolName)}" placeholder="School name..." />
      </div>
      <div class="field-group full">
        <label class="field-label">Exam Name</label>
        <input class="field-input" data-key="examName" value="${_esc(header.examName)}" placeholder="Annual Exam 2024-25" />
      </div>
      <div class="field-group">
        <label class="field-label">Subject</label>
        <input class="field-input" data-key="subject" value="${_esc(header.subject)}" placeholder="Mathematics" />
      </div>
      <div class="field-group">
        <label class="field-label">Class / Grade</label>
        <input class="field-input" data-key="class" value="${_esc(header.class)}" placeholder="Class X" />
      </div>
      <div class="field-group">
        <label class="field-label">Time Allowed</label>
        <input class="field-input" data-key="time" value="${_esc(header.time)}" placeholder="3 Hours" />
      </div>
      <div class="field-group">
        <label class="field-label">Maximum Marks</label>
        <input class="field-input" data-key="maxMarks" value="${_esc(header.maxMarks)}" placeholder="80" />
      </div>
      <div class="field-group">
        <label class="field-label">Date</label>
        <input class="field-input" type="date" data-key="date" value="${_esc(header.date)}" />
      </div>
    </div>
  `;

  wrap.querySelectorAll('.field-input').forEach(input => {
    input.addEventListener('input', () => updateHeader(input.dataset.key, input.value));
  });

  return wrap;
}

/* ─── Instructions Block ─── */
function _buildInstructionsBlock(text) {
  const wrap = document.createElement('div');
  wrap.className = 'instructions-block';
  wrap.innerHTML = `
    <div class="block-header">
      <span>📌 General Instructions</span>
    </div>
    <div class="block-content"
         contenteditable="true"
         data-placeholder="Type instructions here (one per line)..."
         style="white-space:pre-wrap">${_esc(text)}</div>
  `;

  const content = wrap.querySelector('.block-content');
  content.addEventListener('input', debounce(() => {
    updateInstructions(content.innerText);
  }, 200));

  return wrap;
}

/* ─── Section Block ─── */
function _buildSectionBlock(section, numbers) {
  const wrap = document.createElement('div');
  wrap.className = 'section-block';
  wrap.dataset.sectionId = section.id;

  const header = document.createElement('div');
  header.className = 'section-header';
  header.innerHTML = `
    <span class="section-title">${_esc(section.title)}</span>
    <input class="section-title-input" value="${_esc(section.description)}" placeholder="Section description / instruction..." />
    <button class="section-delete-btn" title="Delete section">✕</button>
  `;

  // Update section title from letter (computed, not editable directly)
  // Update description
  const descInput = header.querySelector('.section-title-input');
  descInput.addEventListener('input', debounce(() => {
    updateSection(section.id, 'description', descInput.value);
  }, 200));

  // Delete section
  header.querySelector('.section-delete-btn').addEventListener('click', () => {
    if (confirm(`Delete ${section.title} and all its questions?`)) {
      deleteSection(section.id);
    }
  });

  // Questions container
  const qContainer = document.createElement('div');
  qContainer.className = 'section-questions';

  for (const q of section.questions) {
    qContainer.appendChild(_buildQuestionBlock(section.id, q, numbers[q.id]));
  }

  // Add question button
  const addBtn = document.createElement('button');
  addBtn.className = 'add-question-btn';
  addBtn.textContent = `+ Add Question to ${section.title}`;
  addBtn.addEventListener('click', () => {
    setActiveSection(section.id);
    addQuestion(section.id);
  });

  qContainer.appendChild(addBtn);

  // Track active section on focus within
  wrap.addEventListener('focusin', () => setActiveSection(section.id));

  wrap.appendChild(header);
  wrap.appendChild(qContainer);
  return wrap;
}

/* ─── Question Block ─── */
function _buildQuestionBlock(sectionId, q, number) {
  const wrap = document.createElement('div');
  wrap.className = 'question-block';
  wrap.dataset.questionId = q.id;

  // Question number
  const numEl = document.createElement('div');
  numEl.className = 'question-num';
  numEl.textContent = `Q${number}.`;

  // Body
  const body = document.createElement('div');
  body.className = 'question-body';

  // Question text (contenteditable)
  const textEl = document.createElement('div');
  textEl.className = 'question-text';
  textEl.contentEditable = 'true';
  textEl.dataset.placeholder = 'Type your question here...';

  // Render text with formulas
  textEl.innerHTML = _renderQuestionText(q.text, q.formulas);

  textEl.addEventListener('input', debounce(() => {
    // Extract plain text with placeholders preserved
    const raw = _extractTextWithPlaceholders(textEl, q.formulas);
    updateQuestion(sectionId, q.id, 'text', raw);
  }, 250));

  // Meta row (marks + formula btn)
  const meta = document.createElement('div');
  meta.className = 'question-meta';

  // Marks badge
  const marksBadge = document.createElement('div');
  marksBadge.className = 'marks-badge';
  marksBadge.innerHTML = `
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
    <select class="marks-select" title="Marks for this question">
      ${[1,2,3,4,5,6,8,10].map(m =>
        `<option value="${m}" ${q.marks === m ? 'selected' : ''}>${m} Mark${m > 1 ? 's' : ''}</option>`
      ).join('')}
    </select>
  `;
  marksBadge.querySelector('.marks-select').addEventListener('change', e => {
    updateQuestion(sectionId, q.id, 'marks', parseInt(e.target.value));
  });

  // Insert formula into THIS question
  const fmlBtn = document.createElement('button');
  fmlBtn.style.cssText = 'background:none;border:1px solid #c7d7fc;border-radius:4px;padding:2px 7px;font-size:0.7rem;color:#2563eb;cursor:pointer;';
  fmlBtn.innerHTML = '∑ Formula';
  fmlBtn.title = 'Insert formula into this question';
  fmlBtn.addEventListener('click', () => {
    _pendingFormulaTarget = { sectionId, questionId: q.id };
    if (_mathModal) _mathModal.open('math');
  });

  meta.appendChild(marksBadge);
  meta.appendChild(fmlBtn);

  body.appendChild(textEl);
  body.appendChild(meta);

  // Controls (delete)
  const controls = document.createElement('div');
  controls.className = 'question-controls';
  const delBtn = document.createElement('button');
  delBtn.className = 'q-btn delete';
  delBtn.title = 'Delete question';
  delBtn.innerHTML = '✕';
  delBtn.addEventListener('click', () => deleteQuestion(sectionId, q.id));
  controls.appendChild(delBtn);

  wrap.appendChild(numEl);
  wrap.appendChild(body);
  wrap.appendChild(controls);

  return wrap;
}

/* ─── Helpers ─── */

/**
 * Render question text — replace formula placeholders with KaTeX spans
 */
function _renderQuestionText(text, formulas = {}) {
  if (!text) return '';
  let html = _esc(text);

  for (const [placeholder, latex] of Object.entries(formulas)) {
    const escapedPH = placeholder.replace(/##/g, '##');
    try {
      const rendered = katex.renderToString(latex, { throwOnError: false, displayMode: false });
      const span = `<span class="formula-inline" data-placeholder="${placeholder}" data-latex="${_esc(latex)}" contenteditable="false">${rendered}</span>`;
      html = html.split(placeholder).join(span);
    } catch {
      html = html.split(placeholder).join(`<code>${latex}</code>`);
    }
  }

  return html;
}

/**
 * Extract text + formula placeholders from a contenteditable div
 * (preserves ##FORMULA_xxx## markers from formula spans)
 */
function _extractTextWithPlaceholders(el, formulas) {
  let result = '';
  for (const node of el.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      result += node.textContent;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const ph = node.dataset?.placeholder;
      if (ph && formulas[ph]) {
        result += ph; // keep the placeholder
      } else {
        result += node.innerText || node.textContent;
      }
    }
  }
  return result;
}

function _esc(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
