#!/usr/bin/env node

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSection(title) {
  log(`\n${colors.bold}${colors.blue}=== ${title} ===${colors.reset}`);
}

function runCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    log(`Running: ${command} ${args.join(' ')}`, colors.yellow);
    
    const process = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    });

    process.on('close', (code) => {
      if (code === 0) {
        log(`✅ Command completed successfully`, colors.green);
        resolve(code);
      } else {
        log(`❌ Command failed with code ${code}`, colors.red);
        reject(new Error(`Command failed with code ${code}`));
      }
    });

    process.on('error', (error) => {
      log(`❌ Error running command: ${error.message}`, colors.red);
      reject(error);
    });
  });
}

async function checkDependencies() {
  logSection('Checking Dependencies');
  
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  const requiredDeps = [
    'jest',
    '@testing-library/react',
    '@testing-library/jest-dom',
    '@testing-library/user-event',
    'cypress',
    'cypress-file-upload'
  ];

  const missingDeps = requiredDeps.filter(dep => 
    !packageJson.devDependencies?.[dep] && !packageJson.dependencies?.[dep]
  );

  if (missingDeps.length > 0) {
    log(`❌ Missing dependencies: ${missingDeps.join(', ')}`, colors.red);
    return false;
  }

  log('✅ All required dependencies are installed', colors.green);
  return true;
}

async function runJestTests() {
  logSection('Running Jest Unit Tests');
  
  try {
    await runCommand('npm', ['run', 'test', '--', '--verbose']);
    log('✅ Jest tests completed successfully', colors.green);
    return true;
  } catch (error) {
    log('❌ Jest tests failed', colors.red);
    return false;
  }
}

async function runJestCoverage() {
  logSection('Running Jest with Coverage');
  
  try {
    await runCommand('npm', ['run', 'test:coverage']);
    log('✅ Coverage report generated', colors.green);
    return true;
  } catch (error) {
    log('❌ Coverage generation failed', colors.red);
    return false;
  }
}

async function runCypressTests() {
  logSection('Running Cypress E2E Tests');
  
  try {
    // Check if dev server is running
    log('Note: Make sure your development server is running on http://localhost:5173', colors.yellow);
    log('You can start it with: npm run dev', colors.yellow);
    
    await runCommand('npm', ['run', 'test:e2e']);
    log('✅ Cypress tests completed successfully', colors.green);
    return true;
  } catch (error) {
    log('❌ Cypress tests failed', colors.red);
    log('Make sure the development server is running!', colors.yellow);
    return false;
  }
}

async function generateTestReport() {
  logSection('Generating Test Report');
  
  const report = {
    timestamp: new Date().toISOString(),
    testSuites: [],
    summary: {
      total: 0,
      passed: 0,
      failed: 0
    }
  };

  // Check if coverage exists
  if (fs.existsSync('coverage/coverage-summary.json')) {
    const coverage = JSON.parse(fs.readFileSync('coverage/coverage-summary.json', 'utf8'));
    report.coverage = coverage.total;
  }

  // Check if cypress results exist
  if (fs.existsSync('cypress/reports')) {
    // Cypress results would be here
    report.cypress = 'Results available in cypress/reports';
  }

  fs.writeFileSync('test-report.json', JSON.stringify(report, null, 2));
  log('✅ Test report generated: test-report.json', colors.green);
}

async function main() {
  log(`${colors.bold}${colors.blue}🚀 Image Functionality Test Suite${colors.reset}`);
  log('Testing the following scenarios:');
  log('1. ✨ Create new post with image → verify card preview and individual page');
  log('2. 🔄 Edit post and replace image → old image deleted, new one shown');
  log('3. 🗑️  Delete post → image file removed from bucket, card disappears');
  log('');

  const results = {
    dependencies: false,
    jestTests: false,
    coverage: false,
    cypressTests: false
  };

  try {
    // Check dependencies
    results.dependencies = await checkDependencies();
    if (!results.dependencies) {
      throw new Error('Missing dependencies');
    }

    // Run Jest tests
    results.jestTests = await runJestTests();

    // Run coverage
    results.coverage = await runJestCoverage();

    // Run Cypress tests (optional - requires dev server)
    const runE2E = process.argv.includes('--e2e') || process.argv.includes('--all');
    if (runE2E) {
      results.cypressTests = await runCypressTests();
    } else {
      log('\nSkipping E2E tests. Use --e2e flag to run them.', colors.yellow);
      log('Make sure to start dev server: npm run dev', colors.yellow);
    }

    // Generate report
    await generateTestReport();

    // Summary
    logSection('Test Summary');
    log(`Dependencies: ${results.dependencies ? '✅ Pass' : '❌ Fail'}`, 
        results.dependencies ? colors.green : colors.red);
    log(`Jest Tests: ${results.jestTests ? '✅ Pass' : '❌ Fail'}`, 
        results.jestTests ? colors.green : colors.red);
    log(`Coverage: ${results.coverage ? '✅ Pass' : '❌ Fail'}`, 
        results.coverage ? colors.green : colors.red);
    
    if (runE2E) {
      log(`Cypress Tests: ${results.cypressTests ? '✅ Pass' : '❌ Fail'}`, 
          results.cypressTests ? colors.green : colors.red);
    }

    const allPassed = results.dependencies && results.jestTests && 
                      (runE2E ? results.cypressTests : true);
    
    if (allPassed) {
      log('\n🎉 All tests passed! Image functionality is working correctly.', colors.green);
    } else {
      log('\n⚠️  Some tests failed. Check the output above for details.', colors.red);
      process.exit(1);
    }

  } catch (error) {
    log(`\n💥 Test suite failed: ${error.message}`, colors.red);
    process.exit(1);
  }
}

// Usage information
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  log('Image Functionality Test Runner');
  log('');
  log('Usage:');
  log('  node test-runner.js           # Run unit tests only');
  log('  node test-runner.js --e2e     # Run unit + E2E tests');
  log('  node test-runner.js --all     # Run all tests');
  log('  node test-runner.js --help    # Show this help');
  log('');
  log('Before running E2E tests, start the dev server:');
  log('  npm run dev');
  process.exit(0);
}

main();
