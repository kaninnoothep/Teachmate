/**
 * Import Modules
 */
import { useUser } from "@/context/UserProvider/UserProvider";
import { useForm } from "@/hooks/useForm";
import { useAddSessionMutation } from "@/services/api/sessions/useAddSessionMutation";
import { useUpdateSessionMutation } from "@/services/api/sessions/useUpdateSessionMutation";
import { useLocalSearchParams, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { object, string } from "yup";

// Validation for the form
const validationSchema = object({
  subject: string().required("Subject is required"),
  description: string().required("Description is required"),
  estimatedDuration: string()
    .required("Estimated duration is required")
    .transform((value) => {
      if (typeof value !== "string") return value;

      // Convert ".5" → "0.5"
      if (value.startsWith(".")) value = "0" + value;

      // Convert "1." → "1"
      if (value.endsWith(".")) value = value.slice(0, -1);

      return value;
    })
    .test(
      "is-greater-than-zero",
      "Estimated duration must be greater than 0",
      (value) => {
        const parsed = parseFloat(value);
        return !isNaN(parsed) && parsed > 0;
      }
    ),
});

/**
 * useSessionForm - Custom hook to manage add/update session form
 *
 * @returns Form methods and submit handler
 */
export const useSessionForm = () => {
  const { user, handleSetUser } = useUser();
  const router = useRouter();
  const { sessionId, session } = useLocalSearchParams();

  // Set default values for the form
  let defaultValues = {
    subject: "",
    description: "",
    estimatedDuration: "",
  };

  // If editing, prefill the form with existing data
  if (session) {
    try {
      const parsedSession = JSON.parse(session);
      defaultValues = {
        subject: parsedSession?.subject || "",
        description: parsedSession?.description || "",
        estimatedDuration: parsedSession?.estimatedDuration || "",
      };
    } catch (err) {
      console.warn("Failed to parse session:", err);
    }
  }

  // Initialize the form
  const form = useForm({
    validationSchema,
    defaultValues,
  });

  // Add session mutation
  const { mutateAsync: addSession } = useAddSessionMutation({
    onSuccess: (response) => {
      Toast.show({ type: "success", text1: response.message });
      let newSession = [...user.sessions, response.data];

      handleSetUser({
        data: { ...user, sessions: newSession },
      });
      router.back();
    },
    onError: (error) => {
      Toast.show({ type: "error", text1: error.message });
    },
  });

  // Update session mutation
  const { mutateAsync: updateSession } = useUpdateSessionMutation({
    onSuccess: (response) => {
      Toast.show({ type: "success", text1: response.message });

      // Replace the updated session entry in user.session
      const updatedSessionList = user.sessions.map((item) =>
        item._id === response.data._id ? response.data : item
      );

      handleSetUser({
        data: { ...user, sessions: updatedSessionList },
      });

      router.back();
    },
    onError: (error) => {
      Toast.show({ type: "error", text1: error.message });
    },
  });

  // Submit handler for both add and update cases
  const onSubmit = async (payload) => {
    if (sessionId) {
      // Update the session
      await updateSession({ sessionId, ...payload });
    } else {
      // Add the session
      await addSession(payload);
    }
  };

  return {
    ...form,
    handleSubmit: form.handleSubmit(onSubmit),
  };
};
