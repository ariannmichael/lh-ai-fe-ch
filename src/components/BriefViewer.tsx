import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Brief, Citation, VerificationResult } from '../types';

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

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'critical':
        return 'red';
      case 'warning':
        return 'yellow';
      default:
        return 'lightgreen';
    }
  };

  // Process content to replace citations with a unique marker
  const processContent = (content: string): string => {
    const citationRegex = /\[\[CITATION:(\d+)\]\]/g;
    return content.replace(citationRegex, (match, index) => {
      const citationIndex = parseInt(index, 10) - 1;
      const citation = brief.citations[citationIndex];
      if (citation) {
        // Use a unique marker format that won't be processed by markdown
        return `{{CITE:${citation.id}}}`;
      }
      return match;
    });
  };

  // Custom component to render text with citations
  const renderTextWithCitations = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    // Match citation markers {{CITE:citation-id}}
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
        const result = getResultForCitation(citation.id);
        const severity = result?.severity || 'none';
        const isSelected = selectedCitationId === citation.id;

        parts.push(
          <span
            key={`citation-${citation.id}-${keyCounter++}`}
            onClick={() => {
              if (result) {
                onCitationClick(citation, result);
              }
            }}
            style={{
              backgroundColor: getSeverityColor(severity),
              padding: '2px 4px',
              cursor: result ? 'pointer' : 'default',
              border: isSelected ? '2px solid black' : 'none',
              borderRadius: '2px',
              display: 'inline',
            }}
          >
            {citation.text}
          </span>
        );
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
      // If the node has children, process them recursively
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
    <div>
      <h1>{brief.title}</h1>
      <ReactMarkdown
        components={{
          // Process all components recursively to handle citations
          p: ({ children }) => <p>{processNode(children)}</p>,
          li: ({ children }) => <li>{processNode(children)}</li>,
          blockquote: ({ children }) => <blockquote>{processNode(children)}</blockquote>,
          h1: ({ children }) => <h1>{processNode(children)}</h1>,
          h2: ({ children }) => <h2>{processNode(children)}</h2>,
          h3: ({ children }) => <h3>{processNode(children)}</h3>,
          h4: ({ children }) => <h4>{processNode(children)}</h4>,
          h5: ({ children }) => <h5>{processNode(children)}</h5>,
          h6: ({ children }) => <h6>{processNode(children)}</h6>,
          strong: ({ children }) => <strong>{processNode(children)}</strong>,
          em: ({ children }) => <em>{processNode(children)}</em>,
          code: ({ children }) => <code>{processNode(children)}</code>,
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}
