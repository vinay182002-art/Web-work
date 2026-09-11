/**
 * Semester 3 dashboard.
 *
 * Premium overview of the whole semester: overall progress, subject cards,
 * continue-learning, today's study stepper, quiz accuracy, weak topics,
 * recently studied, and recommended revision. Purely data-driven.
 */
import { routes } from '../lib/router.js?v=10';
import { computeSemesterAnalytics } from '../services/semester-service.js?v=23';

function bar(value) {
  const safe = Math.max(0, Math.min(100, Math.round(value || 0)));
  return `<div class="sem-bar" role="img" aria-label="${safe}% complete"><span style="width:${safe}%"></span></div>`;
}

function progressRing(value) {
  const safe = Math.max(0, Math.min(100, Math.round(value || 0)));
  return `<div class="ring-wrap sem-ring"><div class="progress-ring"><svg viewBox="0 0 100 100" aria-hidden="true"><circle class="progress-ring-track" cx="50" cy="50" r="44" pathLength="100"></circle><circle class="progress-ring-value" cx="50" cy="50" r="44" pathLength="100" stroke-dasharray="${safe} ${100 - safe}"></circle></svg><div class="ring-inner"><strong>${safe}%</strong><span>complete</span></div></div></div>`;
}

function minutesLabel(seconds) {
  if (!seconds) return 'Not started';
  const minutes = Math.round(seconds / 60);
  return minutes < 1 ? 'Less than a minute' : `${minutes} min`;
}

export function renderSemesterDashboard(dashboard) {
  const a = computeSemesterAnalytics(dashboard.state);
  const year = a.year.number;
  const semester = a.semester.number;
  const routeFor = (chapter) => routes.chapter(year, semester, chapter.subjectId, chapter.id);
  const continueItem = a.continueLearning;
  const stats = [
    ['Subjects', String(a.subjects.length), 'ready to explore'],
    ['Units', String(a.unitCount), 'across four subjects'],
    ['Chapters', String(a.chapterCount), 'topics in Semester 3'],
    ['Topics completed', String(a.topicsCompleted), `${a.inProgressTopics} in progress`],
    ['Questions solved', String(a.questionsSolved), 'practice attempts'],
    ['Average quiz score', a.quizAverage === null ? '—' : `${a.quizAverage}%`, a.quizAverage === null ? 'complete a Test Yourself' : 'topic tests'],
    ['Study streak', `${a.streak} day${a.streak === 1 ? '' : 's'}`, a.streak ? 'keep it alive today' : 'start today'],
    ['Study time', `${a.studyMinutes} min`, 'focused learning']
  ];
  const stepIcon = { done: '✓', next: '→', progress: '◔', upcoming: '○' };
  const subjectsHtml = a.subjects.map((item) => `
    <a class="subject-card" data-route="${routes.subject(year, semester, item.id)}" data-searchable>
      <div class="subject-card-head"><div><h3>${item.title}</h3><p>${item.shortDescription}</p></div><strong>${item.progress}%</strong></div>
      ${bar(item.progress)}
      <p>${item.chapters} chapters · ${item.units} units · ${item.topicsCompleted} completed${item.quizAccuracy === null ? '' : ` · quiz ${item.quizAccuracy}%`}</p>
    </a>`).join('');
  const weakHtml = a.weakTopics.length
    ? a.weakTopics.slice(0, 5).map((weak) => `<a class="weak-chip" data-route="${routeFor({ subjectId: weak.subjectId, id: weak.chapterId })}" data-searchable><strong>${weak.title}</strong><small>${weak.subjectTitle} · ${weak.reasons.join(' · ')}</small></a>`).join('')
    : '<p class="muted">No weak topics yet — keep practising and the dashboard will adapt.</p>';
  const recentHtml = a.recentlyStudied.length
    ? a.recentlyStudied.map((item) => `<a class="recent-row" data-route="${routeFor(item.chapter)}" data-searchable><span class="recent-dot"></span><div><strong>${item.chapter.title}</strong><small>${item.chapter.subjectTitle} · ${item.mode || 'deep-dive'} · ${minutesLabel(item.seconds)}</small></div><span class="recent-arrow">↗</span></a>`).join('')
    : '<p class="muted">No topics studied yet. Open DNA Extraction to begin.</p>';
  const revisionHtml = a.recommendedRevision.length
    ? a.recommendedRevision.slice(0, 4).map((item) => `<a class="recent-row" data-route="${routeFor(item.chapter)}?tab=visual" data-searchable><span class="recent-dot is-due"></span><div><strong>${item.chapter.title}</strong><small>${item.reason} · next ${new Date(item.nextReviewAt).toLocaleDateString('en-IN')}</small></div><span class="recent-arrow">↗</span></a>`).join('')
    : '<p class="muted">Nothing is due yet. New topics get scheduled after their first Test Yourself.</p>';
  const todayHtml = a.todayStudy.length
    ? `<div class="today-stepper">${a.todayStudy.map((item) => `
      <div class="step-item ${item.status}" data-searchable>
        <span class="step-icon">${stepIcon[item.status] || '○'}</span>
        <div><strong>${item.chapter.title}</strong><small>${item.chapter.subjectTitle}</small></div>
        <button class="text-link" data-route="${routeFor(item.chapter)}">Study</button>
      </div>`).join('')}</div>`
    : '<p class="muted">Select a subject below to build today\'s plan.</p>';

const continueHtml = continueItem
    ? `<article class="sem-continue-card" data-searchable>
        <div class="sem-continue-copy">
          <p class="card-label">Continue learning · ${continueItem.chapter.subjectTitle}</p>
          <h2>${continueItem.chapter.title}</h2>
          <p>${continueItem.chapter.description}</p>
        </div>
        <div class="sem-continue-side">
          <strong class="sem-big-number">${continueItem.progress}%</strong>
          <span>complete</span>
          ${bar(continueItem.progress)}
          <button class="resume-btn inline-button" data-route="${routeFor(continueItem.chapter)}">Continue <span>↗</span></button>
        </div>
      </article>`
    : '';

  return `
    <section class="page-intro semester-page" data-searchable>
      <p class="eyebrow">Year ${year} · ${a.semester.title} · ${String(a.verificationStatus).replaceAll('_', ' ')}</p>
      <h1>${a.semester.title}.</h1>
      <p>Kittu's complete Semester 3 study platform — subjects, units, chapters, topics, retrieval practice, and revision in one laboratory.</p>
    </section>
    <section class="sem-overview" data-searchable>
      <article class="sem-progress-card">
        <p class="card-label">Overall progress</p>
        ${progressRing(a.overallProgress)}
        <p>${a.topicsCompleted} of ${a.chapterCount} topics completed · ${a.inProgressTopics} in progress</p>
        <a class="text-link" data-route="${routes.revision}">Open Smart Revision ↗</a>
      </article>
      <div class="stat-grid">${stats.map(([label, value, sub]) => `<article class="stat-card" data-searchable><p class="card-label">${label}</p><h3>${value}</h3><span>${sub}</span></article>`).join('')}</div>
    </section>
    ${continueHtml}
    <section class="sem-section" data-searchable>
      <p class="card-label">Today's study</p>
      ${todayHtml}
    </section>
    <section class="sem-section" data-searchable>
      <p class="card-label">Subjects</p>
      <div class="subject-grid">${subjectsHtml}</div>
    </section>
    <section class="sem-columns">
      <article class="sem-panel" data-searchable>
        <p class="card-label">Quiz accuracy</p>
        <h2 class="sem-big-number">${a.quizAverage === null ? '—' : `${a.quizAverage}%`}</h2>
        <p class="muted">${a.quizAverage === null ? 'Complete a "Test Yourself" to start tracking accuracy.' : `Average score across ${Object.keys(dashboard.state.quizAttempts || {}).length} attempted topic tests.`}</p>
        <p class="card-label">Weak topics</p>
        ${weakHtml}
      </article>
      <article class="sem-panel" data-searchable>
        <p class="card-label">Recently studied</p>
        ${recentHtml}
        <p class="card-label">Recommended revision</p>
        ${revisionHtml}
      </article>
    </section>
    <section class="callout-card sem-syllabus-note" data-searchable>
      <strong>Verified syllabus required</strong>
      <p>Semester 3 content is currently ${String(a.verificationStatus).replaceAll('_', ' ')} — supplementary / standard B.Sc. coverage, not an official university syllabus. When Kittu's verified semester scheme (subjects → units → chapters → topics) is supplied, it can be imported without rebuilding any component.</p>
    </section>`;
}