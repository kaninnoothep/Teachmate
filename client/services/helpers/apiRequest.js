/**
 * Import Modules
 */
import axios from "axios";
import { client } from "../client";
import { handleApiError } from "./handleApiError";

/**
 * apiRequest - Create an API request
 *
 * @param {string} url - URL
 * @param {string} method - Http method
 * @param {Object} data - Request Payload
 * @param {Object} options - Additional config options
 * @returns
 */
export const apiRequest = async (
  url,
  method = "GET",
  data = null,
  options = {}
) => {
  const source = axios.CancelToken.source();

  try {
    const config = {
      url,
      method,
      data,
      cancelToken: source.token,
      ...options,
    };
    const response = await client(config);
    return response.data;
  } catch (error) {
    handleApiError(error);
  } finally {
    source.cancel();
  }
};
