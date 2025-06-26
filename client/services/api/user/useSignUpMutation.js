/**
 * Import Modules
 */
import { apiRequest } from "@/services/helpers/apiRequest";
import { SIGN_UP_API_KEY } from "@/services/constants";
import { useApiSend } from "@/services/hooks/useApiSend";

// Create Account Request
const signUpRequest = (payload) => apiRequest(SIGN_UP_API_KEY, "POST", payload);

/**
 * useSignUpMutation - Custom hook to handle Create Account mutation
 *
 * @param {*} options - Mutation options
 * @returns useMutation result
 */
export const useSignUpMutation = (options) =>
  useApiSend(signUpRequest, null, options);
