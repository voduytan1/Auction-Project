import { useState, useCallback } from "react";

interface UseAsyncOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  initialLoading?: boolean;
}

interface UseAsyncReturn<T, Args extends unknown[]> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: (...args: Args) => Promise<T | null>;
  reset: () => void;
}

/**
 * Custom hook để xử lý async operations (API calls)
 *
 * @example
 * const { data, loading, error, execute } = useAsync(productService.getById);
 *
 * useEffect(() => {
 *   execute(productId);
 * }, [productId]);
 */
export function useAsync<T, Args extends unknown[]>(
  asyncFunction: (...args: Args) => Promise<T>,
  options: UseAsyncOptions<T> = {}
): UseAsyncReturn<T, Args> {
  const { onSuccess, onError, initialLoading = false } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (...args: Args): Promise<T | null> => {
      try {
        setLoading(true);
        setError(null);
        const result = await asyncFunction(...args);
        setData(result);
        onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        onError?.(error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [asyncFunction, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  return { data, loading, error, execute, reset };
}
