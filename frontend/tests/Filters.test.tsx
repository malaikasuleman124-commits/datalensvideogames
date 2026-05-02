/** @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Filters } from '../src/components/Filters';
import { api } from '../src/lib/api';
import React from 'react';

vi.mock('../src/lib/api', () => ({
  api: {
    getFilters: vi.fn(),
  },
}));

describe('Filters Component', () => {
  const mockFilters = { genre: '', platform: '' };
  const mockOnGenreChange = vi.fn();
  const mockOnPlatformChange = vi.fn();
  const mockOnReset = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders dropdowns with options from API', async () => {
    vi.mocked(api.getFilters).mockResolvedValue({
      genres: ['Action', 'RPG'],
      platforms: ['PS4', 'PC'],
    });

    render(
      <Filters 
        filters={mockFilters}
        onGenreChange={mockOnGenreChange}
        onPlatformChange={mockOnPlatformChange}
        onReset={mockOnReset}
        refreshTrigger={0}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Action')).toBeDefined();
      expect(screen.getByText('RPG')).toBeDefined();
      expect(screen.getByText('PS4')).toBeDefined();
      expect(screen.getByText('PC')).toBeDefined();
    });
  });

  it('calls onGenreChange when genre is selected', async () => {
    vi.mocked(api.getFilters).mockResolvedValue({
      genres: ['Action'],
      platforms: [],
    });

    render(
      <Filters 
        filters={mockFilters}
        onGenreChange={mockOnGenreChange}
        onPlatformChange={mockOnPlatformChange}
        onReset={mockOnReset}
        refreshTrigger={0}
      />
    );

    // Get all comboboxes (selects)
    await waitFor(() => expect(screen.getAllByRole('combobox').length).toBeGreaterThan(0));
    
    const selects = screen.getAllByRole('combobox');
    // First select is Genre, second is Platform
    fireEvent.change(selects[0], { target: { value: 'Action' } });

    expect(mockOnGenreChange).toHaveBeenCalledWith('Action');
  });

  it('calls onReset when reset button is clicked', async () => {
    vi.mocked(api.getFilters).mockResolvedValue({
      genres: ['Action'],
      platforms: [],
    });

    render(
      <Filters 
        filters={mockFilters}
        onGenreChange={mockOnGenreChange}
        onPlatformChange={mockOnPlatformChange}
        onReset={mockOnReset}
        refreshTrigger={0}
      />
    );

    await waitFor(() => {
      const button = document.querySelector('button');
      if (!button) throw new Error('Button not found');
      fireEvent.click(button);
    });

    expect(mockOnReset).toHaveBeenCalled();
  });
});
