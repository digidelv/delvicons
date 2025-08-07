# DelvIcons Architecture

## Overview

DelvIcons is a comprehensive, multi-framework icon library designed with performance, accessibility, and developer experience in mind. This document outlines the architectural decisions, design patterns, and implementation details.

## 📋 Table of Contents

1. [Core Architecture](#core-architecture)
2. [Build System](#build-system)
3. [Framework Integration](#framework-integration)
4. [Animation System](#animation-system)
5. [Development Workflow](#development-workflow)
6. [Performance Optimizations](#performance-optimizations)
7. [Accessibility Features](#accessibility-features)

## Core Architecture

### Directory Structure

```
delvicons/
├── src/                    # Source files
│   ├── svg/               # SVG icon sources
│   │   ├── static/        # Static icons
│   │   └── animated/      # Animated icons
│   ├── icons.json         # Icon metadata registry
│   ├── index.ts           # Main entry point
│   └── types.ts           # TypeScript definitions
├── scripts/               # Build scripts
│   ├── build-svg.js       # SVG processing
│   ├── build-components.js # Component generation
│   ├── build-css.js       # CSS utilities
│   ├── preview.js         # Development server
│   └── generate-icon.js   # Icon creation tool
├── tests/                 # Test suites
│   ├── unit/             # Unit tests
│   ├── integration/      # Integration tests
│   └── visual/           # Visual regression tests
├── docs/                 # Documentation
└── dist/                 # Built assets (generated)
    ├── react/
    ├── vue/
    ├── angular/
    ├── vanilla/
    ├── svg/
    └── delvicons.css
```

### Design Principles

1. **Framework Agnostic**: Core icons are SVG-based, with framework-specific wrappers
2. **Performance First**: Tree-shakeable, optimized bundles for each framework
3. **Type Safety**: Full TypeScript support with generated type definitions
4. **Accessibility**: ARIA compliance and keyboard navigation built-in
5. **Animation Ready**: Native support for both CSS and SVG animations

## Build System

### Multi-Stage Build Process

The build system consists of four main stages:

#### 1. SVG Processing (`build-svg.js`)
- Optimizes SVG files using SVGO
- Preserves animations for animated icons
- Generates consistent viewBox and sizing
- Copies optimized SVGs to dist directory

#### 2. Component Generation (`build-components.js`)
- Reads icon metadata from `icons.json`
- Generates framework-specific components
- Creates TypeScript definitions
- Handles prop passing and styling

#### 3. CSS Generation (`build-css.js`)
- Creates animation utilities
- Generates size and color variants
- Includes accessibility features
- Produces both regular and minified versions

#### 4. Bundle Optimization (Rollup)
- Tree-shakeable ES modules
- Framework-specific bundles
- TypeScript compilation
- Minification for production

### Icon Metadata Schema

```typescript
interface IconData {
  name: string;           // Display name
  category: string;       // Category key
  tags: string[];        // Search tags
  type: 'static' | 'animated';
  variants: Record<string, string>;  // Variant -> filename mapping
  animations?: {         // Animation configurations
    default: {
      duration: string;
      timing: string;
      iteration: string;
    };
  };
}
```

## Framework Integration

### Universal Component Interface

All framework components implement a consistent interface:

```typescript
interface IconProps {
  size?: number | string;
  color?: string;
  className?: string;
  animated?: boolean;
  style?: Record<string, any>;
}
```

### React Implementation

```typescript
export const ArrowRight: React.FC<IconProps> = ({ 
  size = 24, 
  color = 'currentColor', 
  className = '',
  animated = false,
  ...props 
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={`delv-icon delv-icon-arrow-right ${animated ? 'delv-animated' : ''} ${className}`}
    {...props}
  >
    {/* SVG content */}
  </svg>
);
```

### Vue Implementation

```vue
<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    :class="iconClasses"
    v-bind="$attrs"
  >
    <!-- SVG content -->
  </svg>
</template>

<script setup lang="ts">
interface Props extends IconProps {
  size?: number | string;
  // ... other props
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
  color: 'currentColor',
});
</script>
```

### Angular Implementation

```typescript
@Component({
  selector: 'delv-arrow-right',
  template: `
    <svg [attr.width]="size" [attr.height]="size" [class]="iconClasses">
      <!-- SVG content -->
    </svg>
  `,
  standalone: true
})
export class ArrowRightComponent {
  @Input() size: number | string = 24;
  // ... other inputs
}
```

### Vanilla JavaScript Implementation

```typescript
export function createArrowRight(options: IconProps = {}): SVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  // Configure SVG element
  return svg;
}
```

## Animation System

### Two-Tier Animation Approach

1. **CSS Animations**: For simple, repeatable animations
   - Spin, pulse, bounce, fade
   - Performance optimized
   - Easy to control via CSS classes

2. **SVG Animations**: For complex, custom animations
   - Morphing shapes
   - Path animations
   - Coordinated multi-element animations

### Animation Utilities

```css
/* Base classes */
.delv-icon { /* Base styles */ }
.delv-animated { animation-fill-mode: both; }

/* Animation types */
.delv-spin { animation: delv-spin 1s linear infinite; }
.delv-pulse { animation: delv-pulse 2s ease-in-out infinite; }
.delv-bounce { animation: delv-bounce 1s ease-in-out infinite; }

/* Control classes */
.delv-animation-paused { animation-play-state: paused; }
.delv-animation-slow { animation-duration: 2s; }
```

### Accessibility Considerations

```css
@media (prefers-reduced-motion: reduce) {
  .delv-icon,
  .delv-animated {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

## Development Workflow

### Adding New Icons

1. **Create SVG**: Use `npm run generate:icon` or manually add to `src/svg/`
2. **Update Metadata**: Add entry to `src/icons.json`
3. **Build Components**: Run `npm run build` to generate framework components
4. **Test**: Use `npm run preview` to preview changes
5. **Commit**: Follow conventional commit format

### Quality Gates

1. **Linting**: ESLint with TypeScript rules
2. **Type Checking**: Full TypeScript validation
3. **Testing**: Unit, integration, and visual tests
4. **Bundle Analysis**: Size impact monitoring
5. **Accessibility**: ARIA compliance checks

## Performance Optimizations

### Tree Shaking

Each framework package is structured for optimal tree shaking:

```typescript
// Import only what you need
import { ArrowRight } from '@delvicons/icons/react';

// Not the entire library
import * as Icons from '@delvicons/icons/react'; // ❌ Don't do this
```

### Bundle Splitting

- Separate bundles for each framework
- Individual component imports
- CSS utilities as optional import

### SVG Optimization

- SVGO processing for static icons
- Removal of unnecessary metadata
- Consistent viewBox normalization
- Path simplification where possible

### Runtime Performance

- Minimal component overhead
- CSS animations over JavaScript
- Efficient DOM structure
- Memory leak prevention

## Accessibility Features

### ARIA Support

```typescript
// Automatic ARIA attributes
<ArrowRight aria-label="Next page" role="img" />

// Hidden decorative icons
<ArrowRight aria-hidden="true" />
```

### Keyboard Navigation

```css
.delv-icon:focus {
  outline: 2px solid currentColor;
  outline-offset: 2px;
  border-radius: 2px;
}
```

### Color Contrast

- High contrast mode support
- Respects system color preferences
- Customizable color schemes

### Motion Sensitivity

- `prefers-reduced-motion` media query support
- Animation disabling capabilities
- Alternative static states

## Testing Strategy

### Unit Tests
- Component rendering
- Prop handling
- Accessibility attributes
- Animation behavior

### Integration Tests
- Build system verification
- Cross-framework compatibility
- Bundle integrity
- Performance benchmarks

### Visual Regression
- Icon appearance consistency
- Animation accuracy
- Responsive behavior
- Theme variations

### Accessibility Testing
- Screen reader compatibility
- Keyboard navigation
- Color contrast validation
- Motion preference respect

## Future Considerations

### Roadmap Items

1. **Icon Variants**: Multiple styles per icon (outline, filled, two-tone)
2. **Dynamic Loading**: Lazy loading for large icon sets
3. **Custom Animation Editor**: Visual tool for creating animations
4. **Theme System**: Comprehensive design token integration
5. **Icon Optimization AI**: Automatic SVG optimization suggestions

### Scalability

- Automated icon processing pipelines
- Community contribution workflows
- Multi-language documentation
- Performance monitoring and alerting

---

This architecture provides a solid foundation for a production-ready icon library while maintaining flexibility for future enhancements and community contributions.