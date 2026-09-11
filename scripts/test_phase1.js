// Phase 1 Verification Test Suite
import fs from 'fs';
import path from 'path';
import http from 'http';

console.log('\n========================================');
console.log('   PRIVALEARN AI - PHASE 1 TEST SUITE   ');
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

// TEST GROUP 1: Dependencies in package.json
console.log('--- Checking Required Dependencies ---');
const pkgPath = path.resolve('package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

const requiredDeps = ['react', 'react-dom', 'react-router-dom', 'recharts', 'axios', 'lucide-react'];
requiredDeps.forEach(dep => {
  assert(pkg.dependencies && pkg.dependencies[dep], `Dependency '${dep}' declared in dependencies`);
});

const requiredDevDeps = ['tailwindcss', 'postcss', 'autoprefixer'];
requiredDevDeps.forEach(dep => {
  assert(pkg.devDependencies && pkg.devDependencies[dep], `DevDependency '${dep}' declared in devDependencies`);
});

// TEST GROUP 2: Core Layout Components
console.log('\n--- Checking Layout Components ---');
const layoutFiles = [
  'src/components/layout/Navbar.jsx',
  'src/components/layout/Sidebar.jsx',
  'src/components/layout/MainLayout.jsx'
];
layoutFiles.forEach(file => {
  const exists = fs.existsSync(path.resolve(file));
  assert(exists, `Layout file exists: ${file}`);
  if (exists) {
    const content = fs.readFileSync(path.resolve(file), 'utf8');
    assert(content.includes('export default'), `Layout file exports default component: ${file}`);
  }
});

// TEST GROUP 3: 7 Main Route Placeholder Pages
console.log('\n--- Checking 7 Route Placeholder Pages ---');
const routeFiles = [
  { path: 'src/pages/Login.jsx', route: '/' },
  { path: 'src/pages/Dashboard.jsx', route: '/dashboard' },
  { path: 'src/pages/Students.jsx', route: '/students' },
  { path: 'src/pages/Prediction.jsx', route: '/prediction' },
  { path: 'src/pages/Privacy.jsx', route: '/privacy' },
  { path: 'src/pages/Attack.jsx', route: '/attack' },
  { path: 'src/pages/Analytics.jsx', route: '/analytics' }
];

routeFiles.forEach(({ path: filePath, route }) => {
  const exists = fs.existsSync(path.resolve(filePath));
  assert(exists, `Route component exists for ${route} (${filePath})`);
  if (exists) {
    const content = fs.readFileSync(path.resolve(filePath), 'utf8');
    assert(content.includes('export default'), `Default export exists for ${route}`);
  }
});

// TEST GROUP 4: React Router Configuration in App.jsx
console.log('\n--- Checking Router Configuration in App.jsx ---');
const appContent = fs.readFileSync(path.resolve('src/App.jsx'), 'utf8');
assert(appContent.includes('BrowserRouter'), 'App.jsx includes BrowserRouter');
assert(appContent.includes('Routes'), 'App.jsx includes Routes');
routeFiles.forEach(({ route }) => {
  assert(appContent.includes(`path="${route}"`), `App.jsx defines Route for path="${route}"`);
});

// TEST GROUP 5: Tailwind CSS & Index HTML
console.log('\n--- Checking Tailwind & Root Files ---');
const indexCss = fs.readFileSync(path.resolve('src/index.css'), 'utf8');
assert(indexCss.includes('@tailwind base'), 'index.css imports @tailwind base');
assert(indexCss.includes('@tailwind components'), 'index.css imports @tailwind components');
assert(indexCss.includes('@tailwind utilities'), 'index.css imports @tailwind utilities');

const indexHtml = fs.readFileSync(path.resolve('index.html'), 'utf8');
assert(indexHtml.includes('id="root"'), 'index.html contains root mount div');
assert(indexHtml.includes('/src/main.jsx'), 'index.html includes main.jsx module script');

// TEST GROUP 6: Live Dev Server HTTP Check
console.log('\n--- Checking Local Dev Server Endpoint ---');
const req = http.get('http://localhost:5173/', (res) => {
  assert(res.statusCode === 200, `Dev server responds with HTTP 200 (Got ${res.statusCode})`);
  
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    assert(body.includes('<div id="root"></div>'), 'Server returns HTML with root container');
    
    console.log('\n========================================');
    console.log(`   TEST RESULTS: ${passedTests} / ${totalTests} TESTS PASSED`);
    console.log('========================================\n');
    
    if (passedTests === totalTests) {
      console.log('All Phase 1 verification tests passed successfully!\n');
      process.exit(0);
    } else {
      console.error(`Some tests failed: ${totalTests - passedTests} failure(s)\n`);
      process.exit(1);
    }
  });
});

req.on('error', (err) => {
  assert(false, 'Dev server reachable at http://localhost:5173/', err.message);
  console.log('\n========================================');
  console.log(`   TEST RESULTS: ${passedTests} / ${totalTests} TESTS PASSED`);
  console.log('========================================\n');
  process.exit(1);
});
