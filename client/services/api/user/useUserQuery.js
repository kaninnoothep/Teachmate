import { GET_USER_API_KEY } from "@/services/constants";
import { useApiGet } from "@/services/hooks/useApiGet";

export const useUserQuery = (userId, options) => {
  const { data, ...rest } = useApiGet(
    [`${GET_USER_API_KEY}/${userId}`],
    options
  );

  return {
    ...rest,
    user: data?.data ?? {},
  };
};
