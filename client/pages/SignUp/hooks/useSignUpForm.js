/**
 * Import Modules
 */
// import { useUser } from "@/context/UserProvider";
import { ROLES } from "@/constants/role";
import { useUser } from "@/context/UserProvider/UserProvider";
import { useForm } from "@/hooks/useForm";
import { object, ref, string } from "yup";

const validationSchema = object({
  firstName: string().required("First Name is required"),
  lastName: string().required("Last Name is required"),
  email: string()
    .lowercase()
    .email("Email must be a valid email address")
    .required("Email is required"),
  password: string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: string()
    .required("Confirm password is required")
    .min(8, "Password must be at least 8 characters")
    .oneOf([ref("password"), undefined], "Passwords must match"),
});

export const useSignUpForm = () => {
  const { signUp } = useUser();

  const form = useForm({
    validationSchema,
    defaultValues: {
      role: ROLES.student,
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async ({ role, firstName, lastName, email, password }) => {
    const payload = { role, firstName, lastName, email, password };

    await signUp(payload);
  };

  return {
    ...form,
    handleSubmit: form.handleSubmit(onSubmit),
  };
};
