export const apartmentIncident = {
  id: 'case-file-001',
  title: 'The Apartment Incident',
  label: 'Hypothetical Educational Investigation',
  objective: 'Practise observation, documentation, evidence handling, and cautious interpretation.',
  stages: ['START', 'SCENE_INSPECTION', 'DOCUMENTATION', 'EVIDENCE_COLLECTION', 'LAB_SELECTION', 'ANALYSIS', 'RESULT_INTERPRETATION', 'CASE_SYNTHESIS', 'REPORT', 'COMPLETE'],
  evidence: [
    { id: 'E-01', type: 'Possible biological stain', location: 'Window latch', observation: 'Small reddish-brown mark; simulated scene observation only.', relevance: 'Could support a biological-evidence workflow.', contamination: 'Handling without documentation could compromise interpretation.' },
    { id: 'E-02', type: 'Trace fibre', location: 'Sofa arm', observation: 'Single pale fibre visible under scene lighting.', relevance: 'Could support a trace-evidence discussion.', contamination: 'Transfer from clothing or environment is an alternative explanation.' }
  ],
  actions: {
    SCENE_INSPECTION: [
      ['document', 'Document the scene before selecting evidence'],
      ['inspect', 'Inspect the evidence markers'],
      ['collect', 'Collect an item immediately']
    ],
    DOCUMENTATION: [
      ['photograph', 'Create a scene record and photograph locations'],
      ['collect', 'Collect before recording the location']
    ],
    EVIDENCE_COLLECTION: [
      ['package', 'Package and label the selected item in the simulation'],
      ['ignore', 'Ignore the selected item']
    ],
    LAB_SELECTION: [
      ['biology', 'Request a simulated biological analysis'],
      ['fingerprint', 'Request a simulated fingerprint examination']
    ],
    RESULT_INTERPRETATION: [
      ['interpret-consistent', 'Record: consistent with the comparison sample under stated assumptions'],
      ['interpret-guilty', 'Record: the person is guilty']
    ]
  }
};

export const labSimulation = {
  id: 'dna-workflow-simulation',
  title: 'DNA workflow: sample to interpretation',
  module: 'Forensic Biology',
  objective: 'Connect evidence handling, extraction, quantification, and limitations in a fictional exercise.',
  status: 'Available',
  estimatedMinutes: 12
};
