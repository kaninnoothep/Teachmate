/**
 * Import Modules
 */
import { useForm } from "@/hooks/useForm";
import { useCreateBookingMutation } from "@/services/api/bookings/useCreateBookingMutation";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";
import { array, date, object, string } from "yup";

// Validation for book tutor form
const validationSchema = object({
  sessionId: string().required("Session is required"),
  date: date()
    .typeError("Date and time are required")
    .required("Date and time are required"),
  timeSlots: array().min(1, "Date and time are required"),
  preferredLocation: string(),
});

/**
 * useBookTutorForm - Custom hook to manage book tutor form
 *
 * @returns Form methods and submit handler
 */
export const useBookTutorForm = () => {
  const navigation = useNavigation();
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
  const { mutateAsync: createBooking } = useCreateBookingMutation({
    onSuccess: (response) => {
      Toast.show({ type: "success", text1: response.message });
      navigation.reset({
        index: 0,
        routes: [{ name: "(tabs)", state: { routes: [{ name: "bookings" }] } }],
      });
    },
    onError: (error) => {
      Toast.show({ type: "error", text1: error.message });
    },
  });

  // Submit handler for booking a tutor
  const onSubmit = async ({ date, timeSlots, ...resData }) => {
    let formatDate = date.toISOString().split("T")[0];
    let startTime = timeSlots[0].startTime;
    let endTime = timeSlots[timeSlots.length - 1].endTime;

    const payload = {
      tutorId,
      date: formatDate,
      startTime,
      endTime,
      ...resData,
    };

    // Book the tutor
    await createBooking(payload);
  };

  return {
    ...form,
    handleSubmit: form.handleSubmit(onSubmit),
  };
};
