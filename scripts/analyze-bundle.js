#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { gzipSync } from 'zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, '../dist');

function getFileSize(filePath) {
  if (!fs.existsSync(filePath)) {
    return { size: 0, gzipped: 0 };
  }
  
  const content = fs.readFileSync(filePath);
  const gzipped = gzipSync(content);
  
  return {
    size: formatBytes(content.length),
    gzipped: formatBytes(gzipped.length),
    raw: content.length,
    rawGzipped: gzipped.length
  };
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function analyzeBundle() {
  console.log('📊 Bundle Analysis Report');
  console.log('='.repeat(50));
  
  const analysis = {
    main: getFileSize(path.join(DIST_DIR, 'index.esm.js')),
    react: getFileSize(path.join(DIST_DIR, 'react/index.esm.js')),
    vue: getFileSize(path.join(DIST_DIR, 'vue/index.esm.js')),
    angular: getFileSize(path.join(DIST_DIR, 'angular/index.esm.js')),
    vanilla: getFileSize(path.join(DIST_DIR, 'vanilla/index.esm.js')),
    css: getFileSize(path.join(DIST_DIR, 'delvicons.css')),
    cssMin: getFileSize(path.join(DIST_DIR, 'delvicons.min.css')),
  };
  
  // Display results
  console.log('\n📦 Bundle Sizes:');
  console.log(`Main Library:     ${analysis.main.size} (${analysis.main.gzipped} gzipped)`);
  console.log(`React:           ${analysis.react.size} (${analysis.react.gzipped} gzipped)`);
  console.log(`Vue:             ${analysis.vue.size} (${analysis.vue.gzipped} gzipped)`);
  console.log(`Angular:         ${analysis.angular.size} (${analysis.angular.gzipped} gzipped)`);
  console.log(`Vanilla:         ${analysis.vanilla.size} (${analysis.vanilla.gzipped} gzipped)`);
  console.log(`CSS:             ${analysis.css.size} (${analysis.css.gzipped} gzipped)`);
  console.log(`CSS (minified):  ${analysis.cssMin.size} (${analysis.cssMin.gzipped} gzipped)`);
  
  // Calculate totals
  const totalRaw = Object.values(analysis).reduce((sum, bundle) => sum + (bundle.raw || 0), 0);
  const totalGzipped = Object.values(analysis).reduce((sum, bundle) => sum + (bundle.rawGzipped || 0), 0);
  
  console.log('\n📈 Totals:');
  console.log(`Total Size:      ${formatBytes(totalRaw)} (${formatBytes(totalGzipped)} gzipped)`);
  
  // Performance insights
  console.log('\n💡 Performance Insights:');
  
  if (analysis.main.rawGzipped > 5000) {
    console.log('⚠️  Main bundle is larger than 5KB gzipped - consider code splitting');
  } else {
    console.log('✅ Main bundle size is optimal (< 5KB gzipped)');
  }
  
  if (analysis.css.rawGzipped > 8000) {
    console.log('⚠️  CSS bundle is larger than 8KB gzipped - consider removing unused styles');
  } else {
    console.log('✅ CSS bundle size is reasonable');
  }
  
  // Tree-shaking analysis
  console.log('\n🌲 Tree-shaking Analysis:');
  const frameworks = ['react', 'vue', 'angular', 'vanilla'];
  
  frameworks.forEach(framework => {
    const bundleSize = analysis[framework].rawGzipped;
    const mainSize = analysis.main.rawGzipped;
    const overhead = bundleSize - mainSize;
    const overheadPercent = mainSize > 0 ? ((overhead / mainSize) * 100).toFixed(1) : '0';
    
    console.log(`${framework.padEnd(10)}: +${formatBytes(overhead)} overhead (${overheadPercent}%)`);
  });
  
  // Save analysis for CI/CD
  const statsData = {
    timestamp: new Date().toISOString(),
    bundles: analysis,
    totals: {
      raw: totalRaw,
      gzipped: totalGzipped,
      formatted: {
        raw: formatBytes(totalRaw),
        gzipped: formatBytes(totalGzipped)
      }
    }
  };
  
  fs.writeFileSync('bundle-stats.json', JSON.stringify(statsData, null, 2));
  
  // Check for size regressions (if previous stats exist)
  const previousStatsPath = 'bundle-stats-previous.json';
  if (fs.existsSync(previousStatsPath)) {
    const previousStats = JSON.parse(fs.readFileSync(previousStatsPath, 'utf8'));
    const currentTotal = totalGzipped;
    const previousTotal = previousStats.totals.gzipped;
    const change = currentTotal - previousTotal;
    const changePercent = previousTotal > 0 ? ((change / previousTotal) * 100).toFixed(1) : '0';
    
    console.log('\n📊 Size Comparison:');
    if (change > 0) {
      console.log(`📈 Bundle grew by ${formatBytes(change)} (+${changePercent}%)`);
      if (change > 1000) { // More than 1KB increase
        console.log('⚠️  Significant size increase detected!');
      }
    } else if (change < 0) {
      console.log(`📉 Bundle shrunk by ${formatBytes(Math.abs(change))} (${changePercent}%)`);
      console.log('✅ Great job optimizing!');
    } else {
      console.log('📏 No size change');
    }
  }
  
  // Performance budget warnings
  console.log('\n🎯 Performance Budget:');
  const budgets = {
    main: 5000,      // 5KB
    framework: 3000,  // 3KB per framework
    css: 8000        // 8KB for CSS
  };
  
  let budgetViolations = 0;
  
  if (analysis.main.rawGzipped > budgets.main) {
    console.log(`❌ Main bundle exceeds budget: ${analysis.main.gzipped} > ${formatBytes(budgets.main)}`);
    budgetViolations++;
  }
  
  frameworks.forEach(framework => {
    if (analysis[framework].rawGzipped > budgets.framework) {
      console.log(`❌ ${framework} bundle exceeds budget: ${analysis[framework].gzipped} > ${formatBytes(budgets.framework)}`);
      budgetViolations++;
    }
  });
  
  if (analysis.css.rawGzipped > budgets.css) {
    console.log(`❌ CSS bundle exceeds budget: ${analysis.css.gzipped} > ${formatBytes(budgets.css)}`);
    budgetViolations++;
  }
  
  if (budgetViolations === 0) {
    console.log('✅ All bundles are within performance budget');
  }
  
  console.log('\n' + '='.repeat(50));
  
  // Exit with error code if budget violations exist (for CI/CD)
  if (budgetViolations > 0 && process.env.CI) {
    console.log(`❌ ${budgetViolations} performance budget violation(s) detected`);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  analyzeBundle();
}