/**
 * Import Modules
 */
import { useForm as useBaseForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { omit } from "ramda";

/**
 * useForm - Custom hook to create a form with optional validation
 *
 * @param {*} options - Form config including mode and validation schema
 * @returns useForm methods from react-hook-form
 */
export const useForm = (options) => {
  return useBaseForm({
    mode: options.mode || "onTouched",
    ...(options?.validationSchema && {
      resolver: yupResolver(options.validationSchema),
    }),
    ...(options && omit(["validationSchema"], options)),
  });
};
