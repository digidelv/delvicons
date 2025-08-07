import { 
  toPascalCase, 
  getIconsByCategory, 
  searchIcons, 
  getAnimatedIcons, 
  getStaticIcons,
  iconClasses 
} from '../../src/index';

describe('Icon Utilities', () => {
  describe('toPascalCase', () => {
    it('should convert kebab-case to PascalCase', () => {
      expect(toPascalCase('arrow-right')).toBe('ArrowRight');
      expect(toPascalCase('loading-spinner')).toBe('LoadingSpinner');
      expect(toPascalCase('heart-beat')).toBe('HeartBeat');
    });

    it('should handle single words', () => {
      expect(toPascalCase('home')).toBe('Home');
      expect(toPascalCase('user')).toBe('User');
    });

    it('should handle already PascalCase strings', () => {
      expect(toPascalCase('ArrowRight')).toBe('ArrowRight');
    });
  });

  describe('getIconsByCategory', () => {
    it('should return icons filtered by category', () => {
      const arrowIcons = getIconsByCategory('arrows');
      expect(arrowIcons).toHaveLength(1);
      expect(arrowIcons[0][0]).toBe('arrow-right');
    });

    it('should return empty array for non-existent category', () => {
      const nonExistentIcons = getIconsByCategory('non-existent');
      expect(nonExistentIcons).toHaveLength(0);
    });
  });

  describe('searchIcons', () => {
    it('should find icons by name', () => {
      const results = searchIcons('arrow');
      expect(results).toHaveLength(1);
      expect(results[0][0]).toBe('arrow-right');
    });

    it('should find icons by tags', () => {
      const results = searchIcons('loading');
      expect(results.length).toBeGreaterThan(0);
    });

    it('should be case insensitive', () => {
      const results = searchIcons('ARROW');
      expect(results).toHaveLength(1);
    });

    it('should return empty array for no matches', () => {
      const results = searchIcons('xyz123');
      expect(results).toHaveLength(0);
    });
  });

  describe('getAnimatedIcons', () => {
    it('should return only animated icons', () => {
      const animatedIcons = getAnimatedIcons();
      expect(animatedIcons.length).toBeGreaterThan(0);
      animatedIcons.forEach(([, iconData]) => {
        expect(iconData.type).toBe('animated');
      });
    });
  });

  describe('getStaticIcons', () => {
    it('should return only static icons', () => {
      const staticIcons = getStaticIcons();
      expect(staticIcons.length).toBeGreaterThan(0);
      staticIcons.forEach(([, iconData]) => {
        expect(iconData.type).toBe('static');
      });
    });
  });

  describe('iconClasses', () => {
    it('should provide correct CSS classes', () => {
      expect(iconClasses.base).toBe('delv-icon');
      expect(iconClasses.animated).toBe('delv-animated');
      expect(iconClasses.pulse).toBe('delv-pulse');
      expect(iconClasses.bounce).toBe('delv-bounce');
      expect(iconClasses.rotate).toBe('delv-rotate');
      expect(iconClasses.fade).toBe('delv-fade');
    });
  });
});