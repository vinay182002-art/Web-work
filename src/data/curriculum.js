/**
 * Demo content is intentionally labelled as demo content. It is not presented
 * as an official Anjaneya University syllabus.
 */
import { additionalForensicBiologyUnits } from './forensic-biology-flagship.js';
import { forensicChemistry } from './forensic-chemistry.js?v=18';
import { getDegreeSubject } from './degree-curriculum.js';
import { fingerprintScience } from './fingerprint-science.js?v=19';
import { forensicStatistics } from './forensic-statistics.js?v=20';
export const demoCurriculum = {
  id: 'demo-year-2-semester-3',
  year: { id: 'year-2', number: 2, title: 'Year 2' },
  semester: { id: 'semester-3', number: 3, title: 'Semester 3' },
  verificationStatus: 'NEEDS_REVIEW',
  source: null,
  sourceDate: null,
  curriculumVersion: 1,
  subjects: [
    {
      id: 'forensic-biology',
      title: 'Forensic Biology',
      shortDescription: 'DNA • Serology • Genetics',
      contentLevel: 'standard_undergraduate_content',
      officialUniversityContent: false,
      classification: 'STANDARD_BSC',
      coverageLabel: 'Supplementary / Standard Curriculum',
      learningOutcomes: [
        'Explain how biological evidence is protected from contamination.',
        'Describe the purpose of extraction, purification, and quantification.',
        'Interpret a basic DNA workflow with appropriate limitations.'
      ],
      units: [
        ...additionalForensicBiologyUnits,
        {
          id: 'biology-unit-2',
          title: 'Unit 2 · DNA analysis',
          chapters: [
            {
              id: 'dna-extraction',
              title: 'DNA extraction & quantification',
              description: 'Move from biological sample to a reliable DNA profile.',
              estimatedMinutes: 18,
              difficulty: 'Developing',
              universityRelevance: 'Foundational forensic biology concept',
              topics: ['Cell lysis', 'Purification', 'Quantification'],
              prerequisite: 'Basic cell biology',
              metadata: {
                contentLevel: 'standard_undergraduate_content',
                difficulty: 'developing',
                examRelevance: 'high',
                contentType: 'deep_dive',
                source: null,
                lastUpdated: '2026-09-09'
              },
              sections: [
                {
                  id: 'dna-purpose',
                  title: 'Why extraction quality matters',
                  body: 'DNA extraction separates genetic material from a biological sample so it can be measured and analysed. A clean workflow protects the reliability of every later interpretation.',
                  type: 'definition',
                  callout: 'Important: a DNA profile is only as reliable as the evidence handling and analytical chain that produced it.'
                },
                {
                  id: 'dna-workflow',
                  title: 'The three-stage workflow',
                  body: 'A useful mental model is release, purify, and measure: release DNA from cells, remove inhibitors, then quantify concentration and quality before downstream analysis.',
                  type: 'process',
                  callout: 'Exam tip: explain not only what each stage does, but why skipping it can affect interpretation.'
                }
              ],
              summary: {
                definition: 'Extraction isolates DNA; purification removes inhibitors; quantification estimates concentration and quality.',
                points: ['Protect the chain of custody.', 'Use a clean workflow.', 'Interpret quantity together with quality.'],
                examPoints: ['Release → purify → measure', 'Low yield does not automatically identify the cause.']
              },
              visual: {
                title: 'Sample to profile',
                nodes: [
                  { id: 'release', label: 'Release DNA', detail: 'Break open cells while preserving the target material.' },
                  { id: 'purify', label: 'Purify extract', detail: 'Remove inhibitors that can interfere with downstream analysis.' },
                  { id: 'measure', label: 'Quantify', detail: 'Estimate how much usable DNA is present.' }
                ]
              },
              microChecks: [
                {
                  id: 'micro-1',
                  prompt: 'Why is quantification performed before downstream profiling?',
                  options: ['To check DNA amount and quality', 'To identify a person immediately', 'To replace evidence documentation'],
                  correctIndex: 0,
                  explanation: 'Quantification informs whether the extract is suitable and how much material is available.'
                }
              ],
              quiz: {
                id: 'dna-extraction-quiz',
                title: 'DNA extraction checkpoint',
                questions: [
                  {
                    id: 'dna-q1',
                    prompt: 'What is the primary purpose of quantification before profiling?',
                    options: ['To measure DNA amount and quality', 'To photograph the sample', 'To identify the suspect', 'To seal the evidence bag'],
                    correctIndex: 0,
                    explanation: 'Quantification checks whether the extract is suitable and sufficiently concentrated for the next analytical step.'
                  },
                  {
                    id: 'dna-q2',
                    prompt: 'Which sequence best describes the demo workflow?',
                    options: ['Measure, release, purify', 'Release, purify, measure', 'Purify, identify, release', 'Package, measure, release'],
                    correctIndex: 1,
                    explanation: 'The simplified workflow used here is cell lysis, purification, and then quantification.'
                  }
                ]
              },
              flashcards: [
                { id: 'dna-f1', type: 'definition', front: 'Cell lysis', back: 'The step that releases DNA from cells.' },
                { id: 'dna-f2', type: 'process', front: 'Quantification', back: 'Measuring DNA concentration and quality.' },
                { id: 'dna-f3', type: 'application', front: 'Why can a clean extract still be insufficient?', back: 'It may contain too little usable DNA, so quantity and quality must be considered together.' }
              ],
              practical: {
                title: 'Sample-to-profile workflow',
                objective: 'Map the purpose of each extraction stage without handling real biological material.',
                sections: [
                  ['Objective', 'Connect each stage to its analytical purpose.'],
                  ['Principle', 'Reliable interpretation depends on a controlled chain from sample to measurement.'],
                  ['Precautions', 'Treat contamination control and documentation as part of the science.'],
                  ['Viva prompt', 'Why is a concentration value alone not a complete quality assessment?']
                ]
              },
              caseStudy: {
                title: 'The low-yield extract',
                prompt: 'A sample produces a weak extract. Which stage should be reviewed first?',
                note: 'Use this demo case to practise explaining a causal chain rather than naming a single instrument.',
                sections: [
                  ['Scene', 'A carefully documented biological sample reaches the laboratory with limited material.'],
                  ['Evidence', 'The extract is measurable but below the expected working range.'],
                  ['Analysis', 'Review collection, lysis, purification, and measurement before drawing conclusions.'],
                  ['Limitation', 'This hypothetical teaching case does not represent a real incident or official protocol.']
                ]
              }
            }
          ]
        }
      ]
    },
    forensicChemistry,
    fingerprintScience,
    forensicStatistics
  ]
};

export function getSubject(subjectId) {
  return demoCurriculum.subjects.find((subject) => subject.id === subjectId) || getDegreeSubject(subjectId);
}

export function getChapter(subjectId, chapterId) {
  const subject = getSubject(subjectId);
  return subject?.units.flatMap((unit) => unit.chapters).find((chapter) => chapter.id === chapterId);
}

export function getDefaultChapter() {
  return getChapter('forensic-biology', 'dna-extraction');
}
