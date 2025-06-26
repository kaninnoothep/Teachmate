/**
 * Import Modules
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * useApiSend - Custom hook for sending mutations and invalidating queries
 *
 * @param {*} mutationFn - The mutation function to execute
 * @param {*} invalidateKey - Query keys to invalidate on success
 * @param {*} options - Additional mutation options
 * @returns useMutation result
 */
export const useApiSend = (mutationFn, invalidateKey, options) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options;

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      invalidateKey &&
        invalidateKey.forEach((key) => {
          queryClient.invalidateQueries(key);
        });
      onSuccess && onSuccess(data);
    },
    ...restOptions,
  });
};
