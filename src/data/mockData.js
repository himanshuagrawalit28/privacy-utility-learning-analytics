// Mock Data Engine for PrivaLearn AI (Privacy-Preserving Student Analytics)

export const overviewMetrics = {
  modelAccuracy: 89.4,
  modelAccuracyBaseline: 94.2,
  privacyScore: 96.8,
  attackSuccessRate: 52.1,
  attackSuccessBaseline: 78.4,
  epsilonBudget: 1.25,
  deltaBudget: '1e-5',
  totalStudents: 1420,
  highRiskCount: 168,
  mediumRiskCount: 382,
  lowRiskCount: 870,
  riskDistribution: [
    { name: 'Low Risk', value: 870, color: '#10B981' },
    { name: 'Medium Risk', value: 382, color: '#F59E0B' },
    { name: 'High Risk', value: 168, color: '#F43F5E' },
  ],
  departmentBreakdown: [
    { department: 'Computer Science', low: 240, medium: 95, high: 35 },
    { department: 'Data Science', low: 190, medium: 72, high: 28 },
    { department: 'Information Systems', low: 180, medium: 88, high: 44 },
    { department: 'Electrical Eng', low: 140, medium: 70, high: 36 },
    { department: 'Mathematics', low: 120, medium: 57, high: 25 },
  ]
};

export const accuracyPrivacyTradeoff = [
  { epsilon: 0.2, accuracy: 74.2, privacyScore: 99.1, attackSuccess: 50.4, label: 'ε=0.2 (Strict)' },
  { epsilon: 0.5, accuracy: 81.6, privacyScore: 98.2, attackSuccess: 50.8, label: 'ε=0.5' },
  { epsilon: 0.8, accuracy: 86.3, privacyScore: 97.4, attackSuccess: 51.3, label: 'ε=0.8' },
  { epsilon: 1.2, accuracy: 89.4, privacyScore: 96.8, attackSuccess: 52.1, label: 'ε=1.2 (Current)' },
  { epsilon: 2.0, accuracy: 91.8, privacyScore: 92.5, attackSuccess: 56.4, label: 'ε=2.0' },
  { epsilon: 4.0, accuracy: 93.1, privacyScore: 84.0, attackSuccess: 64.8, label: 'ε=4.0' },
  { epsilon: 8.0, accuracy: 93.9, privacyScore: 71.2, attackSuccess: 72.1, label: 'ε=8.0' },
  { epsilon: 12.0, accuracy: 94.2, privacyScore: 54.0, attackSuccess: 78.4, label: 'Unprotected' },
];

export const privacyComparisonData = {
  models: [
    {
      type: 'Standard Model (Non-Private)',
      tag: 'Vulnerable',
      statusColor: 'rose',
      accuracy: '94.2%',
      precision: '92.8%',
      recall: '93.5%',
      f1Score: '93.1%',
      epsilon: '∞ (No Bound)',
      delta: 'N/A',
      miaVulnerability: '78.4% (High Risk)',
      gradientClipping: 'Disabled',
      noiseMultiplier: '0.00',
      dataLeakageRisk: 'Critical - Individual student records reconstructible via shadow models.',
    },
    {
      type: 'DP-SGD Model (PrivaLearn Protected)',
      tag: 'Differentially Private',
      statusColor: 'cyan',
      accuracy: '89.4%',
      precision: '88.1%',
      recall: '87.6%',
      f1Score: '87.8%',
      epsilon: '1.25',
      delta: '10⁻⁵',
      miaVulnerability: '52.1% (Empirically Safe - Near Random Guess)',
      gradientClipping: 'C = 1.0',
      noiseMultiplier: '1.15 σ',
      dataLeakageRisk: 'Mathematically bounded guarantee against record re-identification.',
    }
  ],
  radarMetrics: [
    { subject: 'Model Accuracy', Standard: 94, Protected: 89, max: 100 },
    { subject: 'Precision', Standard: 93, Protected: 88, max: 100 },
    { subject: 'Recall', Standard: 94, Protected: 88, max: 100 },
    { subject: 'MIA Defense', Standard: 22, Protected: 96, max: 100 },
    { subject: 'Re-ID Resistance', Standard: 15, Protected: 98, max: 100 },
    { subject: 'Gradient Security', Standard: 10, Protected: 95, max: 100 },
  ],
  featureSensitivity: [
    { feature: 'Attendance Rate', standardWeight: 0.38, dpWeight: 0.35, sensitivity: 'High' },
    { feature: 'Midterm Exam Score', standardWeight: 0.32, dpWeight: 0.30, sensitivity: 'High' },
    { feature: 'Assignment Completion', standardWeight: 0.18, dpWeight: 0.20, sensitivity: 'Medium' },
    { feature: 'Study Hours/Week', standardWeight: 0.08, dpWeight: 0.10, sensitivity: 'Medium' },
    { feature: 'Prior Course History', standardWeight: 0.04, dpWeight: 0.05, sensitivity: 'Low' },
  ]
};

export const membershipAttackData = {
  rocCurve: [
    { fpr: 0.0, unprotectedTpr: 0.0, protectedTpr: 0.0, randomBaseline: 0.0 },
    { fpr: 0.1, unprotectedTpr: 0.42, protectedTpr: 0.11, randomBaseline: 0.1 },
    { fpr: 0.2, unprotectedTpr: 0.61, protectedTpr: 0.22, randomBaseline: 0.2 },
    { fpr: 0.3, unprotectedTpr: 0.74, protectedTpr: 0.32, randomBaseline: 0.3 },
    { fpr: 0.4, unprotectedTpr: 0.83, protectedTpr: 0.43, randomBaseline: 0.4 },
    { fpr: 0.5, unprotectedTpr: 0.89, protectedTpr: 0.52, randomBaseline: 0.5 },
    { fpr: 0.6, unprotectedTpr: 0.93, protectedTpr: 0.61, randomBaseline: 0.6 },
    { fpr: 0.7, unprotectedTpr: 0.96, protectedTpr: 0.71, randomBaseline: 0.7 },
    { fpr: 0.8, unprotectedTpr: 0.98, protectedTpr: 0.82, randomBaseline: 0.8 },
    { fpr: 0.9, unprotectedTpr: 0.99, protectedTpr: 0.91, randomBaseline: 0.9 },
    { fpr: 1.0, unprotectedTpr: 1.0, protectedTpr: 1.0, randomBaseline: 1.0 },
  ],
  confidenceDistribution: [
    { bin: '0.0 - 0.2', unprotectedMember: 2, unprotectedNonMember: 48, protectedMember: 15, protectedNonMember: 16 },
    { bin: '0.2 - 0.4', unprotectedMember: 6, unprotectedNonMember: 32, protectedMember: 22, protectedNonMember: 23 },
    { bin: '0.4 - 0.6', unprotectedMember: 14, unprotectedNonMember: 12, protectedMember: 26, protectedNonMember: 25 },
    { bin: '0.6 - 0.8', unprotectedMember: 34, unprotectedNonMember: 6, protectedMember: 21, protectedNonMember: 22 },
    { bin: '0.8 - 1.0', unprotectedMember: 44, unprotectedNonMember: 2, protectedMember: 16, protectedNonMember: 14 },
  ],
  stats: {
    unprotectedAuc: 0.86,
    protectedAuc: 0.53,
    leakageReductionPercent: '88.3%',
    attackSuccessMember: '52.1% (Near Random 50%)',
    vulnerabilityLevel: 'Negligible (Protected by Rényi DP)'
  }
};

export const initialStudents = [
  { id: 'STU-1001', name: 'Alex Rivera', email: 'a.rivera@campus.edu', department: 'Computer Science', attendance: 62, midtermScore: 54, assignmentCompletion: 58, studyHours: 7, absences: 9, predictedRisk: 'High', riskScore: 0.84, dpConfidence: 0.81, dpPerturbation: '-0.03 (DP Noise)' },
  { id: 'STU-1002', name: 'Sophia Chen', email: 's.chen@campus.edu', department: 'Data Science', attendance: 96, midtermScore: 92, assignmentCompletion: 98, studyHours: 22, absences: 1, predictedRisk: 'Low', riskScore: 0.08, dpConfidence: 0.09, dpPerturbation: '+0.01 (DP Noise)' },
  { id: 'STU-1003', name: 'Marcus Vance', email: 'm.vance@campus.edu', department: 'Information Systems', attendance: 78, midtermScore: 68, assignmentCompletion: 74, studyHours: 12, absences: 5, predictedRisk: 'Medium', riskScore: 0.48, dpConfidence: 0.50, dpPerturbation: '+0.02 (DP Noise)' },
  { id: 'STU-1004', name: 'Emily Tanaka', email: 'e.tanaka@campus.edu', department: 'Electrical Eng', attendance: 91, midtermScore: 88, assignmentCompletion: 92, studyHours: 19, absences: 2, predictedRisk: 'Low', riskScore: 0.14, dpConfidence: 0.12, dpPerturbation: '-0.02 (DP Noise)' },
  { id: 'STU-1005', name: 'Dante Rossi', email: 'd.rossi@campus.edu', department: 'Computer Science', attendance: 55, midtermScore: 49, assignmentCompletion: 46, studyHours: 5, absences: 11, predictedRisk: 'High', riskScore: 0.91, dpConfidence: 0.88, dpPerturbation: '-0.03 (DP Noise)' },
  { id: 'STU-1006', name: 'Aaliyah Patel', email: 'a.patel@campus.edu', department: 'Data Science', attendance: 84, midtermScore: 76, assignmentCompletion: 82, studyHours: 15, absences: 3, predictedRisk: 'Medium', riskScore: 0.36, dpConfidence: 0.39, dpPerturbation: '+0.03 (DP Noise)' },
  { id: 'STU-1007', name: 'Liam O’Connor', email: 'l.oconnor@campus.edu', department: 'Mathematics', attendance: 98, midtermScore: 96, assignmentCompletion: 100, studyHours: 26, absences: 0, predictedRisk: 'Low', riskScore: 0.04, dpConfidence: 0.05, dpPerturbation: '+0.01 (DP Noise)' },
  { id: 'STU-1008', name: 'Fatima Al-Mansoor', email: 'f.almansoor@campus.edu', department: 'Electrical Eng', attendance: 72, midtermScore: 64, assignmentCompletion: 69, studyHours: 10, absences: 6, predictedRisk: 'Medium', riskScore: 0.56, dpConfidence: 0.54, dpPerturbation: '-0.02 (DP Noise)' },
  { id: 'STU-1009', name: 'Lucas Silva', email: 'l.silva@campus.edu', department: 'Computer Science', attendance: 88, midtermScore: 82, assignmentCompletion: 86, studyHours: 17, absences: 2, predictedRisk: 'Low', riskScore: 0.19, dpConfidence: 0.21, dpPerturbation: '+0.02 (DP Noise)' },
  { id: 'STU-1010', name: 'Zoe Kravitz', email: 'z.kravitz@campus.edu', department: 'Information Systems', attendance: 61, midtermScore: 52, assignmentCompletion: 55, studyHours: 6, absences: 10, predictedRisk: 'High', riskScore: 0.86, dpConfidence: 0.83, dpPerturbation: '-0.03 (DP Noise)' },
  { id: 'STU-1011', name: 'Julian Hayes', email: 'j.hayes@campus.edu', department: 'Data Science', attendance: 89, midtermScore: 84, assignmentCompletion: 88, studyHours: 18, absences: 2, predictedRisk: 'Low', riskScore: 0.16, dpConfidence: 0.15, dpPerturbation: '-0.01 (DP Noise)' },
  { id: 'STU-1012', name: 'Nadia Rostova', email: 'n.rostova@campus.edu', department: 'Mathematics', attendance: 74, midtermScore: 69, assignmentCompletion: 71, studyHours: 11, absences: 5, predictedRisk: 'Medium', riskScore: 0.51, dpConfidence: 0.53, dpPerturbation: '+0.02 (DP Noise)' },
  { id: 'STU-1013', name: 'Tariq Sterling', email: 't.sterling@campus.edu', department: 'Electrical Eng', attendance: 58, midtermScore: 47, assignmentCompletion: 52, studyHours: 6, absences: 9, predictedRisk: 'High', riskScore: 0.88, dpConfidence: 0.85, dpPerturbation: '-0.03 (DP Noise)' },
  { id: 'STU-1014', name: 'Grace Hopper-Lee', email: 'g.lee@campus.edu', department: 'Computer Science', attendance: 99, midtermScore: 98, assignmentCompletion: 100, studyHours: 25, absences: 0, predictedRisk: 'Low', riskScore: 0.03, dpConfidence: 0.04, dpPerturbation: '+0.01 (DP Noise)' },
  { id: 'STU-1015', name: 'Devon Brooks', email: 'd.brooks@campus.edu', department: 'Information Systems', attendance: 79, midtermScore: 71, assignmentCompletion: 76, studyHours: 13, absences: 4, predictedRisk: 'Medium', riskScore: 0.44, dpConfidence: 0.42, dpPerturbation: '-0.02 (DP Noise)' },
  { id: 'STU-1016', name: 'Mei-Ling Zhou', email: 'm.zhou@campus.edu', department: 'Data Science', attendance: 92, midtermScore: 86, assignmentCompletion: 90, studyHours: 20, absences: 1, predictedRisk: 'Low', riskScore: 0.12, dpConfidence: 0.13, dpPerturbation: '+0.01 (DP Noise)' },
  { id: 'STU-1017', name: 'Kofi Mensah', email: 'k.mensah@campus.edu', department: 'Electrical Eng', attendance: 65, midtermScore: 59, assignmentCompletion: 61, studyHours: 8, absences: 7, predictedRisk: 'High', riskScore: 0.76, dpConfidence: 0.74, dpPerturbation: '-0.02 (DP Noise)' },
  { id: 'STU-1018', name: 'Chloe Dubois', email: 'c.dubois@campus.edu', department: 'Mathematics', attendance: 82, midtermScore: 78, assignmentCompletion: 84, studyHours: 14, absences: 3, predictedRisk: 'Medium', riskScore: 0.38, dpConfidence: 0.40, dpPerturbation: '+0.02 (DP Noise)' },
  { id: 'STU-1019', name: 'Arjun Sharma', email: 'a.sharma@campus.edu', department: 'Computer Science', attendance: 94, midtermScore: 91, assignmentCompletion: 95, studyHours: 21, absences: 1, predictedRisk: 'Low', riskScore: 0.09, dpConfidence: 0.08, dpPerturbation: '-0.01 (DP Noise)' },
  { id: 'STU-1020', name: 'Elena Vega', email: 'e.vega@campus.edu', department: 'Information Systems', attendance: 59, midtermScore: 50, assignmentCompletion: 49, studyHours: 5, absences: 10, predictedRisk: 'High', riskScore: 0.89, dpConfidence: 0.86, dpPerturbation: '-0.03 (DP Noise)' },
  { id: 'STU-1021', name: 'Oliver Kim', email: 'o.kim@campus.edu', department: 'Data Science', attendance: 86, midtermScore: 79, assignmentCompletion: 83, studyHours: 16, absences: 2, predictedRisk: 'Medium', riskScore: 0.32, dpConfidence: 0.34, dpPerturbation: '+0.02 (DP Noise)' },
  { id: 'STU-1022', name: 'Hannah Schmidt', email: 'h.schmidt@campus.edu', department: 'Mathematics', attendance: 95, midtermScore: 90, assignmentCompletion: 96, studyHours: 23, absences: 1, predictedRisk: 'Low', riskScore: 0.07, dpConfidence: 0.09, dpPerturbation: '+0.02 (DP Noise)' },
  { id: 'STU-1023', name: 'Samuel Ortiz', email: 's.ortiz@campus.edu', department: 'Electrical Eng', attendance: 67, midtermScore: 61, assignmentCompletion: 63, studyHours: 9, absences: 6, predictedRisk: 'Medium', riskScore: 0.62, dpConfidence: 0.60, dpPerturbation: '-0.02 (DP Noise)' },
  { id: 'STU-1024', name: 'Yuki Takahashi', email: 'y.takahashi@campus.edu', department: 'Computer Science', attendance: 90, midtermScore: 85, assignmentCompletion: 89, studyHours: 18, absences: 2, predictedRisk: 'Low', riskScore: 0.15, dpConfidence: 0.16, dpPerturbation: '+0.01 (DP Noise)' },
  { id: 'STU-1025', name: 'Amara Nwosu', email: 'a.nwosu@campus.edu', department: 'Information Systems', attendance: 53, midtermScore: 44, assignmentCompletion: 41, studyHours: 4, absences: 12, predictedRisk: 'High', riskScore: 0.94, dpConfidence: 0.91, dpPerturbation: '-0.03 (DP Noise)' },
];
