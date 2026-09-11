import { demoCurriculum } from '../data/curriculum.js';
import { degreeCurriculum } from '../data/degree-curriculum.js';

export const questionTypes = ['MCQ', 'TRUE_FALSE', 'SHORT_ANSWER', 'CASE_BASED', 'APPLICATION', 'PRACTICAL', 'VIVA'];
export const difficulties = ['EASY', 'MODERATE', 'HARD', 'EXPERT'];
export const bloomLevels = ['REMEMBER', 'UNDERSTAND', 'APPLY', 'ANALYZE', 'EVALUATE', 'CREATE'];
export const sourceTypes = ['UNIVERSITY_PAPER', 'OFFICIAL_SOURCE', 'TEXTBOOK', 'TEACHER_CREATED', 'ADMIN_CREATED', 'AI_GENERATED_REVIEW_REQUIRED', 'AI_GENERATED_APPROVED', 'PRACTICE_CREATED'];

const chapter = demoCurriculum.subjects[0].units.find((unit) => unit.id === 'biology-unit-2').chapters[0];

const metadata = {
  subjectId: 'forensic-biology',
  semesterId: 'semester-3',
  yearId: 'year-2',
  unitId: 'biology-unit-2',
  chapterId: chapter.id,
  contentLevel: 'STANDARD_CURRICULUM',
  examRelevance: 'MEDIUM',
  sourceType: 'PRACTICE_CREATED',
  sourceReference: null,
  reviewStatus: 'REVIEW'
};

const generatedSubjects = [...demoCurriculum.subjects.filter((subject) => subject.id !== 'forensic-biology'), ...degreeCurriculum];
const generatedQuestions = generatedSubjects.flatMap((subject) => subject.units.flatMap((unit) => unit.chapters.flatMap((chapter) =>
  chapter.quiz.questions.map((question, index) => ({
    ...metadata,
    subjectId: subject.id,
    yearId: `year-${subject.year || 2}`,
    semesterId: `semester-${subject.semester || 3}`,
    unitId: unit.id,
    chapterId: chapter.id,
    id: `${chapter.id}-practice-${index + 1}`,
    question: question.prompt,
    questionType: index === 2 ? 'APPLICATION' : 'MCQ',
    topicId: chapter.topics[index] || chapter.topics[0],
    difficulty: index === 2 ? 'HARD' : (subject.year === 1 ? 'EASY' : 'MODERATE'),
    marks: index === 2 ? 2 : 1,
    bloomLevel: index === 2 ? 'ANALYZE' : (subject.year === 1 ? 'UNDERSTAND' : 'APPLY'),
    explanation: question.explanation,
    correctAnswer: question.correctIndex,
    options: question.options,
    wrongAnswerGuidance: question.options.map((option, optionIndex) => optionIndex === question.correctIndex ? 'Correct: this matches the learning objective.' : `Review the method and its limitations before selecting ${option}.`),
    conceptTested: chapter.topics[index] || chapter.topics[0],
    relatedTopic: chapter.topics[index] || chapter.topics[0],
    recommendedLesson: chapter.id,
    commonMisconception: 'A scientific observation automatically proves a complete conclusion.',
    professionalInsight: 'Interpret an answer alongside the quality and limits of the evidence.',
    createdAt: '2026-09-10',
    updatedAt: '2026-09-10'
  }))
)));

export const questionBank = [
  ...chapter.quiz.questions.map((question, index) => ({
    ...metadata,
    id: question.id,
    question: question.prompt,
    questionType: 'MCQ',
    topicId: index === 0 ? 'quantification' : 'dna-extraction-workflow',
    difficulty: index === 0 ? 'EASY' : 'MODERATE',
    marks: 1,
    bloomLevel: index === 0 ? 'UNDERSTAND' : 'REMEMBER',
    explanation: question.explanation,
    correctAnswer: question.correctIndex,
    options: question.options,
    wrongAnswerGuidance: question.options.map((option, optionIndex) => optionIndex === question.correctIndex ? 'Correct: this matches the learning objective.' : `Not the best answer: ${option} is not the purpose of this step.`),
    conceptTested: index === 0 ? 'DNA quantification' : 'Extraction workflow',
    relatedTopic: chapter.topics[index] || chapter.topics[0],
    recommendedLesson: chapter.id,
    commonMisconception: index === 0 ? 'Quantification identifies a person; it only estimates extract quantity and quality.' : 'The order can be changed without affecting downstream interpretation.',
    professionalInsight: 'Interpret an answer alongside the quality of the evidence-handling chain.',
    createdAt: '2026-09-09',
    updatedAt: '2026-09-09'
  })),
  {
    ...metadata,
    id: 'dna-application-1',
    question: 'A measurable extract is below the working range. What should be reviewed before drawing a conclusion?',
    questionType: 'APPLICATION',
    topicId: 'quantification',
    difficulty: 'HARD',
    marks: 2,
    bloomLevel: 'ANALYZE',
    examRelevance: 'MEDIUM',
    explanation: 'Review collection, lysis, purification, and measurement as a connected chain rather than blaming one stage immediately.',
    correctAnswer: 0,
    options: ['The complete sample-to-measurement chain', 'Only the final instrument display', 'The suspect identity', 'The paper label colour'],
    wrongAnswerGuidance: ['Correct: low yield needs a chain-based review.', 'Not enough: the display does not explain upstream causes.', 'Not relevant: identity is not established by yield.', 'Not scientifically relevant.'],
    conceptTested: 'Interpreting low yield',
    relatedTopic: 'Quantification',
    recommendedLesson: chapter.id,
    commonMisconception: 'A low value automatically proves one specific procedural error.',
    professionalInsight: 'Forensic interpretation should distinguish observation from unsupported causal claims.',
    createdAt: '2026-09-09',
    updatedAt: '2026-09-09'
  },
  ...generatedQuestions
];

export function getQuestions(filters = {}) {
  return questionBank.filter((question) => Object.entries(filters).every(([key, value]) => !value || question[key] === value));
}

export function selectPracticeQuestions({ mode = 'quick', limit = 10, state = {} } = {}) {
  let candidates = getQuestions();
  if (mode === 'chapter') candidates = getQuestions({ chapterId: chapter.id });
  if (mode === 'master') candidates = candidates.filter((question) => ['HARD', 'EXPERT'].includes(question.difficulty));
  if (mode === 'weak') {
    const weakTopics = new Set((state.questionAttempts || []).filter((attempt) => !attempt.correct).map((attempt) => attempt.topicId));
    candidates = candidates.filter((question) => weakTopics.has(question.topicId));
  }
  const attempted = new Set((state.questionAttempts || []).map((attempt) => attempt.questionId));
  return [...candidates].sort((a, b) => Number(attempted.has(a.id)) - Number(attempted.has(b.id))).slice(0, limit);
}

export function analyseAttempts(attempts = []) {
  const total = attempts.length;
  const correct = attempts.filter((attempt) => attempt.correct).length;
  const byBloom = Object.fromEntries(bloomLevels.map((level) => {
    const scoped = attempts.filter((attempt) => attempt.bloomLevel === level);
    return [level, scoped.length ? Math.round(scoped.filter((attempt) => attempt.correct).length / scoped.length * 100) : null];
  }));
  return { total, correct, accuracy: total ? Math.round(correct / total * 100) : 0, byBloom };
}
