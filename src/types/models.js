/**
 * @typedef {{ id: string, title: string, body: string }} LessonSection
 * @typedef {{ id: string, prompt: string, options: string[], correctIndex: number, explanation: string }} Question
 * @typedef {{ id: string, title: string, description: string, estimatedMinutes: number, topics: string[], sections: LessonSection[], quiz: { id: string, title: string, questions: Question[] }, flashcards: { id: string, front: string, back: string }[], practical: { title: string, objective: string }, caseStudy: { title: string, prompt: string, note: string } }} Chapter
 * @typedef {{ progressByChapter: Record<string, number>, completedSections: string[], quizAttempts: Record<string, { score: number, total: number, completedAt: string }>, mode: 'university'|'master' }} StudyState
 */

export const studyModes = {
  university: { label: 'University', description: 'Exam-focused' },
  master: { label: 'Master forensics', description: 'Advanced learning' }
};
