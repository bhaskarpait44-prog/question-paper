import { v4 as uuidv4 } from 'uuid';

export const INITIAL_STATE = {
  header: {
    schoolName: '',
    examName: '',
    subject: '',
    date: '',
    maxMarks: '',
    duration: '',
    layout: 'single'
  },
  instructions: '',
  sections: [
    {
      id: uuidv4(),
      title: 'Section A',
      description: '',
      questions: []
    }
  ]
};

// Actions
export const ACTIONS = {
  SET_STATE: 'SET_STATE',
  UPDATE_HEADER: 'UPDATE_HEADER',
  UPDATE_INSTRUCTIONS: 'UPDATE_INSTRUCTIONS',
  ADD_SECTION: 'ADD_SECTION',
  UPDATE_SECTION: 'UPDATE_SECTION',
  DELETE_SECTION: 'DELETE_SECTION',
  ADD_QUESTION: 'ADD_QUESTION',
  UPDATE_QUESTION: 'UPDATE_QUESTION',
  DELETE_QUESTION: 'DELETE_QUESTION',
  ADD_SUBPART: 'ADD_SUBPART',
  UPDATE_SUBPART: 'UPDATE_SUBPART',
  DELETE_SUBPART: 'DELETE_SUBPART',
  REORDER_SECTIONS: 'REORDER_SECTIONS',
  REORDER_QUESTIONS: 'REORDER_QUESTIONS',
  SET_LAYOUT: 'SET_LAYOUT',
  RESET_PAPER: 'RESET_PAPER',
  UNDO: 'UNDO',
  REDO: 'REDO',
};

export function paperReducer(state, action) {
  const { past, present, future } = state;

  const pushState = (newPresent) => ({
    past: [...past, present],
    present: newPresent,
    future: []
  });

  const calculateQuestionMarks = (question) => {
    if (question.subParts && question.subParts.length > 0) {
      return question.subParts.reduce((sum, sp) => sum + (Number(sp.marks) || 0), 0);
    }
    return question.marks;
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  switch (action.type) {
    case ACTIONS.SET_STATE:
      return {
        past: [],
        present: action.payload,
        future: []
      };

    case ACTIONS.UPDATE_HEADER:
      return pushState({
        ...present,
        header: { ...present.header, ...action.payload }
      });
      
    case ACTIONS.SET_LAYOUT:
      return pushState({
        ...present,
        header: { ...present.header, layout: action.payload }
      });

    case ACTIONS.UPDATE_INSTRUCTIONS:
      return pushState({
        ...present,
        instructions: action.payload
      });

    case ACTIONS.ADD_SECTION:
      return pushState({
        ...present,
        sections: [
          ...present.sections,
          { id: uuidv4(), title: 'New Section', description: '', questions: [] }
        ]
      });

    case ACTIONS.UPDATE_SECTION:
      return pushState({
        ...present,
        sections: present.sections.map(sec => 
          sec.id === action.payload.id ? { ...sec, ...action.payload.updates } : sec
        )
      });

    case ACTIONS.DELETE_SECTION:
      return pushState({
        ...present,
        sections: present.sections.filter(sec => sec.id !== action.payload.id)
      });

    case ACTIONS.REORDER_SECTIONS: {
      const { activeIndex, overIndex } = action.payload;
      return pushState({
        ...present,
        sections: reorder(present.sections, activeIndex, overIndex)
      });
    }

    case ACTIONS.ADD_QUESTION: {
      const { sectionId, question } = action.payload;
      return pushState({
        ...present,
        sections: present.sections.map(sec => {
          if (sec.id === sectionId) {
            return {
              ...sec,
              questions: [...sec.questions, { id: uuidv4(), image: null, ...question }]
            };
          }
          return sec;
        })
      });
    }

    case ACTIONS.UPDATE_QUESTION: {
      const { sectionId, questionId, updates } = action.payload;
      return pushState({
        ...present,
        sections: present.sections.map(sec => {
          if (sec.id === sectionId) {
            return {
              ...sec,
              questions: sec.questions.map(q => {
                if (q.id === questionId) {
                  const updatedQ = { ...q, ...updates };
                  updatedQ.marks = calculateQuestionMarks(updatedQ);
                  return updatedQ;
                }
                return q;
              })
            };
          }
          return sec;
        })
      });
    }

    case ACTIONS.DELETE_QUESTION: {
      const { sectionId, questionId } = action.payload;
      return pushState({
        ...present,
        sections: present.sections.map(sec => {
          if (sec.id === sectionId) {
            return {
              ...sec,
              questions: sec.questions.filter(q => q.id !== questionId)
            };
          }
          return sec;
        })
      });
    }

    case ACTIONS.REORDER_QUESTIONS: {
      const { sectionId, activeIndex, overIndex } = action.payload;
      return pushState({
        ...present,
        sections: present.sections.map(sec => {
          if (sec.id === sectionId) {
            return {
              ...sec,
              questions: reorder(sec.questions, activeIndex, overIndex)
            };
          }
          return sec;
        })
      });
    }

    case ACTIONS.ADD_SUBPART: {
      const { sectionId, questionId } = action.payload;
      return pushState({
        ...present,
        sections: present.sections.map(sec => {
          if (sec.id === sectionId) {
            return {
              ...sec,
              questions: sec.questions.map(q => {
                if (q.id === questionId) {
                  const newSubParts = [...(q.subParts || []), { id: uuidv4(), text: '', marks: 1 }];
                  return {
                    ...q,
                    subParts: newSubParts,
                    marks: newSubParts.reduce((sum, sp) => sum + sp.marks, 0)
                  };
                }
                return q;
              })
            };
          }
          return sec;
        })
      });
    }

    case ACTIONS.UPDATE_SUBPART: {
      const { sectionId, questionId, subPartId, updates } = action.payload;
      return pushState({
        ...present,
        sections: present.sections.map(sec => {
          if (sec.id === sectionId) {
            return {
              ...sec,
              questions: sec.questions.map(q => {
                if (q.id === questionId) {
                  const newSubParts = q.subParts.map(sp => 
                    sp.id === subPartId ? { ...sp, ...updates } : sp
                  );
                  return {
                    ...q,
                    subParts: newSubParts,
                    marks: newSubParts.reduce((sum, sp) => sum + (Number(sp.marks) || 0), 0)
                  };
                }
                return q;
              })
            };
          }
          return sec;
        })
      });
    }

    case ACTIONS.DELETE_SUBPART: {
      const { sectionId, questionId, subPartId } = action.payload;
      return pushState({
        ...present,
        sections: present.sections.map(sec => {
          if (sec.id === sectionId) {
            return {
              ...sec,
              questions: sec.questions.map(q => {
                if (q.id === questionId) {
                  const newSubParts = q.subParts.filter(sp => sp.id !== subPartId);
                  return {
                    ...q,
                    subParts: newSubParts,
                    marks: newSubParts.length > 0 
                      ? newSubParts.reduce((sum, sp) => sum + (Number(sp.marks) || 0), 0)
                      : q.marks // keep old marks if last subpart deleted? maybe reset to 1?
                  };
                }
                return q;
              })
            };
          }
          return sec;
        })
      });
    }

    case ACTIONS.RESET_PAPER:
      return pushState(INITIAL_STATE);

    case ACTIONS.UNDO: {
      if (past.length === 0) return state;
      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);
      return {
        past: newPast,
        present: previous,
        future: [present, ...future]
      };
    }

    case ACTIONS.REDO: {
      if (future.length === 0) return state;
      const next = future[0];
      const newFuture = future.slice(1);
      return {
        past: [...past, present],
        present: next,
        future: newFuture
      };
    }

    default:
      return state;
  }
}
