import { useState, useCallback } from 'react';
import { getErrorMessage } from '../utils/helpers';

/**
 * useApi - Generic hook for one-off API calls with loading/error/data state.
 *
 * Usage:
 *   const { execute, data, loading, error } = useApi(statsAPI.getPostStats);
 *   await execute();
 *
 * @param {Function} apiFunction - An async function that returns an axios response
 */
const useApi = (apiFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiFunction(...args);
        setData(response.data);
        return { success: true, data: response.data };
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
        return { success: false, error: message };
      } finally {
        setLoading(false);
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { execute, data, loading, error, reset };
};

export default useApi;
