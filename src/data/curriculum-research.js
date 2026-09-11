/**
 * Phase 11 research log and academic roadmap.
 *
 * The university-specific source status is deliberately unresolved. Search
 * results and programme summaries must not be promoted to official syllabus
 * evidence without an authoritative university document.
 */
export const curriculumResearchLog = [
  {
    id: 'anjaneya-public-source-review-2026-09-09',
    title: 'Public source review: Anjaneya University forensic science curriculum',
    sourceUrl: null,
    sourceType: 'OFFICIAL_SOURCE_SEARCH',
    publicationDate: null,
    accessedDate: '2026-09-09',
    university: 'Anjaneya University',
    programme: 'B.Sc. Forensic Science',
    academicYear: null,
    verificationStatus: 'NEEDS_REVIEW',
    notes: 'No authoritative syllabus, semester scheme, or official forensic-science curriculum document was available in the accessible public results. Do not infer subjects or units from the standard map.'
  }
];

export const academicLayers = [
  {
    id: 'university-core',
    label: 'University core',
    description: 'Only content directly supported by an authoritative Anjaneya University source.',
    status: 'NOT_YET_VERIFIED'
  },
  {
    id: 'extended-bsc',
    label: 'Extended B.Sc.',
    description: 'Standard forensic-science coverage used for learning support while university mapping is pending.',
    status: 'ACTIVE_STANDARD_LAYER'
  },
  {
    id: 'master-forensics',
    label: 'Master forensics',
    description: 'Advanced, professional, and research extensions clearly separated from undergraduate requirements.',
    status: 'ROADMAP'
  }
];

export const curriculumGapAnalysis = [
  {
    area: 'Official semester structure',
    status: 'OPEN',
    action: 'Obtain the current university syllabus or academic scheme before marking subjects as required.'
  },
  {
    area: 'Year 2 Semester 3 mapping',
    status: 'OPEN',
    action: 'Compare Kittu’s actual subject registration or timetable with the standard coverage map.'
  },
  {
    area: 'Flagship Forensic Biology content',
    status: 'STANDARD_LAYER',
    action: 'Expand lessons and references, but keep the needs-review label until sources are verified.'
  },
  {
    area: 'Advanced learning layer',
    status: 'ROADMAP',
    action: 'Add advanced content only after foundation objectives and source metadata are complete.'
  }
];

export const masterRoadmap = [
  { stage: 'Foundation', description: 'Cell biology, chemistry, scientific method, and evidence handling.' },
  { stage: 'University-aligned', description: 'Replace standard placeholders with verified university subjects and units.' },
  { stage: 'Deep dive', description: 'Mechanisms, limitations, interpretation, and exam-answer practice.' },
  { stage: 'Application', description: 'Practicals, hypothetical cases, and evidence-to-conclusion reasoning.' },
  { stage: 'Advanced', description: 'Professional workflows, quality systems, statistics, and validation.' },
  { stage: 'Research', description: 'Primary literature, study design, critical appraisal, and dissertation support.' }
];
