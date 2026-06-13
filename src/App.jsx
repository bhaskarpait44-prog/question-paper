import React, { useState, useCallback } from 'react';
import { PaperProvider } from './context/PaperContext';
import Toolbar from './components/Toolbar';
import SplitPane from './components/layout/SplitPane';
import EditorPane from './components/editor/EditorPane';
import PreviewPane from './components/preview/PreviewPane';
import { Header } from './components/layout/Header';
import MathModal from './components/editor/MathModal';

// Create a simple event-based bridge for triggering the math modal from anywhere
// Since we don't want to overcomplicate the context just for one modal state.
export const MathTrigger = {
  callback: null,
  trigger(cb) {
    if (this.callback) this.callback(cb);
  }
};

function App() {
  const [mathModal, setMathModal] = useState({ isOpen: false, onInsert: null });

  const openMathModal = useCallback((onInsert) => {
    setMathModal({ isOpen: true, onInsert });
  }, []);

  const closeMathModal = useCallback(() => {
    setMathModal(prev => ({ ...prev, isOpen: false }));
  }, []);

  const handleInsertMath = useCallback((latex, displayMode) => {
    if (mathModal.onInsert) {
      mathModal.onInsert(latex, displayMode);
    }
    closeMathModal();
  }, [mathModal, closeMathModal]);

  // Connect the trigger
  React.useEffect(() => {
    MathTrigger.callback = openMathModal;
    return () => { MathTrigger.callback = null; };
  }, [openMathModal]);

  return (
    <PaperProvider>
      <div className="flex flex-col h-screen bg-ink-50 font-sans">
        <Header />
        <Toolbar />
        <SplitPane left={<EditorPane />} right={<PreviewPane />} />
        
        <MathModal 
          isOpen={mathModal.isOpen} 
          onClose={closeMathModal} 
          onInsert={handleInsertMath} 
        />
      </div>
    </PaperProvider>
  );
}

export default App;
