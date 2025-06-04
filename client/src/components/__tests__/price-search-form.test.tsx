
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import PriceSearchForm from '../price-search-form';

// Mock the hooks
vi.mock('../hooks/use-mobile', () => ({
  useIsMobile: () => false,
}));

describe('PriceSearchForm', () => {
  it('renders search form with required fields', () => {
    render(<PriceSearchForm />);
    
    expect(screen.getByLabelText(/postcode/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tank size/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /find prices/i })).toBeInTheDocument();
  });

  it('validates postcode format', async () => {
    render(<PriceSearchForm />);
    
    const postcodeInput = screen.getByLabelText(/postcode/i);
    const submitButton = screen.getByRole('button', { name: /find prices/i });
    
    fireEvent.change(postcodeInput, { target: { value: 'INVALID' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/must start with BT/i)).toBeInTheDocument();
    });
  });

  it('accepts valid BT postcode', async () => {
    render(<PriceSearchForm />);
    
    const postcodeInput = screen.getByLabelText(/postcode/i);
    
    fireEvent.change(postcodeInput, { target: { value: 'BT1 1AA' } });
    
    await waitFor(() => {
      expect(postcodeInput).toHaveValue('BT1 1AA');
    });
  });
});
