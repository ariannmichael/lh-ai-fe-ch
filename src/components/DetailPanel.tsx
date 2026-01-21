import { Citation, VerificationResult } from '../types';

interface DetailPanelProps {
  citation: Citation | null;
  result: VerificationResult | null;
  onClose: () => void;
}

export function DetailPanel({ citation, result, onClose }: DetailPanelProps) {
  if (!citation || !result) {
    return (
      <div>
        <p>Click on a citation to see verification details.</p>
      </div>
    );
  }

  return (
    <div>
      <button onClick={onClose}>Close</button>
      <h2>Citation Details</h2>

      <div>
        <strong>Citation:</strong>
        <p>{citation.text}</p>
      </div>

      <div>
        <strong>Case Name:</strong>
        <p>{citation.caseName}</p>
      </div>

      <div>
        <strong>Reporter:</strong>
        <p>{citation.reporter}</p>
      </div>

      {citation.pinCite && (
        <div>
          <strong>Pin Cite:</strong>
          <p>{citation.pinCite}</p>
        </div>
      )}

      <div>
        <strong>Year:</strong>
        <p>{citation.year}</p>
      </div>

      <hr />

      <h2>Verification Result</h2>

      <div>
        <strong>Status:</strong>
        <p>{result.status}</p>
      </div>

      <div>
        <strong>Severity:</strong>
        <p>{result.severity}</p>
      </div>

      <div>
        <strong>Message:</strong>
        <p>{result.message}</p>
      </div>

      {result.details?.expectedQuote && (
        <div>
          <strong>Quote in Brief:</strong>
          <p>{result.details.expectedQuote}</p>
        </div>
      )}

      {result.details?.actualQuote && (
        <div>
          <strong>Actual Quote from Source:</strong>
          <p>{result.details.actualQuote}</p>
        </div>
      )}

      {result.details?.treatmentHistory && (
        <div>
          <strong>Treatment History:</strong>
          <p>{result.details.treatmentHistory}</p>
        </div>
      )}
    </div>
  );
}
