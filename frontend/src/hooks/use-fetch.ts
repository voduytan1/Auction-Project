import { useState, useEffect } from "react";

interface UseFetchOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface UseFetchReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook để fetch data khi component mount
 * Tự động gọi API khi component render lần đầu
 *
 * @example
 * const { data: categories, loading, error, refetch } = useFetch(
 *   () => categoryService.getAllCategories()
 * );
 */
export function useFetch<T>(
  fetchFunction: () => Promise<T>,
  options: UseFetchOptions<T> = {}
): UseFetchReturn<T> {
  const { onSuccess, onError } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction();
      // Unwrap AxiosResponse if needed
      const unwrappedData = (result as any)?.data || result;
      setData(unwrappedData);
      onSuccess?.(unwrappedData);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch on mount
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading, error, refetch: fetchData };
}
