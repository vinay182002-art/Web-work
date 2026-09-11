/**
 * Previous Year Papers — architecture view.
 *
 * Shows the subject → year → paper → questions structure and the practice
 * modes that will become available, without ever fabricating a paper.
 */
import { previousPapers, getVerifiedPaperCount } from '../services/previous-papers.js';

export function renderPapersView() {
  const count = getVerifiedPaperCount();
  const hierarchyHtml = `<div class="papers-tree">${previousPapers.hierarchy.map((level, index) => `
    <span class="papers-level">${String(index + 1).padStart(2, '0')}<strong>${level}</strong></span>
    ${index < previousPapers.hierarchy.length - 1 ? '<i class="papers-arrow">→</i>' : ''}`).join('')}</div>`;
  const subjectsHtml = previousPapers.subjects.map((subject) => `
    <article class="paper-subject" data-searchable>
      <div class="paper-subject-head"><h3>${subject.title}</h3><span class="paper-state">${subject.papers.length ? `${subject.papers.length} paper${subject.papers.length === 1 ? '' : 's'}` : 'No verified papers'}</span></div>
      ${subject.papers.length
        ? subject.papers.map((paper) => `<div class="paper-row"><strong>${paper.year} · ${paper.paperLabel}</strong><span>${paper.questions.length} questions</span><button class="resume-btn" type="button">Practice paper</button></div>`).join('')
        : '<p class="muted">A verified paper will appear here as Subject → Year → Paper → Questions once imported with source metadata.</p>'}
    </article>`).join('');
  const modeChips = previousPapers.supportedModes.map((mode) => `<span class="paper-mode-chip">${mode}</span>`).join('');
  return `
    <section class="page-intro papers-page" data-searchable>
      <p class="eyebrow">Previous Year Papers · ${count ? 'verified papers ready' : 'architecture ready · no papers imported'}</p>
      <h1>Previous Year Papers.</h1>
      <p>Practice under exam conditions with verified papers only. This platform never invents or re-labels a paper as an official university paper.</p>
    </section>
    <section class="callout-card papers-safety" data-searchable>
      <strong>Integrity rule</strong>
      <p>${previousPapers.note} Verified papers require an authoritative source (university + year + paper identity) before they are shown.</p>
    </section>
    <section class="sem-section" data-searchable>
      <p class="card-label">Paper hierarchy</p>
      ${hierarchyHtml}
      <p class="card-label">Supported practice modes</p>
      <div class="paper-mode-row">${modeChips}</div>
    </section>
    <section class="sem-section" data-searchable>
      <p class="card-label">Papers by subject</p>
      ${subjectsHtml}
    </section>
    <section class="sem-section" data-searchable>
      <p class="card-label">When a verified paper is live, Kittu will be able to</p>
      <ul class="papers-capabilities">
        <li>Practice the paper question by question.</li>
        <li>Run timed-mode sessions.</li>
        <li>Review results against the answer key.</li>
        <li>See weak areas inside the paper.</li>
      </ul>
    </section>`;
}