/**
 * preview.js — Live preview panel: renders the state as a formatted exam paper
 */

import katex from 'katex';
import { subscribe, getGlobalNumbers } from '../utils/state.js';
import { debounce } from '../utils/utils.js';

let _container = null;

export function initPreview(container) {
  _container = container;
  subscribe(debounce(state => render(state), 120));
}

export function render(state) {
  if (!_container || !state) return;

  const { header, instructions, sections } = state;
  const numbers = getGlobalNumbers();

  const paper = document.createElement('div');
  paper.className = 'preview-paper';
  paper.id = 'preview-paper';

  // ── School Name
  if (header.schoolName) {
    const el = document.createElement('div');
    el.className = 'preview-school-name';
    el.textContent = header.schoolName;
    paper.appendChild(el);
  }

  // ── Exam Name
  if (header.examName) {
    const el = document.createElement('div');
    el.className = 'preview-exam-name';
    el.textContent = header.examName;
    paper.appendChild(el);
  }

  // ── Subject & Class
  const subLine = [header.subject, header.class].filter(Boolean).join(' | ');
  if (subLine) {
    const el = document.createElement('div');
    el.className = 'preview-subject';
    el.textContent = subLine;
    paper.appendChild(el);
  }

  // ── Meta row (time + date + marks)
  const metaLeft  = [header.time && `Time: ${header.time}`, header.date && `Date: ${_formatDate(header.date)}`].filter(Boolean).join('   ');
  const metaRight = header.maxMarks ? `Max. Marks: ${header.maxMarks}` : '';

  if (metaLeft || metaRight) {
    const row = document.createElement('div');
    row.className = 'preview-meta-row';
    row.innerHTML = `<span>${metaLeft}</span><span>${metaRight}</span>`;
    paper.appendChild(row);
  }

  // ── Instructions
  if (instructions && instructions.trim()) {
    const block = document.createElement('div');
    block.className = 'preview-instructions';
    block.innerHTML = `
      <div class="preview-instructions-title">General Instructions</div>
      <div class="preview-instructions-text">${_formatInstructions(instructions)}</div>
    `;
    paper.appendChild(block);
  }

  // ── Sections
  if (sections.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'preview-empty';
    empty.innerHTML = `<span style="font-size:2rem">📄</span><br>Start adding sections and questions in the editor`;
    paper.appendChild(empty);
  }

  for (const section of sections) {
    // Section header
    const secHeader = document.createElement('div');
    secHeader.className = 'preview-section-header';
    secHeader.innerHTML = `
      <span>${_esc(section.title)}</span>
      ${section.description ? `<span class="preview-section-desc">${_esc(section.description)}</span>` : ''}
    `;
    paper.appendChild(secHeader);

    // Questions
    for (const q of section.questions) {
      const qEl = document.createElement('div');
      qEl.className = 'preview-question';

      const num = numbers[q.id] || '?';
      qEl.innerHTML = `
        <div class="preview-q-num">${num}.</div>
        <div class="preview-q-body">
          <div class="preview-q-text">
            <span class="preview-q-marks">${q.marks} M</span>
            ${_renderQuestionText(q.text, q.formulas)}
          </div>
        </div>
      `;
      paper.appendChild(qEl);
    }
  }

  // ── Signature line at bottom
  if (sections.length > 0) {
    const sig = document.createElement('div');
    sig.style.cssText = 'border-top:1px solid #d9d3c7;margin-top:2rem;padding-top:0.75rem;display:flex;justify-content:space-between;font-size:0.72rem;color:#a39282;';
    sig.innerHTML = `<span>*** End of Paper ***</span><span>Total Marks: ${_totalMarks(sections)}</span>`;
    paper.appendChild(sig);
  }

  _container.innerHTML = '';
  _container.appendChild(paper);
}

/* ─── Helpers ─── */

function _renderQuestionText(text, formulas = {}) {
  if (!text) return '<span style="color:#bfb5a4;font-style:italic">No question text</span>';

  let result = _esc(text);

  for (const [placeholder, latex] of Object.entries(formulas)) {
    try {
      const rendered = katex.renderToString(latex, { throwOnError: false, displayMode: false });
      result = result.split(placeholder).join(rendered);
    } catch {
      result = result.split(placeholder).join(`<code>${latex}</code>`);
    }
  }

  return result;
}

function _formatInstructions(text) {
  return text
    .split('\n')
    .filter(l => l.trim())
    .map((line, i) => `<div style="margin-bottom:2px">${i + 1}. ${_esc(line.trim())}</div>`)
    .join('');
}

function _totalMarks(sections) {
  return sections.reduce((sum, sec) =>
    sum + sec.questions.reduce((s, q) => s + (q.marks || 0), 0), 0);
}

function _formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  } catch { return dateStr; }
}

function _esc(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
