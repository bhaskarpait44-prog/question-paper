import React from 'react';
import { usePaperDispatch, usePaper } from '../../context/PaperContext';
import { ACTIONS } from '../../reducers/paperReducer';

export function PaperHeaderEditor() {
  const { present } = usePaper();
  const dispatch = usePaperDispatch();
  const { header } = present;

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch({
      type: ACTIONS.UPDATE_HEADER,
      payload: { [name]: value }
    });
  };

  return (
    <div className="bg-ink-50 border border-ink-200 rounded-xl p-5">
      <h3 className="font-serif text-sm tracking-widest uppercase text-crimson-500 mb-4">Paper Details</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 flex flex-col gap-1">
          <label className="text-[0.7rem] font-semibold uppercase tracking-wider text-ink-500">School Name</label>
          <input 
            type="text" name="schoolName" value={header.schoolName} onChange={handleChange}
            className="px-3 py-2 border border-ink-200 rounded-md text-sm outline-none focus:border-crimson-500 transition-colors"
            placeholder="e.g. Springfield High School"
          />
        </div>
        <div className="col-span-2 flex flex-col gap-1">
          <label className="text-[0.7rem] font-semibold uppercase tracking-wider text-ink-500">Examination Name</label>
          <input 
            type="text" name="examName" value={header.examName} onChange={handleChange}
            className="px-3 py-2 border border-ink-200 rounded-md text-sm outline-none focus:border-crimson-500 transition-colors"
            placeholder="e.g. Mid-Term Examination 2023-24"
          />
        </div>
        <div className="col-span-2 sm:col-span-1 flex flex-col gap-1">
          <label className="text-[0.7rem] font-semibold uppercase tracking-wider text-ink-500">Subject</label>
          <input 
            type="text" name="subject" value={header.subject} onChange={handleChange}
            className="px-3 py-2 border border-ink-200 rounded-md text-sm outline-none focus:border-crimson-500 transition-colors"
            placeholder="e.g. Mathematics"
          />
        </div>
        <div className="col-span-2 sm:col-span-1 flex flex-col gap-1">
          <label className="text-[0.7rem] font-semibold uppercase tracking-wider text-ink-500">Date</label>
          <input 
            type="text" name="date" value={header.date} onChange={handleChange}
            className="px-3 py-2 border border-ink-200 rounded-md text-sm outline-none focus:border-crimson-500 transition-colors"
            placeholder="e.g. 15 Oct 2023"
          />
        </div>
        <div className="col-span-2 sm:col-span-1 flex flex-col gap-1">
          <label className="text-[0.7rem] font-semibold uppercase tracking-wider text-ink-500">Max Marks</label>
          <input 
            type="text" name="maxMarks" value={header.maxMarks} onChange={handleChange}
            className="px-3 py-2 border border-ink-200 rounded-md text-sm outline-none focus:border-crimson-500 transition-colors"
            placeholder="e.g. 80"
          />
        </div>
        <div className="col-span-2 sm:col-span-1 flex flex-col gap-1">
          <label className="text-[0.7rem] font-semibold uppercase tracking-wider text-ink-500">Time Duration</label>
          <input 
            type="text" name="duration" value={header.duration} onChange={handleChange}
            className="px-3 py-2 border border-ink-200 rounded-md text-sm outline-none focus:border-crimson-500 transition-colors"
            placeholder="e.g. 3 Hours"
          />
        </div>
      </div>
    </div>
  );
}
