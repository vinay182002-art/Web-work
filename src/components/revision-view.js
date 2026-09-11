/**
 * Smart Revision for Semester 3.
 *
 * Surfaces what to study next: due spaced-revision items, weak topics, exam
 * focus, and bookmarked topics. The recommendation is computed by the
 * smart-revision service so every surface stays consistent.
 */
import { routes } from '../lib/router.js?v=10';
import { getSmartRevision } from '../services/smart-revision.js';
import { computeSemesterAnalytics } from '../services/semester-service.js?v=23';

export function renderRevisionView(state) {
  const smart = getSmartRevision(state);
  const semester = computeSemesterAnalytics(state);
  const next = smart.next;
  const nextRoute = next ? routes.chapter(2, 3, next.subjectId, next.chapterId) : routes.semester(2, 3);
  const nextCopy = next
    ? `<span class="card-label">${actionLabel(next.action)}</span><h2>${next.title}</h2><p>${next.reason}</p>`
    : '<h2>You are fully caught up.</h2><p>No revision is due. Keep a light retrieval habit to stay sharp.</p>';

  const renderGroup = (title, icon, items, tone) => {
    const rows = items.length
      ? items.map((item) => `
        <a class="revision-topic-card ${tone}" data-route="${routes.chapter(2, 3, item.subjectId, item.chapterId)}?tab=visual" data-searchable>
          <h3>${item.title}</h3>
          <p>${item.reason}</p>
          <small>${item.subjectTitle || item.subject}</small>
        </a>`).join('')
      : '<p class="muted">Nothing here yet.</p>';
    return `<section class="revision-section" data-searchable><p class="card-label">${icon} ${title}</p><div class="revision-grid">${rows}</div></section>`;
  };

  return `
    <section class="page-intro revision-page" data-searchable>
      <p class="eyebrow">Smart Revision · Semester ${semester.semester.number}</p>
      <h1>What should I study next?</h1>
      <p>Revision is driven by evidence: quiz scores, spaced-revision schedule, bookmarks, and exam relevance — never by guesswork.</p>
    </section>
    <section class="revision-next" data-searchable>
      <article class="sem-continue-card">
        <div class="sem-continue-copy">${nextCopy}</div>
        <div class="sem-continue-side">
          <strong class="sem-big-number">${next ? next.action.replace('-', ' ') : '✓'}</strong>
          <span>recommended action</span>
          <button class="resume-btn inline-button" data-route="${nextRoute}${next && next.action === 'revision' ? '?tab=summary' : ''}">Start now <span>↗</span></button>
        </div>
      </article>
    </section>
    ${renderGroup('Due for Revision', '🔁', smart.dueForRevision, 'is-due')}
    ${renderGroup('Weak Topics', '🔥', smart.weakTopics, 'is-weak')}
    ${renderGroup('Exam Focus', '📝', smart.examFocus, 'is-exam')}
    ${renderGroup('Important · Bookmarked', '⭐', smart.important, 'is-important')}
  `;
}

function actionLabel(action) {
  return { revision: 'Due revision', reinforce: 'Weak topic · reinforce', 'exam-prep': 'Exam focus', review: 'Bookmarked topic', start: 'Start a new topic' }[action] || 'Recommended next step';
}