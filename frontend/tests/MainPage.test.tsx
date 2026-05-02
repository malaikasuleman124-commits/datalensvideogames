/** @vitest-environment jsdom */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MainPage } from '../src/pages/MainPage';
import React from 'react';

// Mock dependencies
vi.mock('../src/lib/api', () => ({
  api: {
    getProfile: vi.fn().mockResolvedValue({ total_games: 0 }),
    getFilters: vi.fn().mockResolvedValue({ genres: [], platforms: [] }),
    getSummary: vi.fn().mockResolvedValue({ summary: "" }),
  },
}));

describe('MainPage', () => {
  it('renders the DataLens title and upload section', () => {
    render(<MainPage />);
    // Check for title (might be multiple because of decorative elements, but we want the main one)
    const titles = screen.getAllByText('DataLens');
    expect(titles.length).toBeGreaterThan(0);
    
    // Check for description
    expect(screen.getByText(/Advanced analytics/i)).toBeDefined();
  });
});
