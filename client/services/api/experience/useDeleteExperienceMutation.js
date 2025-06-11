/**
 * Import Modules
 */
import { EXPERIENCE_API_KEY } from "@/services/constants";
import { apiRequest } from "@/services/helpers/apiRequest";
import { useApiSend } from "@/services/hooks/useApiSend";

const deleteExperienceRequest = (experienceId) => {
  console.log("experienceId", experienceId);
  return apiRequest(`${EXPERIENCE_API_KEY}/${experienceId}`, "DELETE");
};

export const useDeleteExperienceMutation = (options) =>
  useApiSend(deleteExperienceRequest, [], options);
