import { useState, useEffect, useRef, useCallback } from 'react';
import { BriefViewer } from './components/BriefViewer';
import { DetailPanel } from './components/DetailPanel';
import { sampleBrief } from './data/sampleBrief';
import { Citation, VerificationResult } from './types';

interface SelectedCitation {
  citation: Citation;
  result: VerificationResult;
}

function App() {
  const [selectedCitation, setSelectedCitation] = useState<SelectedCitation | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get all citations with verification results in order
  const getCitableCitations = (): Array<{ citation: Citation; result: VerificationResult }> => {
    return sampleBrief.citations
      .map((citation) => {
        const result = sampleBrief.verificationResults.find((r) => r.citationId === citation.id);
        return result ? { citation, result } : null;
      })
      .filter((item): item is { citation: Citation; result: VerificationResult } => item !== null);
  };

  const handleCitationClick = (citation: Citation, result: VerificationResult) => {
    setSelectedCitation({ citation, result });
  };

  const handleClosePanel = useCallback(() => {
    setSelectedCitation(null);
  }, []);

  const navigateToCitation = useCallback((direction: 'next' | 'prev') => {
    const citableCitations = getCitableCitations();
    if (citableCitations.length === 0) return;

    setSelectedCitation((current) => {
      if (!current) {
        // If nothing is selected, select the first citation
        return citableCitations[0];
      }

      const currentIndex = citableCitations.findIndex(
        (item) => item.citation.id === current.citation.id
      );

      if (currentIndex === -1) {
        return citableCitations[0];
      }

      let newIndex: number;
      if (direction === 'next') {
        newIndex = (currentIndex + 1) % citableCitations.length;
      } else {
        newIndex = currentIndex === 0 ? citableCitations.length - 1 : currentIndex - 1;
      }

      return citableCitations[newIndex];
    });
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't handle keyboard shortcuts when user is typing in an input/textarea
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        (event.target instanceof HTMLElement && event.target.isContentEditable)
      ) {
        return;
      }

      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case 'j':
        case 'J':
          event.preventDefault();
          navigateToCitation('next');
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'k':
        case 'K':
          event.preventDefault();
          navigateToCitation('prev');
          break;
        case 'Escape':
          event.preventDefault();
          handleClosePanel();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigateToCitation, handleClosePanel]);

  return (
    <div ref={containerRef} className="flex w-full h-screen bg-gray-100" tabIndex={0}>
      <div className="flex-1 bg-white overflow-y-auto p-8">
        <BriefViewer
          brief={sampleBrief}
          onCitationClick={handleCitationClick}
          selectedCitationId={selectedCitation?.citation.id || null}
        />
      </div>
      {selectedCitation && (
        <div className="w-96 bg-gray-50 border-l border-gray-200">
          <DetailPanel 
            selectedCitation={selectedCitation.citation} 
            selectedResult={selectedCitation.result}
            onClose={handleClosePanel}
          />
        </div>
      )}
    </div>
  );
}

export default App;