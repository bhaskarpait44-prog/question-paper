import katex from 'katex';
import 'katex/dist/katex.min.css';
import 'katex/dist/contrib/mhchem.js';

/**
 * Shared utility for rendering math with consistent options.
 */
export const renderMath = (formula, options = {}) => {
  const defaultOptions = {
    throwOnError: false,
    trust: true,
    displayMode: false,
  };

  try {
    return katex.renderToString(formula, { ...defaultOptions, ...options });
  } catch (err) {
    console.error('KaTeX rendering error:', err);
    return formula;
  }
};

/**
 * Helper to render math inside an HTML string for the preview.
 * It looks for <span data-latex="...">...</span> and replaces it with rendered KaTeX.
 */
export const renderRichTextWithMath = (html) => {
  if (!html) return { __html: '...' };

  const doc = new DOMParser().parseFromString(html, 'text/html');
  const mathSpans = doc.querySelectorAll('span[data-latex]');
  
  mathSpans.forEach(span => {
    const latex = span.getAttribute('data-latex');
    const displayMode = span.getAttribute('data-display') === 'block';
    
    try {
      span.innerHTML = renderMath(latex, { displayMode });
      
      if (displayMode) {
        span.className = 'block my-4 text-center';
      } else {
        span.className = 'inline-block mx-1';
      }
    } catch (e) {
      console.error(e);
    }
  });

  return { __html: doc.body.innerHTML };
};
