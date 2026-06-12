import React from 'react';
import { usePaper, usePaperDispatch } from '../../context/PaperContext';
import { ACTIONS } from '../../reducers/paperReducer';
import { PaperHeaderEditor } from './PaperHeaderEditor';
import { InstructionsEditor } from './InstructionsEditor';
import { SectionEditor } from './SectionEditor';
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
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

export default function EditorPane() {
  const { present } = usePaper();
  const dispatch = usePaperDispatch();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = present.sections.findIndex((s) => s.id === active.id);
      const newIndex = present.sections.findIndex((s) => s.id === over.id);
      
      dispatch({
        type: ACTIONS.REORDER_SECTIONS,
        payload: { activeIndex: oldIndex, overIndex: newIndex }
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PaperHeaderEditor />
      <InstructionsEditor />

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext 
          items={present.sections.map(s => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {present.sections.map((section) => (
            <SectionEditor key={section.id} section={section} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
