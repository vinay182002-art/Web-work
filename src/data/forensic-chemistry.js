const references = [
  { title: 'NIST Chemistry WebBook', url: 'https://webbook.nist.gov/chemistry/', status: 'REFERENCE_CANDIDATE', note: 'Primary candidate for chemical properties and spectra; verify the exact entry before citation.' },
  { title: 'NIJ Forensics topic collection', url: 'https://nij.ojp.gov/topics/forensics', status: 'REFERENCE_CANDIDATE', note: 'Government context for forensic-science practice; not a university syllabus.' },
  { title: 'OSAC Forensic Science Standards Library', url: 'https://www.nist.gov/organization-scientific-area-committees-forensic-science', status: 'REFERENCE_CANDIDATE', note: 'Standards context; check the applicable discipline document before publication.' }
];

const chapters = [
  {
    id: 'chemical-measurement-and-evidence',
    title: 'Chemical Measurement and Evidence Questions',
    description: 'Build a defensible chemical question before selecting a test.',
    topics: ['measurement', 'observation', 'inference', 'sampling'],
    sections: [
      ['From observation to proposition', 'A powder, stain, liquid, or residue is an observation, not yet an identification. The forensic question must specify the proposition: for example, whether a material is consistent with a named substance, contains a particular class of compound, or can be excluded from a comparison.'],
      ['Measurement is conditional', 'Every result depends on the sample taken, preparation, instrument response, calibration, and comparison material. A reported value is meaningful only with units, method scope, quality checks, and an explanation of uncertainty or limitations.'],
      ['Sampling and representativeness', 'A small portion may not represent a heterogeneous exhibit. Document the sampling plan, preserve the remainder, and avoid implying that an aliquot proves the composition of an entire item without a justified basis.']
    ],
    micro: ['Which statement is an inference rather than an observation?', ['A peak appears at a measured position', 'The sample is consistent with a reference under the validated method', 'The container was sealed'], 1],
    questions: [
      ['What should be defined before choosing an analytical method?', ['The forensic proposition and decision needed', 'The preferred conclusion', 'The suspect profile', 'The report wording only'], 0, 'Method choice follows the question; it should not be selected to guarantee a desired conclusion.'],
      ['Why can a small aliquot be limiting?', ['It may not represent a heterogeneous exhibit', 'It always destroys the entire exhibit', 'It automatically contaminates controls', 'It proves the source'], 0, 'Sampling limitation affects how broadly a result can be interpreted.']
    ],
    flashcards: [['Observation vs inference', 'An observation records what was measured or seen; an inference explains what that observation supports.'], ['Representativeness', 'Whether the tested portion reasonably reflects the relevant exhibit or population.']],
    practical: ['Write a proposition for a fictional unknown powder.', 'List what must be documented before taking an aliquot.', 'Explain one reason an inconclusive result may be scientifically correct.'],
    case: ['A sealed exhibit contains visibly different particles.', 'A single scoop produces one instrumental result.', 'Decide what additional sampling documentation or testing would be needed before generalising the result.']
  },
  {
    id: 'separation-and-chromatography',
    title: 'Separation and Chromatography',
    description: 'Understand how mixtures are separated before chemical identification.',
    topics: ['mixtures', 'chromatography', 'retention', 'selectivity'],
    sections: [
      ['Why mixtures need separation', 'A forensic extract may contain the target compound, matrix components, degradation products, and contaminants. Separation distributes components differently so a detector can produce more interpretable signals.'],
      ['Retention is comparative', 'In chromatography, retention depends on the stationary phase, mobile phase, temperature, flow, and analyte properties. A retention time is useful for comparison under defined conditions, but it is not a universal identity label.'],
      ['Selectivity and confirmation', 'Two compounds can behave similarly in one separation. Confidence improves when a method distinguishes plausible alternatives and a complementary technique supports the conclusion. Controls and reference materials are part of the interpretation.']
    ],
    micro: ['What does a chromatographic separation primarily help with?', ['Distinguishing components of a mixture', 'Proving who handled a sample', 'Replacing all controls', 'Removing the need for a reference'], 0],
    questions: [
      ['Why is retention time alone usually insufficient for identification?', ['Different compounds can have similar behaviour under one condition', 'It is never measurable', 'It identifies the source automatically', 'It does not depend on method conditions'], 0, 'Retention is method-dependent and can be shared by different compounds.'],
      ['What is a matrix effect?', ['The sample background changes the measured response', 'A label is missing', 'A result is copied', 'A reference is always wrong'], 0, 'Matrix components can suppress, enhance, obscure, or otherwise alter the target response.']
    ],
    flashcards: [['Stationary phase', 'The phase that remains fixed and interacts differently with components during separation.'], ['Selectivity', 'The ability of a method to distinguish the target from plausible alternatives or interferents.']],
    practical: ['Sketch a mixture-to-separated-peaks workflow.', 'Name three conditions that can change retention.', 'Explain why a blank and reference comparison matter.'],
    case: ['Two peaks have similar retention times in an extract.', 'A reference comparison is compatible but not unique.', 'Decide what complementary evidence or method validation would strengthen the interpretation.']
  },
  {
    id: 'spectroscopy-and-reference-comparison',
    title: 'Spectroscopy and Reference Comparison',
    description: 'Interpret instrumental signals without treating a spectrum as self-explanatory.',
    topics: ['spectroscopy', 'spectra', 'calibration', 'reference comparison'],
    sections: [
      ['Signals represent interactions', 'Spectroscopic methods measure how matter interacts with energy. The recorded pattern depends on the instrument, sample presentation, resolution, environment, and processing choices.'],
      ['Reference comparisons need conditions', 'A comparison is strongest when the unknown and reference are examined under appropriate, documented conditions. Library similarity can support a hypothesis, but the analyst must inspect quality, alternatives, and method limitations.'],
      ['Controls protect interpretation', 'Calibration checks response, blanks reveal contamination or carryover, and quality-control materials show whether the method is behaving as expected. A visually persuasive signal can still be misleading without these checks.']
    ],
    micro: ['What does a library match provide?', ['A comparison lead requiring analytical judgement', 'Automatic proof of source', 'A substitute for calibration', 'A university-certified result'], 0],
    questions: [
      ['What is the purpose of a blank?', ['To reveal contamination or carryover in the workflow', 'To identify the suspect', 'To increase certainty by assumption', 'To replace a control sample'], 0, 'A blank helps reveal signal not attributable to the intended sample.'],
      ['Why should a library match be reviewed critically?', ['Similarity may have alternatives and depends on data quality', 'Libraries never contain spectra', 'It proves the sample origin', 'It removes the need for method scope'], 0, 'A match is evidence for comparison, not an unqualified conclusion.']
    ],
    flashcards: [['Calibration', 'Relating instrument response to known values or behaviour so measurements can be interpreted.'], ['Library match', 'A similarity comparison that requires review of quality, alternatives, and method conditions.']],
    practical: ['Create a checklist for reviewing an unknown/reference comparison.', 'Separate calibration, blank, and positive-control purposes.', 'Write a limitation statement for a weak library match.'],
    case: ['A library search returns a high-scoring candidate but the sample matrix is unusual.', 'The blank is clean, but the reference was acquired under different conditions.', 'Identify the uncertainty and propose a cautious reporting position.']
  },
  {
    id: 'unknowns-drugs-and-trace-materials',
    title: 'Unknowns, Drugs, and Trace Chemical Materials',
    description: 'Use a safe, conceptual workflow for unknown powders and trace materials.',
    topics: ['unknowns', 'screening', 'confirmation', 'trace materials'],
    sections: [
      ['Screening is triage', 'A screening test is designed to be useful early, often by indicating whether a class or possibility deserves further examination. It may trade specificity for speed and should not be presented as definitive when alternatives remain.'],
      ['Confirmation narrows alternatives', 'A confirmatory approach uses a validated method with appropriate selectivity, controls, and reference material. The conclusion must remain within the method’s validated scope and the actual sample tested.'],
      ['Safety and ethics', 'Unknown materials must be handled only under authorised laboratory procedures by trained personnel. This lesson is conceptual: it does not provide operational drug-testing instructions or encourage unsupervised handling.']
    ],
    micro: ['What is a responsible use of a screening result?', ['To guide the next validated examination', 'To announce a final identity regardless of alternatives', 'To skip documentation', 'To infer source or intent'], 0],
    questions: [
      ['What is the key difference between screening and confirmation?', ['Screening narrows possibilities; confirmation supports a bounded identification', 'Screening is always more specific', 'Confirmation needs no controls', 'They are identical'], 0, 'The methods answer different stages of the analytical question.'],
      ['Why should a result be limited to the sample tested?', ['Sampling and heterogeneity constrain generalisation', 'All exhibits are perfectly uniform', 'A label proves composition', 'It avoids recording uncertainty'], 0, 'The tested portion and method scope define what can be concluded.']
    ],
    flashcards: [['Screening', 'An initial test that helps triage possibilities and decide what further examination may be warranted.'], ['Confirmation', 'A more selective, validated examination supporting a bounded conclusion.']],
    practical: ['Build a decision tree from screening result to safe referral for confirmation.', 'List three statements that should not be inferred from a chemical result.', 'Write a laboratory-safety boundary for a student exercise.'],
    case: ['A presumptive colour test is positive for a fictional exhibit.', 'Several substances can produce a similar response.', 'Explain why the result is preliminary and what evidence a report would still need.']
  },
  {
    id: 'quality-assurance-and-reporting',
    title: 'Quality Assurance, Uncertainty, and Reporting',
    description: 'Turn analytical work into a transparent scientific report.',
    topics: ['validation', 'quality assurance', 'uncertainty', 'reporting'],
    sections: [
      ['Validation asks whether a method is fit', 'Validation establishes what a method can reliably do for a defined purpose. Relevant characteristics can include selectivity, sensitivity, precision, accuracy, robustness, and operating range, depending on the method.'],
      ['Uncertainty is information', 'Uncertainty does not mean a result is useless. It communicates the range of plausible values or interpretations and helps prevent false precision. Its treatment must match the measurement and reporting context.'],
      ['A report separates layers', 'A strong report distinguishes observations, analytical results, interpretation, assumptions, and limitations. It should be understandable to the intended reader without implying certainty beyond the evidence.']
    ],
    micro: ['What does a limitation do in a report?', ['It defines how far the result can be interpreted', 'It cancels every result', 'It replaces quality control', 'It proves negligence'], 0],
    questions: [
      ['What is the purpose of method validation?', ['To show a method is fit for its defined purpose', 'To guarantee every future sample has one result', 'To remove the need for controls', 'To create an official syllabus'], 0, 'Validation is tied to a defined use and performance evidence.'],
      ['Which report structure is clearest?', ['Observation, result, interpretation, limitation', 'Conclusion, assumption, observation omitted', 'Instrument display only', 'Opinion without method'], 0, 'Separating these layers makes the reasoning auditable.']
    ],
    flashcards: [['Fit for purpose', 'A method is suitable for a defined use, population, matrix, and decision boundary.'], ['Analytical limitation', 'A stated boundary on what the method or evidence supports.']],
    practical: ['Convert an overconfident conclusion into a bounded statement.', 'Make a four-column observation/result/interpretation/limitation table.', 'List quality records another analyst should be able to audit.'],
    case: ['A method performs well on a clean reference but poorly on a complex matrix.', 'The result is compatible with a candidate but uncertainty is material.', 'Write a cautious conclusion that preserves the useful finding and the limitation.']
  }
];

function makeChapter(definition, index) {
  const [id, title, description, topics, sections, micro, questions, flashcards, practical, caseStudy] = [
    definition.id, definition.title, definition.description, definition.topics, definition.sections,
    definition.micro, definition.questions, definition.flashcards, definition.practical, definition.case
  ];
  return {
    id, title, description, estimatedMinutes: 42, difficulty: 'Developing',
    universityRelevance: 'Core standard B.Sc. coverage · needs university mapping',
    topics, prerequisite: index ? 'Previous forensic chemistry chapter' : 'General chemistry and scientific method',
    metadata: { contentLevel: 'standard_undergraduate_content', classification: 'STANDARD_BSC', verificationStatus: 'STANDARD_CURRICULUM', examRelevance: 'high', sourceStatus: 'REFERENCE_CANDIDATE', lastUpdated: '2026-09-09' },
    sections: sections.map(([sectionTitle, body], sectionIndex) => ({ id: `${id}-${sectionIndex + 1}`, title: sectionTitle, body, callout: sectionIndex === 0 ? 'Separate what was observed from what is inferred.' : 'Report the method scope and limitations alongside the result.' })),
    summary: { definition: `${title} applies chemical measurement to a bounded forensic question.`, points: [sections[0][0], sections[1][0], sections[2][0]], examPoints: ['Question → method → controlled result → interpretation → limitation', 'Screening, confirmation, and reporting are distinct decisions.'] },
    visual: { title: 'Question to defensible report', nodes: [{ id: `${id}-question`, label: 'Question', detail: 'Define the proposition and sampling boundary.' }, { id: `${id}-method`, label: 'Method', detail: 'Use a fit-for-purpose method with controls.' }, { id: `${id}-report`, label: 'Report', detail: 'Separate result, interpretation, and limitation.' }] },
    microChecks: [{ id: `${id}-micro`, prompt: micro[0], options: micro[1], correctIndex: micro[2], explanation: 'The correct choice preserves the distinction between an analytical observation and an unsupported conclusion.' }],
    quiz: { id: `${id}-quiz`, title: `${title} checkpoint`, questions: questions.map(([prompt, options, correctIndex, explanation], questionIndex) => ({ id: `${id}-q${questionIndex + 1}`, prompt, options, correctIndex, explanation })) },
    flashcards: flashcards.map(([front, back], cardIndex) => ({ id: `${id}-f${cardIndex + 1}`, type: cardIndex ? 'application' : 'definition', front, back })),
    practical: { title: `${title} interpretation practical`, objective: 'Apply the concept to a fictional classroom record without handling real unknown materials.', sections: [['Objective', practical[0]], ['Method', practical[1]], ['Viva prompt', practical[2]]] },
    caseStudy: { title: `${title} teaching case`, prompt: caseStudy[0], note: 'Hypothetical educational case only; no real evidence, people, or operational protocol.', sections: [['Observation', caseStudy[1]], ['Analysis', caseStudy[2]], ['Limitation', 'Keep the conclusion within the tested material, method scope, and available controls.']] },
    viva: [`Define ${topics[0]} in forensic chemistry.`, `Explain how ${topics[1]} affects interpretation.`, 'State one limitation that belongs in the report.'],
    aiContext: { allowedTopics: topics, prohibitedClaims: ['official Anjaneya University requirement', 'fabricated case finding', 'unsupported certainty'], grounding: 'STANDARD_CURRICULUM', references },
    revision: { prompts: [`Recall the purpose of ${topics[0]}.`, `Explain ${topics[1]} using the case.`, 'State the reporting limitation.'] },
    references
  };
}

export const forensicChemistry = {
  id: 'forensic-chemistry',
  title: 'Forensic Chemistry',
  shortDescription: 'Measurement • separation • identification • quality assurance',
  contentLevel: 'standard_undergraduate_content',
  officialUniversityContent: false,
  classification: 'STANDARD_BSC',
  coverageLabel: 'Supplementary / Standard Curriculum',
  verificationStatus: 'STANDARD_CURRICULUM',
  year: 2,
  semester: 3,
  learningOutcomes: ['Frame a chemical evidence proposition before selecting a method.', 'Distinguish screening, separation, reference comparison, and confirmation.', 'Interpret analytical results with controls, uncertainty, sampling limits, and transparent reporting.'],
  units: [
    { id: 'chemistry-unit-1', title: 'Unit 1 · Analytical reasoning and identification', chapters: chapters.slice(0, 3).map(makeChapter) },
    { id: 'chemistry-unit-2', title: 'Unit 2 · Unknowns and quality systems', chapters: chapters.slice(3).map((chapter, index) => makeChapter(chapter, index + 3)) }
  ]
};
