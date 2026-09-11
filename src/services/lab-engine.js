import { apartmentIncident } from '../data/lab-simulations.js';

export const initialInvestigation = {
  caseId: apartmentIncident.id,
  stage: 'START',
  selectedEvidence: [],
  actions: [],
  notes: '',
  hintsUsed: 0,
  score: { observation: 0, handling: 0, reasoning: 0, interpretation: 0, documentation: 0 },
  feedback: []
};

export function nextStage(stage, action) {
  const transitions = {
    START: { begin: 'SCENE_INSPECTION' },
    SCENE_INSPECTION: { document: 'DOCUMENTATION', inspect: 'SCENE_INSPECTION', collect: 'SCENE_INSPECTION' },
    DOCUMENTATION: { photograph: 'EVIDENCE_COLLECTION', collect: 'DOCUMENTATION' },
    EVIDENCE_COLLECTION: { package: 'LAB_SELECTION', ignore: 'EVIDENCE_COLLECTION' },
    LAB_SELECTION: { biology: 'ANALYSIS', fingerprint: 'ANALYSIS' },
    ANALYSIS: { continue: 'RESULT_INTERPRETATION' },
    RESULT_INTERPRETATION: { 'interpret-consistent': 'CASE_SYNTHESIS', 'interpret-guilty': 'CASE_SYNTHESIS' },
    CASE_SYNTHESIS: { report: 'REPORT' },
    REPORT: { submit: 'COMPLETE' }
  };
  return transitions[stage]?.[action] || stage;
}

export function applyAction(investigation, action, evidenceId) {
  const isGood = ['begin', 'document', 'inspect', 'photograph', 'package', 'biology', 'interpret-consistent', 'report', 'submit'].includes(action);
  const stage = nextStage(investigation.stage, action);
  const score = { ...investigation.score };
  if (['document', 'photograph'].includes(action)) score.documentation += 20;
  if (['inspect', 'begin'].includes(action)) score.observation += 15;
  if (action === 'package') score.handling += 20;
  if (action === 'biology') score.reasoning += 20;
  if (action === 'interpret-consistent') score.interpretation += 25;
  const feedback = isGood
    ? 'Good scientific workflow choice. Keep observations separate from interpretation.'
    : action === 'interpret-guilty'
      ? 'A simulated finding cannot establish guilt. Record the limited scientific interpretation and its assumptions.'
      : 'This choice creates a documentation or chain-of-custody gap. The case continues so you can learn from it.';
  return {
    ...investigation,
    stage,
    selectedEvidence: evidenceId && !investigation.selectedEvidence.includes(evidenceId) ? [...investigation.selectedEvidence, evidenceId] : investigation.selectedEvidence,
    actions: [...investigation.actions, { action, stage: investigation.stage, at: new Date().toISOString() }],
    score,
    feedback: [feedback, ...investigation.feedback].slice(0, 4)
  };
}

export function getHint(investigation) {
  const level = Math.min(investigation.hintsUsed + 1, 3);
  const hints = [
    'Start by preserving the scene record before handling an item.',
    'Think in sequence: observe, document, collect, package, then request a suitable test.',
    'Your conclusion should state only what the simulated observation supports and name its limitations.'
  ];
  return { level, text: hints[level - 1] };
}
