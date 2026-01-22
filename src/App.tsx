import { useState } from 'react';
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

  const handleCitationClick = (citation: Citation, result: VerificationResult) => {
    setSelectedCitation({ citation, result });
  };

  const handleClosePanel = () => {
    setSelectedCitation(null);
  };

  return (
    <div className="flex w-full h-screen bg-gray-100">
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