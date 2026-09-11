export function buildMentorContext({ profile, chapter, state, mastery, subject }) {
  return {
    student_id: null,
    programme: profile.programme,
    year: profile.year,
    semester: profile.semester,
    subject: subject?.title || 'Forensic Biology',
    unit: subject?.units?.find((unit) => unit.chapters.some((item) => item.id === chapter.id))?.title || 'Unit 2 · DNA analysis',
    chapter: chapter.title,
    topic: chapter.topics,
    current_lesson: chapter.title,
    learning_level: chapter.metadata.contentLevel,
    mastery_score: mastery,
    recent_quiz_results: state.quizAttempts[chapter.id] || null,
    weak_topics: state.quizAttempts[chapter.id]?.score < state.quizAttempts[chapter.id]?.total ? [chapter.topics[chapter.topics.length - 1]] : [],
    study_history: {
      completed_sections: state.completedSections.filter((key) => key.startsWith(`${chapter.id}:`)).length,
      flashcard_reviews: Object.keys(state.flashcardReviews).length
    },
    user_message: ''
  };
}

export const aiService = {
  async askForensicMentor() {
    throw new Error('Forensic Mentor API is not configured. Add a server-side AI provider before enabling live answers.');
  },
  async askAssignmentMentor() {
    throw new Error('Assignment Mentor API is not configured. Add a server-side AI provider before enabling live answers.');
  }
};
