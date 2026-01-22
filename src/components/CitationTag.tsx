import React from 'react';
import { Citation, VerificationResult } from '../types';
import { CitationMetadata } from '../utils/citationMetadata';
import { Copy, ChevronRight } from 'lucide-react';

interface CitationTagProps {
  citation: Citation;
  result: VerificationResult | undefined;
  metadata: CitationMetadata;
  isSelected: boolean;
  onClick: () => void;
}

export function SCOTUSCitationTag({ citation, metadata, isSelected, onClick }: CitationTagProps) {
  const citationParts = citation.text.split(citation.caseName);
  const beforeCase = citationParts[0];
  const afterCase = citationParts[1] || '';

  return (
    <span className="inline-flex items-center gap-1.5 flex-wrap">
      <span
        onClick={onClick}
        className={`inline-flex items-center gap-0 ${isSelected ? 'ring-2 ring-gray-800 rounded px-1' : ''} cursor-pointer`}
      >
        {beforeCase && <span className="text-gray-700">{beforeCase}</span>}
        <span className="bg-blue-100 text-blue-900 px-1 py-0.5 rounded font-medium">
          {citation.caseName}
        </span>
        {afterCase && <span className="text-gray-700">{afterCase}</span>}
      </span>
      
      {metadata.court && (
        <span
          onClick={onClick}
          className="px-2 py-0.5 rounded border border-blue-500 bg-white text-xs font-medium text-gray-700 cursor-pointer hover:bg-blue-50"
        >
          {metadata.court}
        </span>
      )}
      
      {metadata.category && metadata.strength && (
        <span
          onClick={onClick}
          className="px-2 py-0.5 rounded border border-gray-400 bg-white text-xs font-medium text-gray-700 cursor-pointer hover:bg-gray-50"
        >
          {metadata.category} {metadata.strength}
        </span>
      )}
    </span>
  );
}

export function StandardCitationTag({ citation, metadata, isSelected, onClick }: CitationTagProps) {
  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2 py-1 rounded border border-purple-500 bg-purple-50 ${isSelected ? 'ring-2 ring-gray-800' : ''} cursor-pointer hover:bg-purple-100 transition-all`}
      style={{ fontSize: '0.75rem', lineHeight: '1.2' }}
    >
      <span className="font-bold text-xs">{metadata.icon}</span>
      <span className="font-medium">{citation.caseName}</span>
      
      {metadata.court && (
        <>
          <span className="text-gray-400">|</span>
          <span>{metadata.court}</span>
        </>
      )}
      
      {metadata.category && (
        <>
          <span className="text-gray-400">|</span>
          <span>{metadata.category}</span>
        </>
      )}
      
      {metadata.strength && (
        <>
          <span className="text-gray-400">|</span>
          <span>{metadata.strength}</span>
        </>
      )}

      <Copy className="w-3 h-3 text-gray-500 ml-1" />
      <ChevronRight className="w-3 h-3 text-gray-500" />
    </span>
  );
}

interface CitationTagWrapperProps {
  citation: Citation;
  result: VerificationResult | undefined;
  metadata: CitationMetadata;
  isSelected: boolean;
  onClick: () => void;
}

export function CitationTag({ citation, result, metadata, isSelected, onClick }: CitationTagWrapperProps) {
  const isSCOTUS = metadata.color === 'blue' || metadata.color === 'orange';
  
  if (isSCOTUS) {
    return (
      <SCOTUSCitationTag
        citation={citation}
        result={result}
        metadata={metadata}
        isSelected={isSelected}
        onClick={onClick}
      />
    );
  }
  
  return (
    <StandardCitationTag
      citation={citation}
      result={result}
      metadata={metadata}
      isSelected={isSelected}
      onClick={onClick}
    />
  );
}
