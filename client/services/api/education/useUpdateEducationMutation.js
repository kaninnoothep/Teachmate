/**
 * Import Modules
 */
import { EDUCATION_API_KEY } from "@/services/constants";
import { apiRequest } from "@/services/helpers/apiRequest";
import { useApiSend } from "@/services/hooks/useApiSend";

const updateEducationRequest = (payload) => {
  const { educationId, ...data } = payload;
  return apiRequest(`${EDUCATION_API_KEY}/${educationId}`, "PUT", data);
};

export const useUpdateEducationMutation = (options) =>
  useApiSend(updateEducationRequest, [], options);
