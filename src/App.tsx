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
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const announcementRef = useRef<HTMLDivElement>(null);

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
    // Return focus to the main content area when panel closes
    const firstCitation = containerRef.current?.querySelector('button[aria-pressed]');
    if (firstCitation instanceof HTMLElement) {
      firstCitation.focus();
    }
  }, []);

  const navigateToCitation = useCallback((direction: 'next' | 'prev') => {
    const citableCitations = getCitableCitations();
    if (citableCitations.length === 0) return;

    setSelectedCitation((current) => {
      if (!current) {
        // If nothing is selected, select the first citation
        const first = citableCitations[0];
        // Announce to screen readers
        if (announcementRef.current) {
          announcementRef.current.textContent = `Selected citation: ${first.citation.caseName}. Press Enter to view details.`;
        }
        // Focus the citation button
        setTimeout(() => {
          const button = containerRef.current?.querySelector(`button[aria-label*="${first.citation.caseName}"]`);
          if (button instanceof HTMLElement) {
            button.focus();
          }
        }, 0);
        return first;
      }

      const currentIndex = citableCitations.findIndex(
        (item) => item.citation.id === current.citation.id
      );

      if (currentIndex === -1) {
        const first = citableCitations[0];
        if (announcementRef.current) {
          announcementRef.current.textContent = `Selected citation: ${first.citation.caseName}. Press Enter to view details.`;
        }
        setTimeout(() => {
          const button = containerRef.current?.querySelector(`button[aria-label*="${first.citation.caseName}"]`);
          if (button instanceof HTMLElement) {
            button.focus();
          }
        }, 0);
        return first;
      }

      let newIndex: number;
      if (direction === 'next') {
        newIndex = (currentIndex + 1) % citableCitations.length;
      } else {
        newIndex = currentIndex === 0 ? citableCitations.length - 1 : currentIndex - 1;
      }

      const newCitation = citableCitations[newIndex];
      // Announce to screen readers
      if (announcementRef.current) {
        announcementRef.current.textContent = `Selected citation ${newIndex + 1} of ${citableCitations.length}: ${newCitation.citation.caseName}. Press Enter to view details.`;
      }
      // Focus the citation button
      setTimeout(() => {
        const button = containerRef.current?.querySelector(`button[aria-label*="${newCitation.citation.caseName}"]`);
        if (button instanceof HTMLElement) {
          button.focus();
        }
      }, 0);
      return newCitation;
    });
  }, []);

  // Focus management: Move focus to close button when panel opens
  useEffect(() => {
    if (selectedCitation && closeButtonRef.current) {
      // Small delay to ensure panel is rendered
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
    }
  }, [selectedCitation]);

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
    <div className="flex w-full h-screen bg-gray-100">
      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Skip to main content
      </a>

      {/* Keyboard shortcuts help - accessible via keyboard */}
      <div className="sr-only" id="keyboard-shortcuts">
        <h2>Keyboard Shortcuts</h2>
        <ul>
          <li>Arrow Right, Arrow Down, or J: Navigate to next citation</li>
          <li>Arrow Left, Arrow Up, or K: Navigate to previous citation</li>
          <li>Enter or Space: Open citation details (when citation is focused)</li>
          <li>Escape: Close citation details panel</li>
        </ul>
      </div>

      {/* ARIA live region for citation navigation announcements */}
      <div
        ref={announcementRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        id="citation-announcements"
        role="status"
      />

      <main
        ref={containerRef}
        id="main-content"
        className="flex w-full h-screen bg-gray-100"
        role="main"
        aria-label="Legal brief viewer"
      >
        <article className="flex-1 bg-white overflow-y-auto p-8" aria-label="Brief content">
          <BriefViewer
            brief={sampleBrief}
            onCitationClick={handleCitationClick}
            selectedCitationId={selectedCitation?.citation.id || null}
          />
        </article>
        {selectedCitation && (
          <div ref={panelRef} className="w-96 bg-gray-50 border-l border-gray-200">
            <DetailPanel 
              selectedCitation={selectedCitation.citation} 
              selectedResult={selectedCitation.result}
              onClose={handleClosePanel}
              closeButtonRef={closeButtonRef}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;