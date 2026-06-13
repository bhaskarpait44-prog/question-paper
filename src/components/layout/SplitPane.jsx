import React, { useState, useRef, useEffect } from 'react';

export default function SplitPane({ left, right }) {
  const [leftWidth, setLeftWidth] = useState(50);
  const containerRef = useRef(null);

  const handleMouseDown = (e) => {
    e.preventDefault();
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    
    if (newLeftWidth > 20 && newLeftWidth < 80) {
      setLeftWidth(newLeftWidth);
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <main ref={containerRef} className="flex flex-1 overflow-hidden">
      {/* Left Pane (Editor) */}
      <section className="flex flex-col overflow-hidden" style={{ width: `${leftWidth}%` }}>
        <div className="text-[0.65rem] font-semibold tracking-[0.12em] uppercase text-ink-300 px-4 py-1.5 bg-ink-50 border-b border-ink-200">
          ✍ EDITOR
        </div>
        <div className="flex-1 overflow-y-auto p-6 bg-white custom-scrollbar">
          {left}
        </div>
      </section>

      {/* Divider */}
      <div 
        className="w-2.5 bg-ink-100 border-l border-r border-ink-200 flex flex-col items-center justify-center gap-2 cursor-col-resize select-none"
        onMouseDown={handleMouseDown}
      >
        <div className="w-px h-8 bg-ink-300"></div>
        <div className="text-[0.7rem] text-ink-400 [writing-mode:horizontal-tb]">⇄</div>
        <div className="w-px h-8 bg-ink-300"></div>
      </div>

      {/* Right Pane (Preview) */}
      <section className="flex flex-col overflow-hidden" style={{ width: `${100 - leftWidth}%` }}>
        <div className="text-[0.65rem] font-semibold tracking-[0.12em] uppercase text-ink-300 px-4 py-1.5 bg-ink-50 border-b border-ink-200">
          👁 LIVE PREVIEW
        </div>
        <div className="flex-1 overflow-y-auto p-6 bg-[#f0ebe3] custom-scrollbar">
          {right}
        </div>
      </section>
    </main>
  );
}
