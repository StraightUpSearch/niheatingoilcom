
import { render, screen, fireEvent } from '@testing-library/react';
import TankSelector from '../tank-selector';

describe('TankSelector', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders all tank size options', () => {
    render(<TankSelector value={500} onChange={mockOnChange} />);
    
    expect(screen.getByText('300L')).toBeInTheDocument();
    expect(screen.getByText('500L')).toBeInTheDocument();
    expect(screen.getByText('900L')).toBeInTheDocument();
  });

  it('highlights selected tank size', () => {
    render(<TankSelector value={500} onChange={mockOnChange} />);
    
    const selectedOption = screen.getByText('500L').closest('button');
    expect(selectedOption).toHaveClass('ring-2');
  });

  it('calls onChange when tank size is selected', () => {
    render(<TankSelector value={500} onChange={mockOnChange} />);
    
    const option300L = screen.getByText('300L').closest('button');
    fireEvent.click(option300L!);
    
    expect(mockOnChange).toHaveBeenCalledWith(300);
  });
});
