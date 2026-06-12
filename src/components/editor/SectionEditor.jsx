import React from 'react';
import { usePaperDispatch } from '../../context/PaperContext';
import { ACTIONS } from '../../reducers/paperReducer';
import QuestionEditor from './QuestionEditor';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

export function SectionEditor({ section }) {
  const dispatch = usePaperDispatch();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleTitleChange = (e) => {
    dispatch({
      type: ACTIONS.UPDATE_SECTION,
      payload: { id: section.id, updates: { title: e.target.value } }
    });
  };

  const handleDelete = () => {
    dispatch({ type: ACTIONS.DELETE_SECTION, payload: { id: section.id } });
  };

  const handleAddQuestion = () => {
    dispatch({
      type: ACTIONS.ADD_QUESTION,
      payload: {
        sectionId: section.id,
        question: {
          type: 'subjective',
          text: '',
          marks: 1,
          options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
          answerKey: '',
          subParts: []
        }
      }
    });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = section.questions.findIndex((q) => q.id === active.id);
      const newIndex = section.questions.findIndex((q) => q.id === over.id);
      
      dispatch({
        type: ACTIONS.REORDER_QUESTIONS,
        payload: { sectionId: section.id, activeIndex: oldIndex, overIndex: newIndex }
      });
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="border border-[#fcd5d2] rounded-xl overflow-hidden mb-6 bg-white group/section">
      <div className="bg-gradient-to-br from-[#fdf2f2] to-[#fce8e7] px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 text-[#fca9a3] hover:text-crimson-500 opacity-0 group-hover/section:opacity-100 transition-opacity">
            <GripVertical size={18} />
          </div>
          <input 
            type="text" 
            value={section.title} 
            onChange={handleTitleChange}
            className="font-serif font-bold text-crimson-500 bg-transparent border border-transparent hover:border-[#fca9a3] focus:border-crimson-500 rounded px-2 py-1 outline-none transition-colors"
          />
        </div>
        <button 
          onClick={handleDelete}
          className="text-[#e57373] hover:text-crimson-500 hover:bg-[#fde8e8] px-2 py-1 rounded transition-colors text-sm"
        >
          Delete Section
        </button>
      </div>
      <div className="p-3 flex flex-col gap-3 bg-white">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <SortableContext 
            items={section.questions.map(q => q.id)}
            strategy={verticalListSortingStrategy}
          >
            {section.questions.map((question, idx) => (
              <QuestionEditor key={question.id} sectionId={section.id} question={question} index={idx} />
            ))}
          </SortableContext>
        </DndContext>
        
        <button 
          onClick={handleAddQuestion}
          className="w-full py-2 border-2 border-dashed border-[#86c49e] text-[#1a6b3c] rounded-lg text-sm font-medium hover:bg-[#f0faf4] hover:border-solid transition-all"
        >
          + Add Question
        </button>
      </div>
    </div>
  );
}
