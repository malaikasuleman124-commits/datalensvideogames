import { useState, useEffect, useCallback } from 'react';
import { Filters } from '../lib/api';

const STORAGE_KEY = 'datalens_filters';

export const useDataset = () => {
  const [filters, setFilters] = useState<Filters>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { genre: '', platform: '' };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  }, [filters]);

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
