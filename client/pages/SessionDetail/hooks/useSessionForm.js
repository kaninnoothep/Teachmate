import { useUser } from "@/context/UserProvider/UserProvider";
import { useForm } from "@/hooks/useForm";
import { useAddSessionMutation } from "@/services/api/sessions/useAddSessionMutation";
import { useUpdateSessionMutation } from "@/services/api/sessions/useUpdateSessionMutation";
import { useLocalSearchParams, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { object, string } from "yup";

const validationSchema = object({
  subject: string().required("Subject is required"),
  description: string().required("Description is required"),
  estimatedDuration: string().required("Estimated duration is required"),
});

export const useSessionForm = () => {
  const { user, handleSetUser } = useUser();
  const router = useRouter();
  const { sessionId, session } = useLocalSearchParams();

  let defaultValues = {
    subject: "",
    description: "",
    estimatedDuration: "",
  };

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

  const onSubmit = async (payload) => {
    if (sessionId) {
      // update the session
      await updateSession({ sessionId, ...payload });
    } else {
      // add the session
      await addSession(payload);
    }
  };

  return {
    ...form,
    handleSubmit: form.handleSubmit(onSubmit),
  };
};
