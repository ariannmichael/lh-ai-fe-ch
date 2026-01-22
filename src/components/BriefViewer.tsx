import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Brief, Citation, VerificationResult } from '../types';
import { CitationTag } from './CitationTag';
import { getCitationMetadata } from '../utils/citationMetadata';

interface BriefViewerProps {
  brief: Brief;
  onCitationClick: (citation: Citation, result: VerificationResult) => void;
  selectedCitationId: string | null;
}

export function BriefViewer({
  brief,
  onCitationClick,
  selectedCitationId,
}: BriefViewerProps) {
  const getResultForCitation = (citationId: string): VerificationResult | undefined => {
    return brief.verificationResults.find((r) => r.citationId === citationId);
  };

  // Process content to replace citations with a unique marker
  const processContent = (content: string): string => {
    const citationRegex = /\[\[CITATION:(\d+)\]\]/g;
    return content.replace(citationRegex, (match, index) => {
      const citationIndex = parseInt(index, 10) - 1;
      const citation = brief.citations[citationIndex];
      if (citation) {
        return `{{CITE:${citation.id}}}`;
      }
      return match;
    });
  };

  // Render citation tag
  const renderCitationTag = (citation: Citation): React.ReactNode => {
    const result = getResultForCitation(citation.id);
    const isSelected = selectedCitationId === citation.id;
    const metadata = getCitationMetadata(citation);

    const handleClick = () => {
      if (result) {
        onCitationClick(citation, result);
      }
    };

    return (
      <CitationTag
        key={citation.id}
        citation={citation}
        result={result}
        metadata={metadata}
        isSelected={isSelected}
        onClick={handleClick}
      />
    );
  };

  // Custom component to render text with citations
  const renderTextWithCitations = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    const citationMarkerRegex = /\{\{CITE:([^}]+)\}\}/g;
    let lastIndex = 0;
    let match;

    while ((match = citationMarkerRegex.exec(text)) !== null) {
      // Add text before the citation
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      const citationId = match[1];
      const citation = brief.citations.find((c) => c.id === citationId);

      if (citation) {
        parts.push(renderCitationTag(citation));
      }

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? <>{parts}</> : text;
  };

  // Recursively process React nodes to replace citation markers
  const processNode = (node: React.ReactNode): React.ReactNode => {
    if (typeof node === 'string') {
      return renderTextWithCitations(node);
    }

    if (React.isValidElement(node)) {
      if (node.props.children) {
        const processedChildren = React.Children.map(node.props.children, processNode);
        return React.cloneElement(node, { ...node.props, children: processedChildren });
      }
      return node;
    }

    if (Array.isArray(node)) {
      return node.map((item, index) => (
        <React.Fragment key={index}>{processNode(item)}</React.Fragment>
      ));
    }

    return node;
  };

  const processedContent = processContent(brief.content);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-serif font-bold text-gray-900 mb-2">{brief.title}</h1>
      <p className="text-sm text-gray-600 mb-8 font-serif">Failure to State a Claim</p>
      
      <div className="prose prose-sm max-w-none">
        <ReactMarkdown
          components={{
            h2: ({ children }) => (
              <h2 className="text-lg font-serif font-bold text-gray-900 mt-8 mb-4">
                {processNode(children)}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-base font-serif font-bold text-gray-900 mt-6 mb-3">
                {processNode(children)}
              </h3>
            ),
            p: ({ children }) => (
              <p className="text-sm text-gray-800 leading-relaxed mb-4 font-sans">
                {processNode(children)}
              </p>
            ),
            li: ({ children }) => (
              <li className="text-sm text-gray-800 leading-relaxed mb-2 font-sans ml-6">
                {processNode(children)}
              </li>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-gray-300 pl-4 my-4 italic text-gray-700 font-sans">
                {processNode(children)}
              </blockquote>
            ),
            strong: ({ children }) => (
              <strong className="font-semibold">{processNode(children)}</strong>
            ),
            em: ({ children }) => (
              <em className="italic">{processNode(children)}</em>
            ),
            code: ({ children }) => (
              <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">
                {processNode(children)}
              </code>
            ),
            hr: () => <hr className="my-8 border-gray-300" />,
          }}
        >
          {processedContent}
        </ReactMarkdown>
      </div>
    </div>
  );
}
