/**
 * Import Modules
 */
import { useForm } from "@/hooks/useForm";
import { useReplyToReviewMutation } from "@/services/api/reviews/useReplyToReviewMutation";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { object, string } from "yup";

// Validation for the form
const validationSchema = object({
  replyMessage: string().trim().required("Reply message is required"),
});

/**
 * useReplyToReviewForm - Custom hook to manage reply-to-review form
 *
 * @returns Form methods and submit handler
 */
export const useReplyToReviewForm = (reviewId) => {
  const router = useRouter();

  // Set default values for the form
  let defaultValues = {
    replyMessage: "",
  };

  // Initialize the form
  const form = useForm({
    validationSchema,
    defaultValues,
  });

  // Reply-to-review mutation
  const { mutateAsync: replyToReview } = useReplyToReviewMutation({
    onSuccess: (response) => {
      Toast.show({ type: "success", text1: response.message });
      router.back();
    },
    onError: (error) => {
      Toast.show({ type: "error", text1: error.message });
    },
  });

  // Submit handler for adding a reply to a review
  const onSubmit = async (data) => {
    const payload = { reviewId, ...data };

    // Reply to the review
    await replyToReview(payload);
  };

  return {
    ...form,
    handleSubmit: form.handleSubmit(onSubmit),
  };
};
