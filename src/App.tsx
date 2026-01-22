import { useState } from 'react';
import { BriefViewer } from './components/BriefViewer';
import { DetailPanel } from './components/DetailPanel';
import { sampleBrief } from './data/sampleBrief';
import { Citation, VerificationResult } from './types';

function App() {
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);
  const [selectedResult, setSelectedResult] = useState<VerificationResult | null>(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);

  const handleCitationClick = (citation: Citation, result: VerificationResult) => {
    setSelectedCitation(citation);
    setSelectedResult(result);
    setIsDetailPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsDetailPanelOpen(false);
    setSelectedCitation(null);
    setSelectedResult(null);
  };

  return (
    <div className="flex w-full h-screen bg-gray-100">
      <div className="flex-1 bg-white overflow-y-auto p-8">
        <BriefViewer
          brief={sampleBrief}
          onCitationClick={handleCitationClick}
          selectedCitationId={selectedCitation?.id || null}
        />
      </div>
      {isDetailPanelOpen && (
        <div className="w-96 bg-gray-50 border-l border-gray-200">
          <DetailPanel 
            selectedCitation={selectedCitation} 
            selectedResult={selectedResult}
            onClose={handleClosePanel}
          />
        </div>
      )}
    </div>
  );
}

export default App;