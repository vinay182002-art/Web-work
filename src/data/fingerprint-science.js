const references = [
  { title: 'FBI Handbook of Forensic Services', url: 'https://www.fbi.gov/file-repository/handbook-of-forensic-services-pdf.pdf', status: 'REFERENCE_CANDIDATE', note: 'Government reference candidate; verify the relevant friction-ridge section and edition.' },
  { title: 'NIST Forensic Science Resources', url: 'https://www.nist.gov/topics/forensic-science', status: 'REFERENCE_CANDIDATE', note: 'Standards and measurement context; not a university syllabus.' },
  { title: 'OSAC Friction Ridge Subcommittee', url: 'https://www.nist.gov/organization-scientific-area-committees-forensic-science', status: 'REFERENCE_CANDIDATE', note: 'Standards candidate; verify the exact document before publication.' }
];

const definitions = [
  {
    id: 'friction-ridge-foundations',
    title: 'Friction Ridge Skin and Pattern Foundations',
    description: 'Understand the anatomy, persistence, and variability that make friction-ridge examination possible.',
    topics: ['friction ridges', 'ridge detail', 'persistence', 'individualisation limits'],
    sections: [
      ['What friction ridges are', 'Friction ridges are raised skin structures on the palmar surfaces of the hands and the plantar surfaces of the feet. Their arrangement produces features that can persist while skin remains intact, although injury, decomposition, pressure, and distortion affect what can be observed.'],
      ['Levels of detail', 'Examiners may describe broad pattern flow, individual ridge paths, and smaller features such as ridge endings or bifurcations. Detail must be assessed in the context of image quality, distortion, and the comparison process rather than counted mechanically.'],
      ['Persistence and limits', 'Ridge arrangements are generally stable over a person’s lifetime, but a visible impression can be incomplete or distorted. A print is evidence of friction-ridge detail in a particular event; it is not, by itself, a complete reconstruction of how or when contact occurred.']
    ],
    micro: ['Which factor can affect the visible appearance of a friction-ridge impression?', ['Pressure and distortion', 'The subject’s academic year', 'A conclusion written later'], 0],
    questions: [
      ['What is the primary subject of fingerprint examination?', ['Friction-ridge detail and its comparison', 'A person’s motive', 'The colour of an evidence label', 'A guaranteed activity timeline'], 0, 'Fingerprint examination concerns ridge detail and comparison, not motive or automatic activity reconstruction.'],
      ['Why should ridge detail not be counted mechanically?', ['Quality and distortion affect the value of observed detail', 'Every ridge has identical clarity', 'Counting proves when contact occurred', 'The image never contains background effects'], 0, 'Interpretation requires context, quality assessment, and comparison judgement.']
    ],
    flashcards: [['Friction ridges', 'Raised skin structures on palmar and plantar surfaces that create ridge detail.'], ['Persistence', 'The relative stability of ridge arrangement, subject to injury, distortion, and condition of the impression.']],
    practical: ['Label broad pattern flow and fine detail on a fictional diagram.', 'List three causes of distortion.', 'Explain why a print does not alone prove the time or manner of contact.'],
    case: ['A partial impression contains a few clear ridge paths and substantial smearing.', 'A student calls it an identification based on one visible feature.', 'Explain which observations and limitations must be documented before comparison.']
  },
  {
    id: 'pattern-classification',
    title: 'Pattern Classification and Ridge Flow',
    description: 'Use pattern vocabulary to organise examination without treating classification as identification.',
    topics: ['arches', 'loops', 'whorls', 'pattern areas'],
    sections: [
      ['Classification is organisation', 'Broad pattern groups such as arches, loops, and whorls help organise ridge flow and support searching. Classification narrows a description; it does not uniquely identify an individual.'],
      ['Ridge flow and focal areas', 'Pattern areas can contain features used for orientation, such as cores and deltas where applicable. The visibility and interpretation of these areas depend on capture quality and the portion of the impression available.'],
      ['From class to comparison', 'A pattern class can help locate or prioritise a comparison, but an examiner still evaluates corresponding detail, discrepancies, distortion, and sufficiency. A broad class match is not a conclusion of source.']
    ],
    micro: ['What is the role of broad pattern classification?', ['Organise and describe ridge flow', 'Prove source identity by itself', 'Determine contact time', 'Replace documentation'], 0],
    questions: [
      ['Why is a loop or whorl classification not an identification?', ['Many different impressions can share a broad class', 'Classification is never observable', 'It proves the same finger', 'It measures DNA'], 0, 'Class characteristics are shared and therefore cannot alone establish source.'],
      ['What should guide orientation in a partial impression?', ['Visible ridge flow and reliable focal features', 'A preferred conclusion', 'The evidence number alone', 'An assumed finger'], 0, 'Orientation must follow the information actually present in the impression.']
    ],
    flashcards: [['Pattern classification', 'A broad descriptive system for organising ridge flow, not a unique source conclusion.'], ['Core and delta', 'Pattern features that may assist orientation when clearly present and correctly interpreted.']],
    practical: ['Describe three fictional impressions using class vocabulary.', 'Explain how poor capture can obscure focal features.', 'Write a limitation for a class-only observation.'],
    case: ['A partial latent impression appears loop-like but the delta is unclear.', 'Two examiners orient it differently.', 'List the quality and documentation steps needed before proceeding.']
  },
  {
    id: 'latent-print-development',
    title: 'Latent Print Evidence and Development Concepts',
    description: 'Understand how latent impressions are preserved, documented, and developed under controlled procedures.',
    topics: ['latent impressions', 'porosity', 'development', 'preservation'],
    sections: [
      ['Latent does not mean invisible forever', 'A latent impression is a friction-ridge impression that is not readily visible or is only faintly visible. Its composition, surface, environment, and time affect whether useful ridge detail remains.'],
      ['Surface and method selection', 'Porous and non-porous surfaces interact differently with impression residues. Development methods must be selected by trained personnel under validated laboratory or scene procedures; this lesson explains decision reasoning, not operational chemical recipes.'],
      ['Documentation before and after development', 'Record the item, condition, location, orientation, scale, method, sequence, and resulting image. Preservation should maintain the relationship between the impression and the exhibit as far as practicable.']
    ],
    micro: ['What should be documented with a developed impression?', ['Location, orientation, scale, method, and image record', 'Only the examiner’s conclusion', 'The suspect’s presumed action', 'Nothing if the image is clear'], 0],
    questions: [
      ['Why does surface type matter?', ['It affects residue interaction and suitable development decisions', 'It determines source automatically', 'It removes the need for photography', 'It proves the age of a print'], 0, 'Surface properties affect development and preservation decisions.'],
      ['What is a safe educational boundary for students?', ['Study decision logic without handling real unknown evidence or chemicals', 'Experiment on case exhibits', 'Publish unverified identifications', 'Skip protective procedures'], 0, 'Operational development requires authorised facilities, training, and validated procedures.']
    ],
    flashcards: [['Latent impression', 'A faint or not readily visible friction-ridge impression requiring examination or development.'], ['Preservation record', 'Documentation connecting the impression, exhibit, location, method, scale, and resulting image.']],
    practical: ['Create a documentation checklist for a fictional impression.', 'Compare porous and non-porous surface reasoning conceptually.', 'Explain why development sequence should be recorded.'],
    case: ['A faint impression is found on a mixed-surface object.', 'The first photograph lacks scale and location context.', 'Identify the documentation gap and explain why it matters for later comparison.']
  },
  {
    id: 'comparison-and-evaluation',
    title: 'Friction Ridge Comparison and Evaluation',
    description: 'Apply a transparent comparison structure while separating observation from conclusion.',
    topics: ['comparison', 'correspondence', 'discrepancy', 'evaluation'],
    sections: [
      ['Comparison asks whether details correspond', 'The examiner compares the questioned impression with a known exemplar, considering orientation, ridge flow, minutiae, ridge morphology, and the quality of corresponding regions.'],
      ['Discrepancies need explanation', 'An apparent difference may arise from distortion, pressure, substrate, movement, development, or an actual lack of correspondence. It should not be ignored or dismissed without a reasoned assessment.'],
      ['Evaluation is bounded', 'Conclusions use the laboratory’s validated framework and terminology. The strength of a comparison is not a statement about guilt, activity, or time of deposition unless those propositions are separately supported.']
    ],
    micro: ['What should happen when an apparent discrepancy is observed?', ['Assess whether quality or distortion explains it before concluding', 'Ignore it if other details look similar', 'Assume it proves exclusion', 'Change the image'], 0],
    questions: [
      ['What is a correspondence?', ['A meaningful agreement of observed ridge detail in comparable areas', 'A person’s confession', 'A development chemical', 'A time estimate'], 0, 'Correspondence concerns observed comparable ridge detail.'],
      ['Why must discrepancies be documented?', ['They test alternative explanations and protect against confirmation bias', 'They always prove fraud', 'They are irrelevant to comparison', 'They replace the known exemplar'], 0, 'Transparent discrepancy analysis makes the reasoning auditable.']
    ],
    flashcards: [['Correspondence', 'Agreement between comparable observed ridge detail in questioned and known impressions.'], ['Discrepancy', 'An apparent difference requiring assessment of quality, distortion, or true non-correspondence.']],
    practical: ['Use a fictional comparison table with correspondence and discrepancy columns.', 'Write two alternative explanations for an apparent difference.', 'Draft a conclusion that avoids activity or guilt claims.'],
    case: ['A questioned impression has three corresponding regions and one blurred region.', 'The known exemplar is clear but captured at a different pressure.', 'Explain what can be assessed and what remains limited.']
  },
  {
    id: 'quality-assurance-and-reporting',
    title: 'Quality Assurance and Fingerprint Reporting',
    description: 'Report fingerprint evidence with verification, documentation, and limitations.',
    topics: ['quality assurance', 'verification', 'bias management', 'reporting'],
    sections: [
      ['Quality is a process', 'Quality assurance includes validated procedures, competent examination, suitable equipment, documentation, review, and records that allow another qualified person to understand the work.'],
      ['Verification and bias awareness', 'Independent review or verification can identify errors and strengthen confidence. Context management matters because irrelevant case information can influence perception and comparison decisions.'],
      ['Report what the evidence supports', 'A report should state the material examined, method or framework, observations, conclusion category, and limitations. It should not imply that a source conclusion proves when, why, or how contact occurred.']
    ],
    micro: ['What is a key purpose of independent verification?', ['To provide a separate check of the examination and conclusion', 'To guarantee a desired result', 'To remove the original record', 'To determine guilt'], 0],
    questions: [
      ['What does context management help reduce?', ['The risk that irrelevant information influences interpretation', 'The need for documentation', 'The visibility of ridge detail', 'The difference between latent and known prints'], 0, 'Context management supports more independent examination.'],
      ['Which statement is appropriately limited?', ['The impression is reported within the validated comparison framework', 'The print proves when contact occurred', 'The source is guilty', 'Every similar pattern has the same origin'], 0, 'A source comparison does not automatically establish activity or guilt.']
    ],
    flashcards: [['Verification', 'A separate check of examination work or conclusion under the applicable quality system.'], ['Context management', 'Controlling irrelevant information to reduce avoidable interpretive bias.']],
    practical: ['Build a report checklist for a fictional comparison.', 'Separate source-level and activity-level propositions.', 'Write a limitation about time of deposition.'],
    case: ['A reviewer sees the case theory before examining a partial impression.', 'The conclusion appears stronger after discussion.', 'Explain how context and independent review should be managed.']
  }
];

function makeChapter(definition, index) {
  return {
    ...definition,
    estimatedMinutes: 40,
    difficulty: index < 2 ? 'Developing' : 'Advanced undergraduate',
    universityRelevance: 'Core standard B.Sc. coverage · needs university mapping',
    prerequisite: index ? 'Previous Fingerprint Science chapter' : 'Introduction to forensic science and evidence documentation',
    metadata: { contentLevel: 'standard_undergraduate_content', classification: 'STANDARD_BSC', verificationStatus: 'STANDARD_CURRICULUM', examRelevance: 'high', sourceStatus: 'REFERENCE_CANDIDATE', lastUpdated: '2026-09-09' },
    sections: definition.sections.map(([title, body], sectionIndex) => ({ id: `${definition.id}-${sectionIndex + 1}`, title, body, callout: sectionIndex === 0 ? 'Describe the observation before interpreting it.' : 'State the quality and limitation alongside the result.' })),
    summary: { definition: `${definition.title} applies friction-ridge science to a bounded forensic question.`, points: definition.sections.map(([title]) => title), examPoints: ['Observation → method → comparison → evaluation → limitation', 'A fingerprint conclusion does not by itself prove time, activity, or guilt.'] },
    visual: { title: 'Impression to defensible report', nodes: [{ id: `${definition.id}-question`, label: 'Document', detail: 'Record the exhibit, location, scale, and condition.' }, { id: `${definition.id}-compare`, label: 'Compare', detail: 'Assess corresponding detail and discrepancies.' }, { id: `${definition.id}-report`, label: 'Report', detail: 'State the validated conclusion and limits.' }] },
    microChecks: [{ id: `${definition.id}-micro`, prompt: definition.micro[0], options: definition.micro[1], correctIndex: definition.micro[2], explanation: 'The correct choice preserves transparent observation, method, and limitation reasoning.' }],
    quiz: { id: `${definition.id}-quiz`, title: `${definition.title} checkpoint`, questions: definition.questions.map(([prompt, options, correctIndex, explanation], questionIndex) => ({ id: `${definition.id}-q${questionIndex + 1}`, prompt, options, correctIndex, explanation })) },
    flashcards: definition.flashcards.map(([front, back], cardIndex) => ({ id: `${definition.id}-f${cardIndex + 1}`, type: cardIndex ? 'application' : 'definition', front, back })),
    practical: { title: `${definition.title} interpretation practical`, objective: 'Apply the concept to a fictional classroom record; do not handle real evidence or development chemicals.', sections: [['Objective', definition.practical[0]], ['Method', definition.practical[1]], ['Viva prompt', definition.practical[2]]] },
    caseStudy: { title: `${definition.title} teaching case`, prompt: definition.case[0], note: 'Hypothetical educational case only; no real evidence, people, or operational protocol.', sections: [['Observation', definition.case[1]], ['Analysis', definition.case[2]], ['Limitation', 'Keep the conclusion within the visible detail, validated framework, and documented quality.']] },
    viva: [`Define ${definition.topics[0]} in fingerprint science.`, `Explain how ${definition.topics[1]} affects interpretation.`, 'State one limitation of a fingerprint conclusion.'],
    aiContext: { allowedTopics: definition.topics, prohibitedClaims: ['official Anjaneya University requirement', 'fabricated identification', 'unsupported activity or guilt claim'], grounding: 'STANDARD_CURRICULUM', references },
    revision: { prompts: [`Recall the meaning of ${definition.topics[0]}.`, `Explain ${definition.topics[1]} using the case.`, 'State the reporting limitation.'] },
    references
  };
}

export const fingerprintScience = {
  id: 'fingerprint-science',
  title: 'Fingerprint Science',
  shortDescription: 'Friction ridges • latent impressions • comparison • reporting',
  contentLevel: 'standard_undergraduate_content',
  officialUniversityContent: false,
  classification: 'STANDARD_BSC',
  coverageLabel: 'Supplementary / Standard Curriculum',
  verificationStatus: 'STANDARD_CURRICULUM',
  year: 2,
  semester: 3,
  learningOutcomes: ['Describe friction-ridge structure, persistence, pattern flow, and limitations.', 'Explain latent impression documentation and development decisions conceptually.', 'Compare and report ridge detail using transparent quality and limitation reasoning.'],
  units: [
    { id: 'fingerprint-unit-1', title: 'Unit 1 · Ridge foundations and pattern reasoning', chapters: definitions.slice(0, 2).map(makeChapter) },
    { id: 'fingerprint-unit-2', title: 'Unit 2 · Latent evidence and comparison', chapters: definitions.slice(2, 4).map(makeChapter) },
    { id: 'fingerprint-unit-3', title: 'Unit 3 · Quality and reporting', chapters: definitions.slice(4).map(makeChapter) }
  ]
};
