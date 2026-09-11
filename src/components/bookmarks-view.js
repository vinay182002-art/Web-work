/**
 * My Bookmarks.
 *
 * Kittu can bookmark topics (chapter-level), questions, and — in the future —
 * visual diagrams and revision cards. Bookmarks live in the repository; this
 * view resolves them against the curriculum rather than storing UI state.
 */
import { routes } from '../lib/router.js?v=10';
import { flattenChapters } from '../services/semester-service.js?v=23';
import { getQuestions } from '../services/question-engine.js?v=21';
import { getTopicProgress } from './topic-learning.js?v=24';

export function renderBookmarksView(state) {
  const chapters = flattenChapters();
  const ids = state.bookmarks || [];
  const chapterIds = ids.filter((id) => !id.includes(':'));
  const questionIds = ids.filter((id) => id.startsWith('question:')).map((id) => id.replace('question:', ''));
  const conceptIds = ids.filter((id) => id.startsWith('concept:'));
  const chapterCards = chapterIds.map((id) => {
    const chapter = chapters.find((item) => item.id === id);
    if (!chapter) return null;
    const progress = getTopicProgress(chapter, state);
    return `<a class="bookmark-card" data-route="${routes.chapter(2, 3, chapter.subjectId, chapter.id)}" data-searchable>
      <p class="card-label">Topic · ${progress.overall}%</p>
      <h3>${chapter.title}</h3>
      <p>${chapter.subjectTitle} · ${new Date(progress.lastStudiedAt || Date.now()).toLocaleDateString('en-IN')}</p>
    </a>`;
  }).filter(Boolean).join('');
  const questionCards = questionIds.map((id) => {
    const question = getQuestions().find((item) => item.id === id);
    if (!question) return null;
    const chapter = chapters.find((item) => item.id === question.chapterId);
    return `<a class="bookmark-card is-question" data-route="${routes.chapter(2, 3, question.subjectId, question.chapterId)}?tab=quiz" data-searchable>
      <p class="card-label">Question · ${question.difficulty} · ${question.questionType}</p>
      <h3>${question.question}</h3>
      <p>${chapter?.subjectTitle || question.subjectId} · ${chapter?.title || question.chapterId}</p>
    </a>`;
  }).filter(Boolean).join('');
  const conceptHtml = conceptIds.length
    ? conceptIds.map((id) => `<article class="bookmark-card" data-searchable><p class="card-label">Concept</p><h3>${id.replace('concept:', '')}</h3></article>`).join('')
    : '';
  const empty = !chapterCards && !questionCards && !conceptHtml;
  return `
    <section class="page-intro bookmarks-page" data-searchable>
      <p class="eyebrow">My Bookmarks · ${ids.length} saved</p>
      <h1>Bookmarks.</h1>
      <p>Topics, questions, and future visual/revision cards, gathered in one place.</p>
    </section>
    <section class="sem-section" data-searchable>
      <p class="card-label">Bookmarked topics</p>
      <div class="bookmark-grid">${chapterCards || '<p class="muted">Bookmark a topic with the ★ button on any chapter page.</p>'}</div>
    </section>
    <section class="sem-section" data-searchable>
      <p class="card-label">Bookmarked questions</p>
      <div class="bookmark-grid">${questionCards || '<p class="muted">Bookmark questions from the Question Bank to revisit tricky ones.</p>'}</div>
    </section>
    ${conceptHtml ? `<section class="sem-section" data-searchable><p class="card-label">Bookmarked concepts</p><div class="bookmark-grid">${conceptHtml}</div></section>` : ''}
    ${empty ? `<section class="callout-card"><strong>Start collecting</strong><p>Open a topic and press <strong>☆ Bookmark</strong>, or mark a question while practising, so your most useful material is one tap away.</p></section>` : ''}
  `;
}