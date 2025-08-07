// Core icon types and interfaces

export interface IconProps {
  size?: number | string;
  color?: string;
  className?: string;
  animated?: boolean;
  style?: React.CSSProperties | Record<string, any>;
}

export interface AnimatedIconProps extends IconProps {
  duration?: string;
  timing?: string;
  iteration?: string;
  playState?: 'running' | 'paused';
}

export interface IconComponentProps extends IconProps {
  onClick?: (event: Event | React.MouseEvent) => void;
  onMouseEnter?: (event: Event | React.MouseEvent) => void;
  onMouseLeave?: (event: Event | React.MouseEvent) => void;
  'aria-label'?: string;
  role?: string;
  tabIndex?: number;
}

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number | string;

export type IconType = 'static' | 'animated';

export type IconVariant = 'outline' | 'filled' | 'animated';

export interface IconAnimation {
  duration: string;
  timing: string;
  iteration: string;
  delay?: string;
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
}

export interface IconData {
  name: string;
  category: string;
  tags: string[];
  type: IconType;
  variants: Record<string, string>;
  animations?: {
    default: IconAnimation;
    [key: string]: IconAnimation;
  };
}

export interface IconCategory {
  name: string;
  description: string;
}

// Framework-specific component types
export interface ReactIconComponent extends React.FC<IconComponentProps> {
  displayName: string;
}

export interface VueIconComponent {
  name: string;
  props: string[];
  template: string;
}

export interface AngularIconComponent {
  selector: string;
  template: string;
  inputs: string[];
}

export interface VanillaIconFactory {
  (options?: Partial<IconProps>): SVGElement;
}

// Utility types
export type IconRegistry = Record<string, IconData>;

export type IconCategoryRegistry = Record<string, IconCategory>;

export type FrameworkType = 'react' | 'vue' | 'angular' | 'react-native' | 'vanilla';

// Size mappings
export const iconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32
} as const;

// Animation presets
export const animationPresets = {
  spin: {
    duration: '1s',
    timing: 'linear',
    iteration: 'infinite'
  },
  pulse: {
    duration: '2s',
    timing: 'ease-in-out',
    iteration: 'infinite'
  },
  bounce: {
    duration: '1s',
    timing: 'ease-in-out',
    iteration: 'infinite'
  },
  fade: {
    duration: '1.5s',
    timing: 'ease-in-out',
    iteration: 'infinite',
    direction: 'alternate'
  }
} as const;

export type AnimationPreset = keyof typeof animationPresets;