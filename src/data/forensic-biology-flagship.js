const references = [
  { title: 'Reference candidate · National Institute of Justice', url: 'https://nij.ojp.gov/', status: 'REFERENCE_CANDIDATE' },
  { title: 'Reference candidate · National Institute of Standards and Technology', url: 'https://www.nist.gov/', status: 'REFERENCE_CANDIDATE' }
];

const chapterDefinitions = [
  ['biology-introduction', 'Introduction to Forensic Biology', 'How biological observations become bounded forensic evidence.', ['biological evidence', 'observation', 'interpretation']],
  ['biological-evidence', 'Biological Evidence in Forensic Investigation', 'Recognise, document, preserve, and interpret biological material without overstating its meaning.', ['recognition', 'documentation', 'preservation']],
  ['cells-materials', 'Cells and Biological Materials', 'Connect cellular structure and biological source material to forensic questions.', ['cells', 'tissues', 'body fluids']],
  ['blood-evidence', 'Blood as Forensic Evidence', 'Distinguish observation, pattern information, and biological testing in blood evidence.', ['bloodstains', 'observations', 'limitations']],
  ['blood-components', 'Blood Components', 'Relate cellular and liquid components of blood to screening and confirmatory reasoning.', ['erythrocytes', 'leukocytes', 'plasma']],
  ['serological-evidence', 'Serological Evidence', 'Understand how serology supports, excludes, or limits biological interpretations.', ['screening', 'confirmatory testing', 'inference']],
  ['dna-structure', 'DNA Structure and Function', 'Build the molecular foundation needed for forensic DNA analysis.', ['nucleotides', 'chromosomes', 'genome']],
  ['dna-replication', 'DNA Replication', 'Explain copying, fidelity, and why replication concepts matter to interpretation.', ['template', 'polymerase', 'fidelity']],
  ['forensic-genetics', 'Genetics Relevant to Forensic Science', 'Use inheritance, variation, alleles, and loci as a foundation for profile interpretation.', ['alleles', 'loci', 'inheritance']],
  ['dna-quantification', 'DNA Quantification', 'Interpret quantity and quality measurements as decision support, not identity results.', ['concentration', 'quality', 'inhibition']],
  ['pcr', 'Polymerase Chain Reaction', 'Understand amplification conceptually, including controls, cycles, and limitations.', ['amplification', 'primers', 'controls']],
  ['str-analysis', 'STR Analysis', 'Explain why short tandem repeats are useful markers and how alleles are represented.', ['STR loci', 'alleles', 'electrophoresis']],
  ['dna-profiling', 'DNA Profiling', 'Follow the analytical chain from sample to profile with explicit assumptions.', ['profile', 'analytical chain', 'comparison']],
  ['profile-interpretation', 'Profile Interpretation', 'Separate observations, propositions, and conclusions when evaluating a profile.', ['propositions', 'mixtures', 'limitations']],
  ['contamination-quality', 'Contamination and Quality Control', 'Use controls, documentation, and workflow separation to manage contamination risk.', ['contamination', 'controls', 'quality assurance']],
  ['population-genetics', 'Population Genetics and Statistical Interpretation', 'Understand allele frequencies and the limits of match statistics.', ['allele frequency', 'random match probability', 'likelihood ratio']],
  ['dna-limitations', 'Limitations of Forensic DNA', 'Identify what DNA evidence can support and what it cannot establish alone.', ['transfer', 'persistence', 'activity-level limits']],
  ['advanced-dna', 'Advanced DNA Analysis Concepts', 'Survey probabilistic reasoning and complex evidence without presenting it as beginner material.', ['probabilistic genotyping', 'complex mixtures', 'degradation']],
  ['emerging-technologies', 'Emerging Forensic Biology Technologies', 'Evaluate new methods by validation, reproducibility, and evidential purpose.', ['massively parallel sequencing', 'epigenetics', 'validation']],
  ['research-extension', 'Research Extension: Designing a Forensic Biology Study', 'Plan a defensible study with a question, controls, limitations, and transparent reporting.', ['research question', 'study design', 'critical appraisal']]
];

function makeChapter([id, title, description, topics], index) {
  const primary = topics[0];
  return {
    id,
    title,
    description,
    estimatedMinutes: 24 + (index % 4) * 6,
    difficulty: index < 6 ? 'Foundation' : index < 14 ? 'Developing' : 'Advanced',
    universityRelevance: 'Standard B.Sc. forensic-science coverage · needs university mapping',
    topics,
    prerequisite: index ? chapterDefinitions[index - 1][1] : 'Basic biology and scientific method',
    metadata: {
      contentLevel: index < 14 ? 'standard_undergraduate_content' : 'advanced_undergraduate_content',
      classification: index < 14 ? 'STANDARD_BSC' : 'ADVANCED_BSC',
      verificationStatus: 'STANDARD_CURRICULUM',
      examRelevance: 'high',
      sourceStatus: 'REFERENCE_CANDIDATE',
      lastUpdated: '2026-09-09'
    },
    sections: [
      { id: `${id}-overview`, title: 'Overview and forensic purpose', body: `${title} connects a biological concept to a specific forensic question. The analyst must describe what was observed, how it was examined, and which interpretations remain unsupported.`, type: 'overview', callout: 'Keep the observation, method, interpretation, and limitation separate.' },
      { id: `${id}-mechanism`, title: 'Scientific background and mechanism', body: `At B.Sc. level, focus on how ${primary} behaves in biological material and how that behaviour affects collection, examination, or interpretation. Methods require controls and context; a result is not meaningful without both.`, type: 'mechanism', callout: 'A method result is evidence about a proposition, not a conclusion about a person.' },
      { id: `${id}-application`, title: 'Application, quality, and limitations', body: `In practice, review the chain from sample condition through reporting. Consider alternative explanations, uncertainty, contamination, transfer, degradation, and the difference between source-level and activity-level claims.`, type: 'application', callout: 'Professional insight: state what the evidence cannot establish as carefully as what it can.' }
    ],
    summary: {
      definition: `${title} is studied as a structured evidence-to-interpretation problem.`,
      points: [`Define ${primary} precisely.`, 'Link method choice to the forensic question.', 'Report limitations and alternative explanations.'],
      examPoints: ['Use a clear definition → principle → application → limitation structure.', 'Avoid identity or guilt claims from a single biological result.']
    },
    visual: {
      title: 'Question to defensible interpretation',
      nodes: [
        { id: `${id}-question`, label: 'Question', detail: 'What proposition is the examination intended to address?' },
        { id: `${id}-method`, label: 'Method', detail: 'Which validated observation or test addresses that question?' },
        { id: `${id}-interpret`, label: 'Interpret', detail: 'What does the result support, and what remains uncertain?' }
      ]
    },
    microChecks: [{
      id: `${id}-check`,
      prompt: `What should be stated before interpreting ${primary}?`,
      options: ['The question, method, and limitations', 'The suspect identity', 'A conclusion without controls'],
      correctIndex: 0,
      explanation: 'Interpretation is only defensible when the question, method, controls, and limitations are explicit.'
    }],
    quiz: {
      id: `${id}-quiz`,
      title: `${title} checkpoint`,
      questions: [{
        id: `${id}-q1`,
        prompt: `Which approach best represents responsible work with ${primary}?`,
        options: ['Describe evidence, method, interpretation, and limitations', 'Treat every detection as proof of activity', 'Ignore controls if the result seems clear', 'Replace documentation with intuition'],
        correctIndex: 0,
        explanation: 'Forensic reasoning requires a transparent chain from observation through method and interpretation to limitations.'
      }]
    },
    flashcards: [
      { id: `${id}-f1`, type: 'definition', front: primary, back: `A concept within ${title} that must be defined before interpretation.` },
      { id: `${id}-f2`, type: 'application', front: 'What makes an interpretation defensible?', back: 'A clear proposition, validated method, appropriate controls, and stated limitations.' }
    ],
    practical: {
      title: `${title} reasoning exercise`,
      objective: `Map ${primary} from observation to a cautious forensic interpretation without handling real evidence.`,
      sections: [
        ['Objective', `Connect ${primary} to a defined forensic question.`],
        ['Quality check', 'List controls, documentation, and alternative explanations.'],
        ['Viva prompt', 'What can the result support, and what can it not establish?']
      ]
    },
    caseStudy: {
      title: `Interpreting ${primary} in context`,
      prompt: `A report contains a result related to ${primary}. What should be reviewed before relying on it?`,
      note: 'Hypothetical educational case only; it does not represent an operational investigation.',
      sections: [
        ['Observation', `The record contains a finding involving ${primary}.`],
        ['Analysis', 'Review sample condition, method, controls, propositions, and alternative explanations.'],
        ['Limitation', 'No conclusion about guilt, identity, or activity should be drawn from this teaching case alone.']
      ]
    },
    references
  };
}

export const additionalForensicBiologyUnits = [
  {
    id: 'biology-unit-1',
    title: 'Unit 1 · Foundations of forensic biology',
    chapters: chapterDefinitions.slice(0, 3).map(makeChapter)
  },
  {
    id: 'biology-unit-3',
    title: 'Unit 3 · Blood and serology',
    chapters: chapterDefinitions.slice(3, 6).map(makeChapter)
  },
  {
    id: 'biology-unit-4',
    title: 'Unit 4 · DNA and molecular biology',
    chapters: chapterDefinitions.slice(6, 10).map(makeChapter)
  },
  {
    id: 'biology-unit-5',
    title: 'Unit 5 · Forensic DNA analysis',
    chapters: chapterDefinitions.slice(10, 14).map(makeChapter)
  },
  {
    id: 'biology-unit-6',
    title: 'Unit 6 · Profile interpretation',
    chapters: chapterDefinitions.slice(14, 17).map(makeChapter)
  },
  {
    id: 'biology-unit-7',
    title: 'Unit 7 · Advanced analysis',
    chapters: chapterDefinitions.slice(17, 19).map(makeChapter)
  },
  {
    id: 'biology-unit-8',
    title: 'Unit 8 · Research extension',
    chapters: chapterDefinitions.slice(19).map(makeChapter)
  }
];

export const flagshipChapterCount = chapterDefinitions.length;
