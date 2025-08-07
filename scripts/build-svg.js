#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { optimize } from 'svgo';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.join(__dirname, '../src');
const DIST_DIR = path.join(__dirname, '../dist');
const SVG_DIR = path.join(SRC_DIR, 'svg');
const ICONS_JSON = path.join(SRC_DIR, 'icons.json');

// SVGO configuration for optimization
const svgoConfig = {
  plugins: [
    'preset-default',
    'removeDimensions',
    'removeViewBox',
    {
      name: 'addAttributesToSVGElement',
      params: {
        attributes: [
          { width: '1em' },
          { height: '1em' },
          { fill: 'currentColor' }
        ]
      }
    }
  ]
};

async function buildSVGs() {
  console.log('🔧 Building SVG icons...');
  
  // Ensure dist directory exists
  if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR, { recursive: true });
  }

  const iconsData = JSON.parse(fs.readFileSync(ICONS_JSON, 'utf8'));
  const outputSVGDir = path.join(DIST_DIR, 'svg');
  
  // Create SVG output directories
  ['static', 'animated'].forEach(type => {
    const dir = path.join(outputSVGDir, type);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  let processedCount = 0;

  for (const [iconName, iconData] of Object.entries(iconsData.icons)) {
    for (const [variantName, fileName] of Object.entries(iconData.variants)) {
      const sourcePath = path.join(SVG_DIR, iconData.type, fileName);
      const targetPath = path.join(outputSVGDir, iconData.type, fileName);
      
      if (fs.existsSync(sourcePath)) {
        let svgContent = fs.readFileSync(sourcePath, 'utf8');
        
        // Optimize SVG (skip for animated icons to preserve animations)
        if (iconData.type === 'static') {
          const result = optimize(svgContent, svgoConfig);
          svgContent = result.data;
        }
        
        fs.writeFileSync(targetPath, svgContent);
        processedCount++;
        console.log(`✓ Processed ${iconName} (${variantName})`);
      } else {
        console.warn(`⚠️  SVG file not found: ${sourcePath}`);
      }
    }
  }

  // Copy icons metadata
  fs.writeFileSync(
    path.join(DIST_DIR, 'icons.json'),
    JSON.stringify(iconsData, null, 2)
  );

  console.log(`✅ Successfully processed ${processedCount} SVG icons`);
}

buildSVGs().catch(console.error);