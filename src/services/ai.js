/**
 * Builds the context package handed to the AI tutor.
 *
 * The curriculum/content database always stays the source of truth; the model
 * only receives context so "here", "this", and "that step" resolve to the
 * exact place Kittu is studying (year → semester → subject → unit → chapter →
 * topic → learning mode → section → question).
 */
export function buildMentorContext({ profile, chapter, state, mastery, subject, learningMode = 'deep-dive', currentSection = null, studentQuestion = '' }) {
  const unit = subject?.units?.find((unit) => unit.chapters.some((item) => item.id === chapter.id));
  const latestQuiz = state.quizAttempts?.[chapter.id];
  return {
    student_id: null,
    programme: profile.programme,
    year: profile.year,
    semester: profile.semester,
    subject: subject?.title || 'Forensic Biology',
    unit: unit?.title || 'Unit 2 · DNA analysis',
    chapter: chapter.title,
    topic: chapter.topics,
    learning_mode: learningMode,
    current_section: currentSection || learningMode,
    student_question: studentQuestion,
    current_lesson: chapter.title,
    learning_level: chapter.metadata?.contentLevel || 'standard_undergraduate_content',
    mastery_score: mastery,
    recent_quiz_results: latestQuiz || null,
    weak_topics: latestQuiz && chapter.topics?.length
      ? (latestQuiz.score < latestQuiz.total ? [chapter.topics[chapter.topics.length - 1]] : [])
      : [],
    study_history: {
      completed_sections: state.completedSections?.filter((key) => key.startsWith(`${chapter.id}:`)).length || 0,
      flashcard_reviews: Object.keys(state.flashcardReviews || {}).length,
      time_on_topic_seconds: state.topicActivity?.[chapter.id]?.seconds || 0
    },
    grounding_rules: [
      'Curriculum database is the source of truth; never invent syllabus content.',
      'Never claim official university status without a verified source.',
      'Do not assert real case findings; teaching cases are hypothetical.',
      'Keep answers within the stated method scope and limitations.'
    ],
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
