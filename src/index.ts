// DelvIcons - Universal Icon Library
// Main entry point with framework detection

export * from './types';

// Core icon data and utilities
import iconsData from './icons.json' assert { type: 'json' };
export const { icons, categories } = iconsData;

// Framework detection utility (simplified for main entry)
export function detectFramework(): 'react' | 'vue' | 'angular' | 'vanilla' {
  if (typeof window !== 'undefined') {
    // Browser environment
    const win = window as any;
    if (win.React || win.__REACT_DEVTOOLS_GLOBAL_HOOK__) return 'react';
    if (win.Vue) return 'vue';
    if (win.ng) return 'angular';
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