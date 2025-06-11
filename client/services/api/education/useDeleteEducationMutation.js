/**
 * Import Modules
 */
import { EDUCATION_API_KEY } from "@/services/constants";
import { apiRequest } from "@/services/helpers/apiRequest";
import { useApiSend } from "@/services/hooks/useApiSend";

const deleteEducationRequest = (educationId) =>
  apiRequest(`${EDUCATION_API_KEY}/${educationId}`, "DELETE");

export const useDeleteEducationMutation = (options) =>
  useApiSend(deleteEducationRequest, [], options);
