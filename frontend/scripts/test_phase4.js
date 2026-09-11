// Phase 4 Final Verification Test Suite - Polish, Responsiveness & End-to-End Health
import fs from 'fs';
import path from 'path';
import http from 'http';

console.log('\n======================================================');
console.log('   PRIVALEARN AI - PHASE 4 FINAL VERIFICATION SUITE   ');
console.log('======================================================\n');

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

// TEST GROUP 1: Responsive Design & Micro-Animations in CSS
console.log('--- Checking Responsive Design & Micro-Animations in CSS ---');
const indexCss = fs.readFileSync(path.resolve('src/index.css'), 'utf8');
assert(indexCss.includes('glass-card-hover'), 'CSS defines glass-card-hover transition');
assert(indexCss.includes('btn-press'), 'CSS defines btn-press active transform utility');
assert(indexCss.includes('::-webkit-scrollbar'), 'CSS configures custom cyber scrollbar');

// TEST GROUP 2: Responsive Navbar and Sidebar
console.log('\n--- Checking Responsive Layout & Drawers ---');
const navbarContent = fs.readFileSync(path.resolve('src/components/layout/Navbar.jsx'), 'utf8');
assert(navbarContent.includes('onToggleSidebar'), 'Navbar triggers mobile sidebar toggle');
assert(navbarContent.includes('lg:hidden'), 'Navbar provides mobile hamburger toggle');
assert(navbarContent.includes('Ctrl+K'), 'Navbar includes keyboard shortcut aid');

const sidebarContent = fs.readFileSync(path.resolve('src/components/layout/Sidebar.jsx'), 'utf8');
assert(sidebarContent.includes('lg:translate-x-0'), 'Sidebar supports responsive drawer transitions');
assert(sidebarContent.includes('fixed inset-0 z-40 bg-black/60'), 'Sidebar renders backdrop for mobile/tablet screens');

// TEST GROUP 3: Table and Chart Responsiveness Across Pages
console.log('\n--- Checking Table and Chart Responsiveness ---');
const studentsContent = fs.readFileSync(path.resolve('src/pages/Students.jsx'), 'utf8');
assert(studentsContent.includes('overflow-x-auto'), 'Students table wrapped in horizontal overflow container');
assert(studentsContent.includes('Reset Filters'), 'Students page provides reset filters button');

const dashboardContent = fs.readFileSync(path.resolve('src/pages/Dashboard.jsx'), 'utf8');
assert(dashboardContent.includes('ResponsiveContainer'), 'Dashboard charts use Recharts ResponsiveContainer');

const attackContent = fs.readFileSync(path.resolve('src/pages/Attack.jsx'), 'utf8');
assert(attackContent.includes('ResponsiveContainer'), 'Attack charts use Recharts ResponsiveContainer');

const analyticsContent = fs.readFileSync(path.resolve('src/pages/Analytics.jsx'), 'utf8');
assert(analyticsContent.includes('ResponsiveContainer'), 'Analytics charts use Recharts ResponsiveContainer');

// TEST GROUP 4: Documentation & Project Files
console.log('\n--- Checking Documentation & Project Handoff Artifacts ---');
assert(fs.existsSync(path.resolve('README.md')), 'Comprehensive README.md exists');
const readmeContent = fs.readFileSync(path.resolve('README.md'), 'utf8');
assert(readmeContent.includes('Differential Privacy'), 'README details Differential Privacy architecture');
assert(readmeContent.includes('Membership Inference Attack'), 'README details Membership Inference Attack concepts');
assert(readmeContent.includes('Local Development & Setup'), 'README includes setup commands');

// TEST GROUP 5: Production Build Output Verification
console.log('\n--- Checking Production Build Directory ---');
assert(fs.existsSync(path.resolve('dist/index.html')), 'Production dist/index.html exists');
const distFiles = fs.readdirSync(path.resolve('dist/assets'));
assert(distFiles.some(f => f.endsWith('.js')), 'Production JavaScript bundle generated');
assert(distFiles.some(f => f.endsWith('.css')), 'Production CSS bundle generated');

// TEST GROUP 6: Local Dev Server Connectivity Check
console.log('\n--- Checking Dev Server Connectivity ---');
http.get('http://localhost:5173/', (res) => {
  assert(res.statusCode === 200, `Dev server responds with HTTP 200 (Got ${res.statusCode})`);

  console.log('\n======================================================');
  console.log(`   FINAL RESULTS: ${passedTests} / ${totalTests} TESTS PASSED`);
  console.log('======================================================\n');

  if (passedTests === totalTests) {
    console.log('All Phase 4 Polish, Responsiveness & Verification tests passed with 100% success!\n');
    process.exit(0);
  } else {
    console.error(`Some tests failed: ${totalTests - passedTests} failure(s)\n`);
    process.exit(1);
  }
}).on('error', (err) => {
  assert(false, 'Dev server reachable at http://localhost:5173/', err.message);
  process.exit(1);
});
