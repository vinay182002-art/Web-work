import { demoCurriculum } from '../data/curriculum.js';
import { curriculumCatalog, flagshipReferences, getCatalogSemester } from '../data/curriculum-catalog.js';
import { curriculumResearchLog } from '../data/curriculum-research.js';
import { degreeCurriculum } from '../data/degree-curriculum.js';

export const contentLevels = [
  'FOUNDATION',
  'UNIVERSITY',
  'ADVANCED',
  'PROFESSIONAL',
  'RESEARCH',
  'UNIVERSITY_ALIGNED',
  'STANDARD_CURRICULUM'
];

export { curriculumCatalog, flagshipReferences };

export const reviewStatuses = ['DRAFT', 'REVIEW', 'APPROVED', 'PUBLISHED', 'ARCHIVED'];

function flattenCurriculum() {
  const subjects = [...demoCurriculum.subjects, ...degreeCurriculum];
  return subjects.flatMap((subject) => subject.units.flatMap((unit) => unit.chapters.flatMap((chapter) => [
    {
      id: subject.id,
      type: 'subject',
      title: subject.title,
      context: `${demoCurriculum.year.title} · ${demoCurriculum.semester.title}`,
      subjectId: subject.id
    },
    {
      id: unit.id,
      type: 'unit',
      title: unit.title,
      context: subject.title,
      subjectId: subject.id
    },
    {
      id: chapter.id,
      type: 'chapter',
      title: chapter.title,
      context: `${subject.title} · ${unit.title}`,
      subjectId: subject.id
    },
    ...chapter.topics.map((topic) => ({
      id: `${chapter.id}:${topic.toLowerCase().replaceAll(' ', '-')}`,
      type: 'topic',
      title: topic,
      context: `${subject.title} · ${chapter.title}`,
      subjectId: subject.id
    })),
    ...chapter.sections.map((section) => ({
      id: section.id,
      type: 'lesson section',
      title: section.title,
      context: `${subject.title} · ${chapter.title}`,
      body: section.body,
      subjectId: subject.id
    }))
  ])));
}

export function searchContent(query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];
  return flattenCurriculum().filter((item) => `${item.title} ${item.context} ${item.body || ''}`.toLowerCase().includes(normalized));
}

export function getGlossary() {
  return [
    {
      term: 'DNA',
      definition: 'Deoxyribonucleic acid, the molecule that stores hereditary information.',
      simpleExplanation: 'A molecule that carries genetic instructions.',
      relatedTerms: ['genetic material', 'DNA profile'],
      sourceStatus: 'Needs verified reference before publication'
    },
    {
      term: 'Quantification',
      definition: 'Estimating the amount and quality of DNA in an extract before downstream analysis.',
      simpleExplanation: 'Checking how much usable DNA is available.',
      relatedTerms: ['extraction', 'purification'],
      sourceStatus: 'Supplementary demo definition'
    },
    {
      term: 'Likelihood ratio',
      definition: 'The ratio of the probability of findings under one stated proposition to their probability under another stated proposition.',
      simpleExplanation: 'A comparison of how expected the findings are under two explanations.',
      relatedTerms: ['conditional probability', 'evaluative reporting'],
      sourceStatus: 'Reference candidate: Aitken and Taroni (2004)'
    },
    {
      term: 'Confidence interval',
      definition: 'An interval calculated by a stated procedure to express uncertainty about an estimated parameter.',
      simpleExplanation: 'A range that shows how precise an estimate is under the method used.',
      relatedTerms: ['estimation', 'sampling variation'],
      sourceStatus: 'Reference candidate: NIST/SEMATECH e-Handbook'
    },
    {
      term: 'p-value',
      definition: 'Under a specified null model, the probability of results at least as incompatible with that model as the observed results.',
      simpleExplanation: 'A model-based measure of how unusual the data are; it is not the probability that a hypothesis is true.',
      relatedTerms: ['hypothesis test', 'null hypothesis'],
      sourceStatus: 'Reference candidate: NIST/SEMATECH e-Handbook'
    }
  ];
}

export function getConceptRelations() {
  return [
    { from: 'basic-cell-biology', relation: 'prerequisite_of', to: 'dna-extraction' },
    { from: 'dna-extraction', relation: 'related_to', to: 'dna-quantification' },
    { from: 'dna-extraction', relation: 'prerequisite_of', to: 'pcr' },
    { from: 'pcr', relation: 'prerequisite_of', to: 'str-analysis' }
  ];
}

export function validateContent(record) {
  const issues = [];
  if (!record?.title?.trim()) issues.push('Missing title');
  if (!record?.contentLevel || !contentLevels.includes(record.contentLevel)) issues.push('Invalid or missing content level');
  if (!record?.classification) issues.push('Missing content classification');
  if (!record?.reviewStatus || !reviewStatuses.includes(record.reviewStatus)) issues.push('Invalid or missing review status');
  if (!record?.generationStatus) issues.push('Missing generation status');
  if (!record?.sourceStatus) issues.push('Missing source status');
  if (!record?.sections?.length) issues.push('No lesson sections');
  if (record?.sections?.some((section) => !section.heading?.trim() || !section.content?.trim())) issues.push('Empty lesson section');
  if (record?.officialUniversityContent && !record.syllabusReference && !record.sourceUrl) issues.push('University-aligned content needs a syllabus reference');
  if (record?.verificationStatus === 'VERIFIED' && !record.sourceUrl) issues.push('Verified content needs a source URL');
  return { valid: issues.length === 0, issues };
}

export function findPossibleDuplicate(record, records) {
  const title = record?.title?.trim().toLowerCase();
  return records.filter((candidate) => candidate.id !== record.id && candidate.title?.trim().toLowerCase() === title);
}

export function validateImport(records) {
  if (!Array.isArray(records)) return { valid: false, errors: ['Import must be an array of content records'], records: [] };
  const results = records.map(validateContent);
  return {
    valid: results.every((result) => result.valid),
    errors: results.flatMap((result, index) => result.issues.map((issue) => `Record ${index + 1}: ${issue}`)),
    records
  };
}

export const contentApi = {
  async getYears() { return curriculumCatalog.years; },
  async getSemesters(yearNumber = 2) {
    return curriculumCatalog.years.find((year) => year.number === Number(yearNumber))?.semesters || [demoCurriculum.semester];
  },
  async getSubjects() { return demoCurriculum.subjects; },
  async getUnits(subjectId) { return demoCurriculum.subjects.find((subject) => subject.id === subjectId)?.units || []; },
  async getChapters(subjectId) { return (await this.getUnits(subjectId)).flatMap((unit) => unit.chapters); },
  async getTopics(subjectId, chapterId) { return (await this.getChapters(subjectId)).find((chapter) => chapter.id === chapterId)?.topics || []; },
  async getGlossary() { return getGlossary(); },
  async search(query) { return searchContent(query); },
  async validateImport(records) { return validateImport(records); }
};

export function getCurriculumResearchLog() {
  return curriculumResearchLog;
}
