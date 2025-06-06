/**
 * Import Modules
 */
import { apiRequest } from "./apiRequest";

/**
 * apiGetRequest - API GET requests
 *
 * @param {object} params - Parameters
 * @returns
 */
export const apiGetRequest = async ({ queryKey }) => {
  const [key, params] = queryKey;

  return await apiRequest(key, "GET", null, { params });
};
