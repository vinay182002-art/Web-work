/**
 * Statistics for Forensic Interpretation
 *
 * This is original, university-aligned learning content. The accessible
 * curriculum catalogue does not contain a verified university syllabus, so it
 * must never be represented as compulsory university coursework.
 */
const references = [
  {
    title: 'NIST/SEMATECH e-Handbook of Statistical Methods',
    author: 'N. A. Heckert, J. J. Filliben, C. M. Croarkin, B. Hembree, W. F. Guthrie, P. Tobias and J. Prinz',
    publisher: 'National Institute of Standards and Technology', year: 2002,
    url: 'https://doi.org/10.18434/M32189', sourceType: 'GOVERNMENT_HANDBOOK', status: 'REFERENCE_CANDIDATE'
  },
  {
    title: 'Statistics and the Evaluation of Evidence for Forensic Scientists',
    author: 'Colin G. G. Aitken and Franco Taroni', publisher: 'John Wiley & Sons', year: 2004,
    doi: '10.1002/0470011238', url: 'https://doi.org/10.1002/0470011238', sourceType: 'TEXTBOOK', status: 'REFERENCE_CANDIDATE'
  },
  {
    title: 'ENFSI Guideline for Evaluative Reporting in Forensic Science',
    author: 'European Network of Forensic Science Institutes', publisher: 'ENFSI', year: 2015,
    url: 'https://enfsi.eu/wp-content/uploads/2016/09/m1_guideline.pdf', sourceType: 'PROFESSIONAL_GUIDELINE', status: 'REFERENCE_CANDIDATE'
  }
];

const definitions = [
  {
    id: 'data-types-and-forensic-questions', title: 'Data, Variables, and Forensic Questions', minutes: 32, difficulty: 'Foundation',
    topics: ['population and sample', 'variables', 'measurement scales', 'sampling'],
    description: 'Turn an evidential question into defined data without confusing a sample with the wider population.',
    sections: [
      ['Start with the question', 'Statistics does not decide what a case means. It provides disciplined ways to describe data and assess how observations bear on stated propositions. First specify the question, the relevant population, the item or people sampled, and the decision the analysis can support.'],
      ['Variables carry a measurement story', 'A variable is a recorded characteristic. Its type matters: a category, rank, count, or continuous measurement permits different summaries and comparisons. Record how it was measured, its unit, and any coding rule; a number without this context is not yet interpretable evidence.'],
      ['Samples are not the whole world', 'A case sample, reference dataset, or database is a subset of a target population. Selection, representativeness, missingness, and dependence constrain any generalisation. A result about the tested sample should not silently become a claim about every possible source.'],
      ['Forensic application and limitation', 'In forensic work, data may describe measurements, observations, comparison features, or error-study outcomes. The defensible chain is question → defined variable → documented sample → suitable analysis → bounded interpretation. Convenience samples and unclear target populations are common sources of overstatement.']
    ],
    visual: ['From question to bounded inference', ['Forensic question', 'Target population', 'Defined variable', 'Documented sample', 'Analysis and limitation']],
    questions: [
      ['Which statement best distinguishes a sample from a population?', ['A sample is the observed subset; a population is the group the question concerns', 'A sample is always larger than a population', 'They are interchangeable once a graph is drawn', 'A population is only a list of suspects'], 0, 'A sample supplies observed data; the population is the wider group to which an inference may, with assumptions, relate.'],
      ['Why should a measurement scale be recorded?', ['It determines which summaries and comparisons are meaningful', 'It proves the source of an item', 'It removes sampling uncertainty', 'It makes missing data irrelevant'], 0, 'The scale tells us what operations and interpretations are justified.'],
      ['A dataset was collected only from easy-to-access items. What is the key concern?', ['Its representativeness of the target population', 'That every value must be wrong', 'That a histogram cannot be drawn', 'That the data are automatically inadmissible'], 0, 'Convenience selection can limit how far findings generalise; it does not make every observation false.']
    ],
    cards: [['Population', 'The full group relevant to a defined question.'], ['Sample', 'The subset actually observed or measured.'], ['Variable', 'A characteristic recorded for each observational unit.'], ['Representativeness', 'How well a sample supports claims about its defined target population.']],
    practical: ['Audit a fictional evidence spreadsheet before analysis.', 'Classify each column as categorical, ordinal, count, or continuous; define its unit and target population.', 'Do not infer that the fictional sample represents a wider population without an explicit sampling argument.'],
    case: ['A laboratory has measurements from a small training set and is asked to make a statement about all future casework.', 'The collection method and target population are not recorded.', 'Identify what can be described directly and what requires additional sampling information.']
  },
  {
    id: 'describing-distributions-and-variation', title: 'Describing Distributions and Variation', minutes: 35, difficulty: 'Developing',
    topics: ['mean and median', 'spread', 'distribution shape', 'outliers'],
    description: 'Describe central tendency, variation, and unusual observations before making a comparison or calculation.',
    sections: [
      ['A summary is a reduction, not the data', 'Tables and plots reveal features that one number can hide. Begin by checking units, entries, missing values, and a suitable display. A histogram, dot plot, or box plot can make clusters, skewness, gaps, and possible recording problems visible.'],
      ['Centre depends on the question', 'The mean uses every numerical value and is sensitive to extremes. The median is the middle ordered value and can be more representative of a skewed distribution. Neither is automatically “the right average”; choose and report it with the distribution and measurement context.'],
      ['Variation is evidence too', 'Range, interquartile range, variance, and standard deviation describe spread in different ways. Two groups can have the same mean but very different variability. A statement of only the average can therefore conceal the uncertainty and heterogeneity relevant to interpretation.'],
      ['Outliers invite investigation, not deletion', 'An unusual value may be a data-entry error, a measurement issue, or a genuine but rare observation. Check the record and method, document the decision, and assess sensitivity where appropriate. Removing a value merely because it is inconvenient is not sound analysis.']
    ],
    visual: ['Read a distribution before testing', ['Check data and units', 'Plot distribution', 'Describe centre', 'Describe spread', 'Investigate unusual values']],
    questions: [
      ['Why can the median be preferable to the mean for a strongly skewed distribution?', ['It is less influenced by extreme values', 'It always uses more data', 'It proves a result is accurate', 'It removes the need for a plot'], 0, 'The median is resistant to the magnitude of extreme values, but the full distribution still matters.'],
      ['Two datasets have the same mean. What can still differ importantly?', ['Their spread and shape', 'Their units cannot differ', 'Their sample size must match', 'Their observations must be identical'], 0, 'Equal centres do not imply equal variability, distributional form, or evidential implications.'],
      ['What is the most defensible first response to a possible outlier?', ['Check the record, measurement context, and effect on interpretation', 'Delete it immediately', 'Replace it with the mean', 'Assume it proves contamination'], 0, 'Investigation and transparent documentation precede any justified treatment.']
    ],
    cards: [['Mean', 'The arithmetic average; it is influenced by every value.'], ['Median', 'The middle ordered value; it is less sensitive to extremes.'], ['Standard deviation', 'A measure of spread around the mean, in the original measurement unit.'], ['Outlier', 'An observation that appears unusual relative to the rest and requires context-sensitive checking.']],
    practical: ['Compare two fictional measurement sets with the same mean.', 'Make a plot, report a centre and spread, then explain whether an unusual value changes your conclusion.', 'Keep a decision log: visual unusualness alone does not establish error.'],
    case: ['A comparison set has one very high measurement that changes the mean markedly.', 'Instrument notes show the run was otherwise valid.', 'Give a reporting approach that preserves the observation and explains its influence.']
  },
  {
    id: 'probability-conditional-reasoning-and-bayes', title: 'Probability, Conditional Reasoning, and Bayes', minutes: 42, difficulty: 'Developing',
    topics: ['probability', 'conditional probability', 'base rates', 'Bayes theorem'],
    description: 'Use probability language precisely and avoid reversing conditional statements in evidential reasoning.',
    sections: [
      ['Probability models uncertainty', 'Probability quantifies uncertainty within a stated model, reference class, and set of assumptions. It is not a synonym for truth, guilt, or a personal degree of confidence detached from data. State what event is being modelled and how the probabilities were obtained.'],
      ['Conditioning changes the question', 'P(A | B) is the probability of A given B. It usually differs from P(B | A). Confusing the probability of observing evidence if a proposition were true with the probability of that proposition given the evidence is a conditional-probability error.'],
      ['Base rates belong in the model', 'The frequency or prior plausibility of relevant propositions can matter when moving from conditional evidence probabilities to posterior probabilities. Whether and how a prior is used is a contextual, transparent modelling decision—not an excuse to hide assumptions behind a number.'],
      ['Bayes supports updating, not a shortcut verdict', 'Bayes theorem relates prior odds, a likelihood ratio, and posterior odds. In a forensic setting, an expert may often evaluate the likelihood of findings under competing propositions; the ultimate legal decision involves other evidence and the proper decision-maker.']
    ],
    visual: ['Conditional reasoning map', ['State propositions', 'Specify evidence', 'Model P(E | proposition)', 'Compare propositions', 'Report assumptions and limits']],
    questions: [
      ['What does P(E | H) describe?', ['The probability of the evidence if proposition H were true', 'The probability that H is true given the evidence', 'The probability of guilt', 'The certainty of an instrument'], 0, 'The vertical bar means “given.” Reversing it asks a different question.'],
      ['Why is the prosecutor’s fallacy problematic?', ['It treats P(E | H) as though it were P(H | E)', 'It uses a graph', 'It reports uncertainty', 'It compares propositions'], 0, 'Conditional probabilities cannot generally be reversed without additional information and a model.'],
      ['What should accompany a probabilistic statement?', ['Its proposition, reference framework, assumptions, and limitation', 'Only a percentage', 'A statement of legal guilt', 'An unsupported certainty label'], 0, 'A number without its conditioning and assumptions can be seriously misleading.']
    ],
    cards: [['Conditional probability', 'The probability of one event under the condition that another event is assumed or observed.'], ['Base rate', 'The frequency or prior prevalence of an event in a defined reference context.'], ['Prosecutor’s fallacy', 'Mistaking the probability of evidence given a proposition for the probability of the proposition given the evidence.'], ['Bayes theorem', 'A rule relating prior beliefs, evidence likelihood, and updated beliefs under a specified model.']],
    practical: ['Translate three everyday probability claims into conditional notation.', 'For each claim, say what evidence and proposition are conditioned on and identify any missing reference population.', 'Use hypothetical numbers only; the task is interpretation, not a case calculation.'],
    case: ['A report says a feature is rare if it came from an unrelated person, then states this proves the person is the source.', 'No competing proposition or base-rate framework is shown.', 'Identify the conditional reversal and draft a bounded correction.']
  },
  {
    id: 'hypothesis-testing-confidence-and-error', title: 'Hypothesis Testing, Confidence, and Error', minutes: 45, difficulty: 'Developing',
    topics: ['hypothesis test', 'p-value', 'confidence interval', 'type I and II error'],
    description: 'Interpret inferential tools as conditional procedures, not as proof or a binary truth machine.',
    sections: [
      ['A test answers a limited question', 'A hypothesis test evaluates how compatible observed data are with a specified null model. The null and alternative must be defined before interpreting the result. Statistical significance does not state the size, practical importance, or cause of an observed difference.'],
      ['A p-value is conditional', 'A p-value is the probability, under the null model and its assumptions, of results at least as incompatible with that model as the observed result. It is not the probability that the null hypothesis is true, and it does not measure the chance that a result occurred “by accident.”'],
      ['Intervals express estimation uncertainty', 'A confidence interval is produced by a procedure with stated long-run coverage under its assumptions. It gives a plausible range for an estimated parameter in this analysis, but it does not turn every value inside the interval into a probability statement about the parameter.'],
      ['Errors and power are design concerns', 'A Type I error rejects a null model when it is true; a Type II error fails to reject it when an alternative is true. Their risks depend on design, thresholds, effect size, variability, and sample size. Choose procedures before seeing a desired result.']
    ],
    visual: ['Inference without overclaiming', ['Define model and question', 'Check assumptions', 'Estimate and test', 'Report effect and uncertainty', 'State error risks and limits']],
    questions: [
      ['Which interpretation of a p-value is sound?', ['It is conditional on a null model and its assumptions', 'It is the probability the null is true', 'It measures practical importance directly', 'It proves a causal explanation'], 0, 'A p-value describes data extremeness under a model, not the truth probability of the model.'],
      ['What does a wider confidence interval commonly indicate?', ['Less precise estimation, all else equal', 'A guaranteed error', 'A larger effect', 'That the null is true'], 0, 'Width reflects information and variability under the method; context and assumptions remain essential.'],
      ['What is a Type I error?', ['Rejecting a true null hypothesis', 'Failing to reject a false null hypothesis', 'Reporting a confidence interval', 'Using a sample'], 0, 'Type I and Type II errors describe different possible decision errors in repeated use of a procedure.']
    ],
    cards: [['Null hypothesis', 'A specified model or baseline claim assessed by a test.'], ['p-value', 'A conditional measure of observed-data extremeness under a null model.'], ['Confidence interval', 'An interval from a stated method used to express estimation uncertainty.'], ['Type I error', 'Rejecting a null hypothesis that is in fact true.']],
    practical: ['Critique a fictional summary that says “p = 0.03 proves the method works.”', 'List the missing model, effect estimate, uncertainty, assumptions, and practical decision context.', 'Do not replace the claim with a new numerical conclusion without data.'],
    case: ['A validation study reports a statistically significant difference with a very small estimated effect and a wide interval.', 'The proposed operational decision has serious consequences.', 'Explain why significance alone is insufficient for fit-for-purpose judgment.']
  },
  {
    id: 'likelihood-ratios-and-evaluative-reporting', title: 'Likelihood Ratios and Evaluative Reporting', minutes: 48, difficulty: 'Advanced undergraduate',
    topics: ['competing propositions', 'likelihood ratio', 'evaluative reporting', 'uncertainty'],
    description: 'Compare how findings would be expected under competing propositions while keeping scientific and legal roles distinct.',
    sections: [
      ['Evaluation compares propositions', 'An evaluative question asks how findings change when viewed under at least two relevant, logically distinct propositions. Propositions should be set at a level matched to the scientist’s expertise and the available information. They must not be constructed to predetermine a preferred conclusion.'],
      ['The likelihood ratio is a comparison', 'A likelihood ratio compares the probability of findings under one proposition with the probability under another. A value above one supports the numerator proposition relative to the denominator within the model. It is not the probability that either proposition is true and it does not answer the ultimate legal question.'],
      ['Model quality controls meaning', 'Data sources, dependence, population structure, measurement variability, assumptions, and alternative propositions influence an evaluative result. Sensitivity analysis and transparent disclosure can be more informative than a falsely precise single number.'],
      ['Report the reasoning boundary', 'A defensible report distinguishes findings, propositions, method, evaluation, uncertainty, and limitations. Avoid source, activity, or offence-level claims that are outside the method’s scope. Expert evaluation is one contribution to a wider evidential and decision process.']
    ],
    visual: ['Evaluative reporting workflow', ['Define competing propositions', 'Assess findings and data', 'Model probabilities under each', 'Compare with likelihood ratio', 'Communicate scope and limitations']],
    questions: [
      ['A likelihood ratio of 1 means that, within the model, the findings are:', ['Equally probable under the compared propositions', 'Proof that both propositions are true', 'Evidence of guilt', 'A measure of sample size only'], 0, 'An LR of 1 provides no preference between those propositions from the findings under that model.'],
      ['What does a likelihood ratio not provide?', ['The probability that a proposition is true', 'A comparison of evidence probabilities', 'A model-dependent evaluative measure', 'A need to state assumptions'], 0, 'An LR concerns P(E|H1) relative to P(E|H2), not P(H1|E).'],
      ['Why should alternative propositions be stated explicitly?', ['They define the comparison that gives an evaluative result meaning', 'They eliminate uncertainty', 'They guarantee data independence', 'They replace case information'], 0, 'Evidence is evaluated comparatively; an unstated alternative hides the question being answered.']
    ],
    cards: [['Likelihood ratio', 'The ratio of probabilities of findings under two stated competing propositions.'], ['Evaluative reporting', 'Communicating how findings affect competing propositions within a defined scientific framework.'], ['Source level', 'A proposition about the origin of material or a trace.'], ['Activity level', 'A proposition about how material was transferred or deposited; it often needs additional contextual modelling.']],
    practical: ['Build a proposition-to-report template for a fictional trace comparison.', 'Separate observations, competing propositions, probability model, result, and limitation.', 'Do not infer activity or guilt from a source-level comparison alone.'],
    case: ['A comparison result is more expected if a trace came from one source than from an unrelated alternative source.', 'The timing and transfer mechanism are unknown.', 'State what the evaluation can address and what remains outside its scope.']
  },
  {
    id: 'validation-sampling-and-communication', title: 'Validation, Sampling, and Communicating Uncertainty', minutes: 44, difficulty: 'Advanced undergraduate',
    topics: ['validation', 'sampling design', 'measurement uncertainty', 'clear communication'],
    description: 'Plan studies and communicate uncertainty so that statistical reasoning remains auditable and fit for purpose.',
    sections: [
      ['Validation is evidence about performance', 'Validation asks whether a method is fit for a defined purpose, matrix, population, and decision context. A study design should specify performance characteristics, reference materials or datasets, acceptance criteria, and how departures and uncertainty will be assessed.'],
      ['Sampling design protects claims', 'Randomisation, stratification, replication, blinding where feasible, and pre-specified inclusion criteria can reduce avoidable bias. Independence cannot be assumed simply because there are many rows of data; related observations can make apparent precision misleading.'],
      ['Uncertainty has sources', 'Measurement uncertainty and inferential uncertainty can arise from instruments, operators, sampling, model choice, reference data, and natural variation. Listing a limitation is not enough: explain whether it could change the meaning or range of the conclusion.'],
      ['Communicate for the reader', 'A good scientific communication gives the question, method, result, interpretation, and limitation in separable language. Use calibrated terms, define technical measures, and avoid percentages or confidence labels that imply more certainty than the study supports.']
    ],
    visual: ['Fit-for-purpose study cycle', ['Define intended use', 'Design sample and controls', 'Measure performance', 'Assess uncertainty and sensitivity', 'Report scope and decision limits']],
    questions: [
      ['What is the central question of validation?', ['Whether a method is fit for a defined purpose', 'Whether a result supports a preferred conclusion', 'Whether a graph can be made', 'Whether all future samples will be identical'], 0, 'Validation is purpose-specific performance evidence, not a universal guarantee.'],
      ['Why can non-independent observations be a problem?', ['They can make precision appear greater than it is', 'They make every value invalid', 'They stop data collection', 'They remove all bias automatically'], 0, 'Dependence changes the information supplied by multiple observations and must be modelled or addressed.'],
      ['Which report order best supports auditability?', ['Question, method, result, interpretation, limitation', 'Conclusion, then selected facts', 'Percentage only', 'Interpretation without method'], 0, 'Separating layers lets a reader examine the reasoning and its boundary.']
    ],
    cards: [['Validation', 'Demonstrating method performance for a specified intended use.'], ['Bias', 'A systematic tendency that can shift results away from the target quantity or conclusion.'], ['Precision', 'Closeness of repeated measurements to one another under stated conditions.'], ['Sensitivity analysis', 'Checking how conclusions change when reasonable assumptions or inputs vary.']],
    practical: ['Draft a validation-plan outline for a fictional measurement comparison.', 'State intended use, sample-selection rule, controls, performance questions, uncertainty sources, and reporting boundary.', 'This is a classroom planning exercise, not an operational protocol.'],
    case: ['A method was tested only on clean reference materials but will be used on varied casework matrices.', 'The report calls the method universally reliable.', 'Identify the validation gap and write a scientifically bounded statement.']
  }
];

function makeChapter(definition, index) {
  const id = definition.id;
  return {
    id, title: definition.title, description: definition.description, estimatedMinutes: definition.minutes, difficulty: definition.difficulty,
    universityRelevance: 'Standard B.Sc. coverage · university mapping pending', topics: definition.topics,
    prerequisite: index ? 'Earlier Statistics for Forensic Interpretation chapters' : 'Scientific reasoning and basic numerical literacy',
    relatedTopics: ['Forensic Biology', 'Forensic Chemistry', 'Fingerprint Science', 'Research Methodology'],
    metadata: { contentLevel: 'advanced_undergraduate_content', classification: 'STANDARD_BSC', verificationStatus: 'STANDARD_CURRICULUM', examRelevance: index < 4 ? 'high' : 'moderate', sourceStatus: 'REFERENCE_CANDIDATE', lastUpdated: '2026-09-10' },
    sections: definition.sections.map(([title, body], sectionIndex) => ({ id: `${id}-${sectionIndex + 1}`, title, body, callout: sectionIndex === 0 ? 'Explain the question before choosing a calculation.' : 'State the assumption and limitation with the conclusion.' })),
    summary: { definition: `${definition.title} applies statistical reasoning to a defined forensic question without overstating what data can support.`, points: definition.sections.map(([title]) => title), examPoints: ['Question → data/model → result → interpretation → limitation', 'Do not reverse conditional probabilities or turn statistical measures into proof.'] },
    visual: { title: definition.visual[0], nodes: definition.visual[1].map((label, nodeIndex) => ({ id: `${id}-visual-${nodeIndex + 1}`, label, detail: nodeIndex === definition.visual[1].length - 1 ? 'Keep the conclusion within the method and data.' : 'Document this step before moving forward.' })) },
    microChecks: [{ id: `${id}-micro`, prompt: definition.questions[0][0], options: definition.questions[0][1], correctIndex: definition.questions[0][2], explanation: definition.questions[0][3] }],
    quiz: { id: `${id}-quiz`, title: `${definition.title} checkpoint`, questions: definition.questions.map(([prompt, options, correctIndex, explanation], questionIndex) => ({ id: `${id}-q${questionIndex + 1}`, prompt, options, correctIndex, explanation })) },
    flashcards: definition.cards.map(([front, back], cardIndex) => ({ id: `${id}-f${cardIndex + 1}`, type: ['definition', 'concept', 'application', 'common-mistake'][cardIndex] || 'concept', front, back })),
    practical: { title: `${definition.title} classroom practical`, objective: definition.practical[0], sections: [['Objective', definition.practical[0]], ['Conceptual workflow', definition.practical[1]], ['Precautions and limits', definition.practical[2]], ['Viva prompt', `What assumption or limitation matters most when applying ${definition.topics[0]}?`]] },
    caseStudy: { title: `${definition.title} teaching case`, prompt: definition.case[0], note: 'HYPOTHETICAL EDUCATIONAL CASE: fictional data for reasoning practice; not a real case or operational protocol.', sections: [['Scenario', definition.case[0]], ['Evidence', definition.case[1]], ['Questions and decision', definition.case[2]], ['Simulated finding', 'The data permit only the bounded interpretation justified by the stated model.'], ['Limitation', 'Document assumptions, data quality, and alternative explanations before communicating a conclusion.']] },
    viva: [`Define ${definition.topics[0]} in this context.`, `How can ${definition.topics[1]} affect forensic interpretation?`, 'State one reporting limitation that prevents statistical overclaiming.'],
    aiContext: { allowedTopics: definition.topics, prohibitedClaims: ['official university requirement', 'probability of guilt or source from a likelihood ratio', 'fabricated case finding', 'unsupported certainty'], grounding: 'STANDARD_CURRICULUM', references },
    revision: { prompts: [`Define ${definition.topics[0]}.`, `Explain the role of ${definition.topics[1]} in an evidential claim.`, 'Give one limitation and one common misinterpretation to avoid.'] },
    misconceptions: [{ misconception: 'A statistical result proves a conclusion.', correction: 'A result is conditional on its data, model, assumptions, and decision context.', relatedConcept: definition.topics[0] }],
    advanced: { title: 'Go beyond B.Sc.', body: 'Explore model checking, sensitivity analysis, measurement uncertainty, and the distinction between source-level and activity-level propositions before relying on a single summary statistic.' },
    researchExtension: { status: 'NEEDS_REVIEW', topic: 'Transparent uncertainty communication in forensic reporting', whyItMatters: 'The way uncertainty is expressed affects how evidence is understood.', methodConcept: 'Compare alternative reporting frameworks using controlled reader-comprehension studies.', limitation: 'No specific finding is asserted here; a current, discipline-specific literature review is required.', futureDirection: 'Evaluate communication with intended users while preserving scientific boundaries.' },
    references
  };
}

export const forensicStatistics = {
  id: 'forensic-statistics', title: 'Statistics for Forensic Interpretation',
  shortDescription: 'Data • uncertainty • probability • evaluative reporting', contentLevel: 'advanced_undergraduate_content', officialUniversityContent: false,
  classification: 'STANDARD_BSC', coverageLabel: 'University Aligned / Standard B.Sc. Curriculum', verificationStatus: 'STANDARD_CURRICULUM', year: 2, semester: 3,
  source: 'Standard B.Sc. subject-domain planning map', sourceUrl: null,
  learningOutcomes: ['Describe forensic datasets, distributions, samples, and uncertainty accurately.', 'Use probability and inferential language without conditional-probability or significance fallacies.', 'Evaluate and communicate findings under stated competing propositions, assumptions, and limitations.'],
  units: [
    { id: 'statistics-unit-1', title: 'Unit 1 · Data and descriptive reasoning', overview: 'Build a sound description before inference.', learningObjectives: ['Define data and sampling context.', 'Describe centre, spread, and distribution shape.'], topics: ['variables', 'sampling', 'distribution', 'variation'], contentLevel: 'STANDARD_BSC', source: 'Standard B.Sc. subject-domain planning map', chapters: definitions.slice(0, 2).map(makeChapter) },
    { id: 'statistics-unit-2', title: 'Unit 2 · Probability and inference', overview: 'Reason conditionally and report statistical uncertainty accurately.', learningObjectives: ['Distinguish conditional probabilities.', 'Interpret tests and intervals within their assumptions.'], topics: ['probability', 'Bayes', 'hypothesis testing', 'confidence'], contentLevel: 'STANDARD_BSC', source: 'Standard B.Sc. subject-domain planning map', chapters: definitions.slice(2, 4).map((item, index) => makeChapter(item, index + 2)) },
    { id: 'statistics-unit-3', title: 'Unit 3 · Evidence evaluation and quality', overview: 'Use transparent models and fit-for-purpose validation in forensic communication.', learningObjectives: ['Compare findings under competing propositions.', 'Plan and communicate validation and uncertainty.'], topics: ['likelihood ratio', 'evaluation', 'validation', 'communication'], contentLevel: 'STANDARD_BSC', source: 'Standard B.Sc. subject-domain planning map', chapters: definitions.slice(4).map((item, index) => makeChapter(item, index + 4)) }
  ]
};

