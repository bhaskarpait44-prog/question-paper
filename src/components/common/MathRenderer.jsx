import React, { memo, useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const MathRenderer = memo(({ formula, displayMode = false }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(formula, containerRef.current, {
          displayMode,
          throwOnError: false,
          trust: true,
        });
      } catch (err) {
        console.error('KaTeX rendering error:', err);
      }
    }
  }, [formula, displayMode]);

  return <span ref={containerRef} className={displayMode ? 'block my-4' : 'inline-block mx-1'} />;
}, (prevProps, nextProps) => {
  return prevProps.formula === nextProps.formula && prevProps.displayMode === nextProps.displayMode;
});

MathRenderer.displayName = 'MathRenderer';

export default MathRenderer;
