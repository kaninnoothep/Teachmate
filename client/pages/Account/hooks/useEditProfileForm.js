/**
 * Import Modules
 */
import { object, string } from "yup";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { useUpdateUserMutation } from "@/services/api/user/useUpdateUserMutation";
import { useForm } from "@/hooks/useForm";
import { useUser } from "@/context/UserProvider/UserProvider";

// Validation for edit profile form
const validationSchema = object({
  firstName: string().required("First Name is required"),
  lastName: string().required("Last Name is required"),
});

/**
 * useEditProfileForm - Custom hook to manage edit profile form
 *
 * @returns Form methods and submit handler
 */
export const useEditProfileForm = () => {
  const { user, handleSetUser } = useUser();
  const router = useRouter();

  const form = useForm({
    validationSchema,
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone || "",
      country: user.country || null,
      state: user.state || null,
      city: user.city || null,
      postalCode: user.postalCode || "",
      hourlyRate: user.hourlyRate || "",
      about: user.about || "",
    },
  });

  // Update user mutation
  const { mutateAsync: updateUser } = useUpdateUserMutation({
    onSuccess: async (data) => {
      Toast.show({ type: "success", text1: data.message });
      handleSetUser(data);
      router.back();
    },
    onError: (error) => {
      Toast.show({ type: "error", text1: error.message });
    },
  });

  // Submit handler for editing profile
  const onSubmit = async ({ country, state, city, hourlyRate, ...rest }) => {
    const payload = {
      ...rest,
      country,
      state,
      city,
      ...(user.role === "tutor" && { hourlyRate }),
    };

    // Update user
    await updateUser(payload);
  };

  return {
    ...form,
    handleSubmit: form.handleSubmit(onSubmit),
  };
};
