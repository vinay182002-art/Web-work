import { demoCurriculum } from '../data/curriculum.js';
import { forensicChemistry } from '../data/forensic-chemistry.js?v=18';
import { fingerprintScience } from '../data/fingerprint-science.js?v=19';
import { forensicStatistics } from '../data/forensic-statistics.js?v=20';
import { getQuestions } from './question-engine.js';

const requiredChapterFields = ['sections', 'summary', 'visual', 'microChecks', 'quiz', 'flashcards', 'practical', 'caseStudy', 'viva', 'aiContext', 'revision', 'references'];

function flatten(subject) {
  return subject.units.flatMap((unit) => unit.chapters.map((chapter) => ({ ...chapter, unitId: unit.id, unitTitle: unit.title, subjectId: subject.id })));
}

function auditChapter(chapter) {
  const issues = [];
  const reviewTasks = [];
  for (const field of requiredChapterFields) {
    if (!chapter[field] || (Array.isArray(chapter[field]) && !chapter[field].length)) issues.push(`Missing ${field}`);
  }
  if (chapter.references?.some((reference) => reference.status !== 'REFERENCE_CANDIDATE')) reviewTasks.push('Verify reference status and exact bibliographic metadata before publication.');
  if (chapter.metadata?.verificationStatus !== 'STANDARD_CURRICULUM') issues.push('Verification label is inconsistent with the governed catalogue.');
  if (chapter.caseStudy?.note && !/hypothetical|fictional|educational/i.test(chapter.caseStudy.note)) reviewTasks.push('Confirm the case is clearly labelled as educational and hypothetical.');
  if (chapter.sections?.length < 3) reviewTasks.push('Consider whether definition, mechanism, application, and limitation receive enough depth.');
  const repeatedBodies = chapter.sections?.filter((section, index, sections) => sections.findIndex((candidate) => candidate.body === section.body) !== index) || [];
  if (repeatedBodies.length) issues.push('Repeated lesson section text');
  return { id: chapter.id, title: chapter.title, valid: issues.length === 0, issues, reviewTasks };
}

export function auditSubject(subject) {
  const chapters = flatten(subject);
  const chapterAudits = chapters.map(auditChapter);
  const questions = getQuestions({ subjectId: subject.id });
  const missingQuestionLinks = chapters.filter((chapter) => !questions.some((question) => question.chapterId === chapter.id)).map((chapter) => chapter.id);
  const referenceCandidates = chapters.reduce((count, chapter) => count + (chapter.references?.filter((reference) => reference.status === 'REFERENCE_CANDIDATE').length || 0), 0);
  const humanReviewTasks = [
    'Verify each reference candidate against the exact source edition, author/publisher or organisation, date, and applicable section.',
    'Have a subject expert fact-check terminology, method conditions, and reporting boundaries before publication.',
    'Confirm chapter order and prerequisite links against the verified university syllabus when it becomes available.',
    ...chapterAudits.flatMap((audit) => audit.reviewTasks.map((task) => `${audit.title}: ${task}`))
  ];
  const checks = {
    curriculumMapping: Boolean(subject.year && subject.semester && subject.classification && subject.verificationStatus),
    units: subject.units.length > 0,
    chapters: chapters.length > 0,
    lessonDepth: chapterAudits.every((audit) => audit.valid),
    questionLinking: missingQuestionLinks.length === 0,
    flashcards: chapters.every((chapter) => chapter.flashcards?.length >= 2),
    practicals: chapters.every((chapter) => Boolean(chapter.practical)),
    cases: chapters.every((chapter) => Boolean(chapter.caseStudy)),
    viva: chapters.every((chapter) => chapter.viva?.length >= 3),
    aiContext: chapters.every((chapter) => Boolean(chapter.aiContext?.grounding)),
    revision: chapters.every((chapter) => Boolean(chapter.revision)),
    references: referenceCandidates > 0,
    mobileSafe: true,
    scientificReview: false,
    sourceVerification: false
  };
  const passed = Object.values(checks).filter(Boolean).length;
  return {
    subjectId: subject.id,
    title: subject.title,
    status: 'CONTENT_UNDER_REVIEW',
    classification: subject.classification,
    verificationStatus: subject.verificationStatus,
    chapterCount: chapters.length,
    questionCount: questions.length,
    referenceCandidates,
    checks,
    score: Math.round(passed / Object.keys(checks).length * 100),
    missingQuestionLinks,
    chapterAudits,
    humanReviewTasks,
    generatedAt: new Date().toISOString()
  };
}

export function getForensicChemistryAudit() {
  return auditSubject(forensicChemistry);
}

export function getFingerprintScienceAudit() {
  return auditSubject(fingerprintScience);
}

export function getForensicStatisticsAudit() {
  return auditSubject(forensicStatistics);
}

export function getSubjectCompletionPipeline() {
  return [
    'Curriculum and verification metadata',
    'Units, chapters, topics, and prerequisite links',
    'Lesson depth and scientific fact-check',
    'Questions linked to lessons',
    'Flashcards, practicals, viva, and cases',
    'AI grounding and prohibited claims',
    'Revision integration',
    'References and citation verification',
    'Responsive rendering and search',
    'Human approval before publication'
  ];
}

export function getAuditSummary() {
  const audit = getForensicStatisticsAudit();
  return { title: audit.title, status: audit.status, score: audit.score, checks: audit.checks, humanReviewRequired: audit.humanReviewTasks.length > 0 };
}
