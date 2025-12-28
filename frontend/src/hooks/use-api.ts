import { useCallback, useEffect, useState } from "react";
import { apiHelpers } from "@/lib/helpers";
import type { AxiosResponse } from "axios";

// ============= Types =============
interface UseQueryOptions<T> {
  enabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  refetchOnMount?: boolean;
}

interface UseQueryReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  isSuccess: boolean;
  isError: boolean;
}

interface UseMutationOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
}

interface UseMutationReturn<T, Args extends unknown[]> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  mutate: (...args: Args) => Promise<T | null>;
  mutateAsync: (...args: Args) => Promise<T>;
  reset: () => void;
  isSuccess: boolean;
  isError: boolean;
  isLoading: boolean;
}

// ============= useQuery Hook =============
/**
 * Hook để fetch data từ API (GET requests)
 * Tự động fetch khi component mount
 *
 * @example
 * // Basic usage
 * const { data, loading, error } = useQuery(() => auctionAPI.getAll());
 *
 * @example
 * // With options
 * const { data, loading, refetch } = useQuery(
 *   () => auctionAPI.getById(id),
 *   {
 *     enabled: !!id, // Only fetch when id exists
 *     onSuccess: (data) => console.log('Success:', data),
 *     onError: (error) => toast.error(error.message)
 *   }
 * );
 */
export function useQuery<T>(
  queryFn: () => Promise<AxiosResponse<T>>,
  options: UseQueryOptions<T> = {}
): UseQueryReturn<T> {
  const { enabled = true, onSuccess, onError, refetchOnMount = true } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(enabled && refetchOnMount);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);
      const response = await queryFn();
      const extractedData = apiHelpers.extractData(response);
      setData(extractedData);
      onSuccess?.(extractedData);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [queryFn, enabled, onSuccess, onError]);

  useEffect(() => {
    if (enabled && refetchOnMount) {
      fetchData();
    }
  }, [fetchData, enabled, refetchOnMount]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    isSuccess: data !== null && error === null,
    isError: error !== null,
  };
}

// ============= useMutation Hook =============
/**
 * Hook cho mutations (POST, PUT, DELETE, PATCH)
 * Dùng cho form submissions, create/update/delete operations
 *
 * @example
 * // Login mutation
 * const { mutate: login, loading, error } = useMutation(
 *   authAPI.login,
 *   {
 *     onSuccess: (response) => {
 *       const { accessToken, user } = response.data;
 *       localStorage.setItem('token', accessToken);
 *       navigate('/dashboard');
 *     },
 *     onError: (error) => {
 *       toast.error(apiHelpers.getErrorMessage(error));
 *     }
 *   }
 * );
 *
 * // In form handler
 * const handleSubmit = (values) => {
 *   login(values); // Fire and forget
 * };
 *
 * @example
 * // Create auction with await
 * const { mutateAsync: createAuction } = useMutation(auctionAPI.create);
 *
 * const handleCreate = async (data) => {
 *   try {
 *     const response = await createAuction(data);
 *     console.log('Created:', response.data);
 *   } catch (error) {
 *     console.error('Failed:', error);
 *   }
 * };
 */
export function useMutation<T, Args extends unknown[]>(
  mutationFn: (...args: Args) => Promise<AxiosResponse<T>>,
  options: UseMutationOptions<T> = {}
): UseMutationReturn<T, Args> {
  const { onSuccess, onError, onSettled } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(
    async (...args: Args): Promise<T | null> => {
      try {
        setLoading(true);
        setError(null);
        const response = await mutationFn(...args);
        const extractedData = apiHelpers.extractData(response);
        setData(extractedData);
        onSuccess?.(extractedData);
        return extractedData;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        onError?.(error);
        return null;
      } finally {
        setLoading(false);
        onSettled?.();
      }
    },
    [mutationFn, onSuccess, onError, onSettled]
  );

  const mutateAsync = useCallback(
    async (...args: Args): Promise<T> => {
      try {
        setLoading(true);
        setError(null);
        const response = await mutationFn(...args);
        const extractedData = apiHelpers.extractData(response);
        setData(extractedData);
        onSuccess?.(extractedData);
        return extractedData;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        onError?.(error);
        throw error; // Re-throw for async/await
      } finally {
        setLoading(false);
        onSettled?.();
      }
    },
    [mutationFn, onSuccess, onError, onSettled]
  );

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    mutate,
    mutateAsync,
    reset,
    isSuccess: data !== null && error === null,
    isError: error !== null,
    isLoading: loading,
  };
}
