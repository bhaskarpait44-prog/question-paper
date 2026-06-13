import React, { useRef, useEffect } from 'react';
import { usePaperDispatch } from '../../context/PaperContext';
import { ACTIONS } from '../../reducers/paperReducer';
import { Trash2, GripVertical, Sigma, Image as ImageIcon, X } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MathTrigger } from '../../App';

export default function QuestionEditor({ sectionId, question, index }) {
  const dispatch = usePaperDispatch();
  const textRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Ref collections for dynamic items
  const subPartRefs = useRef({});
  const optionRefs = useRef({});

  const handleInsertMath = (targetRef) => {
    // If targetRef is a DOM element (from our ref collections), use it directly
    // Otherwise if it's a React ref object, use .current
    const element = targetRef && targetRef.current ? targetRef.current : targetRef;
    
    MathTrigger.trigger((latex, displayMode) => {
      if (element) {
        element.focus();
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const mathSpan = document.createElement('span');
          
          if (displayMode) {
            mathSpan.className = 'block my-4 bg-blue-50 text-blue-700 px-3 py-2 rounded border border-blue-200 font-mono text-sm text-center mx-auto clear-both';
            mathSpan.dataset.display = 'block';
          } else {
            mathSpan.className = 'inline-block bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200 font-mono text-xs mx-1';
            mathSpan.dataset.display = 'inline';
          }
          
          mathSpan.dataset.latex = latex;
          mathSpan.contentEditable = 'false';
          mathSpan.innerHTML = displayMode ? `\\[ ${latex} \\]` : `\\(${latex}\\)`;
          
          range.deleteContents();
          range.insertNode(mathSpan);
          
          // Add a space after for easier editing
          const textNode = document.createTextNode('\u00A0');
          mathSpan.after(textNode);
          
          // Move cursor after the space
          const newRange = document.createRange();
          newRange.setStartAfter(textNode);
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);
          
          // Trigger blur logic to save
          if (element === textRef.current) {
            handleTextBlur();
          } else {
            // Force a synthetic blur event or manual update if needed
            element.dispatchEvent(new Event('blur', { bubbles: true }));
          }
        }
      }
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateQuestion({ image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  // Sync content editable changes
  useEffect(() => {
    if (textRef.current && textRef.current.innerHTML !== question.text) {
      textRef.current.innerHTML = question.text || '';
    }
  }, [question.text]);

  const updateQuestion = (updates) => {
    dispatch({
      type: ACTIONS.UPDATE_QUESTION,
      payload: { sectionId, questionId: question.id, updates }
    });
  };

  const handleTextBlur = () => {
    if (textRef.current) {
      const html = textRef.current.innerHTML;
      if (html !== question.text) {
        updateQuestion({ text: html });
      }
    }
  };

  const handleTypeChange = (e) => {
    updateQuestion({ type: e.target.value });
  };

  const handleMarksChange = (e) => {
    updateQuestion({ marks: Number(e.target.value) });
  };

  const handleDelete = () => {
    dispatch({ type: ACTIONS.DELETE_QUESTION, payload: { sectionId, questionId: question.id } });
  };

  const updateOption = (optIndex, newValue) => {
    const newOptions = [...question.options];
    newOptions[optIndex] = newValue;
    updateQuestion({ options: newOptions });
  };

  const addOption = () => {
    if (question.options.length < 6) {
      updateQuestion({ options: [...question.options, `Option ${question.options.length + 1}`] });
    }
  };

  const removeOption = (optIndex) => {
    if (question.options.length > 2) {
      const newOptions = question.options.filter((_, idx) => idx !== optIndex);
      updateQuestion({ options: newOptions });
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="flex gap-3 items-start bg-white border border-ink-200 rounded-lg p-3 focus-within:border-[#86c49e] focus-within:ring-2 focus-within:ring-[#86c49e]/20 transition-all group/question">
      <div {...attributes} {...listeners} className="pt-1 text-ink-200 hover:text-ink-400 cursor-grab active:cursor-grabbing opacity-0 group-hover/question:opacity-100 transition-opacity">
        <GripVertical size={16} />
      </div>
      <div className="font-serif font-bold text-sm text-[#1a6b3c] min-w-[24px] pt-1">
        Q{index + 1}.
      </div>
      
      <div className="flex-1 flex flex-col gap-3">
        {/* Top Controls: Type & Marks */}
        <div className="flex items-center gap-3 bg-ink-50 px-2 py-1.5 rounded border border-ink-100">
          <select 
            value={question.type} 
            onChange={handleTypeChange}
            className="bg-transparent text-xs font-semibold text-ink-700 outline-none cursor-pointer"
          >
            <option value="subjective">Subjective</option>
            <option value="mcq">Multiple Choice (MCQ)</option>
            <option value="true_false">True / False</option>
            <option value="fill_blank">Fill in the Blanks</option>
          </select>

          <div className="w-px h-4 bg-ink-200"></div>

          <div className="flex items-center gap-1">
            <span className="text-xs text-ink-500 font-medium">Marks:</span>
            <input 
              type="number" 
              min="1" 
              max="100"
              value={question.marks}
              onChange={handleMarksChange}
              disabled={question.subParts && question.subParts.length > 0}
              className={`w-12 text-xs font-semibold text-purple-600 bg-purple-50 border border-purple-200 rounded px-1.5 py-0.5 outline-none focus:border-purple-400 ${question.subParts?.length > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={question.subParts?.length > 0 ? "Sum of sub-parts" : ""}
            />
          </div>
        </div>

        {/* Question Text */}
        <div 
          ref={textRef}
          contentEditable
          onBlur={handleTextBlur}
          data-placeholder="Type your question here..."
          className="text-sm leading-relaxed text-ink-900 outline-none min-h-[24px] border-b border-dashed border-ink-200 pb-1 focus:border-[#1a6b3c] empty:before:content-[attr(data-placeholder)] empty:before:text-ink-300"
        />

        {/* Image Preview */}
        {question.image && (
          <div className="relative inline-block mt-2">
            <img src={question.image} alt="Question diagram" className="max-h-48 rounded border border-ink-200 shadow-sm" />
            <button 
              onClick={() => updateQuestion({ image: null })}
              className="absolute -top-2 -right-2 bg-crimson-500 text-white rounded-full p-1 shadow-md hover:bg-crimson-600 transition-colors"
            >
              <X size={12} />
            </button>
          </div>
        )}

        {/* Sub-parts Section */}
        <div className="flex flex-col gap-2">
          {question.subParts && question.subParts.map((sp, spIdx) => (
            <div key={sp.id} className="flex gap-2 items-start pl-4 group/subpart">
              <span className="text-xs font-bold text-ink-500 pt-1.5">({String.fromCharCode(97 + spIdx)})</span>
              <div className="flex-1 flex flex-col gap-1 relative">
                <div 
                  ref={el => subPartRefs.current[sp.id] = el}
                  contentEditable
                  onBlur={(e) => {
                    const html = e.target.innerHTML;
                    if (html !== sp.text) {
                      dispatch({
                        type: ACTIONS.UPDATE_SUBPART,
                        payload: { sectionId, questionId: question.id, subPartId: sp.id, updates: { text: html } }
                      });
                    }
                  }}
                  dangerouslySetInnerHTML={{ __html: sp.text || '' }}
                  data-placeholder="Sub-part text..."
                  className="text-xs leading-relaxed text-ink-800 outline-none min-h-[20px] border-b border-ink-100 focus:border-[#1a6b3c] empty:before:content-[attr(data-placeholder)] empty:before:text-ink-300"
                />
                <button 
                  onClick={() => handleInsertMath(subPartRefs.current[sp.id])}
                  className="absolute right-0 bottom-1 p-0.5 text-ink-200 hover:text-blue-500 opacity-0 group-focus-within/subpart:opacity-100 transition-opacity"
                  title="Insert Math"
                >
                  <Sigma size={10} />
                </button>
              </div>
              <input 
                type="number"
                min="0.5"
                step="0.5"
                value={sp.marks}
                onChange={(e) => dispatch({
                  type: ACTIONS.UPDATE_SUBPART,
                  payload: { sectionId, questionId: question.id, subPartId: sp.id, updates: { marks: Number(e.target.value) } }
                })}
                className="w-10 text-[10px] font-bold text-purple-600 bg-purple-50 border border-purple-100 rounded px-1 py-0.5 outline-none"
              />
              <button 
                onClick={() => dispatch({ type: ACTIONS.DELETE_SUBPART, payload: { sectionId, questionId: question.id, subPartId: sp.id } })}
                className="text-ink-200 hover:text-crimson-500 p-1 opacity-0 group-hover/subpart:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          ))}
          <button 
            onClick={() => dispatch({ type: ACTIONS.ADD_SUBPART, payload: { sectionId, questionId: question.id } })}
            className="self-start text-[10px] text-[#1a6b3c] font-bold uppercase tracking-wider hover:bg-[#f0faf4] px-2 py-1 rounded transition-colors"
          >
            + Add Sub-part
          </button>
        </div>

        {/* Dynamic Fields based on Type */}
        {question.type === 'mcq' && (
          <div className="flex flex-col gap-2 pl-2 border-l-2 border-ink-100">
            {question.options.map((opt, optIdx) => (
              <div key={optIdx} className="flex items-center gap-2 group/option">
                <input 
                  type="radio"
                  name={`answer-${question.id}`}
                  checked={question.answerKey === String(optIdx)}
                  onChange={() => updateQuestion({ answerKey: String(optIdx) })}
                  className="accent-[#1a6b3c]"
                  title="Mark as correct answer"
                />
                <span className="text-xs font-bold text-ink-400 w-5">{String.fromCharCode(65 + optIdx)}.</span>
                <div className="flex-1 relative">
                  <div 
                    ref={el => optionRefs.current[optIdx] = el}
                    contentEditable
                    onBlur={(e) => {
                      const html = e.target.innerHTML;
                      if (html !== opt) {
                        updateOption(optIdx, html);
                      }
                    }}
                    dangerouslySetInnerHTML={{ __html: opt || '' }}
                    className="text-sm border border-ink-200 rounded px-2 py-1 outline-none focus:border-[#1a6b3c] bg-white min-h-[30px]"
                  />
                  <button 
                    onClick={() => handleInsertMath(optionRefs.current[optIdx])}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-ink-200 hover:text-blue-500 opacity-0 group-focus-within/option:opacity-100 transition-opacity"
                    title="Insert Math"
                  >
                    <Sigma size={12} />
                  </button>
                </div>
                <button 
                  onClick={() => removeOption(optIdx)}
                  disabled={question.options.length <= 2}
                  className="text-ink-300 hover:text-crimson-500 disabled:opacity-30 p-1"
                >
                  ✕
                </button>
              </div>
            ))}
            {question.options.length < 6 && (
              <button 
                onClick={addOption}
                className="self-start text-xs text-[#1a6b3c] font-semibold hover:underline mt-1 ml-6"
              >
                + Add Option
              </button>
            )}
          </div>
        )}
        
        {question.type === 'true_false' && (
          <div className="flex items-center gap-4 pl-2 border-l-2 border-ink-100 mt-1">
            <span className="text-xs font-semibold text-ink-500">Correct Answer:</span>
            <label className="flex items-center gap-1.5 text-sm text-ink-700 cursor-pointer">
              <input 
                type="radio" 
                name={`answer-${question.id}`} 
                checked={question.answerKey === 'true'} 
                onChange={() => updateQuestion({ answerKey: 'true' })}
                className="accent-[#1a6b3c]"
              />
              True
            </label>
            <label className="flex items-center gap-1.5 text-sm text-ink-700 cursor-pointer">
              <input 
                type="radio" 
                name={`answer-${question.id}`} 
                checked={question.answerKey === 'false'} 
                onChange={() => updateQuestion({ answerKey: 'false' })}
                className="accent-[#1a6b3c]"
              />
              False
            </label>
          </div>
        )}

        {question.type === 'fill_blank' && (
          <div className="flex items-center gap-2 pl-2 border-l-2 border-ink-100 mt-1">
            <span className="text-xs font-semibold text-ink-500">Correct Answer:</span>
            <input 
              type="text"
              value={question.answerKey || ''}
              onChange={(e) => updateQuestion({ answerKey: e.target.value })}
              placeholder="Expected answer..."
              className="flex-1 text-sm border border-ink-200 rounded px-2 py-1 outline-none focus:border-[#1a6b3c]"
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 pt-1">
        <button 
          onClick={() => handleInsertMath(textRef)}
          className="p-1.5 text-ink-300 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
          title="Insert Math Formula"
        >
          <Sigma size={16} />
        </button>
        <button 
          onClick={() => fileInputRef.current.click()}
          className="p-1.5 text-ink-300 hover:text-gold-500 hover:bg-gold-50 rounded transition-colors"
          title="Insert Image"
        >
          <ImageIcon size={16} />
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleImageUpload} 
          accept="image/*" 
          className="hidden" 
        />
        <button 
          onClick={handleDelete}
          className="p-1.5 text-ink-300 hover:text-crimson-500 hover:bg-[#fde8e8] rounded transition-colors"
          title="Delete Question"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
