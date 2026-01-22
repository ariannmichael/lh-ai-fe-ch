import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Brief, Citation, VerificationResult } from '../types';
import { Copy, ChevronRight } from 'lucide-react';

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

  // Determine citation metadata based on case name and context
  const getCitationMetadata = (citation: Citation): {
    court: string;
    category: string;
    strength: string;
    color: string;
    icon: string;
  } => {
    const caseName = citation.caseName.toLowerCase();
    
    // Determine court
    let court = '';
    if (caseName.includes('twombly') || caseName.includes('iqbal') || 
        caseName.includes('tellabs') || caseName.includes('dura') ||
        caseName.includes('basic')) {
      court = 'SCOTUS';
    } else if (citation.reporter.includes('F.3d') || citation.reporter.includes('F.2d')) {
      court = '9th Cir.';
    }

    // Determine category and strength
    let category = '';
    let strength = '';
    let color = 'blue';
    let icon = 'C';

    if (caseName.includes('twombly') || caseName.includes('iqbal')) {
      category = 'Pleading Standard';
      strength = 'Strong';
      color = 'blue';
    } else if (caseName.includes('tellabs')) {
      category = 'Scienter Standard';
      strength = 'Strong';
      color = 'orange';
    } else if (caseName.includes('henderson')) {
      category = 'PSLRA';
      strength = 'Medium';
      color = 'purple';
      icon = 'C';
    } else if (caseName.includes('dura')) {
      category = 'PSLRA';
      strength = 'Medium';
      color = 'purple';
      icon = 'D';
    } else if (caseName.includes('basic')) {
      category = 'PSLRA';
      strength = 'Medium';
      color = 'purple';
    }

    return { court, category, strength, color, icon };
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

  // Custom component to render citation tags
  const renderCitationTag = (citation: Citation): React.ReactNode => {
    const result = getResultForCitation(citation.id);
    const isSelected = selectedCitationId === citation.id;
    const metadata = getCitationMetadata(citation);

    const handleClick = () => {
      if (result) {
        onCitationClick(citation, result);
      }
    };

    // For SCOTUS cases (Twombly, Tellabs, etc.), show full citation text with highlighted case name + separate tags
    if (metadata.color === 'blue' || metadata.color === 'orange') {
      // Split citation text to highlight case name
      const citationParts = citation.text.split(citation.caseName);
      const beforeCase = citationParts[0];
      const afterCase = citationParts[1] || '';

      return (
        <span key={citation.id} className="inline-flex items-center gap-1.5 flex-wrap">
          {/* Full citation text with highlighted case name */}
          <span
            onClick={handleClick}
            className={`inline-flex items-center gap-0 ${isSelected ? 'ring-2 ring-gray-800 rounded px-1' : ''} cursor-pointer`}
          >
            {beforeCase && <span className="text-gray-700">{beforeCase}</span>}
            <span className="bg-blue-100 text-blue-900 px-1 py-0.5 rounded font-medium">
              {citation.caseName}
            </span>
            {afterCase && <span className="text-gray-700">{afterCase}</span>}
          </span>
          
          {/* Separate metadata tags */}
          {metadata.court && (
            <span
              onClick={handleClick}
              className="px-2 py-0.5 rounded border border-blue-500 bg-white text-xs font-medium text-gray-700 cursor-pointer hover:bg-blue-50"
            >
              {metadata.court}
            </span>
          )}
          
          {metadata.category && metadata.strength && (
            <span
              onClick={handleClick}
              className="px-2 py-0.5 rounded border border-gray-400 bg-white text-xs font-medium text-gray-700 cursor-pointer hover:bg-gray-50"
            >
              {metadata.category} {metadata.strength}
            </span>
          )}
        </span>
      );
    }

    // For other cases (purple tags with icons) - show as inline tag
    return (
      <span
        key={citation.id}
        onClick={handleClick}
        className={`inline-flex items-center gap-1 px-2 py-1 rounded border border-purple-500 bg-purple-50 ${isSelected ? 'ring-2 ring-gray-800' : ''} cursor-pointer hover:bg-purple-100 transition-all`}
        style={{ fontSize: '0.75rem', lineHeight: '1.2' }}
      >
        {/* Icon */}
        <span className="font-bold text-xs">{metadata.icon}</span>
        
        {/* Case name */}
        <span className="font-medium">{citation.caseName}</span>
        
        {/* Metadata */}
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
  };

  // Custom component to render text with citations
  const renderTextWithCitations = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    const citationMarkerRegex = /\{\{CITE:([^}]+)\}\}/g;
    let lastIndex = 0;
    let match;
    let keyCounter = 0;

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
        const processedChildren = React.Children.map(node.props.children, (child) =>
          processNode(child)
        );
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
