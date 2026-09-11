import { demoCurriculum, getChapter, getDefaultChapter, getSubject } from '../data/curriculum.js?v=20';
import { routes } from '../lib/router.js?v=9';
import { studyModes } from '../types/models.js';
import { calculateMastery, getRecommendation, getRevisionItem, masteryLabel } from '../services/mastery.js';
import { getGlossary, searchContent } from '../services/content-engine.js?v=20';
import { analyseAttempts, getQuestions, selectPracticeQuestions } from '../services/question-engine.js?v=20';
import { apartmentIncident, labSimulation } from '../data/lab-simulations.js';
import { defaultCoachProfile, buildPlan, getNextStep, getReadiness } from '../services/study-coach.js';
import { curriculumCatalog, flagshipReferences, getCatalogSemester } from '../data/curriculum-catalog.js';
import { academicLayers, curriculumGapAnalysis, curriculumResearchLog, masterRoadmap } from '../data/curriculum-research.js';
import { buildPersonalizedPlan, deriveLearnerProfile, getPersonalizedRecommendation } from '../services/personalization.js';
import { getContentHealth, getCoverageMatrix, getPriorityQueue } from '../services/content-operations.js';
import { getForensicChemistryAudit, getFingerprintScienceAudit, getForensicStatisticsAudit, getSubjectCompletionPipeline } from '../services/subject-audit.js?v=20';

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

const dateLabel = new Intl.DateTimeFormat('en-IN', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
  year: 'numeric'
}).format(new Date());

export function renderAppShell(route, dashboard) {
  return `
    <header class="topbar">
      <div class="topbar-left">
        <button class="menu-btn" id="menu-btn" aria-label="Open navigation"><span></span><span></span><span></span></button>
        <label class="search-box">
          <span class="search-icon">⌕</span>
          <input data-search type="search" placeholder="Search academy  (⌘K)" aria-label="Search academy" />
        </label>
      </div>
      <div class="topbar-right">
        <button class="icon-btn" id="theme-btn" aria-label="Toggle dark reading mode">◐</button>
        <button class="icon-btn" id="notifications-btn" aria-label="Notifications">◔<span class="notice-dot"></span></button>
        <button class="avatar-wrap" id="profile-btn" aria-label="Open Kittu profile">K</button>
      </div>
    </header>
    <main class="content-wrap" id="top">
      ${renderRoute(route, dashboard)}
    </main>
    ${renderDrawer()}
    <div class="toast" id="toast" role="status" aria-live="polite"></div>
    ${renderCommandPalette()}
    ${renderMobileNav()}
  `;
}

function renderCommandPalette() {
  return `<div class="command-backdrop" id="command-backdrop"></div><section class="command-palette" id="command-palette" role="dialog" aria-modal="true" aria-labelledby="command-title"><div class="command-header"><strong id="command-title">Search Forensic Atlas</strong><button id="command-close" aria-label="Close search">×</button></div><input id="command-input" type="search" placeholder="Try “open DNA”, “study coach”, or “question bank”" autocomplete="off" /><div id="command-results" class="command-results"></div><p class="command-hint">Press <kbd>Esc</kbd> to close · <kbd>⌘</kbd><kbd>K</kbd> to open</p></section>`;
}

function renderMobileNav() {
  return `<nav class="mobile-nav" aria-label="Mobile navigation"><button data-route="${routes.dashboard}"><span>⌂</span>Home</button><button data-route="${routes.learn}"><span>◌</span>Learn</button><button data-route="${routes.questions}"><span>?</span>Practice</button><button data-route="${routes.coach}"><span>✦</span>AI</button><button data-route="#/profile"><span>◉</span>Profile</button></nav>`;
}

function renderRoute(route, dashboard) {
  const [segment, year, semester, subjectId, chapterId, leaf] = route.parts;
  if (segment === 'search') return renderSearch(route);
  if (segment === 'glossary') return renderGlossary();
  if (segment === 'questions') return renderQuestionBank(dashboard.state);
  if (segment === 'lab' && year === 'case' && semester) return renderCaseFile(dashboard.state, semester);
  if (segment === 'lab') return renderLab();
  if (segment === 'coach') return renderCoach(dashboard);
  if (segment === 'ai') return renderPersonalizedAI(dashboard);
  if (segment === 'admin') return renderAdminStudio();
  if (!segment || segment === 'dashboard') return renderDashboard(dashboard);
  if (segment === 'learn' && !year) return renderLearnIndex();
  if (segment === 'learn' && year && !semester) return renderYear(year);
  if (segment === 'learn' && year && semester && subjectId && chapterId && leaf === 'quiz') {
    return renderQuiz(getChapter(subjectId, chapterId), dashboard.state, year, semester, subjectId);
  }

  function renderAdminStudio() {
    const health = getContentHealth();
    const coverage = getCoverageMatrix();
    const queue = getPriorityQueue().slice(0, 8);
    const audits = [getForensicChemistryAudit(), getFingerprintScienceAudit(), getForensicStatisticsAudit()];
    const pipeline = getSubjectCompletionPipeline();
    const auditCards = audits.map((audit) => `<div class="content-card"><p class="card-label">${audit.title} audit · ${audit.status}</p><h2>${audit.score}% completion score</h2><p>${audit.chapterCount} chapters · ${audit.questionCount} linked questions · ${audit.referenceCandidates} reference candidates.</p><div class="lesson-section-grid">${Object.entries(audit.checks).map(([check, passed]) => `<article class="content-card"><strong>${passed ? '✓' : '!'}</strong><p>${check.replaceAll(/([A-Z])/g, ' $1')}</p><span>${passed ? 'Pass' : 'Human review required'}</span></article>`).join('')}</div><p class="card-label">Human review tasks</p><ul>${audit.humanReviewTasks.slice(0, 6).map((task) => `<li>${task}</li>`).join('')}</ul></div>`).join('');
    return `<section class="page-intro"><p class="eyebrow">Restricted workspace · local demo</p><h1>Academic Content Studio.</h1><p>Governed authoring and QA surfaces for curriculum records. This local foundation does not publish content or claim university approval.</p><div class="dashboard-grid"><article class="info-card"><p class="card-label">Content health</p><h3>${health.valid}/${health.total} records structurally valid</h3><p>${health.review} awaiting review · ${health.invalid} with validation issues</p></article><article class="info-card"><p class="card-label">Publishing rule</p><h3>Human review required</h3><p>Reference candidates and standard curriculum records remain unpublished until verified.</p></article></div>${auditCards}<div class="content-card"><p class="card-label">Subject completion pipeline</p>${pipeline.map((step, index) => `<div class="plan-row"><strong>${String(index + 1).padStart(2, '0')}</strong><p>${step}</p></div>`).join('')}</div><div class="content-card"><p class="card-label">Coverage matrix</p>${coverage.map((item) => `<div class="plan-row"><strong>Year ${item.year} · ${item.title}</strong><span>${item.chapters} chapters</span><p>${item.lessons} lessons · ${item.questions} question sets · ${item.flashcards} flashcard sets · ${item.practicals} practicals · ${item.cases} cases</p><span>${item.status}</span></div>`).join('')}</div><div class="content-card"><p class="card-label">Priority queue</p>${queue.map((item) => `<div class="plan-row"><strong>#${item.priority} · ${item.title}</strong><span>Year ${item.year}</span><p>${item.reason}</p></div>`).join('')}</div><div class="content-card"><p class="card-label">Operations safeguards</p><p>Source-first metadata, duplicate-safe IDs, version metadata, validation before import, explicit verification labels, and no fabricated official papers or citations.</p></div></section>`;
  }

  function renderSearch(route) {
    const query = new URLSearchParams(window.location.hash.split('?')[1] || '').get('q') || '';
    const results = searchContent(query);
    return `<section class="page-intro"><p class="eyebrow">Knowledge search</p><h1>Search the academy.</h1><p>Results are grouped by content context so you can move from a term to its chapter.</p><form class="global-search-form"><input name="q" value="${escapeHtml(query)}" placeholder="Try DNA, quantification, or extraction" aria-label="Search knowledge" /><button class="resume-btn" type="submit">Search <span>⌕</span></button></form><div class="search-results">${query ? (results.length ? results.map((result) => `<article class="content-card"><p class="card-label">${escapeHtml(result.type)} · ${escapeHtml(result.context)}</p><h3>${escapeHtml(result.title)}</h3>${result.body ? `<p>${escapeHtml(result.body)}</p>` : ''}<button class="text-link" data-route="${result.id === 'dna-extraction' ? routes.chapter(2, 3, 'forensic-biology', 'dna-extraction') : routes.subject(2, 3, result.subjectId)}">Open context ↗</button></article>`).join('') : '<p class="empty-state">No matching content found in the current approved demo dataset.</p>') : '<p class="empty-state">Enter a term to search subjects, chapters, topics, and lesson sections.</p>'}</div></section>`;
  }

  function renderGlossary() {
    return `<section class="page-intro"><p class="eyebrow">Terminology</p><h1>Forensic glossary.</h1><p>Definitions are labelled by source status until reviewed and connected to approved references.</p><div class="lesson-section-grid">${getGlossary().map((entry) => `<article class="content-card"><p class="card-label">${entry.sourceStatus}</p><h3>${entry.term}</h3><p><strong>Definition:</strong> ${entry.definition}</p><p><strong>Simply:</strong> ${entry.simpleExplanation}</p><p class="card-label">Related: ${entry.relatedTerms.join(' · ')}</p></article>`).join('')}</div></section>`;
  }

  function renderQuestionBank(state) {
    const mode = new URLSearchParams(window.location.hash.split('?')[1] || '').get('mode') || 'quick';
    const difficulty = new URLSearchParams(window.location.hash.split('?')[1] || '').get('difficulty') || '';
    const questions = selectPracticeQuestions({ mode, limit: 10, state }).filter((question) => !difficulty || question.difficulty === difficulty);
    const analysis = analyseAttempts(state.questionAttempts);
    return `<section class="page-intro question-bank-page"><p class="eyebrow">Practice engine · source-safe demo content</p><h1>Question bank.</h1><p>Practice questions are clearly marked as supplementary until verified sources are connected. No previous-year university papers are fabricated here.</p><div class="question-bank-toolbar"><label>Mode <select id="question-mode"><option value="quick" ${mode === 'quick' ? 'selected' : ''}>Quick practice</option><option value="chapter" ${mode === 'chapter' ? 'selected' : ''}>Chapter practice</option><option value="weak" ${mode === 'weak' ? 'selected' : ''}>Weak area practice</option><option value="master" ${mode === 'master' ? 'selected' : ''}>Master mode</option></select></label><label>Difficulty <select id="question-difficulty"><option value="">All levels</option>${['EASY','MODERATE','HARD','EXPERT'].map((level) => `<option value="${level}" ${difficulty === level ? 'selected' : ''}>${level}</option>`).join('')}</select></label></div><div class="question-scorecard"><strong>${analysis.accuracy}%</strong><span>accuracy · ${analysis.total} attempts</span><span>Bloom tracking: ${analysis.byBloom.APPLY ?? '—'}% apply</span></div><div class="question-list">${questions.length ? questions.map((question, index) => renderQuestionCard(question, index, state)).join('') : '<p class="empty-state">No questions match this practice mode yet. Answer a few questions first so weak-area practice can learn from your attempts.</p>'}</div></section>`;
  }

  function renderQuestionCard(question, index, state) {
    const attempt = [...(state.questionAttempts || [])].reverse().find((item) => item.questionId === question.id);
    return `<article class="question-card" data-question-card="${question.id}"><div class="question-card-header"><span class="card-label">Q${index + 1} · ${question.questionType} · ${question.marks} mark${question.marks === 1 ? '' : 's'}</span><span class="question-badge">${question.difficulty}</span></div><h3>${question.question}</h3><div class="question-options">${question.options.map((option, optionIndex) => `<button data-question-answer="${question.id}:${optionIndex}" class="${attempt ? (optionIndex === question.correctAnswer ? 'is-correct' : attempt.selectedAnswer === optionIndex ? 'is-incorrect' : '') : ''}">${option}</button>`).join('')}</div><div class="question-meta"><span>${question.bloomLevel}</span><span>${question.relatedTopic}</span><span>${question.sourceType.replaceAll('_', ' ')}</span></div><div class="question-feedback" id="question-feedback-${question.id}">${attempt ? `<strong>${attempt.correct ? 'Correct' : 'Review this concept'}</strong><p>${question.explanation}</p><p><strong>What to revise:</strong> ${question.recommendedLesson} · ${question.commonMisconception}</p>` : 'Choose an answer to see the explanation and next revision step.'}</div></article>`;
  }

  function renderLab() {
    const saved = dashboard.state.investigations?.[apartmentIncident.id];
    const completed = saved?.stage === 'COMPLETE' ? 1 : 0;
    return `<section class="page-intro lab-page"><p class="eyebrow">Forensic Lab · educational simulations</p><h1>Observe. Analyse. Report.</h1><p>These activities are hypothetical educational simulations. They teach scientific reasoning and interpretation; they are not real laboratory results or operational casework.</p><div class="lab-stats"><article class="info-card"><p class="card-label">Available simulations</p><h3>1</h3><p>Flagship case ready</p></article><article class="info-card"><p class="card-label">Completed practicals</p><h3>${completed}</h3><p>Saved on this device</p></article><article class="info-card"><p class="card-label">Recommended practical</p><h3>${labSimulation.title}</h3><p>${labSimulation.estimatedMinutes} minutes</p></article></div><div class="content-card lab-hero-card"><p class="card-label">${apartmentIncident.label}</p><h2>Case File 001 · ${apartmentIncident.title}</h2><p>${apartmentIncident.objective}</p><p class="lab-stage">${saved ? `Saved stage: ${saved.stage.replaceAll('_', ' ')}` : 'Not started'}</p><a class="resume-btn inline-button" data-route="${routes.caseFile(apartmentIncident.id)}">${saved ? 'Continue investigation' : 'Enter interactive scene'} <span>↗</span></a></div></section>`;
  }

  function renderCoach({ state, profile }) {
    const chapter = getDefaultChapter();
    const coachProfile = { ...defaultCoachProfile, ...state.coachProfile };
    const next = getNextStep(chapter, state, coachProfile);
    const plan = buildPlan(chapter, state, coachProfile);
    const readiness = getReadiness(chapter, state);
    const examDate = coachProfile.examDate ? new Date(`${coachProfile.examDate}T00:00:00`) : null;
    const days = examDate ? Math.max(0, Math.ceil((examDate - new Date()) / 86400000)) : null;
    const goals = state.goals || [];
    return `<section class="page-intro coach-page"><p class="eyebrow">Personal study coach · ${escapeHtml(profile.name)}</p><h1>Know what to study next.</h1><p>The coach uses your saved lesson coverage, question attempts, mastery, revision state, and available time. It is a learning-readiness estimate, not a prediction of exam marks.</p><div class="coach-grid"><article class="coach-next"><p class="card-label">Today's best next step</p><h2>${escapeHtml(next.title)}</h2><p>${escapeHtml(next.reason)}</p><button class="resume-btn" data-route="${next.route}">Start now <span>↗</span></button></article><article class="coach-readiness"><p class="card-label">Learning readiness estimate</p><strong>${readiness}%</strong><p>Coverage, mastery, question accuracy, and revision combined.</p>${days === null ? '<p class="card-label">No exam date set</p>' : `<p class="card-label">${days} days until your exam date</p>`}</article></div><div class="content-card"><p class="card-label">Today's plan · ${coachProfile.dailyMinutes} minutes</p><div class="coach-plan">${plan.map((item) => `<div class="plan-row"><div><span class="card-label">${escapeHtml(item.label)} · ${item.minutes} min</span><strong>${escapeHtml(item.title)}</strong></div><button class="text-link" data-route="${item.route}">Start ↗</button></div>`).join('')}</div></div><div class="content-card"><p class="card-label">Personalise the plan</p><form id="coach-profile-form" class="coach-form"><label>Daily minutes<input name="dailyMinutes" type="number" min="10" max="180" value="${Number(coachProfile.dailyMinutes) || 30}" /></label><label>Preferred session<input name="preferredSession" type="number" min="10" max="90" value="${Number(coachProfile.preferredSession) || 20}" /></label><label>Exam date<input name="examDate" type="date" value="${escapeHtml(coachProfile.examDate)}" /></label><label>Current goal<input name="goal" value="${escapeHtml(coachProfile.goal)}" /></label><button class="resume-btn" type="submit">Save plan settings <span>✓</span></button></form></div><div class="content-card"><p class="card-label">Study goals</p>${goals.length ? goals.map((goal) => `<div class="plan-row"><strong>${escapeHtml(goal.title)}</strong><span>${escapeHtml(goal.deadline || 'No deadline')}</span></div>`).join('') : '<p class="empty-state">No goals yet. Add one to make your plan more intentional.</p>'}<form id="goal-form" class="goal-form"><input name="title" placeholder="e.g. Master Forensic Biology" required /><input name="deadline" type="date" /><button class="text-link" type="submit">Add goal +</button></form></div></section>`;
  }

  function renderCaseFile(state, caseId) {
    if (caseId !== apartmentIncident.id) return renderPlaceholder('case file');
    const investigation = state.investigations?.[caseId];
    const stage = investigation?.stage || 'START';
    const currentEvidence = investigation?.selectedEvidence?.[investigation.selectedEvidence.length - 1];
    const evidence = apartmentIncident.evidence.find((item) => item.id === currentEvidence) || apartmentIncident.evidence[0];
    const actions = apartmentIncident.actions[stage] || (stage === 'START' ? [['begin', 'Begin scene inspection']] : stage === 'ANALYSIS' ? [['continue', 'Review simulated result']] : stage === 'CASE_SYNTHESIS' ? [['report', 'Prepare simulated report']] : stage === 'REPORT' ? [['submit', 'Submit report']] : []);
    const complete = stage === 'COMPLETE';
    return `<section class="page-intro case-page"><a class="back-link" data-route="${routes.lab}">← Forensic Lab</a><p class="eyebrow">${apartmentIncident.label}</p><h1>Case File 001 · ${apartmentIncident.title}</h1><p>${apartmentIncident.objective}</p><div class="case-warning">Simulation only: observations and results are fictional teaching content, not findings about real people or evidence.</div><div class="case-stage-bar">${apartmentIncident.stages.map((item) => `<span class="${item === stage ? 'is-current' : (apartmentIncident.stages.indexOf(item) < apartmentIncident.stages.indexOf(stage) ? 'is-done' : '')}">${item.replaceAll('_', ' ')}</span>`).join('')}</div><div class="case-layout"><div class="case-scene"><div class="scene-room" aria-label="Interactive simulated apartment scene"><button class="evidence-marker marker-one" data-select-evidence="E-01">E-01</button><button class="evidence-marker marker-two" data-select-evidence="E-02">E-02</button><span class="scene-object sofa">SOFA</span><span class="scene-object window">WINDOW</span></div><div class="evidence-list">${apartmentIncident.evidence.map((item) => `<button class="evidence-chip ${currentEvidence === item.id ? 'is-selected' : ''}" data-select-evidence="${item.id}">${item.id} · ${item.type}</button>`).join('')}</div></div><aside class="evidence-panel"><p class="card-label">Selected evidence</p><h2>${evidence.id} · ${evidence.type}</h2><p><strong>Location:</strong> ${evidence.location}</p><p><strong>Observation:</strong> ${evidence.observation}</p><p><strong>Relevance:</strong> ${evidence.relevance}</p><p><strong>Contamination concern:</strong> ${evidence.contamination}</p><div class="case-actions">${actions.map(([action, label]) => `<button class="resume-btn" data-case-action="${action}" data-evidence-id="${evidence.id}">${label}</button>`).join('')}</div><button class="text-link" data-case-hint>Hint ${investigation?.hintsUsed ? `(${investigation.hintsUsed}/3 used)` : ''}</button><p id="case-feedback">${investigation?.feedback?.[0] || 'Choose an evidence marker, then decide what should happen next.'}</p></aside></div>${complete ? `<div class="content-card report-card"><p class="card-label">Simulated report complete</p><h2>Scientific conclusion</h2><p>The simulated profile is consistent with the comparison sample under the assumptions specified by this exercise. Evidence is not a determination of guilt.</p><p>Score: ${Object.values(investigation.score).reduce((sum, value) => sum + value, 0)} points across observation, handling, reasoning, interpretation, and documentation.</p></div>` : ''}</section>`;
  }
  if (segment === 'learn' && year && semester && subjectId && chapterId) {
    return renderChapter(getChapter(subjectId, chapterId), dashboard.state, subjectId, year, semester);
  }
  if (segment === 'learn' && year && semester && subjectId) return renderSubject(getSubject(subjectId), dashboard.state);
  return renderPlaceholder(segment || 'dashboard');
}

function renderDashboard({ state, profile }) {
  const chapter = getDefaultChapter();
  const progress = calculateMastery(chapter, state);
  const concepts = Math.round(progress / 100 * chapter.sections.length);
  const recommendation = getRecommendation(chapter, state);
  return `
    <section class="welcome-row" data-searchable>
      <div class="eyebrow"><span class="status-dot"></span>${dateLabel}</div>
      <h1>Good morning, ${profile.name}.</h1>
      <p class="welcome-copy">A little progress today becomes <span class="text-teal">confident expertise</span> tomorrow.</p>
    </section>
    ${renderModeSwitcher(state.mode)}
    <section class="hero-panel" id="lesson" data-searchable>
      <div class="hero-header"><span class="soft-label">${studyModes[state.mode].label} track</span><span class="time-label">⏱ ${chapter.estimatedMinutes} min</span></div>
      <div class="hero-grid">
        <div class="hero-copy-block">
          <p class="mini-label">Continue learning · demo chapter</p>
          <h2>${chapter.title}</h2>
          <p class="hero-sub">${chapter.description} Understand the science behind every step.</p>
          <button class="resume-btn" data-route="${routes.chapter(2, 3, 'forensic-biology', chapter.id)}">Open chapter <span>↗</span></button>
          <div class="progress-foot"><span>✓ ${concepts} of ${chapter.sections.length} sections</span><span>${progress ? 'In progress' : 'Not started yet'}</span></div>
        </div>
        ${renderProgressRing(progress)}
      </div>
    </section>
    ${renderAcademicCards(chapter, progress, recommendation, masteryLabel(progress))}
    ${renderCoachSummary(chapter, state)}
    ${renderPersonalizationPanel(state)}
    ${renderChallenge()}
  `;
}

function renderPersonalizationPanel(state) {
  const learner = deriveLearnerProfile(state);
  const recommendation = getPersonalizedRecommendation(state);
  return `<section class="coach-summary personalization-panel" data-searchable><div><p class="card-label">Personal academic intelligence</p><h3>${recommendation.title}</h3><p>${recommendation.reason}</p><small>Based on your recorded study activity and explicit preferences only.</small></div><div class="coach-summary-side"><strong>${learner.questionAccuracy}%</strong><span>question accuracy</span><a class="text-link" data-route="#/ai">Open AI home ↗</a></div></section>`;
}

function renderPersonalizedAI({ state }) {
  const learner = deriveLearnerProfile(state);
  const recommendation = getPersonalizedRecommendation(state);
  const plan = buildPersonalizedPlan(state);
  return `<section class="page-intro"><p class="eyebrow">Personal academic intelligence</p><h1>Kittu's academic command center.</h1><p>One transparent layer connects your learning activity, knowledge state, revision, practice, and explicit preferences.</p><div class="dashboard-grid"><article class="info-card"><p class="card-label">Learner profile</p><h3>${learner.questionAccuracy}% question accuracy</h3><p>${learner.readingCompletion}% reading completion · ${learner.retentionScore}% retention signal · ${learner.averageSessionLength || 'No'} average session minutes</p></article><article class="info-card"><p class="card-label">Why this recommendation?</p><h3>${recommendation.title}</h3><p>${recommendation.reason}</p><small>Signals: activity, accuracy, revision, flashcards, and preferences. No sensitive traits are inferred.</small><div class="rating-row"><button data-recommendation-feedback="helpful:${recommendation.type}">Helpful</button><button data-recommendation-feedback="not_helpful:${recommendation.type}">Not helpful</button></div></article></div><div class="content-card"><p class="card-label">Personalized plan</p>${plan.map((item) => `<div class="plan-row"><strong>${item.label}</strong><span>${item.minutes} min</span><p>${item.title}</p><a class="text-link" data-route="${item.route}">Open ↗</a></div>`).join('')}</div><div class="content-card"><p class="card-label">User control</p><p>Recommendations are derived from local academic activity and can be changed by updating Study Coach preferences or resetting local demo progress.</p><a class="text-link" data-route="${routes.coach}">Manage preferences ↗</a></div></section>`;
}

function renderCoachSummary(chapter, state) {
  const next = getNextStep(chapter, state, { ...defaultCoachProfile, ...state.coachProfile });
  const readiness = getReadiness(chapter, state);
  return `<section class="coach-summary" data-searchable><div><p class="card-label">Study coach · today's best next step</p><h3>${next.title}</h3><p>${next.reason}</p></div><div class="coach-summary-side"><strong>${readiness}%</strong><span>learning readiness</span><a class="text-link" data-route="${routes.coach}">Open coach ↗</a></div></section>`;
}

function renderModeSwitcher(mode) {
  return `<div class="track-switcher" aria-label="Study mode">
    ${Object.entries(studyModes).map(([key, item]) => `<button data-mode="${key}" class="${mode === key ? 'is-selected' : ''}">${item.label}</button>`).join('')}
  </div>`;
}

function renderProgressRing(progress) {
  return `<div class="ring-wrap"><div class="progress-ring"><svg viewBox="0 0 100 100" aria-hidden="true"><circle class="progress-ring-track" cx="50" cy="50" r="44" pathLength="100"></circle><circle class="progress-ring-value" cx="50" cy="50" r="44" pathLength="100" stroke-dasharray="${progress} ${100 - progress}"></circle></svg><div class="ring-inner"><strong>${progress}%</strong><span>complete</span></div></div></div>`;
}

function renderAcademicCards(chapter, progress, recommendation, label) {
  return `<section class="dashboard-grid" data-searchable>
    <article class="info-card"><p class="card-label">Your curriculum</p><h3>Year 2, Semester 3</h3><p>Supplementary / Standard Curriculum · ${demoCurriculum.subjects.length} subject ready to explore</p><a class="text-link" data-route="${routes.subject(2, 3, 'forensic-biology')}">Open Forensic Biology ↗</a></article>
    <article class="info-card"><p class="card-label">Mastery · ${label}</p><h3>${progress}%</h3><p>${recommendation}</p><a class="text-link" data-route="${routes.chapter(2, 3, 'forensic-biology', chapter.id)}?tab=quiz">Open priority revision ↗</a></article>
  </section>`;
}

function renderChallenge() {
  return `<section class="challenge-panel" id="challenge" data-searchable>
    <div class="challenge-header"><div class="badge-wrap"><span class="shield">◈</span><span class="soft-label coral">Daily challenge</span></div><span class="time-label coral">Demo case file</span></div>
    <div class="challenge-content"><div class="case-headline"><span class="case-tag">Case file #014 · demo</span></div><h3>The silent witness</h3><p>A trace fibre is found on a window latch. What should you document first?</p>
      <div class="answer-list"><button data-answer="false">Scene conditions</button><button data-answer="false">Chain of custody details</button><button data-answer="true">Physical location on the latch</button><button data-answer="false">Lab method for comparison</button></div>
    </div>
  </section>`;
}

function renderLearnIndex() {
  return `<section class="page-intro"><p class="eyebrow">Curriculum explorer · ${curriculumCatalog.verificationStatus.replaceAll('_', ' ')}</p><h1>Learn by structure.</h1><p>Explore the standard B.Sc. coverage map. University-specific requirements remain separate until an authoritative syllabus is verified.</p><div class="route-grid">${curriculumCatalog.years.map((year) => `<a data-route="${routes.year(year.number)}">${year.title}<span>↗</span></a>`).join('')}</div><div class="curriculum-layer-grid">${academicLayers.map((layer) => `<article class="content-card"><p class="card-label">${layer.status.replaceAll('_', ' ')}</p><h3>${layer.label}</h3><p>${layer.description}</p></article>`).join('')}</div><article class="content-card"><p class="card-label">Research log · ${curriculumResearchLog[0].accessedDate}</p><h3>University mapping is intentionally unresolved.</h3><p>${curriculumResearchLog[0].notes}</p></article><div class="curriculum-roadmap"><article class="content-card"><p class="card-label">Gap analysis</p>${curriculumGapAnalysis.map((item) => `<div class="plan-row"><strong>${item.area}</strong><span>${item.status.replaceAll('_', ' ')}</span><p>${item.action}</p></div>`).join('')}</article><article class="content-card"><p class="card-label">Master forensics progression</p>${masterRoadmap.map((item) => `<div class="plan-row"><strong>${item.stage}</strong><span>${item.description}</span></div>`).join('')}</article></div></section>`;
}

function renderYear(year) {
  const yearRecord = curriculumCatalog.years.find((item) => item.number === Number(year));
  if (!yearRecord) return renderPlaceholder(`year-${year}`);
  return `<section class="page-intro"><p class="eyebrow">Curriculum · ${yearRecord.title}</p><h1>${yearRecord.title}.</h1><p>Standard coverage map · university verification status remains visible for every semester.</p><div class="semester-stack">${yearRecord.semesters.map((semesterRecord) => `  <article class="content-card"><p class="card-label">${semesterRecord.title} · ${semesterRecord.verificationStatus.replaceAll('_', ' ')}</p><div class="route-grid">${semesterRecord.subjects.map((subject) => getSubject(subject.id) ? `<a data-route="${routes.subject(yearRecord.number, semesterRecord.number, subject.id)}">${subject.title}${subject.flagship ? ' · flagship' : ''}<span>↗</span></a>` : `<div class="catalog-subject"><strong>${subject.title}</strong><span>${subject.classification.replaceAll('_', ' ')} · content queued</span></div>`).join('')}</div></article>`).join('')}</div></section>`;
}

function renderSubject(subject, state = {}) {
  if (!subject) return renderPlaceholder('subject');
  const chapters = subject.units?.flatMap((unit) => unit.chapters.map((chapter) => ({ ...chapter, unitTitle: unit.title }))) || [];
  const year = subject.year || 2;
  const semester = subject.semester || 3;
  const attempts = (state.questionAttempts || []).filter((attempt) => attempt.subjectId === subject.id);
  const accuracy = attempts.length ? Math.round(attempts.filter((attempt) => attempt.correct).length / attempts.length * 100) : 0;
  const mastery = chapters.length ? Math.round(chapters.reduce((sum, chapter) => sum + calculateMastery(chapter, state), 0) / chapters.length) : 0;
  const completed = chapters.filter((chapter) => (state.completedSections || []).some((key) => key.startsWith(`${chapter.id}:`))).length;
  const next = chapters.find((chapter) => calculateMastery(chapter, state) < 100) || chapters[0];
  const readiness = Math.round(mastery * 0.55 + accuracy * 0.3 + (state.revisionItems?.some((item) => chapters.some((chapter) => chapter.id === item.chapterId)) ? 15 : 0));
  return `<section class="page-intro"><p class="eyebrow">${subject.title} · ${subject.coverageLabel}</p><h1>${subject.id === 'forensic-biology' ? `${subject.title} &amp; DNA` : subject.title}</h1><p>${subject.shortDescription}</p><div class="content-card"><p class="card-label">${subject.classification?.replaceAll('_', ' ') || 'STANDARD BSC'} · ${subject.verificationStatus || 'NEEDS REVIEW'}</p><h3>${chapters.length} connected chapters across ${subject.units.length} units</h3><p>Progress from foundation through B.Sc. understanding, application, advanced interpretation, and research extension. This is standard curriculum coverage, not an official university syllabus.</p></div><div class="academic-cards"><article class="info-card"><p class="card-label">Progress</p><h3>${completed}/${chapters.length}</h3><p>chapters started</p></article><article class="info-card"><p class="card-label">Mastery</p><h3>${mastery}%</h3><p>performance-based estimate</p></article><article class="info-card"><p class="card-label">Question accuracy</p><h3>${attempts.length ? `${accuracy}%` : '—'}</h3><p>${attempts.length || 'No'} practice attempts</p></article><article class="info-card"><p class="card-label">Exam readiness</p><h3>${readiness}%</h3><p>mastery, retrieval, revision</p></article></div><div class="content-card"><p class="card-label">Next best action · Practical readiness: ${completed ? 'in progress' : 'start with concepts'}</p><h2>${next?.title || 'Choose a chapter'}</h2><p>${completed ? 'Use your saved learning evidence to continue the lowest-mastery chapter.' : 'Start the first chapter, then use retrieval practice to establish mastery.'}</p><a class="resume-btn inline-button" data-route="${routes.chapter(year, semester, subject.id, next?.id)}">Continue learning <span>↗</span></a><a class="text-link" data-route="${routes.chapter(year, semester, subject.id, next?.id)}?tab=ai">Ask AI Mentor ↗</a></div><div class="chapter-catalog">${chapters.map((chapter, index) => `<article class="content-card"><p class="card-label">${String(index + 1).padStart(2, '0')} · ${chapter.unitTitle}</p><h3>${chapter.title}</h3><p>${chapter.description}</p><div class="chapter-catalog-meta"><span>${(chapter.metadata.classification || subject.classification || 'STANDARD_BSC').replaceAll('_', ' ')}</span><span>${chapter.estimatedMinutes} min</span></div><a class="text-link" data-route="${routes.chapter(year, semester, subject.id, chapter.id)}">Study chapter ↗</a></article>`).join('')}</div>${subject.id === 'forensic-biology' ? `<div class="content-card"><p class="card-label">Reference candidates</p>${flagshipReferences.map((reference) => `<p><strong>${reference.title}</strong> · ${reference.organization}<br /><span class="muted">${reference.note}</span></p>`).join('')}</div>` : ''}</section>`;
}

function renderChapter(chapter, state, subjectId = 'forensic-biology', year = 2, semester = 3) {
  if (!chapter) return renderPlaceholder('chapter');
  const progress = calculateMastery(chapter, state);
  const attempt = state.quizAttempts[chapter.id];
  const tab = new URLSearchParams(window.location.hash.split('?')[1] || '').get('tab') || 'deep-dive';
  const revision = state.revisionItems.find((item) => item.chapterId === chapter.id);
  return `<section class="page-intro chapter-page"><a class="back-link" data-route="${routes.subject(year, semester, subjectId)}">← ${subjectId === 'forensic-biology' ? 'Forensic Biology' : subjectId === 'forensic-chemistry' ? 'Forensic Chemistry' : subjectId.replaceAll('-', ' ')}</a><div class="chapter-heading"><div><p class="eyebrow">${chapter.metadata.contentLevel === 'foundation' ? 'Foundation' : chapter.metadata.contentLevel === 'advanced_undergraduate_content' ? 'Advanced undergraduate' : 'Supplementary / Standard Curriculum'} · ${chapter.estimatedMinutes} minutes</p><h1>${chapter.title}</h1><p>${chapter.description}</p></div><button class="bookmark-button ${state.bookmarks.includes(chapter.id) ? 'is-bookmarked' : ''}" data-bookmark="${chapter.id}">${state.bookmarks.includes(chapter.id) ? '★ Bookmarked' : '☆ Bookmark'}</button></div><div class="chapter-meta"><span>Difficulty: ${chapter.difficulty}</span><span>Relevance: ${chapter.universityRelevance}</span><span>Mastery: ${progress}%</span></div>
    <nav class="chapter-tabs" aria-label="Chapter sections">${[['deep-dive','Deep Dive'],['summary','Summary'],['visual','Visual'],['practical','Practical'],['case','Case'],['flashcards','Flashcards'],['quiz','Quiz'],['notes','Notes'],['ai','AI Tutor']].map(([key, label]) => `<button data-tab="${key}" class="${tab === key ? 'is-active' : ''}">${label}</button>`).join('')}</nav>
    <div class="chapter-layout"><div class="chapter-main">${renderChapterTab(chapter, state, tab, subjectId, year, semester)}</div><aside class="chapter-aside"><p class="card-label">Mastery · ${masteryLabel(progress)}</p><strong class="aside-progress">${progress}%</strong><p>${attempt ? `Quiz: ${attempt.score}/${attempt.total}` : 'Complete sections and quiz questions to build mastery.'}</p>${revision ? `<p class="revision-note">Next review: ${new Date(revision.nextReviewAt).toLocaleDateString('en-IN')}<br />${revision.reason}</p>` : ''}<button class="text-link" data-route="${routes.quiz(year, semester, subjectId, chapter.id)}">Open chapter quiz ↗</button></aside></div>
  </section>`;
}

function renderChapterTab(chapter, state, tab, subjectId = 'forensic-biology', year = 2, semester = 3) {
  if (tab === 'summary') return `<div class="reading-stack"><p class="eyebrow">Quick summary</p><h2>What to remember</h2><article class="content-card"><p>${chapter.summary.definition}</p><ul>${chapter.summary.points.map((point) => `<li>${point}</li>`).join('')}</ul></article><article class="callout-card"><strong>Exam points</strong><ul>${chapter.summary.examPoints.map((point) => `<li>${point}</li>`).join('')}</ul></article></div>`;
  if (tab === 'visual') return `<div class="reading-stack"><p class="eyebrow">Visual revision</p><h2>${chapter.visual.title}</h2><div class="process-flow">${chapter.visual.nodes.map((node, index) => `<button class="process-node" data-reveal="${node.id}"><span>0${index + 1}</span><strong>${node.label}</strong><small id="reveal-${node.id}">${node.detail}</small></button>`).join('')}</div></div>`;
  if (tab === 'practical') return `<div class="reading-stack"><p class="eyebrow">Practical study</p><h2>${chapter.practical.title}</h2>${chapter.practical.sections.map(([label, body]) => `<article class="content-card"><p class="card-label">${label}</p><p>${body}</p></article>`).join('')}</div>`;
  if (tab === 'case') return `<div class="reading-stack"><p class="eyebrow">Hypothetical teaching case</p><h2>${chapter.caseStudy.title}</h2>${chapter.caseStudy.sections.map(([label, body]) => `<article class="content-card"><p class="card-label">${label}</p><p>${body}</p></article>`).join('')}<textarea class="note-input" id="case-response" placeholder="What do you think should be reviewed first?"></textarea><button class="resume-btn" data-save-case>Save reasoning <span>✓</span></button></div>`;
  if (tab === 'flashcards') return `<div class="reading-stack"><p class="eyebrow">Spaced revision</p><h2>Flashcards</h2><div class="flashcard-grid">${chapter.flashcards.map((card) => `<article class="flashcard"><p class="card-label">${card.type}</p><button data-flip-card="${card.id}"><strong>${card.front}</strong><span class="flashcard-back" id="back-${card.id}">${card.back}</span></button><div class="rating-row">${['again','hard','good','easy'].map((rating) => `<button data-card-rating="${card.id}:${rating}">${rating}</button>`).join('')}</div></article>`).join('')}</div></div>`;
  if (tab === 'quiz') return `<div class="reading-stack"><p class="eyebrow">Retrieval practice</p><h2>Micro knowledge check</h2>${chapter.microChecks.map((check) => `<article class="micro-check"><strong>${check.prompt}</strong><div>${check.options.map((option, index) => `<button data-micro-answer="${check.id}:${index}">${option}</button>`).join('')}</div><p id="micro-feedback-${check.id}"></p></article>`).join('')}<a class="resume-btn inline-button" data-route="${routes.quiz(year, semester, subjectId, chapter.id)}">Take full chapter quiz ↗</a></div>`;
  if (tab === 'notes') return `<div class="reading-stack"><p class="eyebrow">Personal study space</p><h2>Notes &amp; questions</h2><textarea class="note-input" id="chapter-note" placeholder="Write a note, question, or “need to understand” item...">${escapeHtml(state.notesByChapter[chapter.id] || '')}</textarea><button class="resume-btn" data-save-note="${chapter.id}">Save note <span>✓</span></button></div>`;
  if (tab === 'ai') return `<div class="reading-stack"><p class="eyebrow">Contextual AI boundary</p><h2>Ask about this chapter</h2><p class="ai-context">Context supplied automatically: Year ${year} · Semester ${semester} · ${subjectId.replaceAll('-', ' ')} · ${chapter.title} · ${state.mode} mode · mastery ${state.progressByChapter[chapter.id] || 0}%.</p><div class="quick-actions">${['Explain simply','Explain deeply','Give an analogy','Quiz me','Give exam answer','Connect to a case'].map((action) => `<button data-ai-action="${action}">${action}</button>`).join('')}</div><div class="content-card"><p id="ai-response">AI answers will be connected to a server-side, grounded model after the knowledge base and provider are configured.</p></div></div>`;
  return `<div class="reading-stack"><p class="eyebrow">Deep dive</p><h2>${chapter.title}</h2>${chapter.sections.map((section, index) => `<article class="reading-section"><span class="section-number">0${index + 1}</span><h3>${section.title}</h3><p>${section.body}</p><div class="callout-card"><strong>${index === 0 ? 'Professional insight' : 'Remember'}</strong><p>${section.callout}</p></div><button class="text-link" data-complete-section data-chapter-id="${chapter.id}" data-section-id="${section.id}">Mark section read ✓</button></article>`).join('')}</div>`;
}

function renderQuiz(chapter, state, year = 2, semester = 3, subjectId = 'forensic-biology') {
  if (!chapter) return renderPlaceholder('quiz');
  const attempt = state.quizAttempts[chapter.id];
  return `<section class="page-intro"><a class="back-link" data-route="${routes.chapter(year, semester, subjectId, chapter.id)}">← Back to chapter</a><p class="eyebrow">${chapter.metadata.contentLevel === 'foundation' ? 'Foundation assessment' : 'Advanced assessment'} · ${chapter.quiz.questions.length} questions</p><h1>${chapter.quiz.title}.</h1><p>Answer the questions, then save your result to the study repository.</p><form class="quiz-form" id="quiz-form" data-chapter-id="${chapter.id}">${chapter.quiz.questions.map((question, index) => `<fieldset><legend>${index + 1}. ${question.prompt}</legend>${question.options.map((option, optionIndex) => `<label><input type="radio" name="q-${index}" value="${optionIndex}" required /> ${option}</label>`).join('')}</fieldset>`).join('')}<button class="resume-btn" type="submit">Save result <span>✓</span></button></form>${attempt ? `<article class="result-card"><p class="eyebrow">Latest result</p><h2>${attempt.score}/${attempt.total}</h2><p>${attempt.score < attempt.total ? `Needs work: ${chapter.topics[chapter.topics.length - 1]}. Review the explanation below before retrying.` : 'Strong result. Keep the spaced review scheduled.'}</p>${chapter.quiz.questions.map((question) => `<details><summary>${question.prompt}</summary><p>${question.explanation}</p></details>`).join('')}</article>` : ''}</section>`;
}

function renderPlaceholder(segment) {
  return `<section class="page-intro"><p class="eyebrow">Forensic Atlas</p><h1>${segment.replace('-', ' ')}.</h1><p>This route is part of the scalable application map and will be connected to verified content in the next slice.</p><a class="resume-btn inline-button" data-route="${routes.dashboard}">Return to dashboard ↗</a></section>`;
}

function renderDrawer() {
  const links = [
    ['Overview', routes.dashboard],
    ['Learn', routes.learn],
    ['Subjects', '#/subjects'],
    ['Global search', '#/search'],
    ['Glossary', '#/glossary'],
    ['Practice', '#/practice'],
    ['Question bank', routes.questions],
    ['Forensic Lab', routes.lab],
    ['Study Coach', routes.coach],
    ['Revision', '#/revision'],
    ['Study tracker', '#/tracker'],
    ['Profile & settings', '#/profile']
  ];
  return `<div class="drawer-backdrop" id="drawer-backdrop"></div><aside class="app-drawer" id="app-drawer" aria-hidden="true"><button class="drawer-close" id="drawer-close" aria-label="Close menu">×</button><p class="mini-label drawer-label">Forensic Atlas</p><h2>Kittu's study lab</h2><nav class="drawer-nav" aria-label="Primary navigation">${links.map(([label, path]) => `<button data-route="${path}">${label}<span>↗</span></button>`).join('')}<button id="reset-progress">Reset local demo progress <span>↺</span></button></nav><p class="drawer-note">Demo content is clearly marked. Academic progress is kept behind a repository boundary ready for synchronized storage.</p></aside>`;
}
