import { Citation, VerificationResult } from '../types';
import { X } from 'lucide-react';

interface DetailPanelProps {
  selectedCitation: Citation | null;
  selectedResult: VerificationResult | null;
  onClose: () => void;
  closeButtonRef?: React.RefObject<HTMLButtonElement>;
}

interface DetailSectionProps {
  title: string;
  children: React.ReactNode;
  isBold?: boolean;
}

function DetailSection({ title, children, isBold = false }: DetailSectionProps) {
  const sectionId = `section-${title.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <section aria-labelledby={sectionId}>
      <h4 id={sectionId} className="text-sm font-serif font-bold text-gray-900 mb-3">{title}</h4>
      <p className={`text-sm text-gray-800 leading-relaxed font-sans ${isBold ? 'font-semibold' : ''}`}>
        {children}
      </p>
    </section>
  );
}

interface QuoteBlockProps {
  title: string;
  quote: string;
}

function QuoteBlock({ title, quote }: QuoteBlockProps) {
  const quoteId = `quote-${title.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <section aria-labelledby={quoteId}>
      <h4 id={quoteId} className="text-sm font-serif font-bold text-gray-900 mb-3">{title}</h4>
      <blockquote 
        className="border-l-4 border-gray-300 pl-4 my-2 italic text-gray-700 font-sans text-sm leading-relaxed"
        cite=""
      >
        {quote}
      </blockquote>
    </section>
  );
}

function formatReporter(citation: Citation): string {
  let formatted = citation.reporter;
  if (citation.pinCite) {
    formatted += `, ${citation.pinCite}`;
  }
  if (citation.year) {
    formatted += ` (${citation.year})`;
  }
  return formatted;
}

export function DetailPanel({ selectedCitation, selectedResult, onClose, closeButtonRef }: DetailPanelProps) {
  const hasSelection = selectedCitation && selectedResult;

  return (
    <aside
      className="h-full flex flex-col bg-gray-50"
      role="complementary"
      aria-label="Citation details panel"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <h2 id="panel-title" className="text-base font-serif font-bold text-gray-900">Citation Details</h2>
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          aria-label="Close citation details panel"
          type="button"
        >
          <X className="w-4 h-4 text-gray-500" aria-hidden="true" />
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6" role="region" aria-labelledby="panel-title">
        {hasSelection ? (
          <div className="bg-white rounded-lg p-6 space-y-6">
            <DetailSection title="Citation">{selectedCitation.text}</DetailSection>
            <DetailSection title="Case Name">{selectedCitation.caseName}</DetailSection>
            <DetailSection title="Reporter">{formatReporter(selectedCitation)}</DetailSection>
            <DetailSection title="Status" isBold>{selectedResult.status}</DetailSection>
            <DetailSection title="Message">{selectedResult.message}</DetailSection>

            {/* Additional Details */}
            {selectedResult.details && (
              <div className="space-y-4">
                {selectedResult.details.expectedQuote && (
                  <QuoteBlock title="Quote in Brief" quote={selectedResult.details.expectedQuote} />
                )}
                {selectedResult.details.actualQuote && (
                  <QuoteBlock title="Actual Quote from Source" quote={selectedResult.details.actualQuote} />
                )}
                {selectedResult.details.treatmentHistory && (
                  <DetailSection title="Treatment History">
                    {selectedResult.details.treatmentHistory}
                  </DetailSection>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-6">
            <p className="text-sm text-gray-600 font-sans leading-relaxed">
              Click on a citation to see details.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
