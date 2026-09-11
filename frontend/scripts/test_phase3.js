// Phase 3 Verification Test Suite - API Integration & Services
import fs from 'fs';
import path from 'path';
import http from 'http';

console.log('\n========================================');
console.log('   PRIVALEARN AI - PHASE 3 TEST SUITE   ');
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

// TEST GROUP 1: API Service Layer Code Verification
console.log('--- Checking API Service Layer (src/services/api.js) ---');
const apiPath = path.resolve('src/services/api.js');
assert(fs.existsSync(apiPath), 'api.js exists');

const apiContent = fs.readFileSync(apiPath, 'utf8');
assert(apiContent.includes('axios.create'), 'apiClient instantiated via axios.create()');
assert(apiContent.includes('apiClient.interceptors.request.use'), 'Authorization request interceptor configured');
assert(apiContent.includes('export const authAPI'), 'Exports authAPI module');
assert(apiContent.includes('export const studentsAPI'), 'Exports studentsAPI module');
assert(apiContent.includes('export const predictionAPI'), 'Exports predictionAPI module');
assert(apiContent.includes('export const metricsAPI'), 'Exports metricsAPI module');

// TEST GROUP 2: Toast and Loading Components
console.log('\n--- Checking Toast Notification & Spinner Components ---');
const toastPath = path.resolve('src/context/ToastContext.jsx');
assert(fs.existsSync(toastPath), 'ToastContext.jsx exists');
const toastContent = fs.readFileSync(toastPath, 'utf8');
assert(toastContent.includes('export const ToastProvider'), 'Exports ToastProvider component');
assert(toastContent.includes('export const useToast'), 'Exports useToast hook');

const spinnerPath = path.resolve('src/components/common/LoadingSpinner.jsx');
assert(fs.existsSync(spinnerPath), 'LoadingSpinner.jsx exists');

// TEST GROUP 3: Pages Connected to API & Toast Services
console.log('\n--- Checking API & Feedback Wiring Across Pages ---');
const pagesToCheck = [
  { file: 'src/pages/Dashboard.jsx', api: 'metricsAPI', hasSpinner: true },
  { file: 'src/pages/Students.jsx', api: 'studentsAPI', hasSpinner: true },
  { file: 'src/pages/Prediction.jsx', api: 'predictionAPI', hasSpinner: false },
  { file: 'src/pages/Privacy.jsx', api: 'metricsAPI', hasSpinner: true },
  { file: 'src/pages/Attack.jsx', api: 'metricsAPI', hasSpinner: true },
  { file: 'src/pages/Analytics.jsx', api: 'metricsAPI', hasSpinner: true },
  { file: 'src/pages/Login.jsx', api: 'authAPI', hasSpinner: false }
];

pagesToCheck.forEach(({ file, api, hasSpinner }) => {
  const content = fs.readFileSync(path.resolve(file), 'utf8');
  assert(content.includes(api), `${file} calls ${api}`);
  assert(content.includes('useToast'), `${file} integrates useToast hook for error/status alerts`);
  if (hasSpinner) {
    assert(content.includes('LoadingSpinner'), `${file} renders LoadingSpinner during async fetches`);
  }
});

// TEST GROUP 4: Dynamic Functional Invocation of API Services
console.log('\n--- Dynamically Executing API Service Calls ---');

async function runFunctionalApiTests() {
  try {
    const { authAPI, studentsAPI, predictionAPI, metricsAPI } = await import('../src/services/api.js');

    // Test 4.1: authAPI.login
    const loginRes = await authAPI.login({ email: 'e.vance@campus.edu', password: 'PrivalearnSecure#2026' });
    assert(loginRes.success && loginRes.data.token, 'authAPI.login returns success and auth token');

    // Test 4.2: studentsAPI.getStudents
    const studentsRes = await studentsAPI.getStudents({ page: 1, limit: 5 });
    assert(studentsRes.success && studentsRes.data.length === 5, 'studentsAPI.getStudents returns paginated list');
    assert(studentsRes.total >= 25, 'studentsAPI.getStudents provides total count metadata');

    // Test 4.3: predictionAPI.predictRisk
    const predRes = await predictionAPI.predictRisk({
      attendance: 45,
      midtermScore: 40,
      studyHours: 3,
      absences: 11,
      epsilon: 1.25,
      enableDP: true
    });
    assert(predRes.success && predRes.data.riskScore !== undefined, 'predictionAPI.predictRisk computes risk score');
    assert(predRes.data.predictedRisk === 'High', 'predictionAPI accurately predicts High risk for struggling features');
    assert(predRes.data.noiseApplied !== undefined, 'predictionAPI outputs injected DP perturbation');

    // Test 4.4: metricsAPI.getOverviewMetrics
    const metricsRes = await metricsAPI.getOverviewMetrics();
    assert(metricsRes.success && metricsRes.data.modelAccuracy === 89.4, 'metricsAPI.getOverviewMetrics returns accuracy');
    assert(metricsRes.data.privacyScore === 96.8, 'metricsAPI.getOverviewMetrics returns privacyScore');

    // Test 4.5: metricsAPI.getPrivacyComparison
    const privacyRes = await metricsAPI.getPrivacyComparison();
    assert(privacyRes.success && privacyRes.data.models.length === 2, 'metricsAPI.getPrivacyComparison returns model pair');

    // Test 4.6: metricsAPI.getAttackSimulation
    const attackRes = await metricsAPI.getAttackSimulation();
    assert(attackRes.success && attackRes.data.rocCurve.length > 5, 'metricsAPI.getAttackSimulation returns ROC curve');

    // Test 4.7: metricsAPI.getTradeoffCurve
    const tradeoffRes = await metricsAPI.getTradeoffCurve();
    assert(tradeoffRes.success && tradeoffRes.data.length > 5, 'metricsAPI.getTradeoffCurve returns Pareto tradeoff points');

    // TEST GROUP 5: Production Build Artifacts & Server
    console.log('\n--- Checking Build & Dev Server Endpoint ---');
    assert(fs.existsSync(path.resolve('dist/index.html')), 'Production build artifact dist/index.html verified');

    http.get('http://localhost:5173/', (res) => {
      assert(res.statusCode === 200, `Dev server responds with HTTP 200 (Got ${res.statusCode})`);

      console.log('\n========================================');
      console.log(`   TEST RESULTS: ${passedTests} / ${totalTests} TESTS PASSED`);
      console.log('========================================\n');

      if (passedTests === totalTests) {
        console.log('All Phase 3 API Integration & Services tests passed successfully!\n');
        process.exit(0);
      } else {
        console.error(`Some tests failed: ${totalTests - passedTests} failure(s)\n`);
        process.exit(1);
      }
    }).on('error', (err) => {
      assert(false, 'Dev server reachable at http://localhost:5173/', err.message);
      process.exit(1);
    });

  } catch (err) {
    console.error('Fatal test error during API execution:', err);
    process.exit(1);
  }
}

runFunctionalApiTests();
