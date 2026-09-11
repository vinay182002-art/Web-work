/**
 * Subject dashboard for Semester 3.
 *
 * One page per subject: progress ring, stats, per-unit chapter rows (topics,
 * completion %, quiz status, question-bank status), weak topics, and recent
 * activity. Data-driven — no hardcoded subject content.
 */
import { routes } from '../lib/router.js?v=10';
import { getTopicProgress } from './topic-learning.js?v=24';
import { calculateMastery } from '../services/mastery.js';
import { analyseAttempts, getQuestions } from '../services/question-engine.js?v=21';

function bar(value) {
  const safe = Math.max(0, Math.min(100, Math.round(value || 0)));
  return `<div class="sem-bar" role="img" aria-label="${safe}% complete"><span style="width:${safe}%"></span></div>`;
}

function progressRing(value) {
  const safe = Math.max(0, Math.min(100, Math.round(value || 0)));
  return `<div class="ring-wrap sem-ring"><div class="progress-ring"><svg viewBox="0 0 100 100" aria-hidden="true"><circle class="progress-ring-track" cx="50" cy="50" r="44" pathLength="100"></circle><circle class="progress-ring-value" cx="50" cy="50" r="44" pathLength="100" stroke-dasharray="${safe} ${100 - safe}"></circle></svg><div class="ring-inner"><strong>${safe}%</strong><span>complete</span></div></div></div>`;
}

export function renderSubjectDashboard(subject, state) {
  if (!subject) return '';
  const year = subject.year || 2;
  const semester = subject.semester || 3;
  const chapters = subject.units.flatMap((unit) => unit.chapters.map((chapter) => ({ ...chapter, unitId: unit.id, unitTitle: unit.title })));
  const attempts = (state.questionAttempts || []).filter((attempt) => attempt.subjectId === subject.id);
  const analysis = analyseAttempts(attempts);
  const topicStates = chapters.map((chapter) => ({ chapter, progress: getTopicProgress(chapter, state) }));
  const progressValues = topicStates.map((item) => item.progress.overall);
  const progress = progressValues.length ? Math.round(progressValues.reduce((a, b) => a + b, 0) / progressValues.length) : 0;
  const completedChapters = topicStates.filter((item) => item.progress.overall >= 95).length;
  const startedChapters = topicStates.filter((item) => item.progress.overall > 0).length;
  const weakTopics = topicStates.filter((item) => {
    const quiz = item.progress.quizAttempt;
    const chapterAttempts = attempts.filter((attempt) => attempt.chapterId === item.chapter.id);
    const accuracy = chapterAttempts.length ? Math.round(chapterAttempts.filter((attempt) => attempt.correct).length / chapterAttempts.length * 100) : null;
    return (quiz && item.progress.quiz < 70) || (accuracy !== null && accuracy < 70);
  }).map((item) => item.chapter);
  const next = topicStates
    .filter((item) => item.progress.overall > 0 && item.progress.overall < 100)
    .sort((a, b) => String(state.topicActivity?.[b.chapter.id]?.lastStudiedAt || '').localeCompare(String(state.topicActivity?.[a.chapter.id]?.lastStudiedAt || '')))[0]
    || topicStates.find((item) => item.progress.overall === 0)
    || topicStates[0];
  const recent = Object.entries(state.topicActivity || {})
    .filter(([chapterId]) => chapters.some((chapter) => chapter.id === chapterId))
    .sort((a, b) => String(b[1].lastStudiedAt || '').localeCompare(String(a[1].lastStudiedAt || '')))
    .slice(0, 5)
    .map(([chapterId, entry]) => ({ chapter: chapters.find((chapter) => chapter.id === chapterId), ...entry }));
  const stats = [
    ['Units', String(subject.units.length), 'in this semester'],
    ['Chapters', String(chapters.length), 'topics to master'],
    ['Topics', String(chapters.reduce((sum, chapter) => sum + (chapter.topics?.length || 1), 0)), 'named concepts'],
    ['Started', String(startedChapters), 'opened with evidence'],
    ['Completed', String(completedChapters), 'all modes + quiz'],
    ['Quiz accuracy', analysis.total ? `${analysis.accuracy}%` : '—', `${analysis.total} practice attempts`],
    ['Weak topics', String(weakTopics.length), weakTopics.length ? 'review below' : 'looking strong'],
    ['Mastery', `${Math.round(topicStates.reduce((sum, item) => sum + calculateMastery(item.chapter, state), 0) / Math.max(1, topicStates.length))}%`, 'performance estimate']
  ];
  const unitHtml = subject.units.map((unit, unitIndex) => {
    const unitStates = unit.chapters.map((chapter) => ({ chapter, progress: getTopicProgress(chapter, state) }));
    const unitProgress = Math.round(unitStates.reduce((sum, item) => sum + item.progress.overall, 0) / Math.max(1, unitStates.length));
    return `<section class="unit-section" data-searchable>
      <div class="unit-header">
        <div><p class="card-label">Unit ${String(unitIndex + 1).padStart(2, '0')}</p><h2>${unit.title}</h2></div>
        <div class="unit-progress"><strong>${unitProgress}%</strong>${bar(unitProgress)}</div>
      </div>
      <div class="chapter-rows">${unit.chapters.map((chapter) => {
        const progress = getTopicProgress(chapter, state);
        const bankCount = getQuestions({ chapterId: chapter.id }).length;
        const statusIcon = progress.overall >= 95 ? '✓' : (progress.overall > 0 ? '→' : '○');
        return `<article class="chapter-row" data-searchable>
          <span class="chapter-status">${statusIcon}</span>
          <div class="chapter-row-main">
            <h3>${chapter.title}</h3>
            <p>${chapter.topics?.length || 1} topics · ${progress.overall}% complete</p>
            <div class="chapter-row-meta">
              <span>Quiz: ${progress.quizAttempt ? `${progress.quizAttempt.score}/${progress.quizAttempt.total}` : 'Not attempted'}</span>
              <span>Question bank: ${bankCount} Qs</span>
              <span>${chapter.estimatedMinutes} min</span>
            </div>
          </div>
          ${bar(progress.overall)}
          <a class="text-link" data-route="${routes.chapter(year, semester, subject.id, chapter.id)}">Study ↗</a>
        </article>`;
      }).join('')}</div>
    </section>`;
  }).join('');
const weakHtml = weakTopics.length
    ? `<div class="weak-topic-grid">${weakTopics.map((chapter) => {
        const progress = getTopicProgress(chapter, state);
        const reason = progress.quizAttempt && progress.quiz < 70 ? `Quiz ${progress.quiz}%` : 'Practice accuracy below 70%';
        return `<a class="weak-chip" data-route="${routes.chapter(year, semester, subject.id, chapter.id)}?tab=quiz" data-searchable><strong>${chapter.title}</strong><small>${reason} · ${chapter.topics?.length || 1} topics</small></a>`;
      }).join('')}</div>`
    : '<p class="muted">No weak topics in this subject — keep the retrieval habit.</p>';
  const recentHtml = recent.length
    ? recent.map((item) => `<a class="recent-row" data-route="${routes.chapter(year, semester, subject.id, item.chapter.id)}" data-searchable><span class="recent-dot"></span><div><strong>${item.chapter.title}</strong><small>${item.lastMode || 'deep-dive'} · ${Math.round((item.seconds || 0) / 60)} min studied</small></div><span class="recent-arrow">↗</span></a>`).join('')
    : '<p class="muted">Study a chapter to start building this subject\'s activity record.</p>';

  const nextRoute = next ? routes.chapter(year, semester, subject.id, next.chapter.id) : routes.semester(year, semester);
  const nextLabel = next ? next.chapter.title : 'Semester overview';

  return `
    <section class="page-intro subject-page" data-searchable>
      <a class="back-link" data-route="${routes.semester(year, semester)}">← Semester ${semester}</a>
      <p class="eyebrow">${subject.title} · ${subject.coverageLabel || 'Supplementary / Standard Curriculum'}</p>
      <h1>${subject.title}.</h1>
      <p>${subject.shortDescription}</p>
      <div class="content-card subject-verification-note">
        <p class="card-label">${String(subject.classification || 'STANDARD BSC').replaceAll('_', ' ')} · ${String(subject.verificationStatus || 'NEEDS REVIEW').replaceAll('_', ' ')}</p>
        <p>${chapters.length} chapters across ${subject.units.length} units. This is standard curriculum coverage, not an official university syllabus.</p>
      </div>
    </section>
    <section class="subject-overview" data-searchable>
      <article class="sem-progress-card">
        <p class="card-label">Progress</p>
        ${progressRing(progress)}
        <p>${completedChapters} of ${chapters.length} chapters completed</p>
        <a class="text-link" data-route="${routes.questions}?mode=chapter">Open question bank ↗</a>
      </article>
      <div class="stat-grid">${stats.map(([label, value, sub]) => `<article class="stat-card" data-searchable><p class="card-label">${label}</p><h3>${value}</h3><span>${sub}</span></article>`).join('')}</div>
    </section>
    <section class="sem-section" data-searchable>
      <p class="card-label">Continue learning</p>
      <div class="sem-continue-card">
        <div class="sem-continue-copy">
          <p class="card-label">Next best action</p>
          <h2>${nextLabel}</h2>
          <p>${next ? 'Use your saved learning evidence to continue this topic, then test yourself to lock it in.' : 'This subject is fully mastered — move to the Semester dashboard.'}</p>
        </div>
        <div class="sem-continue-side">
          <strong class="sem-big-number">${next ? Math.round(next.progress.overall) : 100}%</strong>
          <span>complete</span>
          ${bar(next ? next.progress.overall : 100)}
          <button class="resume-btn inline-button" data-route="${nextRoute}">Continue <span>↗</span></button>
        </div>
      </div>
    </section>
    ${unitHtml}
    <section class="sem-section" data-searchable>
      <p class="card-label">Weak topics</p>
      ${weakHtml}
    </section>
    <section class="sem-section" data-searchable>
      <p class="card-label">Recent activity</p>
      ${recentHtml}
    </section>`;
}