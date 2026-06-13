import React, { memo, useEffect, useRef } from 'react';
import { renderMath } from '../../utils/mathRender';

const MathRenderer = memo(({ formula, displayMode = false }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = renderMath(formula, { displayMode });
    }
  }, [formula, displayMode]);

  return <span ref={containerRef} className={displayMode ? 'block my-4' : 'inline-block mx-1'} />;
}, (prevProps, nextProps) => {
  return prevProps.formula === nextProps.formula && prevProps.displayMode === nextProps.displayMode;
});

MathRenderer.displayName = 'MathRenderer';

export default MathRenderer;
