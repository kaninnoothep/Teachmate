/**
 * Import Modules
 */
import { object, string } from "yup";
import { useForm } from "@/hooks/useForm";
import { useUser } from "@/context/UserProvider/UserProvider";

// Validation for Login page form
const validationSchema = object({
  email: string()
    .lowercase()
    .email("Email must be a valid email address")
    .required("Email is required"),
  password: string().required("Password is required"),
});

/**
 * useLoginForm - Custom hook to manage Login form
 */
export const useLoginForm = () => {
  const { login } = useUser();
  const form = useForm({ validationSchema });

  const onSubmit = async (formValues) => {
    await login(formValues, {
      onError: () => {
        form.setError("email");
        form.setError("password", {
          message: "Email or password is incorrect!",
        });
      },
    });
  };

  return {
    ...form,
    handleSubmit: form.handleSubmit(onSubmit),
  };
};
