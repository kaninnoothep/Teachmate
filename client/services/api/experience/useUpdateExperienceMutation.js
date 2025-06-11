/**
 * Import Modules
 */
import { EXPERIENCE_API_KEY } from "@/services/constants";
import { apiRequest } from "@/services/helpers/apiRequest";
import { useApiSend } from "@/services/hooks/useApiSend";

const updateExperienceRequest = (payload) => {
  const { experienceId, ...data } = payload;
  return apiRequest(`${EXPERIENCE_API_KEY}/${experienceId}`, "PUT", data);
};

export const useUpdateExperienceMutation = (options) =>
  useApiSend(updateExperienceRequest, [], options);
