/**
 * Semester 3 analytics engine.
 *
 * Pure functions over the governed curriculum (`demoCurriculum`) and the local
 * study state. Views stay thin; this service is the single source of truth for
 * "how is Semester 3 going" so the dashboard, subject page, revision page, and
 * home cards all agree.
 */
import { demoCurriculum } from '../data/curriculum.js?v=23';
import { getTopicProgress } from '../components/topic-learning.js?v=24';
import { calculateMastery } from './mastery.js';

export function getSemester() {
  return demoCurriculum;
}

export function flattenChapters() {
  return demoCurriculum.subjects.flatMap((subject) =>
    subject.units.flatMap((unit) =>
      unit.chapters.map((chapter) => ({
        ...chapter,
        unitId: unit.id,
        unitTitle: unit.title,
        subjectId: subject.id,
        subjectTitle: subject.title
      }))
    )
  );
}

function dayKey(iso) {
  return iso ? String(iso).slice(0, 10) : null;
}

function addDays(date, days) {
  return new Date(date.getTime() + days * 86400000);
}

/** Consecutive study days ending today (or yesterday if today is quiet). */
export function computeStudyStreak(state) {
  const days = new Set();
  (state.studySessions || []).forEach((session) => {
    const key = dayKey(session.startedAt);
    if (key) days.add(key);
  });
  Object.values(state.topicActivity || {}).forEach((entry) => {
    const key = dayKey(entry.lastStudiedAt);
    if (key) days.add(key);
  });
  if (!days.size) return 0;
  let active = new Date();
  if (!days.has(dayKey(active.toISOString()))) {
    active = addDays(active, -1);
    if (!days.has(dayKey(active.toISOString()))) return 0;
  }
  let streak = 0;
  let cursor = dayKey(active.toISOString());
  while (cursor && days.has(cursor)) {
    streak += 1;
    cursor = dayKey(addDays(new Date(`${cursor}T00:00:00.000Z`), -1).toISOString());
  }
  return streak;
}

export function computeStudyMinutes(state) {
  const sessionMinutes = (state.studySessions || []).reduce((total, session) => {
    if (!session.endedAt) return total;
    return total + Math.max(0, (new Date(session.endedAt) - new Date(session.startedAt)) / 60000);
  }, 0);
  const topicSeconds = Object.values(state.topicActivity || {}).reduce((total, entry) => total + (entry.seconds || 0), 0);
  return Math.round(sessionMinutes + topicSeconds / 60);
}

export function averageQuizScore(state) {
  const attempts = Object.values(state.quizAttempts || {});
  if (!attempts.length) return null;
  return Math.round(attempts.reduce((sum, attempt) => sum + (attempt.total ? attempt.score / attempt.total : 0), 0) / attempts.length * 100);
}

export function getWeakTopics(state) {
  const weak = [];
  for (const chapter of flattenChapters()) {
    const quiz = state.quizAttempts?.[chapter.id];
    const attempts = (state.questionAttempts || []).filter((attempt) => attempt.chapterId === chapter.id);
    const correct = attempts.filter((attempt) => attempt.correct).length;
    const accuracy = attempts.length ? Math.round(correct / attempts.length * 100) : null;
    const quizScore = quiz && quiz.total ? Math.round(quiz.score / quiz.total * 100) : null;
    const reasons = [];
    if (quizScore !== null && quizScore < 70) reasons.push(`Quiz ${quizScore}%`);
    if (accuracy !== null && accuracy < 70) reasons.push(`Practice ${accuracy}%`);
    if (reasons.length) {
      weak.push({
        chapterId: chapter.id,
        subjectId: chapter.subjectId,
        subjectTitle: chapter.subjectTitle,
        title: chapter.title,
        topic: chapter.topics?.[0] || chapter.title,
        quizScore,
        accuracy,
        reasons
      });
    }
  }
  return weak.sort((a, b) => Math.min(a.quizScore ?? 100, a.accuracy ?? 100) - Math.min(b.quizScore ?? 100, b.accuracy ?? 100));
}

export function getRecentlyStudied(state, limit = 5) {
  const chapters = flattenChapters();
  return Object.entries(state.topicActivity || {})
    .map(([chapterId, entry]) => {
      const chapter = chapters.find((item) => item.id === chapterId);
      return chapter ? { chapterId, chapter, mode: entry.lastMode, seconds: entry.seconds, lastStudiedAt: entry.lastStudiedAt } : null;
    })
    .filter(Boolean)
    .sort((a, b) => String(b.lastStudiedAt || '').localeCompare(String(a.lastStudiedAt || '')))
    .slice(0, limit);
}
export function getContinueLearning(state) {
  const chapters = flattenChapters();
  const inProgress = chapters
    .map((chapter) => {
      const progress = getTopicProgress(chapter, state);
      return { chapter, progress: progress.overall, mastery: calculateMastery(chapter, state), lastStudiedAt: state.topicActivity?.[chapter.id]?.lastStudiedAt || '' };
    })
    .filter((item) => item.progress > 0 && item.progress < 100)
    .sort((a, b) => String(b.lastStudiedAt || '').localeCompare(String(a.lastStudiedAt || '')));
  if (inProgress.length) return inProgress[0];
  const notStarted = chapters[0];
  return notStarted ? { chapter: notStarted, progress: 0, mastery: 0, lastStudiedAt: '' } : null;
}

export function getTodayStudy(state) {
  const start = getContinueLearning(state);
  if (!start) return [];
  const subjectChapters = flattenChapters().filter((chapter) => chapter.subjectId === start.chapter.subjectId);
  const index = subjectChapters.findIndex((chapter) => chapter.id === start.chapter.id);
  const windowItems = subjectChapters.slice(Math.max(0, index - 1), index + 2);
  return windowItems.map((chapter) => {
    const progress = getTopicProgress(chapter, state);
    return {
      chapter,
      status: progress.overall >= 95 ? 'done' : (chapter.id === start.chapter.id ? 'next' : (progress.overall > 0 ? 'progress' : 'upcoming'))
    };
  });
}

export function getDueRevision(state, days = 7) {
  const chapters = flattenChapters();
  const horizon = new Date(Date.now() + days * 86400000);
  return (state.revisionItems || [])
    .filter((item) => new Date(item.nextReviewAt) <= horizon)
    .map((item) => {
      const chapter = chapters.find((c) => c.id === item.chapterId);
      return chapter ? { ...item, chapter } : null;
    })
    .filter(Boolean)
    .sort((a, b) => new Date(a.nextReviewAt) - new Date(b.nextReviewAt));
}

export function getSemesterSubjects(state) {
  return demoCurriculum.subjects.map((subject) => {
    const chapters = subject.units.flatMap((unit) => unit.chapters);
    const progressValues = chapters.map((chapter) => getTopicProgress(chapter, state).overall);
    const progress = progressValues.length ? Math.round(progressValues.reduce((a, b) => a + b, 0) / progressValues.length) : 0;
    const quizAttempts = chapters.map((chapter) => state.quizAttempts?.[chapter.id]).filter(Boolean);
    const quizAccuracy = quizAttempts.length ? Math.round(quizAttempts.reduce((sum, quiz) => sum + quiz.score / Math.max(1, quiz.total), 0) / quizAttempts.length * 100) : null;
    const topicsCompleted = chapters.filter((chapter) => getTopicProgress(chapter, state).overall >= 95).length;
    return {
      id: subject.id,
      title: subject.title,
      shortDescription: subject.shortDescription,
      units: subject.units.length,
      chapters: chapters.length,
      progress,
      quizAccuracy,
      topicsCompleted,
      verificationStatus: subject.verificationStatus || 'NEEDS_REVIEW'
    };
  });
}

export function computeSemesterAnalytics(state) {
  const chapters = flattenChapters();
  const subjects = getSemesterSubjects(state);
  const allProgress = chapters.map((chapter) => getTopicProgress(chapter, state).overall);
  const overallProgress = allProgress.length ? Math.round(allProgress.reduce((a, b) => a + b, 0) / allProgress.length) : 0;
  const topicsCompleted = chapters.filter((chapter) => getTopicProgress(chapter, state).overall >= 95).length;
  const inProgressTopics = chapters.filter((chapter) => {
    const progress = getTopicProgress(chapter, state).overall;
    return progress > 0 && progress < 95;
  }).length;
  return {
    overallProgress,
    subjects,
    topicsCompleted,
    inProgressTopics,
    questionsSolved: (state.questionAttempts || []).length,
    quizAverage: averageQuizScore(state),
    streak: computeStudyStreak(state),
    studyMinutes: computeStudyMinutes(state),
    weakTopics: getWeakTopics(state),
    recentlyStudied: getRecentlyStudied(state),
    continueLearning: getContinueLearning(state),
    todayStudy: getTodayStudy(state),
    recommendedRevision: getDueRevision(state),
    semester: demoCurriculum.semester,
    year: demoCurriculum.year,
    verificationStatus: demoCurriculum.verificationStatus,
    chapterCount: chapters.length,
    unitCount: demoCurriculum.subjects.reduce((sum, subject) => sum + subject.units.length, 0),
    bookmarkCount: (state.bookmarks || []).length
  };
}