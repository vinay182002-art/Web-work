import { getChapter, getDefaultChapter, getSubject } from './src/data/curriculum.js?v=23';
import { getRoute, navigate, routes } from './src/lib/router.js?v=10';
import { repository } from './src/services/repository.js?v=24';
import { studyModes } from './src/types/models.js?v=8';
import { renderAppShell } from './src/components/app-shell.js?v=31';
import { getRevisionItem } from './src/services/mastery.js';
import { getQuestions } from './src/services/question-engine.js?v=21';
import { applyAction, getHint, initialInvestigation } from './src/services/lab-engine.js';

const app = document.querySelector('#app');

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch((error) => {
    console.warn('Offline shell could not be registered.', error);
  });
}

/** Track time-on-topic while a chapter page is open (evidence-based progress). */
let activeTopicVisit = null;

function startTopicTracking(route) {
  activeTopicVisit = null;
  const [segment, , , subjectId, chapterId] = route.parts;
  if (segment !== 'learn' || !chapterId) return;
  const tab = new URLSearchParams(window.location.hash.split('?')[1] || '').get('tab') || 'deep-dive';
  activeTopicVisit = { chapterId, subjectId, mode: tab, startedAt: Date.now() };
}

function flushTopicTracking() {
  if (!activeTopicVisit) return;
  const seconds = Math.round((Date.now() - activeTopicVisit.startedAt) / 1000);
  if (seconds >= 1) {
    void repository.recordTopicActivity(activeTopicVisit.chapterId, activeTopicVisit.mode, seconds, activeTopicVisit.subjectId);
  }
  activeTopicVisit = null;
}

async function render() {
  const route = getRoute();
  const dashboard = await repository.getDashboard();
  app.innerHTML = renderAppShell(route, dashboard);
  bindInteractions();
  startTopicTracking(route);
  document.body.dataset.theme = localStorage.getItem('forensic-atlas-theme') || 'light';
}

function bindInteractions() {
  document.querySelectorAll('[data-route]').forEach((element) => {
    element.addEventListener('click', () => navigate(element.dataset.route));
  });
  document.querySelector('.global-search-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = new FormData(event.currentTarget).get('q')?.toString().trim() || '';
    navigate(`#/search?q=${encodeURIComponent(query)}`);
  });
  const commandPalette = document.querySelector('#command-palette');
  const commandInput = document.querySelector('#command-input');
  const commandBackdrop = document.querySelector('#command-backdrop');
  const closeCommand = () => {
    commandPalette?.classList.remove('is-open');
    commandBackdrop?.classList.remove('is-open');
  };
  const openCommand = () => {
    commandPalette?.classList.add('is-open');
    commandBackdrop?.classList.add('is-open');
    renderCommandResults(commandInput?.value || '');
    commandInput?.focus();
  };
  document.querySelector('#command-close')?.addEventListener('click', closeCommand);
  commandBackdrop?.addEventListener('click', closeCommand);
  document.querySelector('#command-input')?.addEventListener('input', (event) => renderCommandResults(event.target.value));
  document.querySelector('#theme-btn')?.addEventListener('click', () => {
    const theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    document.body.dataset.theme = theme;
    localStorage.setItem('forensic-atlas-theme', theme);
  });
  window.onkeydown = (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      openCommand();
    }
    if (event.key === 'Escape') closeCommand();
  };
  document.querySelector('#coach-profile-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    await repository.saveCoachProfile({ ...values, dailyMinutes: Number(values.dailyMinutes), preferredSession: Number(values.preferredSession) });
    showToast('Study coach settings saved.');
    await render();
  });
  document.querySelector('#goal-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    await repository.addGoal(values);
    showToast('Goal added to your study plan.');
    await render();
  });
  document.querySelectorAll('[data-recommendation-feedback]').forEach((button) => {
    button.addEventListener('click', async () => {
      const [feedback, recommendationKey] = button.dataset.recommendationFeedback.split(':');
      await repository.saveRecommendationFeedback({ feedback, recommendationKey });
      showToast('Recommendation feedback saved.');
    });
  });
  document.querySelector('#question-mode')?.addEventListener('change', (event) => {
    const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
    params.set('mode', event.target.value);
    navigate(`#/questions?${params}`);
  });
  document.querySelector('#question-difficulty')?.addEventListener('change', (event) => {
    const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
    if (event.target.value) params.set('difficulty', event.target.value);
    else params.delete('difficulty');
    navigate(`#/questions?${params}`);
  });
  document.querySelectorAll('[data-question-answer]').forEach((button) => {
    button.addEventListener('click', async () => {
      const [questionId, option] = button.dataset.questionAnswer.split(':');
      const question = getQuestions().find((item) => item.id === questionId);
      if (!question) return;
      const selectedAnswer = Number(option);
      const correct = selectedAnswer === question.correctAnswer;
      await repository.recordQuestionAttempt(question.id, question.topicId, question.bloomLevel, correct, selectedAnswer, { subjectId: question.subjectId, chapterId: question.chapterId });
      const feedback = document.querySelector(`#question-feedback-${question.id}`);
      if (feedback) feedback.innerHTML = `<strong>${correct ? 'Correct' : 'Review this concept'}</strong><p>${escapeHtml(question.explanation)}</p><p><strong>What to revise:</strong> ${escapeHtml(question.recommendedLesson)} · ${escapeHtml(question.commonMisconception)}</p>`;
      document.querySelectorAll(`[data-question-answer^="${question.id}:"]`).forEach((item) => item.classList.remove('is-correct', 'is-incorrect'));
      button.classList.add(correct ? 'is-correct' : 'is-incorrect');
      if (!correct) document.querySelector(`[data-question-answer="${question.id}:${question.correctAnswer}"]`)?.classList.add('is-correct');
    });
  });
  document.querySelectorAll('[data-select-evidence]').forEach((button) => {
    button.addEventListener('click', async () => {
      const current = (await repository.getInvestigation('case-file-001')) || { ...initialInvestigation };
      await repository.saveInvestigation({ ...current, selectedEvidence: [...new Set([...current.selectedEvidence, button.dataset.selectEvidence])] });
      await render();
    });
  });
  document.querySelectorAll('[data-case-action]').forEach((button) => {
    button.addEventListener('click', async () => {
      const current = (await repository.getInvestigation('case-file-001')) || { ...initialInvestigation };
      await repository.saveInvestigation(applyAction(current, button.dataset.caseAction, button.dataset.evidenceId));
      await render();
    });
  });
  document.querySelector('[data-case-hint]')?.addEventListener('click', async () => {
    const current = (await repository.getInvestigation('case-file-001')) || { ...initialInvestigation };
    const hint = getHint(current);
    await repository.saveInvestigation({ ...current, hintsUsed: hint.level, feedback: [hint.text, ...current.feedback].slice(0, 4) });
    await render();
  });

  document.querySelectorAll('[data-mode]').forEach((element) => {
    element.addEventListener('click', async () => {
      await repository.setMode(element.dataset.mode);
      await render();
    });
  });

  document.querySelector('#menu-btn')?.addEventListener('click', () => {
    document.querySelector('#app-drawer')?.classList.add('is-open');
    document.querySelector('#drawer-backdrop')?.classList.add('is-open');
  });
  document.querySelector('#drawer-close')?.addEventListener('click', closeDrawer);
  document.querySelector('#drawer-backdrop')?.addEventListener('click', closeDrawer);
  document.querySelector('#reset-progress')?.addEventListener('click', async () => {
    await repository.resetProgress();
    closeDrawer();
    await render();
  });

  document.querySelector('#notifications-btn')?.addEventListener('click', () => showToast('No new mentor notes today.'));
  document.querySelector('#profile-btn')?.addEventListener('click', () => showToast('Profile settings are ready for account connection.'));
  document.querySelectorAll('[data-answer]').forEach((answer) => {
    answer.addEventListener('click', () => {
      document.querySelectorAll('[data-answer]').forEach((item) => item.classList.remove('is-correct', 'is-incorrect'));
      const correct = answer.dataset.answer === 'true';
      answer.classList.add(correct ? 'is-correct' : 'is-incorrect');
      showToast(correct
        ? 'Correct. Document the exact physical location before handling the fibre.'
        : 'Not quite. Start with the evidence location and condition.');
    });
  });
  document.querySelectorAll('[data-complete-section]').forEach((button) => {
    button.addEventListener('click', async () => {
      await repository.completeSection(button.dataset.chapterId, button.dataset.sectionId);
      showToast('Section complete. Your study state was saved.');
      await render();
    });
  });
  document.querySelectorAll('[data-mark-topic-mode]').forEach((button) => {
    button.addEventListener('click', async () => {
      const [chapterId, mode] = button.dataset.markTopicMode.split(':');
      await repository.markTopicMode(chapterId, mode);
      showToast(`${mode === 'deep' ? 'Deep Dive' : mode[0].toUpperCase() + mode.slice(1)} marked complete.`);
      await render();
    });
  });
  document.querySelectorAll('[data-reset-topic]').forEach((button) => {
    button.addEventListener('click', async () => {
      await repository.resetTopicProgress(button.dataset.resetTopic);
      showToast('Topic progress reset.');
      await render();
    });
  });
  document.querySelectorAll('[data-tab]').forEach((button) => {
    button.addEventListener('click', async () => {
      const route = getRoute();
      const [, , , , chapterId] = route.parts;
      if (chapterId) await repository.recordTopicVisit(chapterId, button.dataset.tab);
      const hash = window.location.hash.split('?')[0];
      window.history.pushState({}, '', `${window.location.pathname}${hash}?tab=${button.dataset.tab}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
  });
  document.querySelector('[data-bookmark]')?.addEventListener('click', async (event) => {
    await repository.toggleBookmark(event.currentTarget.dataset.bookmark);
    await render();
  });
  document.querySelectorAll('[data-bookmark-question]').forEach((button) => {
    button.addEventListener('click', async () => {
      await repository.toggleBookmark(`question:${button.dataset.bookmarkQuestion}`);
      showToast('Question bookmark updated.');
      await render();
    });
  });
  document.querySelector('#question-chapter')?.addEventListener('change', (event) => {
    const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
    if (event.target.value) params.set('chapter', event.target.value);
    else params.delete('chapter');
    navigate(`#/questions?${params}`);
  });
  document.querySelector('[data-ai-ask]')?.addEventListener('click', () => {
    const response = document.querySelector('#ai-response');
    const question = document.querySelector('#ai-question')?.value.trim() || '';
    if (response) {
      response.innerHTML = question
        ? `<strong>Question received:</strong> ${escapeHtml(question)}<br />The grounded tutor will answer after a server-side provider is configured. Context (year, semester, subject, unit, chapter, topic, mode, section, question) is already built for that call.`
        : 'Type a question above — the tutor will receive it together with your current topic, mode, section, and mastery context.';
    }
  });
  document.querySelectorAll('[data-reveal]').forEach((button) => {
    button.addEventListener('click', () => {
      const open = button.classList.toggle('is-open');
      button.setAttribute('aria-expanded', String(open));
    });
  });
  document.querySelectorAll('[data-micro-answer]').forEach((button) => {
    button.addEventListener('click', async () => {
      const [checkId, option] = button.dataset.microAnswer.split(':');
      const route = getRoute();
      const [, , , subjectId, chapterId] = route.parts;
      const chapter = getChapter(subjectId, chapterId);
      const check = chapter.microChecks.find((item) => item.id === checkId);
      const correct = Number(option) === check.correctIndex;
      await repository.recordMicroCheck(chapter.id, checkId, correct);
      document.querySelector(`#micro-feedback-${checkId}`).textContent = correct ? `Correct. ${check.explanation}` : `Keep thinking. ${check.explanation}`;
    });
  });
  document.querySelectorAll('[data-flip-card]').forEach((button) => {
    button.addEventListener('click', () => button.classList.toggle('is-flipped'));
  });
  document.querySelectorAll('[data-card-rating]').forEach((button) => {
    button.addEventListener('click', async () => {
      const [cardId, rating] = button.dataset.cardRating.split(':');
      await repository.reviewFlashcard(cardId, rating);
      showToast(`Flashcard marked ${rating}.`);
    });
  });
  document.querySelector('[data-save-note]')?.addEventListener('click', async (event) => {
    await repository.saveNote(event.currentTarget.dataset.saveNote, document.querySelector('#chapter-note').value);
    showToast('Note saved on this device.');
  });
  document.querySelector('[data-save-case]')?.addEventListener('click', () => showToast('Case reasoning saved for review in the next sync phase.'));
  document.querySelector('[data-topic-quiz]')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const chapterId = form.dataset.chapterId;
    const route = getRoute();
    const [, year, semester, subjectId] = route.parts;
    const chapter = getChapter(subjectId, chapterId);
    const questions = chapter.quiz.questions;
    const selected = [...form.querySelectorAll('input:checked')].map((input) => Number(input.value));
    let score = 0;
    questions.forEach((question, index) => {
      const answer = selected[index];
      const correct = answer === question.correctIndex;
      if (correct) score += 1;
      form.querySelectorAll(`fieldset[data-quiz-question="q${index}"] label`).forEach((label, optionIndex) => {
        label.classList.remove('is-correct', 'is-incorrect');
        if (optionIndex === question.correctIndex) label.classList.add('is-correct');
        if (optionIndex === answer && !correct) label.classList.add('is-incorrect');
      });
      const feedback = document.querySelector(`#quiz-feedback-q${index}`);
      if (feedback) {
        feedback.innerHTML = correct
          ? `<strong>Correct.</strong> ${escapeHtml(question.explanation)}`
          : `<strong>Not quite.</strong> ${escapeHtml(question.explanation)} <span class="muted">Your answer: ${escapeHtml(question.options[answer] || '—')}.</span>`;
      }
    });
    const weakConcepts = questions.filter((question, index) => selected[index] !== question.correctIndex).map((question, index) => chapter.topics[index] || chapter.topics[0]);
    await repository.recordQuizAttempt(chapterId, score, questions.length, { answers: selected, weakConcepts });
    await repository.markTopicMode(chapterId, 'quiz');
    await repository.scheduleRevision(getRevisionItem(chapter, await repository.getStudyState()));
    const percent = questions.length ? Math.round(score / questions.length * 100) : 0;
    const message = percent === 100
      ? 'Excellent. Spaced revision is scheduled.'
      : percent >= 70
        ? 'Strong result. Review the visual flow before your next spaced review.'
        : `Needs work: ${weakConcepts.length ? weakConcepts.join(', ') : 'review the explanations above'}. Focus on these before retrying.`;
    const resultCard = document.querySelector('#topic-quiz-result');
    if (resultCard) {
      resultCard.hidden = false;
      const eyebrow = document.querySelector('#topic-quiz-result-eyebrow');
      const scoreLine = document.querySelector('#topic-quiz-result-score');
      const note = document.querySelector('#topic-quiz-result-message');
      if (eyebrow) eyebrow.textContent = 'Assessment result · saved locally';
      if (scoreLine) scoreLine.textContent = `${score}/${questions.length} · ${percent}%`;
      if (note) note.textContent = message;
    }
    const history = document.querySelector('#topic-attempt-history');
    if (history) {
      const heading = history.querySelector('h2');
      const note = history.querySelectorAll('p')[1];
      if (heading) heading.textContent = `${score}/${questions.length} · ${percent}%`;
      if (note) note.textContent = weakConcepts.length ? `Review: ${weakConcepts.join(', ')}.` : 'Strong result. Revisit the visual flow before your next spaced review.';
    }
    showToast(`Topic test scored: ${score}/${questions.length} (${percent}%).`);
  });
  document.querySelectorAll('[data-ai-action]').forEach((button) => {
    button.addEventListener('click', () => {
      const response = document.querySelector('#ai-response');
      if (response) response.textContent = `${button.dataset.aiAction}: this chapter context is ready for a grounded server-side tutor response.`;
    });
  });
  document.querySelectorAll('[data-search]').forEach((input) => {
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        navigate(`#/search?q=${encodeURIComponent(input.value.trim())}`);
      }

    });
    input.addEventListener('input', () => {
      const query = input.value.trim().toLowerCase();
      document.querySelectorAll('[data-searchable]').forEach((item) => {
        item.hidden = Boolean(query && !item.textContent.toLowerCase().includes(query));
      });
    });
  });

  document.querySelector('#lesson-complete')?.addEventListener('click', async () => {
    const { chapterId, sectionId } = document.querySelector('#lesson-complete').dataset;
    await repository.completeSection(chapterId, sectionId);
    showToast('Section complete. Your study state was saved.');
    await render();
  });

  document.querySelector('#quiz-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const chapterId = form.dataset.chapterId;
    const route = getRoute();
    const [, year, semester, subjectId] = route.parts;
    const chapter = getChapter(subjectId, chapterId);
    const answers = [...form.querySelectorAll('input:checked')];
    const score = chapter.quiz.questions.reduce((total, question, index) => (
      total + (answers[index]?.value === String(question.correctIndex) ? 1 : 0)
    ), 0);
    const answerValues = answers.map((input) => Number(input.value));
    const weakConcepts = chapter.quiz.questions.filter((question, index) => answerValues[index] !== question.correctIndex).map((question, index) => chapter.topics[index] || chapter.topics[0]);
    await repository.recordQuizAttempt(chapterId, score, chapter.quiz.questions.length, { answers: answerValues, weakConcepts });
    await repository.markTopicMode(chapterId, 'quiz');
    await repository.scheduleRevision(getRevisionItem(chapter, await repository.getStudyState()));
    navigate(routes.chapter(Number(year), Number(semester), subjectId, chapterId));
  });
}

function renderCommandResults(query = '') {
  const results = [
    ['Open dashboard', '#/dashboard'],
    ['Open DNA extraction chapter', '#/learn/2/3/forensic-biology/dna-extraction'],
    ["Start today's question practice", '#/questions?mode=quick'],
    ['Open question bank', '#/questions'],
    ['Open Study Coach', '#/coach'],
    ['Show Forensic Lab', '#/lab'],
    ['Open glossary', '#/glossary']
  ].filter(([label]) => label.toLowerCase().includes(query.trim().toLowerCase()));
  const container = document.querySelector('#command-results');
  if (!container) return;
  container.innerHTML = results.length
    ? results.map(([label, route]) => `<button data-command-route="${route}"><span>↗</span>${label}</button>`).join('')
    : '<p class="empty-state">No matching academy action.</p>';
  container.querySelectorAll('[data-command-route]').forEach((button) => {
    button.addEventListener('click', () => {
      navigate(button.dataset.commandRoute);
      document.querySelector('#command-palette')?.classList.remove('is-open');
      document.querySelector('#command-backdrop')?.classList.remove('is-open');
    });
  });
}

function closeDrawer() {
  document.querySelector('#app-drawer')?.classList.remove('is-open');
  document.querySelector('#drawer-backdrop')?.classList.remove('is-open');
}

function showToast(message) {
  const toast = document.querySelector('#toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.setTimeout(() => toast.classList.remove('is-visible'), 2600);
}

window.addEventListener('popstate', () => { flushTopicTracking(); render(); });
window.addEventListener('load', render);
