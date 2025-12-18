import { useState } from "react";

interface UseMutationOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface UseMutationReturn<T, Args extends unknown[]> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  mutate: (...args: Args) => Promise<T | null>;
  reset: () => void;
}

/**
 * Custom hook cho mutations (POST, PUT, DELETE)
 * Dùng cho form submissions, create/update/delete actions
 *
 * @example
 * const { mutate: login, loading, error } = useMutation(
 *   authService.login,
 *   {
 *     onSuccess: (data) => {
 *       dispatch(setCredentials(data));
 *       navigate('/');
 *     },
 *     onError: (error) => {
 *       toast.error(error.message);
 *     }
 *   }
 * );
 *
 * // Usage in form
 * const handleSubmit = async (values) => {
 *   await login(values);
 * };
 */
export function useMutation<T, Args extends unknown[]>(
  mutationFunction: (...args: Args) => Promise<T>,
  options: UseMutationOptions<T> = {}
): UseMutationReturn<T, Args> {
  const { onSuccess, onError } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (...args: Args): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await mutationFunction(...args);
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
  };

  const reset = () => {
    setData(null);
    setLoading(false);
    setError(null);
  };

  return { data, loading, error, mutate, reset };
}
