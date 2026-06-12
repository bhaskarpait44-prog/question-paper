/**
 * state.js — Centralized paper state (single source of truth)
 *
 * The paper is stored as structured JSON:
 * {
 *   header: { schoolName, examName, subject, class, time, maxMarks, date },
 *   instructions: string,
 *   sections: [
 *     {
 *       id: string,
 *       title: "Section A",
 *       description: string,
 *       questions: [
 *         {
 *           id: string,
 *           number: number,      // auto-computed
 *           text: string,        // may include formula markers
 *           marks: number,
 *           formulas: { [placeholder]: latexStr }
 *         }
 *       ]
 *     }
 *   ]
 * }
 */

import { uid } from './utils.js';

const defaultState = () => ({
  header: {
    schoolName: 'Springfield Public School',
    examName:   'Annual Examination 2024-25',
    subject:    'Mathematics',
    class:      'Class X',
    time:       '3 Hours',
    maxMarks:   '80',
    date:       ''
  },
  instructions: 'All questions are compulsory.\nUse of calculator is not permitted.\nDraw neat diagrams wherever necessary.',
  sections: []
});

let _state = defaultState();
let _listeners = [];

export function getState() {
  return _state;
}

export function setState(newState) {
  _state = newState;
  _notify();
}

export function updateHeader(key, value) {
  _state.header[key] = value;
  _notify();
}

export function updateInstructions(text) {
  _state.instructions = text;
  _notify();
}

export function addSection() {
  _state.sections.push({
    id:          uid(),
    title:       `Section ${String.fromCharCode(65 + _state.sections.length)}`,
    description: '',
    questions:   []
  });
  _notify();
}

export function updateSection(sectionId, key, value) {
  const sec = _state.sections.find(s => s.id === sectionId);
  if (sec) { sec[key] = value; _notify(); }
}

export function deleteSection(sectionId) {
  _state.sections = _state.sections.filter(s => s.id !== sectionId);
  _notify();
}

export function addQuestion(sectionId) {
  const sec = _state.sections.find(s => s.id === sectionId);
  if (!sec) return;
  sec.questions.push({
    id:       uid(),
    text:     '',
    marks:    1,
    formulas: {}
  });
  _notify();
}

export function updateQuestion(sectionId, questionId, key, value) {
  const sec = _state.sections.find(s => s.id === sectionId);
  if (!sec) return;
  const q = sec.questions.find(q => q.id === questionId);
  if (q) { q[key] = value; _notify(); }
}

export function deleteQuestion(sectionId, questionId) {
  const sec = _state.sections.find(s => s.id === sectionId);
  if (!sec) return;
  sec.questions = sec.questions.filter(q => q.id !== questionId);
  _notify();
}

export function addFormula(sectionId, questionId, latex) {
  const sec = _state.sections.find(s => s.id === sectionId);
  if (!sec) return null;
  const q = sec.questions.find(q => q.id === questionId);
  if (!q) return null;
  const placeholder = `##FORMULA_${uid()}##`;
  q.formulas[placeholder] = latex;
  _notify();
  return placeholder;
}

/**
 * Compute global question numbers across all sections
 */
export function getGlobalNumbers() {
  const map = {};
  let n = 1;
  for (const sec of _state.sections) {
    for (const q of sec.questions) {
      map[q.id] = n++;
    }
  }
  return map;
}

export function resetState() {
  _state = defaultState();
  _notify();
}

export function subscribe(fn) {
  _listeners.push(fn);
  return () => { _listeners = _listeners.filter(f => f !== fn); };
}

function _notify() {
  for (const fn of _listeners) fn(_state);
}
