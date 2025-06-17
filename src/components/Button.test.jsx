import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';
import { describe, it, expect, vi } from 'vitest';

/**
 * Tests for the reusable <Button/> component.
 *
 * The goals are to ensure that:
 * 1. The component renders the given children text.
 * 2. The onClick handler is fired when the user interacts with the button.
 * 3. The disabled prop renders the button in a disabled state.
 */

describe('<Button />', () => {
  it('renders the provided text', () => {
    render(<Button>Click me</Button>);

    const btn = screen.getByRole('button', { name: /click me/i });
    expect(btn).toBeInTheDocument();
  });

  it('calls onClick when pressed', () => {
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Press</Button>);
    const btn = screen.getByRole('button', { name: /press/i });

    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when the disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);

    const btn = screen.getByRole('button', { name: /disabled/i });
    expect(btn).toBeDisabled();
  });
}); 