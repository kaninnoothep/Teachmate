/**
 * Import Modules
 */
import { useForm as useBaseForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { omit } from "ramda";

// Custom hook to serve as wrapper over UseBaseForm
export const useForm = (options) => {
  return useBaseForm({
    mode: options.mode || "onTouched",
    ...(options?.validationSchema && {
      resolver: yupResolver(options.validationSchema),
    }),
    ...(options && omit(["validationSchema"], options)),
  });
};
