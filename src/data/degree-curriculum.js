const references = [
  { title: 'Reference candidate · National Institute of Justice', url: 'https://nij.ojp.gov/', status: 'REFERENCE_CANDIDATE' },
  { title: 'Reference candidate · National Institute of Standards and Technology', url: 'https://www.nist.gov/', status: 'REFERENCE_CANDIDATE' }
];

const subjectBlueprints = {
  'foundations-forensic-science': ['Foundations of Forensic Science', 'scientific foundations, evidence, and the forensic process', ['What is forensic science?', 'Observation and inference', 'Evidence concepts', 'Professional ethics'], 'How foundational reasoning supports every later forensic discipline.'],
  'general-chemistry': ['General Chemistry for Forensic Science', 'matter, reactions, measurement, and laboratory safety', ['Matter and measurement', 'Atoms and bonding', 'Chemical reactions', 'Solutions and concentration'], 'How chemical principles support forensic chemistry and toxicology.'],
  'cell-biology-genetics': ['Cell Biology and Genetics', 'cells, heredity, and the biological basis of identification', ['Cell structure', 'Cell division', 'Inheritance', 'Molecular information'], 'How genetics connects to biological evidence and DNA profiling.'],
  'forensic-science-communication': ['Scientific Communication and Study Skills', 'reading, note-making, argument, and responsible scientific communication', ['Scientific vocabulary', 'Reading evidence', 'Academic writing', 'Presentation and revision'], 'How clear communication protects the meaning of forensic findings.'],
  'crime-scene-foundations': ['Crime Scene Investigation Foundations', 'scene observation, documentation, preservation, and evidence reasoning', ['Scene safety', 'Observation and documentation', 'Evidence continuity', 'Reconstruction basics'], 'How disciplined scene work protects later laboratory interpretation.'],
  'organic-chemistry': ['Organic Chemistry for Forensic Science', 'carbon compounds, functional groups, and reaction reasoning', ['Carbon structure', 'Functional groups', 'Reaction patterns', 'Organic evidence'], 'How organic chemistry prepares Kittu for drugs, toxicology, and trace analysis.'],
  'human-anatomy-physiology': ['Human Anatomy and Physiology', 'body systems, function, and medically relevant evidence context', ['Tissues and organs', 'Nervous system', 'Circulation and respiration', 'Homeostasis'], 'How body structure and function inform forensic biology and medicine.'],
  'forensic-photography': ['Forensic Photography and Documentation', 'scale, perspective, lighting, and accurate visual records', ['Photographic principles', 'Scale and perspective', 'Lighting and detail', 'Documentation workflow'], 'How images preserve observations without replacing written interpretation.'],
  'forensic-dna': ['Forensic DNA Analysis', 'advanced DNA workflows, interpretation, and reporting boundaries', ['STR analysis', 'Mixture interpretation', 'Quality and stochastic effects', 'Reporting and databases'], 'How advanced molecular evidence is interpreted responsibly.'],
  ballistics: ['Forensic Ballistics', 'firearms, projectile motion, examination, and interpretation', ['Firearm fundamentals', 'Projectile motion', 'Toolmarks and comparison', 'Trajectory reasoning'], 'How physics and comparison methods support firearm evidence interpretation.'],
  'digital-forensics': ['Digital and Cyber Forensics', 'digital evidence preservation, acquisition concepts, and interpretation', ['Digital evidence principles', 'Storage and metadata', 'Acquisition concepts', 'Reporting and legal boundaries'], 'How technical evidence is preserved, examined, and communicated.'],
  'forensic-medicine': ['Forensic Medicine', 'injury, death investigation, and medico-legal reasoning', ['Medico-legal context', 'Injury documentation', 'Death investigation', 'Interpretation limits'], 'How medicine contributes evidence without replacing expert scope or legal judgment.'],
  'forensic-anthropology': ['Forensic Anthropology', 'skeletal biology, identification, and estimation limits', ['Skeletal biology', 'Biological profile', 'Trauma and taphonomy', 'Identification reasoning'], 'How osteological evidence contributes to a broader identification process.'],
  'forensic-odontology': ['Forensic Odontology', 'dental anatomy, records, and identification reasoning', ['Dental anatomy', 'Dental records', 'Bite evidence limits', 'Identification reporting'], 'How dental evidence is compared and reported with appropriate caution.'],
  'forensic-entomology': ['Forensic Entomology', 'insects, decomposition, and time-since-event reasoning', ['Insect biology', 'Succession and decomposition', 'Collection context', 'Estimation limits'], 'How ecological observations can inform, but not alone determine, an investigation.'],
  'research-methodology': ['Research Methodology and Dissertation', 'research questions, study design, data, writing, and ethics', ['Research question and hypothesis', 'Literature review', 'Study design and data', 'Scientific writing and presentation'], 'How a defensible research process supports a dissertation without inventing results.']
};

function makeChapter(subjectId, subjectTitle, chapterTitle, topic, connection, index, year) {
  const id = `${subjectId}-${index + 1}`;
  const foundation = year === 1;
  return {
    id,
    title: chapterTitle,
    description: `${topic} within ${subjectTitle.toLowerCase()}.`,
    estimatedMinutes: foundation ? 25 : 35,
    difficulty: foundation ? 'Foundation' : 'Advanced undergraduate',
    universityRelevance: 'Standard B.Sc. coverage · needs university mapping',
    topics: [topic, 'Scientific terminology', 'Forensic application'],
    prerequisite: index ? `Previous ${subjectTitle} chapter` : 'Scientific reasoning and safe study practice',
    metadata: { contentLevel: foundation ? 'foundation' : 'advanced_undergraduate_content', classification: year === 3 && subjectId === 'forensic-dna' ? 'ADVANCED_BSC' : 'STANDARD_BSC', verificationStatus: 'STANDARD_CURRICULUM', examRelevance: index < 2 ? 'high' : 'moderate', sourceStatus: 'REFERENCE_CANDIDATE', lastUpdated: '2026-09-09' },
    sections: [
      { id: `${id}-what`, title: 'What is it?', body: `${topic} is introduced through clear definitions, observable features, and the vocabulary needed to discuss it accurately.`, callout: foundation ? 'Start with the definition before memorising detail.' : 'Separate established findings from interpretation.' },
      { id: `${id}-why`, title: 'Why does it matter?', body: `This concept matters because it helps answer a bounded forensic question. ${connection}`, callout: 'Always connect a scientific method to the question it can actually answer.' },
      { id: `${id}-how`, title: 'How is it used?', body: `Use a controlled workflow: define the question, document the material or data, apply an appropriate method, and interpret the result with limitations.`, callout: 'A careful limitation is part of the result, not an afterthought.' }
    ],
    summary: { definition: `${topic} is a core concept in ${subjectTitle}.`, points: ['Define the concept and its terms.', 'Explain its forensic relevance.', 'State method, evidence, and limitations.'], examPoints: ['Definition → application → limitation', 'Do not claim more than the evidence supports.'] },
    visual: { title: `${topic} workflow`, nodes: [{ id: `${id}-question`, label: 'Question', detail: 'Define what must be understood.' }, { id: `${id}-method`, label: 'Method', detail: 'Choose a suitable scientific approach.' }, { id: `${id}-interpret`, label: 'Interpret', detail: 'Explain the result and its limits.' }] },
    microChecks: [{ id: `${id}-micro`, prompt: 'What should come before interpretation?', options: ['A clearly defined question and method', 'A guaranteed conclusion', 'An unsupported assumption'], correctIndex: 0, explanation: 'Interpretation depends on a clear question and an appropriate method.' }],
    quiz: { id: `${id}-quiz`, title: `${chapterTitle} checkpoint`, questions: [{ id: `${id}-q1`, prompt: 'Which approach is most scientifically defensible?', options: ['Question, method, evidence, interpretation, limitations', 'Conclusion first, method later', 'Observation without documentation', 'A single result without context'], correctIndex: 0, explanation: 'Forensic reasoning is structured and transparent.' }] },
    flashcards: [{ id: `${id}-f1`, type: 'definition', front: topic, back: `${topic} is a core concept in ${subjectTitle}.` }, { id: `${id}-f2`, type: 'connection', front: 'Forensic connection', back: connection }],
    practical: { title: `${chapterTitle} study practical`, objective: 'Plan a safe, conceptual workflow using a fictional or classroom dataset only.', sections: [['Objective', `Explain ${topic} in your own words.`], ['Method', 'List the observation, method, and quality checks required.'], ['Viva', 'What is one limitation of this evidence or method?']] },
    caseStudy: { title: `The ${topic.toLowerCase()} interpretation`, prompt: 'A student has observations but an uncertain conclusion. What should be reviewed?', note: 'Hypothetical educational case only; no real people, evidence, or operational protocol.', sections: [['Observation', 'The record contains a plausible observation.'], ['Reasoning', 'Review method fit, controls, alternatives, and uncertainty.'], ['Limitation', 'Do not turn a teaching example into a real-world conclusion.']] },
    viva: [`Define ${topic}.`, `How does ${topic} connect to forensic science?`, 'What limitation should be reported?'],
    aiContext: { allowedTopics: [subjectTitle, topic, 'forensic application'], prohibitedClaims: ['official university requirement', 'fabricated case finding', 'unsupported certainty'], grounding: 'STANDARD_CURRICULUM' },
    revision: { prompts: [`Recall the definition of ${topic}.`, 'Explain the forensic connection.', 'State one limitation.'] },
    references
  };
}

function makeSubject(subjectId, [title, shortDescription, chapters, connection], year, semester) {
  return {
    id: subjectId, title, shortDescription, contentLevel: year === 1 ? 'foundation' : 'advanced_undergraduate_content',
    officialUniversityContent: false, classification: subjectId === 'forensic-dna' ? 'ADVANCED_BSC' : 'STANDARD_BSC',
    coverageLabel: year === 1 ? 'Foundation · Standard Curriculum' : 'Advanced · Standard Curriculum',
    verificationStatus: 'STANDARD_CURRICULUM',
    year, semester,
    learningOutcomes: chapters.map((topic) => `Explain ${topic.toLowerCase()} and connect it to forensic reasoning.`),
    units: [{ id: `${subjectId}-unit-1`, title: `Unit 1 · ${title}`, chapters: chapters.map((chapterTitle, index) => makeChapter(subjectId, title, chapterTitle, chapterTitle, connection, index, year)) }],
    prerequisites: year === 1 ? ['Scientific literacy', 'Safe study practice'] : ['Year 1 scientific foundations', 'Year 2 subject concepts'],
    mode: year === 1 ? 'FOUNDATION' : 'ADVANCED',
    projectSupport: year === 3 ? ['Topic selection', 'Research question', 'Source library', 'Research notes', 'Draft report', 'Presentation preparation'] : []
  };
}

export const degreeCurriculum = Object.entries(subjectBlueprints).map(([id, blueprint]) => {
  const year = ['foundations-forensic-science', 'general-chemistry', 'cell-biology-genetics', 'forensic-science-communication', 'crime-scene-foundations', 'organic-chemistry', 'human-anatomy-physiology', 'forensic-photography'].includes(id) ? 1 : 3;
  const semester = year === 1 ? (['crime-scene-foundations', 'organic-chemistry', 'human-anatomy-physiology', 'forensic-photography'].includes(id) ? 2 : 1) : (['forensic-anthropology', 'forensic-odontology', 'forensic-entomology', 'research-methodology'].includes(id) ? 6 : 5);
  return makeSubject(id, blueprint, year, semester);
});

export function getDegreeSubject(subjectId) {
  return degreeCurriculum.find((subject) => subject.id === subjectId);
}
