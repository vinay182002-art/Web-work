import { demoCurriculum } from '../data/curriculum.js';
import { degreeCurriculum } from '../data/degree-curriculum.js';
import { validateContent, validateImport } from './content-engine.js';

const subjects = [...demoCurriculum.subjects, ...degreeCurriculum];

function records() {
  return subjects.flatMap((subject) => subject.units.flatMap((unit) => unit.chapters.map((chapter) => ({
    id: chapter.id,
    subjectId: subject.id,
    subjectTitle: subject.title,
    year: subject.year || 2,
    semester: subject.semester || 3,
    title: chapter.title,
    contentLevel: chapter.metadata?.contentLevel === 'foundation' ? 'FOUNDATION' : chapter.metadata?.contentLevel === 'advanced_undergraduate_content' ? 'ADVANCED' : 'STANDARD_CURRICULUM',
    classification: chapter.metadata?.classification || subject.classification || 'STANDARD_BSC',
    reviewStatus: 'REVIEW',
    generationStatus: 'HUMAN_AUTHORED',
    sourceStatus: chapter.metadata?.sourceStatus || 'REFERENCE_CANDIDATE',
    verificationStatus: chapter.metadata?.verificationStatus || subject.verificationStatus || 'NEEDS_REVIEW',
    officialUniversityContent: Boolean(subject.officialUniversityContent),
    sourceUrl: chapter.references?.[0]?.url || null,
    sourceDate: null,
    sections: chapter.sections.map((section) => ({ id: section.id, heading: section.title, content: section.body })),
    version: { version: 1, changeSummary: 'Generated from governed subject template', updatedBy: 'content-operations' }
  }))));
}

export function getContentRecords() {
  return records();
}

export function getContentHealth() {
  const all = records();
  const results = all.map(validateContent);
  const published = all.filter((record) => record.reviewStatus === 'PUBLISHED').length;
  return {
    total: all.length,
    valid: results.filter((result) => result.valid).length,
    invalid: results.filter((result) => !result.valid).length,
    published,
    review: all.length - published,
    issues: results.flatMap((result, index) => result.issues.map((issue) => ({ id: all[index].id, issue })))
  };
}

export function getCoverageMatrix() {
  return subjects.map((subject) => {
    const chapters = subject.units.flatMap((unit) => unit.chapters);
    return {
      id: subject.id,
      title: subject.title,
      year: subject.year || 2,
      semester: subject.semester || 3,
      chapters: chapters.length,
      lessons: chapters.filter((chapter) => chapter.sections?.length).length,
      questions: chapters.filter((chapter) => chapter.quiz?.questions?.length).length,
      flashcards: chapters.filter((chapter) => chapter.flashcards?.length).length,
      practicals: chapters.filter((chapter) => chapter.practical).length,
      cases: chapters.filter((chapter) => chapter.caseStudy).length,
      references: chapters.filter((chapter) => chapter.references?.length).length,
      status: subject.verificationStatus || 'NEEDS_REVIEW'
    };
  });
}

export function getPriorityQueue() {
  return getCoverageMatrix()
    .filter((item) => item.status !== 'VERIFIED')
    .sort((a, b) => a.year - b.year || a.semester - b.semester || a.chapters - b.chapters)
    .map((item, index) => ({ ...item, priority: index + 1, reason: item.chapters < 4 ? 'Expand chapter coverage' : 'Review sources and approve before publication' }));
}

export function validateContentImport(recordsToImport) {
  return validateImport(recordsToImport);
}

export function exportContentRecords() {
  return JSON.stringify(records(), null, 2);
}
