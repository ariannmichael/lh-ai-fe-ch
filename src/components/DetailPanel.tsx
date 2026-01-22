import { Citation, VerificationResult } from '../types';
import { X } from 'lucide-react';

interface DetailPanelProps {
  selectedCitation: Citation | null;
  selectedResult: VerificationResult | null;
  onClose: () => void;
}

export function DetailPanel({ selectedCitation, selectedResult, onClose }: DetailPanelProps) {
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
        {selectedCitation && selectedResult ? (
          <div className="bg-white rounded-lg p-6 space-y-6">
            {/* Citation */}
            <div>
              <h4 className="text-sm font-serif font-bold text-gray-900 mb-3">Citation</h4>
              <p className="text-sm text-gray-800 leading-relaxed font-sans">
                {selectedCitation.text}
              </p>
            </div>

            {/* Case Name */}
            <div>
              <h4 className="text-sm font-serif font-bold text-gray-900 mb-3">Case Name</h4>
              <p className="text-sm text-gray-800 leading-relaxed font-sans">
                {selectedCitation.caseName}
              </p>
            </div>

            {/* Reporter */}
            <div>
              <h4 className="text-sm font-serif font-bold text-gray-900 mb-3">Reporter</h4>
              <p className="text-sm text-gray-800 leading-relaxed font-sans">
                {selectedCitation.reporter}
                {selectedCitation.pinCite && `, ${selectedCitation.pinCite}`}
                {selectedCitation.year && ` (${selectedCitation.year})`}
              </p>
            </div>

            {/* Status */}
            <div>
              <h4 className="text-sm font-serif font-bold text-gray-900 mb-3">Status</h4>
              <p className="text-sm text-gray-800 leading-relaxed font-sans font-semibold">
                {selectedResult.status}
              </p>
            </div>

            {/* Message */}
            <div>
              <h4 className="text-sm font-serif font-bold text-gray-900 mb-3">Message</h4>
              <p className="text-sm text-gray-800 leading-relaxed font-sans">
                {selectedResult.message}
              </p>
            </div>

            {/* Additional Details */}
            {selectedResult.details && (
              <div className="space-y-4">
                {selectedResult.details.expectedQuote && (
                  <div>
                    <h4 className="text-sm font-serif font-bold text-gray-900 mb-3">Quote in Brief</h4>
                    <blockquote className="border-l-4 border-gray-300 pl-4 my-2 italic text-gray-700 font-sans text-sm leading-relaxed">
                      {selectedResult.details.expectedQuote}
                    </blockquote>
                  </div>
                )}
                {selectedResult.details.actualQuote && (
                  <div>
                    <h4 className="text-sm font-serif font-bold text-gray-900 mb-3">Actual Quote from Source</h4>
                    <blockquote className="border-l-4 border-gray-300 pl-4 my-2 italic text-gray-700 font-sans text-sm leading-relaxed">
                      {selectedResult.details.actualQuote}
                    </blockquote>
                  </div>
                )}
                {selectedResult.details.treatmentHistory && (
                  <div>
                    <h4 className="text-sm font-serif font-bold text-gray-900 mb-3">Treatment History</h4>
                    <p className="text-sm text-gray-800 leading-relaxed font-sans">
                      {selectedResult.details.treatmentHistory}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-6">
            <p className="text-sm text-gray-600 font-sans leading-relaxed">Click on a citation to see details.</p>
          </div>
        )}
      </div>
    </div>
  );
}
