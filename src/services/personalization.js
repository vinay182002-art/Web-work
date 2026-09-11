import { curriculumCatalog } from '../data/curriculum-catalog.js';
import { degreeCurriculum } from '../data/degree-curriculum.js';
import { demoCurriculum } from '../data/curriculum.js';

const subjects = [...demoCurriculum.subjects, ...degreeCurriculum];

function allChapters() {
  return subjects.flatMap((subject) => subject.units.flatMap((unit) => unit.chapters.map((chapter) => ({
    ...chapter,
    subjectId: subject.id,
    subjectTitle: subject.title,
    year: subject.year || 2,
    semester: subject.semester || 3
  }))));
}

export function deriveKnowledgeState(state) {
  const attempts = state.questionAttempts || [];
  return allChapters().map((chapter) => {
    const quiz = state.quizAttempts?.[chapter.id];
    const chapterAttempts = attempts.filter((attempt) => attempt.chapterId === chapter.id || attempt.questionId?.startsWith(`${chapter.id}-`));
    const correct = chapterAttempts.filter((attempt) => attempt.correct).length;
    const accuracy = chapterAttempts.length ? Math.round(correct / chapterAttempts.length * 100) : null;
    const exposure = state.completedSections?.filter((key) => key.startsWith(`${chapter.id}:`)).length
      ? Math.min(100, Math.round(state.completedSections.filter((key) => key.startsWith(`${chapter.id}:`)).length / chapter.sections.length * 100))
      : (quiz ? 100 : 0);
    const mastery = quiz ? Math.round((quiz.score / Math.max(1, quiz.total)) * 70 + (exposure * 0.3)) : Math.round(exposure * 0.3);
    return {
      chapterId: chapter.id,
      subjectId: chapter.subjectId,
      subjectTitle: chapter.subjectTitle,
      topic: chapter.topics?.[0] || chapter.title,
      exposure,
      understanding: accuracy === null ? null : accuracy,
      recall: accuracy,
      application: accuracy,
      retention: state.flashcardReviews?.[chapter.id] ? (['good', 'easy'].includes(state.flashcardReviews[chapter.id]) ? 100 : 50) : null,
      confidence: accuracy === null ? null : Math.max(0, Math.min(100, accuracy - (accuracy < 50 ? 10 : 0))),
      mastery,
      lastStudied: state.studySessions?.find((session) => session.chapterId === chapter.id)?.startedAt || null,
      lastRevised: state.revisionItems?.find((item) => item.chapterId === chapter.id)?.nextReviewAt || null,
      mistakeCount: chapterAttempts.filter((attempt) => !attempt.correct).length,
      successfulRetries: chapterAttempts.filter((attempt) => attempt.correct).length
    };
  });
}

export function deriveLearnerProfile(state) {
  const attempts = state.questionAttempts || [];
  const knowledge = deriveKnowledgeState(state);
  const answered = attempts.length;
  const sessions = state.studySessions || [];
  const minutes = sessions.reduce((sum, session) => {
    if (!session.endedAt) return sum;
    return sum + Math.max(0, (new Date(session.endedAt) - new Date(session.startedAt)) / 60000);
  }, 0);
  const completed = state.completedSections?.length || 0;
  const accuracy = answered ? Math.round(attempts.filter((attempt) => attempt.correct).length / answered * 100) : 0;
  const retentionValues = knowledge.map((item) => item.retention).filter((value) => value !== null);
  return {
    learningProfileId: 'local-demo-profile',
    studentId: 'local-demo-student',
    preferredSessionLength: Number(state.coachProfile?.preferredSession) || 20,
    preferredLearningModes: [state.mode || 'university'],
    preferredStudyTimes: state.coachProfile?.preferredTimes || [],
    averageSessionLength: sessions.length ? Math.round(minutes / sessions.length) : 0,
    questionAccuracy: accuracy,
    retentionScore: retentionValues.length ? Math.round(retentionValues.reduce((sum, value) => sum + value, 0) / retentionValues.length) : 0,
    applicationScore: accuracy,
    readingCompletion: completed ? Math.min(100, completed * 10) : 0,
    revisionCompletion: state.revisionItems?.length ? 100 : 0,
    casePerformance: 0,
    vivaPerformance: 0,
    examPerformance: 0,
    updatedAt: new Date().toISOString()
  };
}

export function getPersonalizedRecommendation(state) {
  const knowledge = deriveKnowledgeState(state);
  const weak = knowledge.filter((item) => item.exposure > 0 && item.mastery < 60).sort((a, b) => a.mastery - b.mastery)[0];
  if (weak && weak.understanding !== null) {
    return {
      type: 'reinforce',
      title: `Reinforce ${weak.topic}`,
      reason: `You have studied ${weak.topic}, but recorded performance is ${weak.understanding ?? 0}%. Exposure is not being treated as mastery.`,
      chapterId: weak.chapterId,
      route: `#/learn/${subjects.find((subject) => subject.id === weak.subjectId)?.year || 2}/${subjects.find((subject) => subject.id === weak.subjectId)?.semester || 3}/${weak.subjectId}/${weak.chapterId}?tab=quiz`
    };
  }
  if (weak) {
    return {
      type: 'continue',
      title: `Continue studying ${weak.topic}`,
      reason: `You have opened this concept, but there is not enough quiz or question evidence to estimate mastery yet.`,
      chapterId: weak.chapterId,
      route: `#/learn/${subjects.find((subject) => subject.id === weak.subjectId)?.year || 2}/${subjects.find((subject) => subject.id === weak.subjectId)?.semester || 3}/${weak.subjectId}/${weak.chapterId}`
    };
  }
  const untouched = knowledge.find((item) => item.exposure === 0);
  if (untouched) {
    return {
      type: 'start',
      title: `Start ${untouched.topic}`,
      reason: 'This is a new concept in your current learning record, so a short lesson gives the highest-value next step.',
      chapterId: untouched.chapterId,
      route: `#/learn/${subjects.find((subject) => subject.id === untouched.subjectId)?.year || 2}/${subjects.find((subject) => subject.id === untouched.subjectId)?.semester || 3}/${untouched.subjectId}/${untouched.chapterId}`
    };
  }
  return { type: 'maintain', title: 'Keep a short retrieval habit', reason: 'Your current record has no clear weak area yet. Use a small mixed practice set to keep recall active.', route: '#/questions?mode=quick' };
}

export function buildPersonalizedPlan(state) {
  const recommendation = getPersonalizedRecommendation(state);
  const minutes = Math.max(10, Math.min(90, Number(state.coachProfile?.dailyMinutes) || 30));
  return [
    { label: 'Priority', title: recommendation.title, minutes: Math.round(minutes * 0.6), route: recommendation.route },
    { label: 'Retrieval', title: 'Answer a short mixed practice set', minutes: Math.max(5, Math.round(minutes * 0.4)), route: '#/questions?mode=quick' }
  ];
}

export function explainRecommendation(state) {
  const profile = deriveLearnerProfile(state);
  const recommendation = getPersonalizedRecommendation(state);
  return { recommendation, profile, signals: ['completed sections', 'quiz and question accuracy', 'flashcard ratings', 'revision records', 'explicit study preferences'] };
}

export function getPersonalizationSummary() {
  return { curriculumYears: curriculumCatalog.years.length, sensitiveInference: false, source: 'local academic activity and explicit preferences only' };
}
