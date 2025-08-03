/**
 * Import Modules
 */
import { useForm } from "@/hooks/useForm";
import { useAddReviewMutation } from "@/services/api/reviews/useAddReviewMutation";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { number, object, string } from "yup";

// Validation for the form
const validationSchema = object({
  rating: number().min(1, "Rating is required"),
  title: string().trim().required("Title is required"),
  reviewMessage: string().trim().required("Message is required"),
});

/**
 * useAddReviewForm - Custom hook to manage add review form
 *
 * @returns Form methods and submit handler
 */
export const useAddReviewForm = (revieweeId) => {
  const router = useRouter();

  // Set default values for the form
  let defaultValues = {
    rating: 0,
    title: "",
    reviewMessage: "",
  };

  // Initialize the form
  const form = useForm({
    validationSchema,
    defaultValues,
  });

  // Add review mutation
  const { mutateAsync: addReview } = useAddReviewMutation({
    onSuccess: (response) => {
      Toast.show({ type: "success", text1: response.message });
      router.back();
    },
    onError: (error) => {
      Toast.show({ type: "error", text1: error.message });
    },
  });

  // Submit handler for adding review
  const onSubmit = async (data) => {
    const payload = { revieweeId, ...data };

    // Add the review
    await addReview(payload);
  };

  return {
    ...form,
    handleSubmit: form.handleSubmit(onSubmit),
  };
};
