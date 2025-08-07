// Validation utilities for icon library

export class IconValidationError extends Error {
  constructor(message: string, public iconName?: string) {
    super(message);
    this.name = 'IconValidationError';
  }
}

export class IconNotFoundError extends Error {
  constructor(iconName: string) {
    super(`Icon "${iconName}" not found. Available icons: ${getAvailableIconNames().join(', ')}`);
    this.name = 'IconNotFoundError';
  }
}

// Type guards
export function isValidSize(size: unknown): size is number | string {
  if (typeof size === 'number') {
    return size > 0 && size <= 1000; // Reasonable limits
  }
  if (typeof size === 'string') {
    // Valid CSS units: px, em, rem, %, vw, vh
    return /^(\d*\.?\d+)(px|em|rem|%|vw|vh)$/.test(size) || 
           /^(\d*\.?\d+)$/.test(size); // Unitless numbers
  }
  return false;
}

export function isValidColor(color: unknown): color is string {
  if (typeof color !== 'string') return false;
  
  // Allow currentColor, transparent, inherit
  if (['currentColor', 'transparent', 'inherit', 'initial', 'unset'].includes(color)) {
    return true;
  }
  
  // Hex colors
  if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(color)) {
    return true;
  }
  
  // RGB/RGBA
  if (/^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+)?\s*\)$/.test(color)) {
    return true;
  }
  
  // HSL/HSLA
  if (/^hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(,\s*[\d.]+)?\s*\)$/.test(color)) {
    return true;
  }
  
  // CSS variables
  if (/^var\(--[\w-]+\)$/.test(color)) {
    return true;
  }
  
  // Named colors (basic check)
  const namedColors = [
    'red', 'green', 'blue', 'black', 'white', 'gray', 'grey',
    'yellow', 'orange', 'purple', 'pink', 'brown', 'cyan', 'magenta'
  ];
  
  return namedColors.includes(color.toLowerCase());
}

export function isValidClassName(className: unknown): className is string {
  if (typeof className !== 'string') return false;
  
  // Allow empty string
  if (className === '') return true;
  
  // Basic CSS class name validation
  return /^[\w\s-]+$/.test(className);
}

export function isValidAnimationDuration(duration: unknown): duration is string {
  if (typeof duration !== 'string') return false;
  
  // CSS time values: s, ms
  return /^\d*\.?\d+(s|ms)$/.test(duration);
}

export function isValidAnimationTiming(timing: unknown): timing is string {
  if (typeof timing !== 'string') return false;
  
  const validTimings = [
    'ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear',
    'step-start', 'step-end'
  ];
  
  return validTimings.includes(timing) || 
         /^cubic-bezier\([\d.]+,\s*[\d.]+,\s*[\d.]+,\s*[\d.]+\)$/.test(timing) ||
         /^steps\(\d+\)$/.test(timing);
}

export function isValidAnimationIteration(iteration: unknown): iteration is string {
  if (typeof iteration !== 'string') return false;
  
  return iteration === 'infinite' || /^\d+$/.test(iteration);
}

// Icon existence validation
function getAvailableIconNames(): string[] {
  try {
    // In runtime, this would access the icon registry
    // For build-time, we need to handle this differently
    if (typeof window !== 'undefined' && (window as any).__DELVICONS_REGISTRY__) {
      return Object.keys((window as any).__DELVICONS_REGISTRY__.icons);
    }
    
    // Fallback for Node.js environment
    return ['arrow-right', 'loading-spinner', 'heart-beat']; // Default icons
  } catch {
    return [];
  }
}

export function validateIconExists(iconName: string): void {
  const availableIcons = getAvailableIconNames();
  if (availableIcons.length > 0 && !availableIcons.includes(iconName)) {
    throw new IconNotFoundError(iconName);
  }
}

// Comprehensive prop validation
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateIconProps(props: {
  size?: unknown;
  color?: unknown;
  className?: unknown;
  animated?: unknown;
  duration?: unknown;
  timing?: unknown;
  iteration?: unknown;
}): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  // Validate size
  if (props.size !== undefined && !isValidSize(props.size)) {
    result.errors.push(`Invalid size: ${props.size}. Must be a positive number or valid CSS unit.`);
    result.isValid = false;
  }

  // Validate color
  if (props.color !== undefined && !isValidColor(props.color)) {
    result.errors.push(`Invalid color: ${props.color}. Must be a valid CSS color value.`);
    result.isValid = false;
  }

  // Validate className
  if (props.className !== undefined && !isValidClassName(props.className)) {
    result.errors.push(`Invalid className: ${props.className}. Must be a valid CSS class name.`);
    result.isValid = false;
  }

  // Validate animated
  if (props.animated !== undefined && typeof props.animated !== 'boolean') {
    result.errors.push(`Invalid animated prop: ${props.animated}. Must be a boolean.`);
    result.isValid = false;
  }

  // Validate animation properties
  if (props.duration !== undefined && !isValidAnimationDuration(props.duration)) {
    result.errors.push(`Invalid duration: ${props.duration}. Must be a valid CSS time value (e.g., "2s", "500ms").`);
    result.isValid = false;
  }

  if (props.timing !== undefined && !isValidAnimationTiming(props.timing)) {
    result.errors.push(`Invalid timing: ${props.timing}. Must be a valid CSS timing function.`);
    result.isValid = false;
  }

  if (props.iteration !== undefined && !isValidAnimationIteration(props.iteration)) {
    result.errors.push(`Invalid iteration: ${props.iteration}. Must be "infinite" or a positive integer.`);
    result.isValid = false;
  }

  // Warnings for common issues
  if (typeof props.size === 'number' && props.size > 200) {
    result.warnings.push(`Large icon size: ${props.size}px. Consider if this is intentional.`);
  }

  if (props.animated && !props.duration && !props.timing) {
    result.warnings.push('Animation enabled but no custom timing specified. Using defaults.');
  }

  return result;
}

// Development mode warnings
export function warnInDevelopment(message: string, iconName?: string): void {
  if (process.env.NODE_ENV === 'development') {
    const prefix = iconName ? `[DelvIcons:${iconName}]` : '[DelvIcons]';
    console.warn(`${prefix} ${message}`);
  }
}

// Error boundary helper
export function createIconErrorBoundary<T>(
  iconName: string, 
  fallbackComponent: T
): T | null {
  try {
    return fallbackComponent;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`Error rendering icon "${iconName}":`, error);
    }
    
    // In production, fail silently or return a default icon
    return null;
  }
}

// Sanitization utilities
export function sanitizeSize(size: unknown, defaultSize: number = 24): number | string {
  if (isValidSize(size)) {
    return size;
  }
  
  warnInDevelopment(`Invalid size "${size}", using default: ${defaultSize}`);
  return defaultSize;
}

export function sanitizeColor(color: unknown, defaultColor: string = 'currentColor'): string {
  if (isValidColor(color)) {
    return color;
  }
  
  warnInDevelopment(`Invalid color "${color}", using default: ${defaultColor}`);
  return defaultColor;
}

export function sanitizeClassName(className: unknown, defaultClassName: string = ''): string {
  if (isValidClassName(className)) {
    return className;
  }
  
  warnInDevelopment(`Invalid className "${className}", using default: "${defaultClassName}"`);
  return defaultClassName;
}