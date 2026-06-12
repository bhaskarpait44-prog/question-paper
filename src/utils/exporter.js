import html2pdf from 'html2pdf.js';

/**
 * Generates a PDF from the provided HTML element.
 * Applies specific print-styles like repeating headers and page-break avoidance.
 */
export const exportToPdf = (element, filename = 'question-paper.pdf') => {
  const opt = {
    margin: [10, 10, 10, 10], // top, left, bottom, right in mm
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, letterRendering: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  // Clone element to avoid modifying the live preview DOM
  const clone = element.cloneNode(true);
  
  // Ensure the clone is visible and has proper print sizing
  clone.style.width = '210mm'; // A4 width
  clone.style.padding = '15mm 20mm';
  clone.style.boxShadow = 'none';
  
  // Add a hidden container to the body for the clone
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  document.body.appendChild(container);
  container.appendChild(clone);

  return html2pdf().set(opt).from(clone).save().then(() => {
    document.body.removeChild(container);
  });
};

/**
 * Saves paper state as a JSON file.
 */
export const saveToJson = (data, filename = 'paper-draft.json') => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
