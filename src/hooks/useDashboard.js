// src/hooks/useDashboard.js
import { useState, useEffect, useCallback } from 'react';
import { getDashboardPage } from '../services/api';

const EMPTY = {
  en_ejecucion: [],
  atrasados:    [],
  desviados:    [],
  planificados: [],
};

export function useDashboard() {
  const [data, setData]       = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [page, setPage]       = useState(0);

  const fetchData = useCallback(async (offset = 0) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getDashboardPage(offset);
      setData(result);
    } catch (e) {
      setError(e?.response?.data?.message || 'Error al cargar el dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(page); }, [fetchData, page]);

  const refresh = () => fetchData(page);

  return { data, loading, error, page, setPage, refresh };
}
