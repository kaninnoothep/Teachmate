import { useMutation, useQueryClient } from "@tanstack/react-query";

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
