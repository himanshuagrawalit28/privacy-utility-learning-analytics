// Phase 2 Verification Test Suite
import fs from 'fs';
import path from 'path';
import http from 'http';

console.log('\n========================================');
console.log('   PRIVALEARN AI - PHASE 2 TEST SUITE   ');
console.log('========================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`[FAIL] ${testName} - ${details}`);
  }
}

// TEST GROUP 1: Mock Data Engine
console.log('--- Checking Mock Data Engine (src/data/mockData.js) ---');
const mockDataPath = path.resolve('src/data/mockData.js');
assert(fs.existsSync(mockDataPath), 'mockData.js exists');

const mockContent = fs.readFileSync(mockDataPath, 'utf8');
assert(mockContent.includes('export const overviewMetrics'), 'Exports overviewMetrics');
assert(mockContent.includes('modelAccuracy: 89.4'), 'overviewMetrics includes modelAccuracy');
assert(mockContent.includes('privacyScore: 96.8'), 'overviewMetrics includes privacyScore');
assert(mockContent.includes('attackSuccessRate: 52.1'), 'overviewMetrics includes attackSuccessRate');
assert(mockContent.includes('export const accuracyPrivacyTradeoff'), 'Exports accuracyPrivacyTradeoff');
assert(mockContent.includes('export const initialStudents'), 'Exports initialStudents');
assert(mockContent.includes('export const privacyComparisonData'), 'Exports privacyComparisonData');
assert(mockContent.includes('export const membershipAttackData'), 'Exports membershipAttackData');

// TEST GROUP 2: Dashboard & Analytics UI with Recharts
console.log('\n--- Checking Dashboard & Analytics UI ---');
const dashboardContent = fs.readFileSync(path.resolve('src/pages/Dashboard.jsx'), 'utf8');
assert(dashboardContent.includes('AreaChart'), 'Dashboard imports AreaChart for Tradeoff');
assert(dashboardContent.includes('PieChart'), 'Dashboard imports PieChart for Risk Distribution');
assert(dashboardContent.includes('BarChart'), 'Dashboard imports BarChart for Department Risk');
assert(dashboardContent.includes('Model Accuracy'), 'Dashboard renders Model Accuracy KPI');
assert(dashboardContent.includes('Privacy Score'), 'Dashboard renders Privacy Score KPI');
assert(dashboardContent.includes('Attack Success'), 'Dashboard renders Attack Success KPI');
assert(dashboardContent.includes('Accuracy vs. Privacy Tradeoff Graph'), 'Dashboard renders crucial Tradeoff graph heading');

const analyticsContent = fs.readFileSync(path.resolve('src/pages/Analytics.jsx'), 'utf8');
assert(analyticsContent.includes('accuracyPrivacyTradeoff'), 'Analytics imports accuracyPrivacyTradeoff');
assert(analyticsContent.includes('selectedEpsilon'), 'Analytics implements interactive Epsilon slider state');
assert(analyticsContent.includes('AreaChart'), 'Analytics renders Pareto Frontier AreaChart');

// TEST GROUP 3: Student Data Grid with Pagination
console.log('\n--- Checking Student Data Grid (src/pages/Students.jsx) ---');
const studentsContent = fs.readFileSync(path.resolve('src/pages/Students.jsx'), 'utf8');
assert(studentsContent.includes('initialStudents'), 'Students page loads initialStudents mock data');
assert(studentsContent.includes('pageSize'), 'Students page implements pageSize pagination state');
assert(studentsContent.includes('totalPages'), 'Students page calculates totalPages');
assert(studentsContent.includes('ChevronLeft') && studentsContent.includes('ChevronRight'), 'Students page includes pagination navigation controls');
assert(studentsContent.includes('Attendance'), 'Students page displays Attendance feature');
assert(studentsContent.includes('Midterm Score'), 'Students page displays Previous / Midterm score feature');
assert(studentsContent.includes('Predicted Risk'), 'Students page displays Predicted Risk column');
assert(studentsContent.includes('selectedStudent'), 'Students page implements student detail modal inspection');

// TEST GROUP 4: Interactive Forms (Login & Prediction)
console.log('\n--- Checking Interactive Forms ---');
const loginContent = fs.readFileSync(path.resolve('src/pages/Login.jsx'), 'utf8');
assert(loginContent.includes('handleSubmit'), 'Login implements handleSubmit handler');
assert(loginContent.includes('handleAutofill') || loginContent.includes('autofill'), 'Login implements demo autofill feature');
assert(loginContent.includes('navigate(\'/dashboard\')'), 'Login redirects to /dashboard upon submit');

const predictionContent = fs.readFileSync(path.resolve('src/pages/Prediction.jsx'), 'utf8');
assert(predictionContent.includes('formData'), 'Prediction implements student features state');
assert(predictionContent.includes('attendance'), 'Prediction form has attendance input');
assert(predictionContent.includes('midtermScore'), 'Prediction form has midtermScore input');
assert(predictionContent.includes('studyHours'), 'Prediction form has studyHours input');
assert(predictionContent.includes('absences'), 'Prediction form has absences input');
assert(predictionContent.includes('epsilon'), 'Prediction form has epsilon privacy slider');
assert(predictionContent.includes('result'), 'Prediction displays mock prediction result');

// TEST GROUP 5: Privacy & Attack Comparison Pages
console.log('\n--- Checking Privacy & Attack Side-by-Side Comparison Pages ---');
const privacyContent = fs.readFileSync(path.resolve('src/pages/Privacy.jsx'), 'utf8');
assert(privacyContent.includes('Normal Model') || privacyContent.includes('Baseline Model'), 'Privacy page includes Normal Model comparison card');
assert(privacyContent.includes('Protected Model'), 'Privacy page includes Protected Model comparison card');
assert(privacyContent.includes('RadarChart'), 'Privacy page includes Multi-Dimensional Defense RadarChart');
assert(privacyContent.includes('featureSensitivity'), 'Privacy page includes feature sensitivity stability table');

const attackContent = fs.readFileSync(path.resolve('src/pages/Attack.jsx'), 'utf8');
assert(attackContent.includes('Normal Model') || attackContent.includes('unprotectedAuc'), 'Attack page includes Normal Model vulnerability stats');
assert(attackContent.includes('Protected Model') || attackContent.includes('protectedAuc'), 'Attack page includes Protected Model resilience stats');
assert(attackContent.includes('rocCurve'), 'Attack page renders ROC curves');
assert(attackContent.includes('confidenceDistribution'), 'Attack page renders Member vs Non-Member confidence histogram');

// TEST GROUP 6: Server & Build
console.log('\n--- Checking Build & Dev Server Status ---');
assert(fs.existsSync(path.resolve('dist/index.html')), 'Production build artifact dist/index.html exists');

const req = http.get('http://localhost:5173/', (res) => {
  assert(res.statusCode === 200, `Dev server responds with HTTP 200 (Got ${res.statusCode})`);
  
  console.log('\n========================================');
  console.log(`   TEST RESULTS: ${passedTests} / ${totalTests} TESTS PASSED`);
  console.log('========================================\n');
  
  if (passedTests === totalTests) {
    console.log('All Phase 2 static pages & mock data tests passed successfully!\n');
    process.exit(0);
  } else {
    console.error(`Some tests failed: ${totalTests - passedTests} failure(s)\n`);
    process.exit(1);
  }
});

req.on('error', (err) => {
  assert(false, 'Dev server reachable at http://localhost:5173/', err.message);
  process.exit(1);
});
