/**
 * Smart revision for Semester 3.
 *
 * Categories:
 *   🔥 Weak topics   — quiz or practice accuracy below threshold
 *   🔁 Due for revision — scheduled revision items within the horizon
 *   ⭐ Important     — topics bookmarked by Kittu
 *   📝 Exam focus    — chapters flagged high exam relevance
 *
 * The single "study next" recommendation is deliberately deterministic and
 * explainable: due revision first, then weak reinforcement, exam prep, and
 * finally starting fresh topics.
 */
import { getDueRevision, getWeakTopics, flattenChapters } from './semester-service.js';
import { getTopicProgress } from '../components/topic-learning.js?v=24';

export function getSmartRevision(state) {
  const weakTopics = getWeakTopics(state).map((item) => ({ ...item, kind: 'weak' }));
  const dueForRevision = getDueRevision(state, 1).map((item) => ({
    chapterId: item.chapterId,
    chapter: item.chapter,
    subjectId: item.chapter.subjectId,
    subjectTitle: item.chapter.subjectTitle,
    title: item.chapter.title,
    reason: item.reason || 'Scheduled spaced revision is due.',
    nextReviewAt: item.nextReviewAt,
    kind: 'due'
  }));
  const important = (state.bookmarks || [])
    .filter((id) => !id.startsWith('question:') && !id.startsWith('concept:'))
    .map((id) => {
      const chapter = flattenChapters().find((item) => item.id === id);
      return chapter
        ? { chapterId: chapter.id, chapter, subjectId: chapter.subjectId, subjectTitle: chapter.subjectTitle, title: chapter.title, reason: 'Bookmarked as important.', kind: 'important' }
        : null;
    })
    .filter(Boolean);
  const examFocus = flattenChapters()
    .filter((chapter) => chapter.metadata?.examRelevance === 'high')
    .filter((chapter) => {
      const quiz = state.quizAttempts?.[chapter.id];
      return !quiz || quiz.score < quiz.total;
    })
    .map((chapter) => ({
      chapterId: chapter.id,
      chapter,
      subjectId: chapter.subjectId,
      subjectTitle: chapter.subjectTitle,
      title: chapter.title,
      reason: 'High exam relevance in this subject.',
      kind: 'exam'
    }));
  return {
    weakTopics,
    dueForRevision,
    important,
    examFocus,
    next: recommendNext(state, dueForRevision, weakTopics, examFocus, important)
  };
}

export function recommendNext(state, due, weak, exam, important) {
  if (due.length) return { ...due[0], action: 'revision' };
  if (weak.length) return { ...weak[0], action: 'reinforce' };
  if (exam.length) return { ...exam[0], action: 'exam-prep' };
  if (important.length) return { ...important[0], action: 'review' };
  const untouched = flattenChapters().find((chapter) => getTopicProgress(chapter, state).overall === 0);
  return untouched
    ? { chapterId: untouched.id, chapter: untouched, subjectId: untouched.subjectId, subjectTitle: untouched.subjectTitle, title: untouched.title, reason: 'Start a new topic to keep momentum.', action: 'start' }
    : null;
}