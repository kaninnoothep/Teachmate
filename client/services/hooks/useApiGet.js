import { useQuery } from "@tanstack/react-query";
import { apiGetRequest } from "../helpers/apiGetRequest";

export const useApiGet = (key, options) =>
  useQuery({
    queryKey: key,
    queryFn: apiGetRequest,
    ...options,
  });
