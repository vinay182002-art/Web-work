export function calculateMastery(chapter, state) {
  const quiz = state.quizAttempts[chapter.id];
  const sectionCount = chapter.sections.length;
  const completedSections = state.completedSections.filter((key) => key.startsWith(`${chapter.id}:`)).length;
  const sectionSignal = sectionCount ? (completedSections / sectionCount) * 30 : 0;
  const quizSignal = quiz ? (quiz.score / quiz.total) * 50 : 0;
  const microEntries = Object.entries(state.microChecks).filter(([key]) => key.startsWith(`${chapter.id}:`));
  const microSignal = microEntries.length ? (microEntries.filter(([, correct]) => correct).length / microEntries.length) * 10 : 0;
  const flashcardEntries = Object.entries(state.flashcardReviews);
  const retentionSignal = flashcardEntries.length ? (flashcardEntries.filter(([, rating]) => rating === 'good' || rating === 'easy').length / flashcardEntries.length) * 10 : 0;
  return Math.round(Math.min(100, sectionSignal + quizSignal + microSignal + retentionSignal));
}

export function masteryLabel(score) {
  if (score >= 85) return 'Mastered';
  if (score >= 70) return 'Strong';
  if (score >= 45) return 'Developing';
  if (score > 0) return 'Learning';
  return 'Not Started';
}

export function getRecommendation(chapter, state) {
  const quiz = state.quizAttempts[chapter.id];
  if (!quiz) return `Start ${chapter.title} with the Deep Dive before taking the quiz.`;
  if (quiz.score < quiz.total) return `Review ${chapter.topics[chapter.topics.length - 1]} before attempting the quiz again.`;
  if (state.completedSections.filter((key) => key.startsWith(`${chapter.id}:`)).length < chapter.sections.length) {
    return `Finish the remaining lesson section on ${chapter.topics[1] || chapter.title}.`;
  }
  return `Review ${chapter.title} again in 7 days to strengthen retention.`;
}

export function getRevisionItem(chapter, state) {
  const quiz = state.quizAttempts[chapter.id];
  const intervalDays = quiz && quiz.score === quiz.total ? 7 : 1;
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + intervalDays);
  return {
    chapterId: chapter.id,
    topic: quiz && quiz.score < quiz.total ? chapter.topics[chapter.topics.length - 1] : chapter.title,
    nextReviewAt: nextReview.toISOString(),
    intervalDays,
    reason: quiz && quiz.score < quiz.total ? 'Repeated mistake needs earlier review.' : 'Spaced revision after study activity.'
  };
}
