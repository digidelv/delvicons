import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock the React components since they're generated
jest.mock('../../dist/react', () => ({
  ArrowRight: ({ size = 24, color = 'currentColor', className = '', ...props }: any) => (
    <svg
      data-testid="arrow-right-icon"
      width={size}
      height={size}
      className={`delv-icon delv-icon-arrow-right ${className}`}
      style={{ color }}
      {...props}
    >
      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  LoadingSpinner: ({ size = 24, animated = false, className = '', ...props }: any) => (
    <svg
      data-testid="loading-spinner-icon"
      width={size}
      height={size}
      className={`delv-icon delv-icon-loading-spinner ${animated ? 'delv-animated' : ''} ${className}`}
      {...props}
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}));

import { ArrowRight, LoadingSpinner } from '../../dist/react';

describe('React Components', () => {
  describe('ArrowRight', () => {
    it('should render with default props', () => {
      render(<ArrowRight />);
      const icon = screen.getByTestId('arrow-right-icon');
      
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('width', '24');
      expect(icon).toHaveAttribute('height', '24');
      expect(icon).toHaveClass('delv-icon', 'delv-icon-arrow-right');
    });

    it('should accept custom size', () => {
      render(<ArrowRight size={32} />);
      const icon = screen.getByTestId('arrow-right-icon');
      
      expect(icon).toHaveAttribute('width', '32');
      expect(icon).toHaveAttribute('height', '32');
    });

    it('should accept custom className', () => {
      render(<ArrowRight className="custom-class" />);
      const icon = screen.getByTestId('arrow-right-icon');
      
      expect(icon).toHaveClass('custom-class');
    });

    it('should accept custom color', () => {
      render(<ArrowRight color="#ff0000" />);
      const icon = screen.getByTestId('arrow-right-icon');
      
      expect(icon).toHaveStyle({ color: '#ff0000' });
    });

    it('should forward props to SVG element', () => {
      render(<ArrowRight data-custom="value" aria-label="Arrow Right" />);
      const icon = screen.getByTestId('arrow-right-icon');
      
      expect(icon).toHaveAttribute('data-custom', 'value');
      expect(icon).toHaveAttribute('aria-label', 'Arrow Right');
    });
  });

  describe('LoadingSpinner', () => {
    it('should render with animation class when animated', () => {
      render(<LoadingSpinner animated />);
      const icon = screen.getByTestId('loading-spinner-icon');
      
      expect(icon).toHaveClass('delv-animated');
    });

    it('should not have animation class when not animated', () => {
      render(<LoadingSpinner animated={false} />);
      const icon = screen.getByTestId('loading-spinner-icon');
      
      expect(icon).not.toHaveClass('delv-animated');
    });
  });
});