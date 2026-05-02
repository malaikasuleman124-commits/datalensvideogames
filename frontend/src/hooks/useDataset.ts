import { useState, useCallback } from 'react';
import { Filters } from '../lib/api';

export const useDataset = () => {
  const [filters, setFilters] = useState<Filters>({ genre: '', platform: '' });

  const setGenre = useCallback((genre: string) => {
    setFilters((prev) => ({ ...prev, genre }));
  }, []);

  const setPlatform = useCallback((platform: string) => {
    setFilters((prev) => ({ ...prev, platform }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ genre: '', platform: '' });
  }, []);

  return {
    filters,
    setGenre,
    setPlatform,
    resetFilters,
  };
};
