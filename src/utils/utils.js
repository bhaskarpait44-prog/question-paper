/**
 * utils.js — Shared utility functions for the Question Paper Editor
 */

/**
 * Generate a unique ID string
 */
export function uid() {
  return Math.random().toString(36).slice(2, 9);
}

/**
 * Convert a section index (0,1,2…) to letter (A,B,C…)
 */
export function sectionLetter(index) {
  return String.fromCharCode(65 + index);
}

/**
 * Show a toast notification
 * @param {string} message
 * @param {'success'|'error'|''} type
 * @param {number} duration ms
 */
export function showToast(message, type = '', duration = 2500) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast${type ? ' ' + type : ''}`;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), duration);
}

/**
 * Download a string as a file
 */
export function downloadFile(content, filename, mime = 'application/json') {
  const blob = new Blob([content], { type: mime });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Deep-clone an object (JSON safe)
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Sanitize HTML to prevent XSS (basic – strips script tags)
 */
export function sanitize(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, '');
}

/**
 * Debounce – returns a debounced version of fn
 */
export function debounce(fn, delay = 150) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}
