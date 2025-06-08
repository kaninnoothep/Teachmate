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
      country: user.country?.code
        ? {
            cca2: user.country.code,
            name: { common: user.country.name },
          }
        : null,
      postalCode: user.postalCode || "",
      city: user.city || "",
      hourlyRate: user.hourlyRate || "",
      about: user.about || "",
    },
  });

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

  const onSubmit = async ({ country, ...res }) => {
    const tranformedCountry = {
      code: country?.cca2 || null,
      name: country?.name || null,
    };
    const payload = { country: tranformedCountry, ...res };
    console.log("payload", payload);

    await updateUser(payload);
  };

  return {
    ...form,
    handleSubmit: form.handleSubmit(onSubmit),
  };
};
