import React from 'react';
import { usePaper } from '../../context/PaperContext';
import katex from 'katex';

/**
 * Helper to render math inside an HTML string.
 * It looks for <span data-latex="...">...</span> and replaces it with rendered KaTeX.
 */
const renderRichText = (html) => {
  if (!html) return { __html: '...' };

  // Simple approach: use a temporary div to parse and replace
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const mathSpans = doc.querySelectorAll('span[data-latex]');
  
  mathSpans.forEach(span => {
    const latex = span.getAttribute('data-latex');
    try {
      span.innerHTML = katex.renderToString(latex, {
        throwOnError: false,
        displayMode: false
      });
      // Remove editor styling
      span.className = 'inline-block mx-1';
    } catch (e) {
      console.error(e);
    }
  });

  return { __html: doc.body.innerHTML };
};

export default function PreviewPane() {
  const { present } = usePaper();
  const { header, instructions, sections } = present;

  return (
    <div id="paper-preview-content" className="bg-white max-w-[700px] mx-auto py-12 px-14 shadow-lg min-h-[900px] rounded-sm relative">
      {/* Top Gradient Border */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-crimson-500 to-gold-500 print:hidden"></div>

      {/* Header */}
      <div className="mb-4 print:mt-4">
        <h1 className="text-center font-serif text-2xl font-bold text-ink-950 tracking-tight mb-1">
          {header.schoolName || 'School Name'}
        </h1>
        <h2 className="text-center text-lg font-semibold text-crimson-500 mb-2">
          {header.examName || 'Examination Name'}
        </h2>
        <div className="text-center text-sm text-ink-700 mb-4">
          {header.subject || 'Subject'}
        </div>
        <div className="flex justify-between text-xs text-ink-700 border-t-2 border-ink-950 border-b border-ink-200 py-1.5">
          <span>Date: {header.date || '___'}</span>
          <span>Max Marks: {header.maxMarks || '___'}</span>
          <span>Time: {header.duration || '___'}</span>
        </div>
      </div>

      {/* Instructions */}
      {instructions && (
        <div className="bg-[#fdf9f0] border-l-4 border-gold-500 px-4 py-3 mb-6 rounded-r print:bg-white print:border-ink-200">
          <div className="text-[0.7rem] font-bold tracking-widest uppercase text-gold-500 mb-1 print:text-ink-700">
            General Instructions:
          </div>
          <div 
            className="text-sm leading-relaxed text-ink-700 whitespace-pre-wrap"
            dangerouslySetInnerHTML={renderRichText(instructions)}
          />
        </div>
      )}

      {/* Sections */}
      {sections.map((section, idx) => (
        <div key={section.id} className="mb-8 print:break-inside-avoid">
          <h3 className="font-serif text-base font-bold text-crimson-500 border-b-[1.5px] border-crimson-500 pb-1 mb-3 print:text-ink-900 print:border-ink-900">
            {section.title}
          </h3>
          {section.questions.length === 0 ? (
            <div className="text-center text-ink-300 text-sm py-4 italic">No questions added yet.</div>
          ) : (
            <div className="space-y-4">
              {section.questions.map((q, qIdx) => (
                <div key={q.id} className="flex gap-3 text-sm break-inside-avoid">
                  <span className="font-serif font-bold text-ink-950 min-w-[24px]">
                    {qIdx + 1}.
                  </span>
                  <div className="flex-1">
                    <div dangerouslySetInnerHTML={renderRichText(q.text)} />
                    
                    {/* Sub-parts */}
                    {q.subParts && q.subParts.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {q.subParts.map((sp, spIdx) => (
                          <div key={sp.id} className="flex gap-2 break-inside-avoid">
                            <span className="font-bold text-ink-900">({String.fromCharCode(97 + spIdx)})</span>
                            <div className="flex-1" dangerouslySetInnerHTML={renderRichText(sp.text)} />
                            <span className="text-[10px] text-purple-600 font-bold self-start mt-1 print:text-ink-700">[{sp.marks}]</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {q.type === 'mcq' && q.options && (
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {q.options.map((opt, optIdx) => (
                          <div key={optIdx} className="flex gap-2">
                            <span className="font-semibold text-ink-900">({String.fromCharCode(97 + optIdx)})</span>
                            <span>{opt}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {q.type === 'true_false' && (
                      <div className="mt-2 flex gap-6">
                        <span className="font-semibold text-ink-900">(a) True</span>
                        <span className="font-semibold text-ink-900">(b) False</span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-purple-600 font-semibold bg-purple-50 border border-purple-200 rounded-full px-2 py-0.5 self-start whitespace-nowrap ml-2 print:bg-white print:border-ink-200 print:text-ink-900">
                    {q.marks} {q.marks === 1 ? 'mark' : 'marks'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
