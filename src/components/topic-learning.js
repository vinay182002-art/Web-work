/** Reusable topic-module views. Content remains on the chapter record. */
function moduleFor(chapter) {
  const learning = chapter.learningModule || {};
  return {
    overview: learning.overview || chapter.description,
    objectives: learning.objectives || [`Define ${chapter.topics?.[0] || chapter.title}.`, 'Explain its forensic relevance and limitation.'],
    terminology: learning.terminology || (chapter.topics || []).map((term) => [term, `A core term used when discussing ${chapter.title}.`]),
    equipment: learning.equipment || ['Documented material', 'Appropriate measurement or examination system', 'Quality-control record'],
    materials: learning.materials || ['Relevant sample or dataset', 'Validated method materials', 'Reference or control material'],
    advantages: learning.advantages || ['Provides a structured way to answer a forensic question.'],
    limitations: learning.limitations || ['Interpretation remains limited by the sample, method scope, and documented conditions.'],
    commonMistakes: learning.commonMistakes || ['Treating an observation as a complete conclusion.'],
    examples: learning.examples || [],
    faq: learning.faq || []
  };
}

/**
 * Topic-level progress driven by evidence, never by merely opening a page:
 * Deep Dive sections, Summary/Visual completion, quiz score, question-bank
 * attempts, scheduled revision, time on topic, and bookmarks.
 */
export function getTopicProgress(chapter, state) {
  const completed = (state.completedSections || []).filter((key) => key.startsWith(`${chapter.id}:`)).length;
  const modes = state.topicModes?.[chapter.id] || {};
  const deep = modes.deep ? 100 : ((chapter.sections || []).length ? Math.round(completed / chapter.sections.length * 100) : 0);
  const summary = modes.summary ? 100 : 0;
  const visual = modes.visual ? 100 : 0;
  const quizAttempt = state.quizAttempts?.[chapter.id];
  const quiz = quizAttempt ? Math.round(quizAttempt.score / Math.max(1, quizAttempt.total) * 100) : 0;
  const chapterAttempts = (state.questionAttempts || []).filter((attempt) => attempt.chapterId === chapter.id);
  const bank = chapterAttempts.length ? Math.round(chapterAttempts.filter((attempt) => attempt.correct).length / chapterAttempts.length * 100) : 0;
  const revision = (state.revisionItems || []).some((item) => item.chapterId === chapter.id) ? 100 : 0;
  const activity = state.topicActivity?.[chapter.id];
  const time = activity?.seconds ? Math.min(100, Math.round(activity.seconds / 1200 * 100)) : 0;
  const bookmarked = (state.bookmarks || []).includes(chapter.id) ? 100 : 0;
  const overall = Math.round(
    deep * 0.22 + summary * 0.12 + visual * 0.12 + quiz * 0.22 + bank * 0.12 + revision * 0.08 + time * 0.08 + bookmarked * 0.04
  );
  return {
    deep,
    summary,
    visual,
    quiz,
    quizAttempt,
    bank,
    revision,
    time,
    bookmarked,
    overall,
    lastStudiedAt: activity?.lastStudiedAt || null,
    lastMode: activity?.lastMode || modes.lastMode || null
  };
}

export function renderTopicProgress(chapter, state) {
  const progress = getTopicProgress(chapter, state);
  const quizLabel = progress.quiz ? `${progress.quiz}%` : 'Not started';
  return `<section class="topic-progress" aria-label="Topic progress"><div class="topic-progress-heading"><span class="card-label">Topic completion</span><strong>${progress.overall}%</strong></div><div class="topic-progress-bar"><span style="width:${progress.overall}%"></span></div><div class="mode-progress-grid"><span>Deep Dive <b>${progress.deep ? `${progress.deep}%` : '—'}</b></span><span>Summary <b>${progress.summary ? '✓' : '—'}</b></span><span>Visual <b>${progress.visual ? '✓' : '—'}</b></span><span>Test <b>${quizLabel}</b></span><span>Q-Bank <b>${progress.bank ? `${progress.bank}%` : '—'}</b></span><span>Revision <b>${progress.revision ? '✓' : '—'}</b></span></div></section>`;
}

export function renderTopicDeepDive(chapter, state) {
  const learning = moduleFor(chapter);
  return `<div class="topic-module reading-stack"><div class="topic-overview"><p class="eyebrow">Deep Dive · ${chapter.estimatedMinutes} min</p><h2>${chapter.title}</h2><p>${learning.overview}</p></div><section class="topic-objectives"><p class="card-label">Learning objectives</p><ul>${learning.objectives.map((item) => `<li>${item}</li>`).join('')}</ul></section>${chapter.sections.map((section, index) => `<article class="reading-section"><span class="section-number">0${index + 1}</span><h3>${section.title}</h3><p>${section.body}</p><div class="callout-card"><strong>${index === 0 ? 'Scientific focus' : 'Remember'}</strong><p>${section.callout || 'Keep the result within the available evidence and method scope.'}</p></div><button class="text-link" data-complete-section data-chapter-id="${chapter.id}" data-section-id="${section.id}">Mark section read ✓</button></article>`).join('')}<div class="topic-detail-grid"><details open><summary>Terminology</summary>${renderDefinitionList(learning.terminology)}</details><details><summary>Equipment & materials</summary><div class="topic-columns"><div><strong>Equipment</strong><ul>${learning.equipment.map((item) => `<li>${item}</li>`).join('')}</ul></div><div><strong>Materials</strong><ul>${learning.materials.map((item) => `<li>${item}</li>`).join('')}</ul></div></div></details><details><summary>Advantages & limitations</summary><div class="topic-columns"><div><strong>Advantages</strong><ul>${learning.advantages.map((item) => `<li>${item}</li>`).join('')}</ul></div><div><strong>Limitations</strong><ul>${learning.limitations.map((item) => `<li>${item}</li>`).join('')}</ul></div></div></details><details><summary>Common mistakes & exam focus</summary><p><strong>Common mistakes</strong></p><ul>${learning.commonMistakes.map((item) => `<li>${item}</li>`).join('')}</ul><p><strong>Exam focus</strong></p><ul>${(chapter.summary?.examPoints || []).map((item) => `<li>${item}</li>`).join('')}</ul></details>${learning.examples.length ? `<details><summary>Forensic examples</summary><ul>${learning.examples.map((item) => `<li>${item}</li>`).join('')}</ul></details>` : ''}${learning.faq.length ? `<details><summary>Frequently asked questions</summary>${learning.faq.map(([question, answer]) => `<p><strong>${question}</strong><br />${answer}</p>`).join('')}</details>` : ''}<details><summary>References</summary>${(chapter.references || []).map((reference) => `<p><strong>${reference.title}</strong>${reference.author || reference.organization ? ` · ${reference.author || reference.organization}` : ''}${reference.year ? ` (${reference.year})` : ''}${reference.url ? ` · <a href="${reference.url}" target="_blank" rel="noreferrer">Source ↗</a>` : ''}</p>`).join('') || '<p>Reference metadata is awaiting review.</p>'}</details></div><button class="resume-btn inline-button" data-mark-topic-mode="${chapter.id}:deep">Mark Deep Dive complete <span>✓</span></button></div>`;
}

export function renderTopicSummary(chapter) {
  const learning = moduleFor(chapter);
  return `<div class="topic-module reading-stack"><p class="eyebrow">Quick Summary · 5–10 min</p><h2>What to remember</h2><section class="remember-card"><p class="card-label">Key definition</p><p>${chapter.summary.definition}</p></section><div class="summary-grid"><article class="content-card"><p class="card-label">Key concepts</p><ul>${chapter.summary.points.map((point) => `<li>${point}</li>`).join('')}</ul></article><article class="content-card"><p class="card-label">Process summary</p><ol>${chapter.visual.nodes.map((node) => `<li><strong>${node.label}</strong> · ${node.detail}</li>`).join('')}</ol></article><article class="content-card"><p class="card-label">Important terminology</p>${renderDefinitionList(learning.terminology.slice(0, 4))}</article><article class="callout-card"><strong>Exam points</strong><ul>${chapter.summary.examPoints.map((point) => `<li>${point}</li>`).join('')}</ul></article></div><button class="resume-btn inline-button" data-mark-topic-mode="${chapter.id}:summary">Mark Summary complete <span>✓</span></button></div>`;
}

export function renderTopicVisual(chapter) {
  return `<div class="topic-module reading-stack"><p class="eyebrow">Visual Revision · Interactive flow</p><h2>${chapter.visual.title}</h2><p class="visual-intro">Select a stage to reveal what happens, why it matters, the underlying principle, and its forensic relevance.</p><div class="process-flow topic-process-flow">${chapter.visual.nodes.map((node, index) => `<button class="process-node" data-reveal="${node.id}" aria-expanded="false"><span>0${index + 1}</span><strong>${node.label}</strong><small>${node.detail}</small><div class="process-detail" id="reveal-${node.id}"><p><b>Why:</b> ${node.why || 'This stage supports a controlled, interpretable workflow.'}</p><p><b>Principle:</b> ${node.principle || 'Use a suitable method and assess its conditions.'}</p><p><b>Materials:</b> ${node.reagents || 'Method-dependent materials and quality controls.'}</p><p><b>Forensic relevance:</b> ${node.forensic || 'Documented steps protect the scope of later interpretation.'}</p></div></button>`).join('')}</div><button class="resume-btn inline-button" data-mark-topic-mode="${chapter.id}:visual">Mark Visual Revision complete <span>✓</span></button></div>`;
}

export function renderTopicTest(chapter, state) {
  const result = state.quizAttempts?.[chapter.id];
  return `<div class="topic-module reading-stack"><p class="eyebrow">Test Yourself · Topic assessment</p><h2>${chapter.quiz.title}</h2><p>Use the questions to test recall, concepts, scenarios, and application. Answers are scored instantly and your latest attempt is saved locally.</p><div class="result-card" id="topic-quiz-result" hidden><p class="eyebrow" id="topic-quiz-result-eyebrow">Assessment result</p><h2 id="topic-quiz-result-score"></h2><p id="topic-quiz-result-message"></p></div><form class="quiz-form topic-quiz-form" data-topic-quiz data-chapter-id="${chapter.id}">${chapter.quiz.questions.map((question, index) => `<fieldset data-quiz-question="q${index}"><legend><span class="question-kind">${question.type || (index === 0 ? 'MCQ' : 'CONCEPT')}</span> ${index + 1}. ${question.prompt}</legend>${question.options.map((option, optionIndex) => `<label><input type="radio" name="q-${index}" value="${optionIndex}" required /> ${option}</label>`).join('')}<div class="quiz-question-feedback" id="quiz-feedback-q${index}" aria-live="polite"></div></fieldset>`).join('')}<button class="resume-btn" type="submit">Submit topic test <span>✓</span></button></form>${result ? `<article class="result-card" id="topic-attempt-history"><p class="eyebrow">Latest saved attempt · ${result.attempts || 1} attempt${(result.attempts || 1) === 1 ? '' : 's'}</p><h2>${result.score}/${result.total} · ${Math.round(result.score / Math.max(1, result.total) * 100)}%</h2><p>${result.weakConcepts?.length ? `Review: ${result.weakConcepts.join(', ')}.` : 'Strong result. Revisit the visual flow before your next spaced review.'}</p><details><summary>Review all answers</summary>${chapter.quiz.questions.map((question) => `<p><strong>${question.prompt}</strong></p><p>Correct answer: ${question.options[question.correctIndex]}</p><p>${question.explanation}</p>`).join('')}</details></article>` : ''}</div>`;
}

function renderDefinitionList(items) {
  return `<dl class="topic-definitions">${items.map(([term, definition]) => `<div><dt>${term}</dt><dd>${definition}</dd></div>`).join('')}</dl>`;
}
