# DelvIcons 🎨

> Comprehensive icon library with static and animated SVG icons for all frameworks

[![npm version](https://badge.fury.io/js/%40delvicons%2Ficons.svg)](https://www.npmjs.com/package/@delvicons/icons)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

DelvIcons is a modern, comprehensive icon library that provides both static and animated SVG icons compatible with React, Vue, Angular, React Native, and vanilla JavaScript. Built with TypeScript and designed for performance and accessibility.

## ✨ Features

- 🎯 **Universal Compatibility** - Works with React, Vue, Angular, React Native, and vanilla JS
- 🎬 **Animated Icons** - Unique collection of animated SVG icons with smooth transitions
- 🎨 **Customizable** - Easy to style with CSS, supports theming and custom animations
- 📱 **Responsive** - Icons that work perfectly across all devices and screen sizes
- ♿ **Accessible** - Built with accessibility best practices and ARIA support
- 🚀 **Performance Optimized** - Tree-shakeable, optimized SVGs, minimal bundle size
- 🎪 **Rich Animations** - Pre-built animation utilities (spin, pulse, bounce, etc.)
- 🌙 **Dark Mode Ready** - Automatic theme adaptation

## 📦 Installation

```bash
npm install @delvicons/icons
# or
yarn add @delvicons/icons
# or
pnpm add @delvicons/icons
```

## 🚀 Quick Start

### React

```tsx
import { ArrowRight, LoadingSpinner } from '@delvicons/icons/react';

function App() {
  return (
    <div>
      <ArrowRight size={24} />
      <LoadingSpinner animated className="text-blue-500" />
    </div>
  );
}
```

### Vue 3

```vue
<template>
  <div>
    <ArrowRight :size="24" />
    <LoadingSpinner :animated="true" class="text-blue-500" />
  </div>
</template>

<script setup>
import { ArrowRight, LoadingSpinner } from '@delvicons/icons/vue';
</script>
```

### Angular

```typescript
import { ArrowRightComponent, LoadingSpinnerComponent } from '@delvicons/icons/angular';

@Component({
  selector: 'app-root',
  template: `
    <delv-arrow-right [size]="24"></delv-arrow-right>
    <delv-loading-spinner [animated]="true"></delv-loading-spinner>
  `,
  imports: [ArrowRightComponent, LoadingSpinnerComponent]
})
export class AppComponent {}
```

### Vanilla JavaScript

```javascript
import { createArrowRight, createLoadingSpinner } from '@delvicons/icons/vanilla';

const arrowIcon = createArrowRight({ size: 24 });
const spinnerIcon = createLoadingSpinner({ animated: true, className: 'text-blue-500' });

document.body.appendChild(arrowIcon);
document.body.appendChild(spinnerIcon);
```

### CSS Animations

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="node_modules/@delvicons/icons/dist/delvicons.css">
</head>
<body>
  <!-- Direct SVG usage with CSS classes -->
  <svg class="delv-icon delv-spin">
    <!-- SVG content -->
  </svg>
</body>
</html>
```

## 🎬 Animation Classes

DelvIcons comes with built-in CSS animation utilities:

```html
<!-- Basic animations -->
<icon class="delv-spin" />        <!-- Spinning animation -->
<icon class="delv-pulse" />       <!-- Pulsing animation -->
<icon class="delv-bounce" />      <!-- Bouncing animation -->
<icon class="delv-fade" />        <!-- Fading animation -->

<!-- Hover effects -->
<icon class="delv-hover-spin" />  <!-- Spin on hover -->
<icon class="delv-hover-bounce" /><!-- Bounce on hover -->

<!-- Size utilities -->
<icon class="delv-icon-xs" />     <!-- 12px -->
<icon class="delv-icon-sm" />     <!-- 16px -->
<icon class="delv-icon-lg" />     <!-- 24px -->
<icon class="delv-icon-xl" />     <!-- 32px -->

<!-- Color utilities -->
<icon class="delv-icon-primary" />
<icon class="delv-icon-success" />
<icon class="delv-icon-warning" />
```

## 📚 API Reference

### Icon Props

All framework components accept these common props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `number \| string` | `24` | Icon size in pixels or CSS unit |
| `color` | `string` | `'currentColor'` | Icon color |
| `className` | `string` | `''` | Additional CSS classes |
| `animated` | `boolean` | `false` | Enable animation (for animated icons) |
| `style` | `object` | `{}` | Inline styles |

### Animation Props (Animated Icons)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `duration` | `string` | `'2s'` | Animation duration |
| `timing` | `string` | `'ease-in-out'` | Animation timing function |
| `iteration` | `string` | `'infinite'` | Animation iteration count |
| `playState` | `'running' \| 'paused'` | `'running'` | Animation play state |

## 🎨 Customization

### Custom Colors

```tsx
// Using props
<ArrowRight color="#3b82f6" />
<ArrowRight color="var(--primary-color)" />

// Using CSS
<ArrowRight className="text-blue-500" />
<ArrowRight style={{ color: '#3b82f6' }} />
```

### Custom Animations

```css
.my-custom-animation {
  animation: my-spin 1s linear infinite;
}

@keyframes my-spin {
  from { transform: rotate(0deg) scale(1); }
  to { transform: rotate(360deg) scale(1.1); }
}
```

### Dark Mode

```css
@media (prefers-color-scheme: dark) {
  .delv-icon {
    color: #f1f5f9;
  }
}

/* Or using CSS variables */
:root {
  --icon-color: #1e293b;
}

[data-theme="dark"] {
  --icon-color: #f1f5f9;
}

.delv-icon {
  color: var(--icon-color);
}
```

## 🔍 Icon Categories

- **Arrows** - Navigation and directional icons
- **Feedback** - Loading states, notifications, status indicators
- **Emotions** - Hearts, reactions, emotional expressions
- More categories coming soon!

## 🛠️ Development

### Building the Library

```bash
npm install
npm run build
```

### Preview Icons

```bash
npm run preview
```

This starts a local server at `http://localhost:3000` with an interactive icon browser.

### Adding New Icons

```bash
npm run generate:icon
```

Follow the interactive prompts to create a new icon.

### Scripts

- `npm run dev` - Start development mode with file watching
- `npm run build` - Build all components and assets
- `npm run preview` - Start icon preview server  
- `npm run generate:icon` - Interactive icon generator
- `npm test` - Run tests
- `npm run lint` - Lint code

## 📁 Project Structure

```
delvicons/
├── src/
│   ├── svg/
│   │   ├── static/          # Static SVG icons
│   │   └── animated/        # Animated SVG icons
│   ├── icons.json          # Icon metadata
│   ├── index.ts            # Main entry point
│   └── types.ts            # TypeScript definitions
├── scripts/
│   ├── build-svg.js        # SVG optimization
│   ├── build-components.js # Component generation
│   ├── build-css.js        # CSS utilities
│   ├── preview.js          # Development server
│   └── generate-icon.js    # Icon generator
└── dist/                   # Built assets
    ├── react/
    ├── vue/
    ├── angular/
    ├── vanilla/
    ├── svg/
    └── delvicons.css
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-icons`)
3. Add your icons to the appropriate SVG directories
4. Update `src/icons.json` with icon metadata
5. Run `npm run build` to generate components
6. Test your changes with `npm run preview`
7. Commit your changes (`git commit -am 'Add amazing icons'`)
8. Push to the branch (`git push origin feature/amazing-icons`)
9. Open a Pull Request

## 📄 License

MIT © [Aman Soni](mailto:aman.soni.se@gmail.com)

## 🙏 Acknowledgments

- Inspired by [Heroicons](https://heroicons.com/), [Feather](https://feathericons.com/), and [Lucide](https://lucide.dev/)
- Built with [SVGO](https://github.com/svg/svgo) for optimization
- Animation utilities inspired by [Animate.css](https://animate.style/)

---

Made with ❤️ by the DelvUI team