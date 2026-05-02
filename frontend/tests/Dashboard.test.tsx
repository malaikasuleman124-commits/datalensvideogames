/** @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Dashboard } from '../src/components/Dashboard';
import { api } from '../src/lib/api';
import React from 'react';

// Mock Recharts to avoid testing issues with SVG elements in JSDOM
vi.mock('recharts', async () => {
  const OriginalRechartsModule = await vi.importActual('recharts');
  return {
    ...OriginalRechartsModule as any,
    ResponsiveContainer: ({ children }: any) => (
      <div style={{ width: '100%', height: 300 }}>{children}</div>
    ),
  };
});

// Mock the API calls
vi.mock('../src/lib/api', () => ({
  api: {
    getProfile: vi.fn(),
    getGenreSales: vi.fn(),
    getPlatformSales: vi.fn(),
    getSalesOverTime: vi.fn(),
  },
}));

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders nothing if no data exists', async () => {
    vi.mocked(api.getProfile).mockResolvedValue({ total_games: 0, min_year: null, max_year: null, total_global_sales: 0 });
    
    const { container } = render(<Dashboard refreshTrigger={0} />);
    
    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });

  it('renders charts if data exists', async () => {
    vi.mocked(api.getProfile).mockResolvedValue({ total_games: 10, min_year: 2000, max_year: 2010, total_global_sales: 100 });
    vi.mocked(api.getGenreSales).mockResolvedValue([{ name: 'Action', sales: 50 }]);
    vi.mocked(api.getPlatformSales).mockResolvedValue([{ name: 'PS4', sales: 50 }]);
    vi.mocked(api.getSalesOverTime).mockResolvedValue([{ year: 2000, sales: 50 }]);

    render(<Dashboard refreshTrigger={0} />);

    // Wait for data to resolve and charts to appear
    await waitFor(() => {
      expect(screen.getByText(/Global Sales by Genre/i)).toBeDefined();
      expect(screen.getByText(/Top Platforms by Global Sales/i)).toBeDefined();
      expect(screen.getByText(/Global Sales Over Time/i)).toBeDefined();
    });
  });
});
