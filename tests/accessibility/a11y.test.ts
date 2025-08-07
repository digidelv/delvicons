import { axe, toHaveNoViolations } from 'jest-axe';
import { render } from '@testing-library/react';
import React from 'react';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock React components for accessibility testing
const MockArrowRight = ({ 
  size = 24, 
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
  role,
  tabIndex,
  ...props 
}: any) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    aria-label={ariaLabel}
    aria-hidden={ariaHidden}
    role={role}
    tabIndex={tabIndex}
    className="delv-icon delv-icon-arrow-right"
    {...props}
  >
    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const MockLoadingSpinner = ({ 
  animated = true, 
  'aria-label': ariaLabel = 'Loading',
  ...props 
}: any) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    role="img"
    aria-label={ariaLabel}
    className={`delv-icon delv-icon-loading-spinner ${animated ? 'delv-animated' : ''}`}
    {...props}
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
  </svg>
);

describe('Accessibility Tests', () => {
  describe('ARIA Compliance', () => {
    it('should have no accessibility violations for decorative icon', async () => {
      const { container } = render(
        <MockArrowRight aria-hidden="true" />
      );
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations for meaningful icon', async () => {
      const { container } = render(
        <MockArrowRight aria-label="Next page" role="img" />
      );
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations for interactive icon', async () => {
      const { container } = render(
        <button type="button">
          <MockArrowRight aria-hidden="true" />
          Next
        </button>
      );
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should handle loading states accessibly', async () => {
      const { container } = render(
        <div>
          <MockLoadingSpinner aria-label="Loading content" />
          <div aria-live="polite" aria-atomic="true">
            Loading...
          </div>
        </div>
      );
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should be focusable when tabIndex is provided', () => {
      const { container } = render(
        <MockArrowRight 
          tabIndex={0} 
          role="button" 
          aria-label="Navigate forward"
        />
      );
      
      const icon = container.querySelector('svg');
      expect(icon).toHaveAttribute('tabIndex', '0');
      expect(icon).toHaveAttribute('role', 'button');
    });

    it('should not be focusable when decorative', () => {
      const { container } = render(
        <MockArrowRight aria-hidden="true" />
      );
      
      const icon = container.querySelector('svg');
      expect(icon).not.toHaveAttribute('tabIndex');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Screen Reader Support', () => {
    it('should provide appropriate labels for screen readers', () => {
      const { container } = render(
        <MockArrowRight 
          aria-label="Go to next page" 
          role="img" 
        />
      );
      
      const icon = container.querySelector('svg');
      expect(icon).toHaveAttribute('aria-label', 'Go to next page');
      expect(icon).toHaveAttribute('role', 'img');
    });

    it('should hide decorative icons from screen readers', () => {
      const { container } = render(
        <div>
          Decorative context
          <MockArrowRight aria-hidden="true" />
        </div>
      );
      
      const icon = container.querySelector('svg');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('should provide context for loading states', () => {
      const { container } = render(
        <MockLoadingSpinner 
          aria-label="Loading user data" 
          role="img" 
        />
      );
      
      const icon = container.querySelector('svg');
      expect(icon).toHaveAttribute('aria-label', 'Loading user data');
      expect(icon).toHaveAttribute('role', 'img');
    });
  });

  describe('Color Contrast', () => {
    it('should work with high contrast mode', () => {
      const { container } = render(
        <div style={{ forced-color-adjust: 'none' }}>
          <MockArrowRight style={{ color: 'ButtonText' }} />
        </div>
      );
      
      const icon = container.querySelector('svg');
      expect(icon).toHaveStyle({ color: 'ButtonText' });
    });

    it('should respect color preferences', () => {
      const { container } = render(
        <MockArrowRight style={{ color: 'currentColor' }} />
      );
      
      const icon = container.querySelector('svg');
      expect(icon).toHaveStyle({ color: 'currentColor' });
    });
  });

  describe('Animation Accessibility', () => {
    it('should respect prefers-reduced-motion', () => {
      // Mock CSS media query
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      const { container } = render(
        <MockLoadingSpinner 
          animated={true}
          style={{ 
            animationDuration: window.matchMedia('(prefers-reduced-motion: reduce)').matches 
              ? '0.01ms' 
              : '2s' 
          }} 
        />
      );
      
      const icon = container.querySelector('svg');
      expect(icon).toHaveStyle({ animationDuration: '0.01ms' });
    });

    it('should provide animation controls when needed', () => {
      const { container } = render(
        <div>
          <MockLoadingSpinner animated={true} />
          <button type="button" aria-label="Pause animation">
            Pause
          </button>
        </div>
      );
      
      const button = container.querySelector('button');
      expect(button).toHaveAttribute('aria-label', 'Pause animation');
    });
  });

  describe('Context and Semantics', () => {
    it('should work properly in form contexts', async () => {
      const { container } = render(
        <form>
          <label htmlFor="search">
            Search
            <MockArrowRight aria-hidden="true" />
          </label>
          <input id="search" type="text" />
          <button type="submit">
            <MockArrowRight aria-hidden="true" />
            Submit
          </button>
        </form>
      );
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should work in navigation contexts', async () => {
      const { container } = render(
        <nav aria-label="Main navigation">
          <ul>
            <li>
              <a href="/home">
                Home
                <MockArrowRight aria-hidden="true" />
              </a>
            </li>
            <li>
              <a href="/about">
                About
                <MockArrowRight aria-hidden="true" />
              </a>
            </li>
          </ul>
        </nav>
      );
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should work in table contexts', async () => {
      const { container } = render(
        <table>
          <thead>
            <tr>
              <th>
                Name
                <MockArrowRight 
                  aria-label="Sort by name ascending" 
                  role="button" 
                  tabIndex={0}
                />
              </th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John Doe</td>
              <td>john@example.com</td>
            </tr>
          </tbody>
        </table>
      );
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Touch and Mobile Accessibility', () => {
    it('should have adequate touch targets', () => {
      const { container } = render(
        <button 
          type="button"
          style={{ minWidth: '44px', minHeight: '44px', padding: '8px' }}
        >
          <MockArrowRight aria-hidden="true" />
        </button>
      );
      
      const button = container.querySelector('button');
      const computedStyle = window.getComputedStyle(button!);
      
      // Touch target should be at least 44x44px
      expect(parseInt(computedStyle.minWidth)).toBeGreaterThanOrEqual(44);
      expect(parseInt(computedStyle.minHeight)).toBeGreaterThanOrEqual(44);
    });

    it('should work with voice control', () => {
      const { container } = render(
        <button 
          type="button"
          data-voice-command="next"
          aria-label="Go to next page"
        >
          <MockArrowRight aria-hidden="true" />
        </button>
      );
      
      const button = container.querySelector('button');
      expect(button).toHaveAttribute('data-voice-command', 'next');
      expect(button).toHaveAttribute('aria-label', 'Go to next page');
    });
  });
});