import { useForm } from "@/hooks/useForm";
import { useLocalSearchParams, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { object, string } from "yup";

const validationSchema = object({
  sessionId: string().required("Session is required"),
});

export const useBookTutorForm = () => {
  const router = useRouter();
  const { tutorId } = useLocalSearchParams();

  let defaultValues = {
    sessionId: "",
    date: "",
    timeSlots: [],
    preferredLocation: "",
    note: "",
  };

  const form = useForm({
    validationSchema,
    defaultValues: defaultValues,
  });

  // Book tutor mutation
  //   const { mutateAsync: createBooking } = useCreateBookingMutation({
  //     onSuccess: (response) => {
  //       Toast.show({ type: "success", text1: response.message });
  //       let newEducation = [...user.education, response.data];

  //       handleSetUser({
  //         data: { ...user, education: sortByEndDate(newEducation) },
  //       });
  //       router.back();
  //     },
  //     onError: (error) => {
  //       Toast.show({ type: "error", text1: error.message });
  //     },
  //   });

  const onSubmit = async (data) => {
    console.log("data", data);

    const payload = { tutorId, ...data };

    console.log("payload", payload);
    // book the tutor
    //   await createBooking(payload);
  };

  return {
    ...form,
    handleSubmit: form.handleSubmit(onSubmit),
  };
};
