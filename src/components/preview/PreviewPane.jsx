import React from 'react';
import { usePaper } from '../../context/PaperContext';
import { renderRichTextWithMath } from '../../utils/mathRender';

export default function PreviewPane() {
  const { present } = usePaper();
  const header = present?.header || {};
  const instructions = present?.instructions || '';
  const sections = present?.sections || [];
  const isTwoColumn = header.layout === 'two-column';

  return (
    <div 
      id="paper-preview-content" 
      className={`bg-white mx-auto py-12 px-14 shadow-lg min-h-[900px] rounded-sm relative transition-all ${isTwoColumn ? 'max-w-[900px] text-[13px]' : 'max-w-[700px] text-sm'}`}
    >
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
            className="leading-relaxed text-ink-700 whitespace-pre-wrap"
            dangerouslySetInnerHTML={renderRichTextWithMath(instructions)}
          />
        </div>
      )}

      {/* Sections & Questions Container */}
      <div className={isTwoColumn ? 'columns-2 gap-8 border-t border-ink-100 pt-4' : ''}>
        {sections.map((section, idx) => (
          <div key={section.id} className="mb-8 break-inside-avoid">
            <h3 className="font-serif text-base font-bold text-crimson-500 border-b-[1.5px] border-crimson-500 pb-1 mb-3 print:text-ink-900 print:border-ink-900">
              {section.title}
            </h3>
            {section.questions.length === 0 ? (
              <div className="text-center text-ink-300 text-sm py-4 italic">No questions added yet.</div>
            ) : (
              <div className="space-y-4">
                {section.questions.map((q, qIdx) => (
                  <div key={q.id} className="flex gap-3 break-inside-avoid">
                    <span className="font-serif font-bold text-ink-950 min-w-[20px]">
                      {qIdx + 1}.
                    </span>
                    <div className="flex-1">
                      <div dangerouslySetInnerHTML={renderRichTextWithMath(q.text)} />
                      
                      {/* Image rendering */}
                      {q.image && (
                        <div className="mt-3 mb-2">
                          <img src={q.image} alt="" className="max-w-full rounded border border-ink-100" />
                        </div>
                      )}

                      {/* Sub-parts */}
                      {q.subParts && q.subParts.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {q.subParts.map((sp, spIdx) => (
                            <div key={sp.id} className="flex gap-2 break-inside-avoid">
                              <span className="font-bold text-ink-900">({String.fromCharCode(97 + spIdx)})</span>
                              <div className="flex-1" dangerouslySetInnerHTML={renderRichTextWithMath(sp.text)} />
                              <span className="text-[10px] text-purple-600 font-bold self-start mt-1 print:text-ink-700">[{sp.marks}]</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {q.type === 'mcq' && q.options && (
                        <div className={`mt-2 grid gap-2 ${isTwoColumn ? 'grid-cols-1' : 'grid-cols-2'}`}>
                          {q.options.map((opt, optIdx) => (
                            <div key={optIdx} className="flex gap-2">
                              <span className="font-semibold text-ink-900">({String.fromCharCode(97 + optIdx)})</span>
                              <div dangerouslySetInnerHTML={renderRichTextWithMath(opt)} />
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
                    <span className="text-xs text-purple-600 font-semibold bg-purple-50 border border-purple-200 rounded-full px-2 py-0.5 self-start whitespace-nowrap ml-1 print:bg-white print:border-ink-200 print:text-ink-900">
                      {q.marks} {q.marks === 1 ? 'm' : 'm'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
