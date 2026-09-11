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
              learningModule: {
                overview: 'DNA extraction is the controlled isolation of DNA from biological material so that its quantity and suitability can be assessed before downstream profiling. This learning module is conceptual: it teaches the scientific reasoning and reporting boundary, not an operational laboratory protocol.',
                objectives: ['Explain why extraction quality affects every later DNA result.', 'Distinguish cell lysis, protein removal, purification, precipitation, and collection.', 'Interpret a low-yield or inhibited extract without overclaiming the cause.'],
                terminology: [['Lysis', 'Breaking open cells to release cellular contents, including DNA.'], ['Inhibitor', 'A substance that can interfere with a downstream analytical reaction.'], ['Aliquot', 'A measured portion taken from a larger sample for analysis.'], ['Quantification', 'Estimating the amount and, depending on method, suitability of DNA in an extract.']],
                equipment: ['Documented sample container', 'Appropriate labelled tubes', 'Pipette or measurement device', 'Validated quantification instrument'],
                materials: ['Biological sample or extract', 'Lysis chemistry', 'Purification medium or separation system', 'Reference and quality-control materials'],
                advantages: ['Can make DNA accessible for later analysis.', 'Purification can reduce substances that interfere with measurement or amplification.', 'Quantification helps plan an appropriate downstream examination.'],
                limitations: ['A result is limited to the sample and portion actually examined.', 'A low quantity alone does not identify the cause of the low yield.', 'The appropriate method, controls, and interpretation depend on validated laboratory procedures.'],
                commonMistakes: ['Treating quantification as personal identification.', 'Skipping documentation of the sampled portion and its condition.', 'Assuming a clean-looking extract is automatically suitable for every downstream method.'],
                examples: ['A degraded training sample may yield little usable DNA even when collection was documented carefully.', 'A complex sample matrix can require cautious interpretation because background material may affect downstream response.'],
                faq: [['Why quantify before profiling?', 'Quantification provides evidence about the available extract and helps keep a later method choice within its intended range.'], ['Does a low DNA value prove poor collection?', 'No. It is an observation that requires a chain-based review of sample condition, collection, extraction, purification, and measurement.'], ['Can a DNA result determine guilt?', 'No. This module concerns scientific processing and interpretation; legal conclusions require wider evidence and proper decision-making.']]
              },
              visual: {
                title: 'Sample to quantified extract',
                nodes: [
                  { id: 'sample', label: 'Sample', detail: 'Document the material, its condition, and the portion selected.', why: 'The analytical result can only be interpreted for the material actually examined.', reagents: 'Documented container, suitable control strategy', principle: 'Traceable sampling and chain of custody.', forensic: 'Protects the meaning and continuity of later findings.' },
                  { id: 'lysis', label: 'Cell lysis', detail: 'Release DNA from cells into a controlled extract.', why: 'DNA must be accessible before it can be separated and measured.', reagents: 'Conceptual lysis chemistry', principle: 'Cell membranes and structures are disrupted under validated conditions.', forensic: 'Poor release can limit downstream material.' },
                  { id: 'protein-removal', label: 'Protein removal', detail: 'Separate DNA from proteins and other cellular components.', why: 'Background material can complicate a later measurement or reaction.', reagents: 'Method-dependent separation chemistry', principle: 'Different molecular components can be separated by their properties.', forensic: 'Supports an interpretable, cleaner extract.' },
                  { id: 'purify', label: 'DNA purification', detail: 'Reduce substances that could interfere with later analysis.', why: 'A measurable extract is not automatically free of inhibitors.', reagents: 'Validated purification medium or system', principle: 'Selective retention, washing, or separation of DNA and background material.', forensic: 'Helps keep downstream results within a validated method scope.' },
                  { id: 'precipitate', label: 'DNA precipitation', detail: 'Concentrate or recover DNA in workflows where this is appropriate.', why: 'Some approaches use recovery or concentration to prepare material for further work.', reagents: 'Method-dependent recovery system', principle: 'DNA solubility and separation are controlled by the validated method.', forensic: 'The exact method and its limitations must be documented.' },
                  { id: 'measure', label: 'DNA collection & quantification', detail: 'Recover the extract, measure it, and review quality controls before downstream analysis.', why: 'Measurement supports a bounded decision about next steps.', reagents: 'Quantification method, blanks, controls, reference materials', principle: 'Instrument response is interpreted with calibration and quality checks.', forensic: 'Supports transparent reporting of amount, suitability, and limitation.' }
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
                  },
                  {
                    id: 'dna-q3',
                    type: 'TRUE_FALSE',
                    prompt: 'True or false: a measured DNA extract by itself identifies the person from whom the sample originated.',
                    options: ['True', 'False'],
                    correctIndex: 1,
                    explanation: 'False. Quantification assesses the extract; it does not establish source identity or answer a legal question.'
                  },
                  {
                    id: 'dna-q4',
                    type: 'SCENARIO',
                    prompt: 'A fictional sample gives a low quantified value. Which response is most defensible?',
                    options: ['Review the documented sample-to-measurement chain and quality controls', 'State that collection definitely failed', 'Report a source conclusion immediately', 'Discard the record because the value is low'],
                    correctIndex: 0,
                    explanation: 'Low yield can arise at more than one point. A chain-based review avoids assigning an unsupported cause.'
                  },
                  {
                    id: 'dna-q5',
                    type: 'APPLICATION',
                    prompt: 'Which statement best communicates an extraction limitation?',
                    options: ['The result applies to the examined portion and validated method conditions', 'The result proves the composition of every item in the case', 'The result excludes all possible explanations', 'The result determines activity at the scene'],
                    correctIndex: 0,
                    explanation: 'A defensible conclusion stays within the sample, method scope, and documented conditions.'
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
              },
              references: [
                { title: 'Informative Literature for Forensic Biology and DNA', author: 'Organization of Scientific Area Committees for Forensic Science', publisher: 'National Institute of Standards and Technology', year: 2020, url: 'https://www.nist.gov/document/informative-literature-forensic-biology-dnareference-list-2020', sourceType: 'GOVERNMENT_REFERENCE_LIST', status: 'REFERENCE_CANDIDATE' },
                { title: 'Fundamentals of Forensic DNA Typing', author: 'John M. Butler', publisher: 'Academic Press', year: 2010, doi: '10.1016/C2009-0-01945-X', url: 'https://doi.org/10.1016/C2009-0-01945-X', sourceType: 'TEXTBOOK', status: 'REFERENCE_CANDIDATE' }
              ]
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
