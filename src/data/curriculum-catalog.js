/**
 * Standard B.Sc. Forensic Science coverage map.
 *
 * This is a planning/catalogue layer, not a claim about Anjaneya University's
 * official syllabus. University-specific rows must be imported with a source
 * and verification status before they are shown as required coursework.
 */
export const verificationStatuses = [
  'VERIFIED',
  'PARTIALLY_VERIFIED',
  'STANDARD_CURRICULUM',
  'NEEDS_REVIEW'
];

export const contentClassifications = [
  'OFFICIAL_UNIVERSITY',
  'UNIVERSITY_ALIGNED',
  'STANDARD_BSC',
  'ADVANCED_BSC',
  'PROFESSIONAL_EXTENSION',
  'RESEARCH_EXTENSION'
];

export const curriculumCatalog = {
  id: 'standard-bsc-forensic-science',
  title: 'B.Sc. Forensic Science · standard coverage map',
  verificationStatus: 'STANDARD_CURRICULUM',
  source: 'Standard B.Sc. subject-domain planning map',
  sourceUrl: null,
  sourceDate: null,
  curriculumVersion: 1,
  years: [
    {
      id: 'year-1',
      number: 1,
      title: 'Year 1',
      semesters: [
        {
          id: 'semester-1',
          number: 1,
          title: 'Semester 1',
          verificationStatus: 'STANDARD_CURRICULUM',
          subjects: [
            { id: 'foundations-forensic-science', title: 'Foundations of Forensic Science', classification: 'STANDARD_BSC' },
            { id: 'general-chemistry', title: 'General Chemistry for Forensic Science', classification: 'STANDARD_BSC' },
            { id: 'cell-biology-genetics', title: 'Cell Biology and Genetics', classification: 'STANDARD_BSC' },
            { id: 'forensic-science-communication', title: 'Scientific Communication and Study Skills', classification: 'STANDARD_BSC' }
          ]
        },
        {
          id: 'semester-2',
          number: 2,
          title: 'Semester 2',
          verificationStatus: 'STANDARD_CURRICULUM',
          subjects: [
            { id: 'crime-scene-foundations', title: 'Crime Scene Investigation Foundations', classification: 'STANDARD_BSC' },
            { id: 'organic-chemistry', title: 'Organic Chemistry for Forensic Science', classification: 'STANDARD_BSC' },
            { id: 'human-anatomy-physiology', title: 'Human Anatomy and Physiology', classification: 'STANDARD_BSC' },
            { id: 'forensic-photography', title: 'Forensic Photography and Documentation', classification: 'STANDARD_BSC' }
          ]
        }
      ]
    },
    {
      id: 'year-2',
      number: 2,
      title: 'Year 2',
      semesters: [
        {
          id: 'semester-3',
          number: 3,
          title: 'Semester 3',
          verificationStatus: 'NEEDS_REVIEW',
          subjects: [
            { id: 'forensic-biology', title: 'Forensic Biology', classification: 'STANDARD_BSC', flagship: true },
            { id: 'forensic-chemistry', title: 'Forensic Chemistry', classification: 'STANDARD_BSC' },
            { id: 'fingerprint-science', title: 'Fingerprint Science', classification: 'STANDARD_BSC' },
            { id: 'forensic-statistics', title: 'Statistics for Forensic Interpretation', classification: 'STANDARD_BSC' }
          ]
        },
        {
          id: 'semester-4',
          number: 4,
          title: 'Semester 4',
          verificationStatus: 'STANDARD_CURRICULUM',
          subjects: [
            { id: 'forensic-toxicology', title: 'Forensic Toxicology', classification: 'STANDARD_BSC' },
            { id: 'forensic-serology', title: 'Forensic Serology', classification: 'STANDARD_BSC' },
            { id: 'trace-evidence', title: 'Trace Evidence', classification: 'STANDARD_BSC' },
            { id: 'questioned-documents', title: 'Questioned Documents', classification: 'STANDARD_BSC' }
          ]
        }
      ]
    },
    {
      id: 'year-3',
      number: 3,
      title: 'Year 3',
      semesters: [
        {
          id: 'semester-5',
          number: 5,
          title: 'Semester 5',
          verificationStatus: 'STANDARD_CURRICULUM',
          subjects: [
            { id: 'forensic-dna', title: 'Forensic DNA Analysis', classification: 'ADVANCED_BSC' },
            { id: 'ballistics', title: 'Forensic Ballistics', classification: 'STANDARD_BSC' },
            { id: 'digital-forensics', title: 'Digital and Cyber Forensics', classification: 'STANDARD_BSC' },
            { id: 'forensic-medicine', title: 'Forensic Medicine', classification: 'STANDARD_BSC' }
          ]
        },
        {
          id: 'semester-6',
          number: 6,
          title: 'Semester 6',
          verificationStatus: 'STANDARD_CURRICULUM',
          subjects: [
            { id: 'forensic-anthropology', title: 'Forensic Anthropology', classification: 'STANDARD_BSC' },
            { id: 'forensic-odontology', title: 'Forensic Odontology', classification: 'STANDARD_BSC' },
            { id: 'forensic-entomology', title: 'Forensic Entomology', classification: 'STANDARD_BSC' },
            { id: 'research-methodology', title: 'Research Methodology and Dissertation', classification: 'STANDARD_BSC' }
          ]
        }
      ]
    }
  ]
};

export const flagshipReferences = [
  {
    id: 'nist-dna-forensic',
    title: 'Forensic DNA Analysis: A Primer for Courts',
    organization: 'National Institute of Standards and Technology',
    url: 'https://www.nist.gov/',
    status: 'REFERENCE_CANDIDATE',
    note: 'Use the authoritative publication page and edition details before publishing a citation.'
  },
  {
    id: 'nij-dna-evidence',
    title: 'DNA Evidence: Basics and Interpretation',
    organization: 'National Institute of Justice',
    url: 'https://nij.ojp.gov/',
    status: 'REFERENCE_CANDIDATE',
    note: 'Reference candidate for evidence handling and interpretation context; not a university syllabus.'
  }
];

export function getCatalogSemester(yearNumber, semesterNumber) {
  return curriculumCatalog.years
    .find((year) => year.number === Number(yearNumber))
    ?.semesters.find((semester) => semester.number === Number(semesterNumber));
}
