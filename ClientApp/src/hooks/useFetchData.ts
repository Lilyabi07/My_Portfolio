import { useState, useEffect } from 'react';
import api from '../api';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * Custom hook for fetching data from API endpoints
 * Eliminates repeated fetch logic across components
 * 
 * @template T - Type of data being fetched
 * @param endpoint - API endpoint to fetch from
 * @param dependencies - Optional dependency array for useEffect
 * @returns Object with data, loading, error, and refetch function
 */
export function useFetchData<T>(endpoint: string, dependencies: any[] = []) {
  const { t } = useLanguage();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(endpoint);
      
      if (Array.isArray(response.data)) {
        setData(response.data);
      } else {
        setError(t('common.invalidData') || 'Invalid data format received');
      }
    } catch (err) {
      console.error(`Error fetching from ${endpoint}:`, err);
      setError(t('common.loadError') || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    setData // Allow manual updates when needed
  };
}
