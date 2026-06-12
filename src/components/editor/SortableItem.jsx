import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

export function SortableItem({ id, children, handle = false }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      {!handle && (
        <div 
          {...attributes} 
          {...listeners} 
          className="absolute left-[-20px] top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing p-1 text-ink-300 hover:text-ink-500 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical size={16} />
        </div>
      )}
      {children}
    </div>
  );
}

export function SortableHandle({ id }) {
  const { attributes, listeners } = useSortable({ id });
  return (
    <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 text-ink-300 hover:text-ink-500">
      <GripVertical size={18} />
    </div>
  );
}
