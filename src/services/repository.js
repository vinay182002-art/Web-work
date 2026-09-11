import { demoCurriculum } from '../data/curriculum.js';

const stateKey = 'forensic-atlas-study-state-v2';
const defaultState = {
  progressByChapter: {},
  completedSections: [],
  quizAttempts: {},
  questionAttempts: [],
  microChecks: {},
  flashcardReviews: {},
  notesByChapter: {},
  bookmarks: [],
  studySessions: [],
  revisionItems: [],
  investigations: {},
  coachProfile: {},
  recommendationFeedback: [],
  goals: [],
  mode: 'university'
};

export const demoProfile = {
  name: 'Kittu',
  university: 'Anjaneya University',
  programme: 'B.Sc. Forensic Science',
  year: 2,
  semester: 3
};

function readState() {
  try {
    return { ...defaultState, ...JSON.parse(localStorage.getItem(stateKey) || '{}') };
  } catch (error) {
    console.warn('Study state could not be restored; starting a new local session.', error);
    return { ...defaultState };
  }
}

let state = readState();

function persist() {
  try {
    localStorage.setItem(stateKey, JSON.stringify(state));
  } catch (error) {
    console.error('Study state could not be saved locally.', error);
    throw new Error('Your study state could not be saved on this device.', { cause: error });
  }
}

/**
 * This repository is the single client-side boundary for academic state.
 * It can be replaced by a Supabase implementation without changing views.
 */
export const repository = {
  async getDashboard() {
    return { curriculum: demoCurriculum, profile: demoProfile, state: { ...state } };
  },

  async getCurriculum() {
    return demoCurriculum;
  },

  async getStudyState() {
    return { ...state };
  },

  async setMode(mode) {
    state = { ...state, mode };
    persist();
    return { ...state };
  },

  async completeSection(chapterId, sectionId) {
    const key = `${chapterId}:${sectionId}`;
    const sections = new Set(state.completedSections);
    sections.add(key);
    const chapterSections = [...sections].filter((sectionKey) => sectionKey.startsWith(`${chapterId}:`));
    state = {
      ...state,
      completedSections: [...sections],
      progressByChapter: { ...state.progressByChapter, [chapterId]: Math.max(state.progressByChapter[chapterId] || 0, chapterSections.length >= 2 ? 75 : 50) }
    };
    persist();
    return { ...state };
  },

  async recordQuizAttempt(chapterId, score, total) {
    const quizProgress = total ? Math.round(score / total * 100) : 0;
    state = {
      ...state,
      progressByChapter: { ...state.progressByChapter, [chapterId]: Math.max(state.progressByChapter[chapterId] || 0, quizProgress) },
      quizAttempts: { ...state.quizAttempts, [chapterId]: { score, total, completedAt: new Date().toISOString() } }
    };
    persist();
    return { ...state };
  },

  async recordQuestionAttempt(questionId, topicId, bloomLevel, correct, selectedAnswer, context = {}) {
    state = {
      ...state,
      questionAttempts: [
        ...state.questionAttempts.filter((attempt) => !(attempt.questionId === questionId && attempt.selectedAnswer === selectedAnswer)),
        { questionId, topicId, bloomLevel, correct, selectedAnswer, subjectId: context.subjectId || null, chapterId: context.chapterId || null, attemptedAt: new Date().toISOString() }
      ]
    };
    persist();
    return { ...state };
  },

  async recordMicroCheck(chapterId, checkId, correct) {
    state = {
      ...state,
      microChecks: { ...state.microChecks, [`${chapterId}:${checkId}`]: correct }
    };
    persist();
    return { ...state };
  },

  async reviewFlashcard(cardId, rating) {
    state = { ...state, flashcardReviews: { ...state.flashcardReviews, [cardId]: rating } };
    persist();
    return { ...state };
  },

  async saveNote(chapterId, note) {
    state = { ...state, notesByChapter: { ...state.notesByChapter, [chapterId]: note } };
    persist();
    return { ...state };
  },

  async toggleBookmark(chapterId) {
    const bookmarks = new Set(state.bookmarks);
    bookmarks.has(chapterId) ? bookmarks.delete(chapterId) : bookmarks.add(chapterId);
    state = { ...state, bookmarks: [...bookmarks] };
    persist();
    return { ...state };
  },

  async scheduleRevision(item) {
    state = {
      ...state,
      revisionItems: [...state.revisionItems.filter((existing) => existing.chapterId !== item.chapterId), item]
    };
    persist();
    return { ...state };
  },

  async startStudySession(context) {
    const session = { ...context, startedAt: new Date().toISOString(), endedAt: null };
    state = { ...state, studySessions: [...state.studySessions, session] };
    persist();
    return session;
  },

  async finishStudySession(startedAt) {
    state = {
      ...state,
      studySessions: state.studySessions.map((session) => session.startedAt === startedAt
        ? { ...session, endedAt: new Date().toISOString() }
        : session)
    };
    persist();
    return { ...state };
  },

  async saveInvestigation(investigation) {
    state = { ...state, investigations: { ...state.investigations, [investigation.caseId]: investigation } };
    persist();
    return { ...investigation };
  },

  async getInvestigation(caseId) {
    return state.investigations[caseId] || null;
  },

  async saveCoachProfile(profile) {
    state = { ...state, coachProfile: { ...state.coachProfile, ...profile } };
    persist();
    return { ...state.coachProfile };
  },

  async addGoal(goal) {
    const entry = { ...goal, id: `goal-${Date.now()}`, createdAt: new Date().toISOString() };
    state = { ...state, goals: [...state.goals, entry] };
    persist();
    return entry;
  },

  async saveRecommendationFeedback(feedback) {
    state = {
      ...state,
      recommendationFeedback: [
        ...(state.recommendationFeedback || []).filter((item) => item.recommendationKey !== feedback.recommendationKey),
        { ...feedback, createdAt: new Date().toISOString() }
      ]
    };
    persist();
    return feedback;
  },

  async resetProgress() {
    state = { ...defaultState, mode: state.mode };
    persist();
    return { ...state };
  }
};
