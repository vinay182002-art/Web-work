/**
 * Previous Year Papers — architecture only.
 *
 * No papers are ever fabricated. Verified university papers will be imported
 * with authoritative source metadata (university, year, paper id) and only then
 * appear in the study UI. Until then every surface reports the empty state.
 */
export const previousPapers = {
  verificationStatus: 'NO_VERIFIED_PAPERS',
  note: 'No verified previous-year papers have been imported. Nothing in this area is labelled as an official university paper.',
  hierarchy: ['Semester', 'Subject', 'Year', 'Paper', 'Questions'],
  supportedModes: ['Practice Paper', 'Timed Mode', 'Results', 'Question review', 'Weak areas'],
  subjects: [
    { subjectId: 'forensic-biology', title: 'Forensic Biology', papers: [] },
    { subjectId: 'forensic-chemistry', title: 'Forensic Chemistry', papers: [] },
    { subjectId: 'fingerprint-science', title: 'Fingerprint Science', papers: [] },
    { subjectId: 'forensic-statistics', title: 'Statistics for Forensic Interpretation', papers: [] }
  ]
};

/** Shape of a single verified paper once imported. */
export const paperShape = {
  id: 'string · university-year-subject-paper',
  subjectId: 'string',
  university: 'string',
  year: '2023',
  paperLabel: 'Semester 3 · Paper 1',
  sourceUrl: 'string',
  sourceDate: 'string',
  status: 'VERIFIED',
  questions: [
    {
      id: 'string',
      prompt: 'string',
      options: null,
      marks: 0,
      questionType: 'UNIVERSITY_EXAM_STYLE',
      difficulty: null
    }
  ]
};

export function getVerifiedPaperCount() {
  return previousPapers.subjects.reduce((sum, subject) => sum + subject.papers.length, 0);
}

export function getPapersForSubject(subjectId) {
  return previousPapers.subjects.find((subject) => subject.subjectId === subjectId)?.papers || [];
}

export function canRunPaperModes() {
  return getVerifiedPaperCount() > 0;
}