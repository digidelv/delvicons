#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, '../dist');

function buildCSS() {
  console.log('🔧 Building CSS animations and utilities...');

  const cssContent = `
/* DelvIcons - Core Styles and Animations */

/* Base icon styles */
.delv-icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  stroke-width: 2;
  stroke: currentColor;
  fill: none;
  vertical-align: middle;
  flex-shrink: 0;
}

/* Size utilities */
.delv-icon-xs { width: 0.75rem; height: 0.75rem; }
.delv-icon-sm { width: 1rem; height: 1rem; }
.delv-icon-md { width: 1.25rem; height: 1.25rem; }
.delv-icon-lg { width: 1.5rem; height: 1.5rem; }
.delv-icon-xl { width: 2rem; height: 2rem; }
.delv-icon-2xl { width: 2.5rem; height: 2.5rem; }

/* Animation utilities */
.delv-animated {
  animation-fill-mode: both;
}

.delv-spin {
  animation: delv-spin 1s linear infinite;
}

.delv-pulse {
  animation: delv-pulse 2s ease-in-out infinite;
}

.delv-bounce {
  animation: delv-bounce 1s ease-in-out infinite;
}

.delv-fade {
  animation: delv-fade 1.5s ease-in-out infinite alternate;
}

.delv-wobble {
  animation: delv-wobble 1s ease-in-out infinite;
}

.delv-heartbeat {
  animation: delv-heartbeat 2s ease-in-out infinite;
}

.delv-float {
  animation: delv-float 3s ease-in-out infinite;
}

.delv-swing {
  animation: delv-swing 1s ease-in-out infinite;
}

/* Animation control utilities */
.delv-animation-paused { animation-play-state: paused; }
.delv-animation-running { animation-play-state: running; }

.delv-animation-slow { animation-duration: 2s; }
.delv-animation-fast { animation-duration: 0.5s; }

.delv-animation-delay-1 { animation-delay: 0.1s; }
.delv-animation-delay-2 { animation-delay: 0.2s; }
.delv-animation-delay-3 { animation-delay: 0.3s; }

/* Keyframe animations */
@keyframes delv-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes delv-pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

@keyframes delv-bounce {
  0%, 20%, 53%, 80%, 100% {
    animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
    transform: translate3d(0, 0, 0);
  }
  40%, 43% {
    animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
    transform: translate3d(0, -8px, 0);
  }
  70% {
    animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
    transform: translate3d(0, -4px, 0);
  }
  90% {
    transform: translate3d(0, -2px, 0);
  }
}

@keyframes delv-fade {
  0% { opacity: 0.3; }
  100% { opacity: 1; }
}

@keyframes delv-wobble {
  0% { transform: translateX(0%); }
  15% { transform: translateX(-25%) rotate(-5deg); }
  30% { transform: translateX(20%) rotate(3deg); }
  45% { transform: translateX(-15%) rotate(-3deg); }
  60% { transform: translateX(10%) rotate(2deg); }
  75% { transform: translateX(-5%) rotate(-1deg); }
  100% { transform: translateX(0%); }
}

@keyframes delv-heartbeat {
  0% {
    transform: scale(1);
  }
  14% {
    transform: scale(1.3);
  }
  28% {
    transform: scale(1);
  }
  42% {
    transform: scale(1.3);
  }
  70% {
    transform: scale(1);
  }
}

@keyframes delv-float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes delv-swing {
  20% {
    transform: rotate3d(0, 0, 1, 15deg);
  }
  40% {
    transform: rotate3d(0, 0, 1, -10deg);
  }
  60% {
    transform: rotate3d(0, 0, 1, 5deg);
  }
  80% {
    transform: rotate3d(0, 0, 1, -5deg);
  }
  100% {
    transform: rotate3d(0, 0, 1, 0deg);
  }
}

/* Hover effects */
.delv-icon:hover.delv-hover-spin {
  animation: delv-spin 0.5s ease-in-out;
}

.delv-icon:hover.delv-hover-bounce {
  animation: delv-bounce 0.6s ease-in-out;
}

.delv-icon:hover.delv-hover-pulse {
  animation: delv-pulse 0.4s ease-in-out;
}

/* Color utilities */
.delv-icon-primary { color: #3b82f6; }
.delv-icon-secondary { color: #64748b; }
.delv-icon-success { color: #10b981; }
.delv-icon-warning { color: #f59e0b; }
.delv-icon-danger { color: #ef4444; }
.delv-icon-info { color: #06b6d4; }

/* Theme support */
@media (prefers-color-scheme: dark) {
  .delv-icon-auto {
    color: #f1f5f9;
  }
}

@media (prefers-color-scheme: light) {
  .delv-icon-auto {
    color: #1e293b;
  }
}

/* Accessibility */
.delv-icon[aria-hidden="true"] {
  pointer-events: none;
}

.delv-icon:focus {
  outline: 2px solid currentColor;
  outline-offset: 2px;
  border-radius: 2px;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .delv-icon,
  .delv-animated {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Print styles */
@media print {
  .delv-icon {
    color: black !important;
  }
  
  .delv-animated {
    animation: none !important;
  }
}
`;

  fs.writeFileSync(path.join(DIST_DIR, 'delvicons.css'), cssContent.trim());

  // Also create a minified version
  const minifiedCSS = cssContent
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .replace(/;\s}/g, '}') // Remove unnecessary semicolons
    .trim();

  fs.writeFileSync(path.join(DIST_DIR, 'delvicons.min.css'), minifiedCSS);

  console.log('✅ Successfully built CSS files');
}

buildCSS();