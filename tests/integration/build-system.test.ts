import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '../..');
const distDir = path.join(rootDir, 'dist');

describe('Build System Integration', () => {
  beforeAll(() => {
    // Ensure we have a clean build
    try {
      execSync('npm run build', { cwd: rootDir, stdio: 'pipe' });
    } catch (error) {
      console.error('Build failed:', error);
      throw error;
    }
  });

  describe('SVG Build', () => {
    it('should generate optimized SVG files', () => {
      const svgDir = path.join(distDir, 'svg');
      expect(fs.existsSync(svgDir)).toBe(true);
      
      const staticDir = path.join(svgDir, 'static');
      const animatedDir = path.join(svgDir, 'animated');
      
      expect(fs.existsSync(staticDir)).toBe(true);
      expect(fs.existsSync(animatedDir)).toBe(true);
      
      // Check specific files exist
      expect(fs.existsSync(path.join(staticDir, 'arrow-right.svg'))).toBe(true);
      expect(fs.existsSync(path.join(animatedDir, 'loading-spinner.svg'))).toBe(true);
      expect(fs.existsSync(path.join(animatedDir, 'heart-beat.svg'))).toBe(true);
    });

    it('should preserve animations in animated SVGs', () => {
      const heartBeatSvg = fs.readFileSync(
        path.join(distDir, 'svg', 'animated', 'heart-beat.svg'), 
        'utf8'
      );
      
      expect(heartBeatSvg).toContain('animateTransform');
      expect(heartBeatSvg).toContain('repeatCount="indefinite"');
    });
  });

  describe('Component Generation', () => {
    const frameworks = ['react', 'vue', 'angular', 'vanilla'];
    
    frameworks.forEach(framework => {
      it(`should generate ${framework} components`, () => {
        const frameworkDir = path.join(distDir, framework);
        expect(fs.existsSync(frameworkDir)).toBe(true);
        
        const indexFile = path.join(frameworkDir, 'index.ts');
        expect(fs.existsSync(indexFile)).toBe(true);
        
        const componentsDir = path.join(frameworkDir, 'components');
        expect(fs.existsSync(componentsDir)).toBe(true);
      });
    });

    it('should generate TypeScript definitions', () => {
      const typesFile = path.join(distDir, 'types.ts');
      expect(fs.existsSync(typesFile)).toBe(true);
      
      const typesContent = fs.readFileSync(typesFile, 'utf8');
      expect(typesContent).toContain('export interface IconProps');
      expect(typesContent).toContain('export type IconName');
    });
  });

  describe('CSS Build', () => {
    it('should generate CSS files', () => {
      expect(fs.existsSync(path.join(distDir, 'delvicons.css'))).toBe(true);
      expect(fs.existsSync(path.join(distDir, 'delvicons.min.css'))).toBe(true);
    });

    it('should include animation keyframes', () => {
      const cssContent = fs.readFileSync(path.join(distDir, 'delvicons.css'), 'utf8');
      
      expect(cssContent).toContain('@keyframes delv-spin');
      expect(cssContent).toContain('@keyframes delv-pulse');
      expect(cssContent).toContain('@keyframes delv-bounce');
      expect(cssContent).toContain('.delv-icon');
      expect(cssContent).toContain('.delv-animated');
    });

    it('should support accessibility features', () => {
      const cssContent = fs.readFileSync(path.join(distDir, 'delvicons.css'), 'utf8');
      
      expect(cssContent).toContain('@media (prefers-reduced-motion: reduce)');
      expect(cssContent).toContain('.delv-icon:focus');
    });
  });

  describe('Icons Metadata', () => {
    it('should copy icons.json to dist', () => {
      const iconsFile = path.join(distDir, 'icons.json');
      expect(fs.existsSync(iconsFile)).toBe(true);
      
      const iconsData = JSON.parse(fs.readFileSync(iconsFile, 'utf8'));
      expect(iconsData).toHaveProperty('categories');
      expect(iconsData).toHaveProperty('icons');
      expect(Object.keys(iconsData.icons)).toHaveLength(3); // arrow-right, loading-spinner, heart-beat
    });
  });
});