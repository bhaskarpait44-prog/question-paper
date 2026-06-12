/**
 * exporter.js — PDF export and JSON save/load utilities
 */

import { getState, setState, resetState } from '../utils/state.js';
import { downloadFile, showToast } from '../utils/utils.js';

/**
 * Export the preview paper as PDF using the browser's print dialog
 * (html2pdf.js via CDN as fallback)
 */
export async function exportToPDF() {
  showToast('Preparing PDF…', '', 3000);

  const paperEl = document.getElementById('preview-paper');
  if (!paperEl) {
    showToast('Nothing to export yet', 'error');
    return;
  }

  // Dynamically load html2pdf from CDN (free, open-source)
  if (!window.html2pdf) {
    await _loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js');
  }

  const state    = getState();
  const filename = _buildFilename(state.header);

  const opt = {
    margin:       [10, 10, 10, 10],
    filename:     filename,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true, logging: false },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] },
  };

  try {
    await window.html2pdf().set(opt).from(paperEl).save();
    showToast('PDF exported!', 'success');
  } catch (err) {
    console.error(err);
    showToast('PDF export failed — try Print instead', 'error');
  }
}

/**
 * Save current state as a JSON file
 */
export function saveJSON() {
  const state    = getState();
  const json     = JSON.stringify(state, null, 2);
  const filename = _buildFilename(state.header).replace('.pdf', '.json');
  downloadFile(json, filename, 'application/json');
  showToast('Saved as JSON', 'success');
}

/**
 * Load state from a JSON file chosen by the user
 */
export function loadJSON() {
  const fileInput = document.getElementById('file-input');
  fileInput.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text  = await file.text();
      const data  = JSON.parse(text);
      // Basic validation
      if (!data.header || !Array.isArray(data.sections)) {
        throw new Error('Invalid paper JSON');
      }
      setState(data);
      showToast('Paper loaded!', 'success');
    } catch (err) {
      showToast('Could not load file: ' + err.message, 'error');
    }
    fileInput.value = '';
  };
  fileInput.click();
}

/* ─── Helpers ─── */
function _buildFilename(header) {
  const exam    = (header.examName || 'question-paper').toLowerCase().replace(/\s+/g, '-');
  const subject = (header.subject || '').toLowerCase().replace(/\s+/g, '-');
  const date    = header.date || new Date().toISOString().slice(0, 10);
  return `${exam}${subject ? '-' + subject : ''}-${date}.pdf`;
}

function _loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s   = document.createElement('script');
    s.src     = src;
    s.onload  = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}
