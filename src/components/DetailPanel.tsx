import { Citation, VerificationResult } from '../types';
import { X } from 'lucide-react';

interface DetailPanelProps {
  selectedCitation: Citation | null;
  selectedResult: VerificationResult | null;
  onClose: () => void;
}

interface DetailSectionProps {
  title: string;
  children: React.ReactNode;
  isBold?: boolean;
}

function DetailSection({ title, children, isBold = false }: DetailSectionProps) {
  return (
    <div>
      <h4 className="text-sm font-serif font-bold text-gray-900 mb-3">{title}</h4>
      <p className={`text-sm text-gray-800 leading-relaxed font-sans ${isBold ? 'font-semibold' : ''}`}>
        {children}
      </p>
    </div>
  );
}

interface QuoteBlockProps {
  title: string;
  quote: string;
}

function QuoteBlock({ title, quote }: QuoteBlockProps) {
  return (
    <div>
      <h4 className="text-sm font-serif font-bold text-gray-900 mb-3">{title}</h4>
      <blockquote className="border-l-4 border-gray-300 pl-4 my-2 italic text-gray-700 font-sans text-sm leading-relaxed">
        {quote}
      </blockquote>
    </div>
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

export function DetailPanel({ selectedCitation, selectedResult, onClose }: DetailPanelProps) {
  const hasSelection = selectedCitation && selectedResult;

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <h3 className="text-base font-serif font-bold text-gray-900">Citation Details</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          aria-label="Close panel"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
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
    </div>
  );
}
