// DelvIcons - Universal Icon Library
// Main entry point with framework detection

export * from './types';

// Core icon data and utilities
import iconsData from './icons.json' assert { type: 'json' };
export const { icons, categories } = iconsData;

// Universal icon loader function
export async function loadIcon(name: string, framework?: 'react' | 'vue' | 'angular' | 'vanilla') {
  const detectedFramework = framework || await detectFramework();
  
  switch (detectedFramework) {
    case 'react':
      return import('./react').then(m => m[toPascalCase(name)]);
    case 'vue':
      return import('./vue').then(m => m[toPascalCase(name)]);
    case 'angular':
      return import('./angular').then(m => m[toPascalCase(name) + 'Component']);
    case 'vanilla':
    default:
      return import('./vanilla').then(m => m['create' + toPascalCase(name)]);
  }
}

// Framework detection utility
async function detectFramework(): Promise<'react' | 'vue' | 'angular' | 'vanilla'> {
  if (typeof window !== 'undefined') {
    // Browser environment
    if (window.React || window.__REACT_DEVTOOLS_GLOBAL_HOOK__) return 'react';
    if (window.Vue) return 'vue';
    if (window.ng) return 'angular';
  }
  
  if (typeof process !== 'undefined' && process.versions?.node) {
    // Node.js environment - check for framework packages
    try {
      await import('react');
      return 'react';
    } catch {}
    
    try {
      await import('vue');
      return 'vue';
    } catch {}
    
    try {
      await import('@angular/core');
      return 'angular';
    } catch {}
  }
  
  return 'vanilla';
}

// Utility functions
export function toPascalCase(str: string): string {
  return str.replace(/(^\w|-\w)/g, (match) => 
    match.replace('-', '').toUpperCase()
  );
}

export function getIconsByCategory(category: string) {
  return Object.entries(icons).filter(([, iconData]) => iconData.category === category);
}

export function searchIcons(query: string) {
  const searchTerm = query.toLowerCase();
  return Object.entries(icons).filter(([name, iconData]) => {
    return name.toLowerCase().includes(searchTerm) ||
           iconData.name.toLowerCase().includes(searchTerm) ||
           iconData.tags.some(tag => tag.toLowerCase().includes(searchTerm));
  });
}

export function getAnimatedIcons() {
  return Object.entries(icons).filter(([, iconData]) => iconData.type === 'animated');
}

export function getStaticIcons() {
  return Object.entries(icons).filter(([, iconData]) => iconData.type === 'static');
}

// CSS class utilities for animations
export const iconClasses = {
  base: 'delv-icon',
  animated: 'delv-animated',
  pulse: 'delv-pulse',
  bounce: 'delv-bounce',
  rotate: 'delv-rotate',
  fade: 'delv-fade'
} as const;

export type IconClass = typeof iconClasses[keyof typeof iconClasses];