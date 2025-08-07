#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.join(__dirname, '../src');
const DIST_DIR = path.join(__dirname, '../dist');
const ICONS_JSON = path.join(SRC_DIR, 'icons.json');

// Template generators for different frameworks
const templates = {
  react: (iconName, svgContent, iconData) => `
import React from 'react';
import { IconProps } from '../types';

export const ${toPascalCase(iconName)}: React.FC<IconProps> = ({ 
  size = 24, 
  color = 'currentColor', 
  className = '',
  animated = ${iconData.type === 'animated'},
  ...props 
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={\`delv-icon delv-icon-${iconName} \${animated ? 'delv-animated' : ''} \${className}\`}
    {...props}
  >
    ${extractSVGContent(svgContent)}
  </svg>
);

${toPascalCase(iconName)}.displayName = '${toPascalCase(iconName)}';
`,

  vue: (iconName, svgContent, iconData) => `
<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    :class="iconClasses"
    v-bind="$attrs"
  >
    ${extractSVGContent(svgContent)}
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { IconProps } from '../types';

interface Props extends IconProps {
  size?: number | string;
  color?: string;
  className?: string;
  animated?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
  color: 'currentColor',
  className: '',
  animated: ${iconData.type === 'animated'}
});

const iconClasses = computed(() => [
  'delv-icon',
  'delv-icon-${iconName}',
  props.animated && 'delv-animated',
  props.className
].filter(Boolean).join(' '));
</script>
`,

  angular: (iconName, svgContent, iconData) => `
import { Component, Input } from '@angular/core';

@Component({
  selector: 'delv-${iconName}',
  template: \`
    <svg
      [attr.width]="size"
      [attr.height]="size"
      viewBox="0 0 24 24"
      fill="none"
      [class]="iconClasses"
    >
      ${extractSVGContent(svgContent)}
    </svg>
  \`,
  standalone: true
})
export class ${toPascalCase(iconName)}Component {
  @Input() size: number | string = 24;
  @Input() color: string = 'currentColor';
  @Input() className: string = '';
  @Input() animated: boolean = ${iconData.type === 'animated'};

  get iconClasses(): string {
    return [
      'delv-icon',
      'delv-icon-${iconName}',
      this.animated ? 'delv-animated' : '',
      this.className
    ].filter(Boolean).join(' ');
  }
}
`,

  vanilla: (iconName, svgContent, iconData) => `
export function create${toPascalCase(iconName)}(options = {}) {
  const {
    size = 24,
    color = 'currentColor',
    className = '',
    animated = ${iconData.type === 'animated'},
    ...attrs
  } = options;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', size.toString());
  svg.setAttribute('height', size.toString());
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.className = [
    'delv-icon',
    'delv-icon-${iconName}',
    animated ? 'delv-animated' : '',
    className
  ].filter(Boolean).join(' ');

  // Set additional attributes
  Object.entries(attrs).forEach(([key, value]) => {
    svg.setAttribute(key, value);
  });

  svg.innerHTML = \`${extractSVGContent(svgContent)}\`;
  return svg;
}
`
};

function toPascalCase(str) {
  return str.replace(/(^\w|-\w)/g, (match) => 
    match.replace('-', '').toUpperCase()
  );
}

function extractSVGContent(svgContent) {
  // Extract content between <svg> tags, removing the outer svg element
  const match = svgContent.match(/<svg[^>]*>(.*?)<\/svg>/s);
  return match ? match[1].trim() : '';
}

async function buildComponents() {
  console.log('🔧 Building framework components...');
  
  const iconsData = JSON.parse(fs.readFileSync(ICONS_JSON, 'utf8'));
  
  // Create framework directories
  const frameworks = ['react', 'vue', 'angular', 'vanilla'];
  frameworks.forEach(framework => {
    const dir = path.join(DIST_DIR, framework);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Generate types file
  const typesContent = `
export interface IconProps {
  size?: number | string;
  color?: string;
  className?: string;
  animated?: boolean;
}

export interface AnimatedIconProps extends IconProps {
  duration?: string;
  timing?: string;
  iteration?: string;
}

export type IconName = ${Object.keys(iconsData.icons).map(name => `'${name}'`).join(' | ')};

export interface IconCategory {
  name: string;
  description: string;
}

export interface IconData {
  name: string;
  category: keyof typeof categories;
  tags: string[];
  type: 'static' | 'animated';
  variants: Record<string, string>;
  animations?: {
    default: {
      duration: string;
      timing: string;
      iteration: string;
    };
  };
}

export const categories = ${JSON.stringify(iconsData.categories, null, 2)} as const;
export const icons = ${JSON.stringify(iconsData.icons, null, 2)} as const;
`;

  fs.writeFileSync(path.join(DIST_DIR, 'types.ts'), typesContent);

  let processedCount = 0;

  // Generate components for each framework
  for (const framework of frameworks) {
    const frameworkDir = path.join(DIST_DIR, framework);
    const componentsDir = path.join(frameworkDir, 'components');
    
    if (!fs.existsSync(componentsDir)) {
      fs.mkdirSync(componentsDir, { recursive: true });
    }

    const exports = [];

    for (const [iconName, iconData] of Object.entries(iconsData.icons)) {
      // Read SVG content
      const svgPath = path.join(DIST_DIR, 'svg', iconData.type, Object.values(iconData.variants)[0]);
      
      if (fs.existsSync(svgPath)) {
        const svgContent = fs.readFileSync(svgPath, 'utf8');
        const componentContent = templates[framework](iconName, svgContent, iconData);
        
        const componentFile = path.join(componentsDir, `${toPascalCase(iconName)}.${framework === 'vue' ? 'vue' : 'ts'}`);
        fs.writeFileSync(componentFile, componentContent.trim());
        
        exports.push(`export { ${toPascalCase(iconName)} } from './components/${toPascalCase(iconName)}';`);
        processedCount++;
      }
    }

    // Create index file for each framework
    const indexContent = [
      `export * from '../types';`,
      ...exports
    ].join('\n');

    fs.writeFileSync(path.join(frameworkDir, 'index.ts'), indexContent);
  }

  console.log(`✅ Successfully generated ${processedCount} components for ${frameworks.length} frameworks`);
}

buildComponents().catch(console.error);