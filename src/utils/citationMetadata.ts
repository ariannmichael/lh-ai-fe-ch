import { Citation } from '../types';

export interface CitationMetadata {
  court: string;
  category: string;
  strength: string;
  color: 'blue' | 'orange' | 'purple';
  icon: string;
}

const SCOTUS_CASES = ['twombly', 'iqbal', 'tellabs', 'dura', 'basic'];
const PLEADING_STANDARD_CASES = ['twombly', 'iqbal'];
const SCIENTER_STANDARD_CASES = ['tellabs'];
const PSLRA_CASES = ['henderson', 'dura', 'basic'];

export function getCitationMetadata(citation: Citation): CitationMetadata {
  const caseName = citation.caseName.toLowerCase();
  
  // Determine court
  const isSCOTUS = SCOTUS_CASES.some(caseNameItem => caseName.includes(caseNameItem));
  const isNinthCircuit = citation.reporter.includes('F.3d') || citation.reporter.includes('F.2d');
  const court = isSCOTUS ? 'SCOTUS' : isNinthCircuit ? '9th Cir.' : '';

  // Determine category, strength, color, and icon
  let category = '';
  let strength = '';
  let color: 'blue' | 'orange' | 'purple' = 'blue';
  let icon = 'C';

  if (PLEADING_STANDARD_CASES.some(caseNameItem => caseName.includes(caseNameItem))) {
    category = 'Pleading Standard';
    strength = 'Strong';
    color = 'blue';
  } else if (SCIENTER_STANDARD_CASES.some(caseNameItem => caseName.includes(caseNameItem))) {
    category = 'Scienter Standard';
    strength = 'Strong';
    color = 'orange';
  } else if (PSLRA_CASES.some(caseNameItem => caseName.includes(caseNameItem))) {
    category = 'PSLRA';
    strength = 'Medium';
    color = 'purple';
    icon = caseName.includes('dura') ? 'D' : 'C';
  }

  return { court, category, strength, color, icon };
}
