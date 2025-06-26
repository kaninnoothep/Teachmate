/**
 * Import Modules
 */
import { useQuery } from "@tanstack/react-query";
import { apiGetRequest } from "../helpers/apiGetRequest";

/**
 * useApiGet - Custom hook for making GET requests using React Query
 *
 * @param {*} key - Query key for caching
 * @param {*} options - Additional query options
 * @returns useQuery result
 */
export const useApiGet = (key, options) =>
  useQuery({
    queryKey: key,
    queryFn: apiGetRequest,
    ...options,
  });
