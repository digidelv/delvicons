#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.join(__dirname, '../src');
const SVG_DIR = path.join(SRC_DIR, 'svg');
const ICONS_JSON = path.join(SRC_DIR, 'icons.json');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise(resolve => rl.question(prompt, resolve));
}

async function generateIcon() {
  console.log('🎨 DelvIcons - Icon Generator\n');
  
  // Get icon details
  const iconName = await question('Icon name (kebab-case): ');
  const iconDisplayName = await question(`Display name (${iconName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}): `) || 
                         iconName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  
  // Show available categories
  const iconsData = JSON.parse(fs.readFileSync(ICONS_JSON, 'utf8'));
  console.log('\nAvailable categories:');
  Object.entries(iconsData.categories).forEach(([key, cat]) => {
    console.log(`  ${key}: ${cat.name}`);
  });
  
  const category = await question('\\nCategory: ');
  const tags = (await question('Tags (comma-separated): ')).split(',').map(t => t.trim()).filter(Boolean);
  const isAnimated = (await question('Animated? (y/N): ')).toLowerCase() === 'y';
  
  // Generate SVG template
  const svgTemplate = isAnimated ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Add your animated SVG content here -->
  <!-- Example animated element: -->
  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <animate attributeName="r" dur="2s" values="8;12;8" repeatCount="indefinite"/>
  </circle>
</svg>` : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Add your SVG content here -->
  <!-- Example: -->
  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

  // Create SVG file
  const svgDir = path.join(SVG_DIR, isAnimated ? 'animated' : 'static');
  const svgFile = path.join(svgDir, `${iconName}.svg`);
  
  if (!fs.existsSync(svgDir)) {
    fs.mkdirSync(svgDir, { recursive: true });
  }
  
  fs.writeFileSync(svgFile, svgTemplate);
  
  // Update icons.json
  const newIconData = {
    name: iconDisplayName,
    category: category,
    tags: tags,
    type: isAnimated ? 'animated' : 'static',
    variants: {
      [isAnimated ? 'animated' : 'outline']: `${iconName}.svg`
    }
  };
  
  if (isAnimated) {
    newIconData.animations = {
      default: {
        duration: "2s",
        timing: "ease-in-out",
        iteration: "infinite"
      }
    };
  }
  
  iconsData.icons[iconName] = newIconData;
  
  fs.writeFileSync(ICONS_JSON, JSON.stringify(iconsData, null, 2));
  
  console.log(`\\n✅ Icon created successfully!`);
  console.log(`📄 SVG file: ${svgFile}`);
  console.log(`📝 Updated: ${ICONS_JSON}`);
  console.log(`\\n📋 Next steps:`);
  console.log(`1. Edit the SVG file with your icon design`);
  console.log(`2. Run "npm run build" to generate components`);
  console.log(`3. Run "npm run preview" to see your icon in action`);
  
  rl.close();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateIcon().catch(console.error);
}