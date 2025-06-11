/**
 * Import Modules
 */

import { UPLOAD_IMAGE_API_KEY } from "@/services/constants";
import { apiRequest } from "@/services/helpers/apiRequest";
import { useApiSend } from "@/services/hooks/useApiSend";

// Upload Image Request
const uploadImageRequest = (payload) =>
  apiRequest(UPLOAD_IMAGE_API_KEY, "POST", payload);

// Custom Hook to manage Upload Image request
export const useUploadImageMutation = (options) =>
  useApiSend(uploadImageRequest, [], options);
