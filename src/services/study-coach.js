import { getDefaultChapter } from '../data/curriculum.js';
import { calculateMastery } from './mastery.js';
import { analyseAttempts, selectPracticeQuestions } from './question-engine.js';

export const defaultCoachProfile = {
  dailyMinutes: 30,
  preferredSession: 20,
  goal: 'Build a reliable Semester 3 foundation',
  examDate: ''
};

export function getReadiness(chapter, state) {
  const mastery = calculateMastery(chapter, state);
  const questions = analyseAttempts(state.questionAttempts || []);
  const revision = state.revisionItems?.length ? 100 : 0;
  const coverage = chapter.sections.length
    ? Math.round(state.completedSections.filter((key) => key.startsWith(`${chapter.id}:`)).length / chapter.sections.length * 100)
    : 0;
  return Math.round(coverage * 0.25 + mastery * 0.35 + questions.accuracy * 0.25 + revision * 0.15);
}

export function getNextStep(chapter, state, profile = defaultCoachProfile) {
  const mastery = calculateMastery(chapter, state);
  const accuracy = analyseAttempts(state.questionAttempts || []).accuracy;
  if (!state.completedSections.some((key) => key.startsWith(`${chapter.id}:`))) {
    return {
      title: `Review ${chapter.topics[0]} for ${profile.preferredSession} minutes`,
      reason: 'You have not completed a lesson section yet, so foundational coverage has the highest learning value.',
      action: 'lesson',
      route: '#/learn/2/3/forensic-biology/dna-extraction'
    };
  }
  if (accuracy < 70) {
    return {
      title: 'Complete 10 targeted practice questions',
      reason: `Your current question accuracy is ${accuracy}%. Retrieval practice will expose the concepts that need revision.`,
      action: 'questions',
      route: '#/questions?mode=weak'
    };
  }
  return {
    title: `Revisit ${chapter.title} with spaced revision`,
    reason: `Your current chapter mastery is ${mastery}%. A short review now supports retention before the next quiz.`,
    action: 'revision',
    route: '#/learn/2/3/forensic-biology/dna-extraction?tab=summary'
  };
}

export function buildPlan(chapter, state, profile = defaultCoachProfile) {
  const next = getNextStep(chapter, state, profile);
  const minutes = Math.max(10, Math.min(90, Number(profile.dailyMinutes) || 30));
  const practiceMinutes = Math.min(20, Math.round(minutes * 0.4));
  return [
    { label: 'Priority', title: next.title, minutes: minutes - practiceMinutes, route: next.route },
    { label: 'Retrieval', title: `Answer ${Math.min(10, selectPracticeQuestions({ limit: 10, state }).length)} related questions`, minutes: practiceMinutes, route: '#/questions?mode=chapter' }
  ];
}
